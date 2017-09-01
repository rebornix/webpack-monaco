define(["require", "exports", "vs/base/common/arrays", "vs/base/common/lifecycle", "vs/base/browser/dom"], function (require, exports, arrays, lifecycle_1, DomUtils) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var EventType;
    (function (EventType) {
        EventType.Tap = '-monaco-gesturetap';
        EventType.Change = '-monaco-gesturechange';
        EventType.Start = '-monaco-gesturestart';
        EventType.End = '-monaco-gesturesend';
        EventType.Contextmenu = '-monaco-gesturecontextmenu';
    })(EventType = exports.EventType || (exports.EventType = {}));
    var Gesture = (function () {
        function Gesture(target) {
            this.callOnTarget = [];
            this.activeTouches = {};
            this.target = target;
            this.handle = null;
        }
        Gesture.prototype.dispose = function () {
            this.target = null;
            if (this.handle) {
                this.handle.dispose();
                this.handle = null;
            }
        };
        Object.defineProperty(Gesture.prototype, "target", {
            set: function (element) {
                var _this = this;
                this.callOnTarget = lifecycle_1.dispose(this.callOnTarget);
                this.activeTouches = {};
                this.targetElement = element;
                if (!this.targetElement) {
                    return;
                }
                this.callOnTarget.push(DomUtils.addDisposableListener(this.targetElement, 'touchstart', function (e) { return _this.onTouchStart(e); }));
                this.callOnTarget.push(DomUtils.addDisposableListener(this.targetElement, 'touchend', function (e) { return _this.onTouchEnd(e); }));
                this.callOnTarget.push(DomUtils.addDisposableListener(this.targetElement, 'touchmove', function (e) { return _this.onTouchMove(e); }));
            },
            enumerable: true,
            configurable: true
        });
        Gesture.newGestureEvent = function (type) {
            var event = document.createEvent('CustomEvent');
            event.initEvent(type, false, true);
            return event;
        };
        Gesture.prototype.onTouchStart = function (e) {
            var timestamp = Date.now(); // use Date.now() because on FF e.timeStamp is not epoch based.
            e.preventDefault();
            if (this.handle) {
                this.handle.dispose();
                this.handle = null;
            }
            for (var i = 0, len = e.targetTouches.length; i < len; i++) {
                var touch = e.targetTouches.item(i);
                this.activeTouches[touch.identifier] = {
                    id: touch.identifier,
                    initialTarget: touch.target,
                    initialTimeStamp: timestamp,
                    initialPageX: touch.pageX,
                    initialPageY: touch.pageY,
                    rollingTimestamps: [timestamp],
                    rollingPageX: [touch.pageX],
                    rollingPageY: [touch.pageY]
                };
                var evt = Gesture.newGestureEvent(EventType.Start);
                evt.pageX = touch.pageX;
                evt.pageY = touch.pageY;
                this.targetElement.dispatchEvent(evt);
            }
        };
        Gesture.prototype.onTouchEnd = function (e) {
            var timestamp = Date.now(); // use Date.now() because on FF e.timeStamp is not epoch based.
            e.preventDefault();
            e.stopPropagation();
            var activeTouchCount = Object.keys(this.activeTouches).length;
            for (var i = 0, len = e.changedTouches.length; i < len; i++) {
                var touch = e.changedTouches.item(i);
                if (!this.activeTouches.hasOwnProperty(String(touch.identifier))) {
                    console.warn('move of an UNKNOWN touch', touch);
                    continue;
                }
                var data = this.activeTouches[touch.identifier], holdTime = Date.now() - data.initialTimeStamp;
                if (holdTime < Gesture.HOLD_DELAY
                    && Math.abs(data.initialPageX - arrays.tail(data.rollingPageX)) < 30
                    && Math.abs(data.initialPageY - arrays.tail(data.rollingPageY)) < 30) {
                    var evt = Gesture.newGestureEvent(EventType.Tap);
                    evt.initialTarget = data.initialTarget;
                    evt.pageX = arrays.tail(data.rollingPageX);
                    evt.pageY = arrays.tail(data.rollingPageY);
                    this.targetElement.dispatchEvent(evt);
                }
                else if (holdTime >= Gesture.HOLD_DELAY
                    && Math.abs(data.initialPageX - arrays.tail(data.rollingPageX)) < 30
                    && Math.abs(data.initialPageY - arrays.tail(data.rollingPageY)) < 30) {
                    var evt = Gesture.newGestureEvent(EventType.Contextmenu);
                    evt.initialTarget = data.initialTarget;
                    evt.pageX = arrays.tail(data.rollingPageX);
                    evt.pageY = arrays.tail(data.rollingPageY);
                    this.targetElement.dispatchEvent(evt);
                }
                else if (activeTouchCount === 1) {
                    var finalX = arrays.tail(data.rollingPageX);
                    var finalY = arrays.tail(data.rollingPageY);
                    var deltaT = arrays.tail(data.rollingTimestamps) - data.rollingTimestamps[0];
                    var deltaX = finalX - data.rollingPageX[0];
                    var deltaY = finalY - data.rollingPageY[0];
                    this.inertia(timestamp, // time now
                    Math.abs(deltaX) / deltaT, // speed
                    deltaX > 0 ? 1 : -1, // x direction
                    finalX, // x now
                    Math.abs(deltaY) / deltaT, // y speed
                    deltaY > 0 ? 1 : -1, // y direction
                    finalY // y now
                    );
                }
                // forget about this touch
                delete this.activeTouches[touch.identifier];
            }
        };
        Gesture.prototype.inertia = function (t1, vX, dirX, x, vY, dirY, y) {
            var _this = this;
            this.handle = DomUtils.scheduleAtNextAnimationFrame(function () {
                var now = Date.now();
                // velocity: old speed + accel_over_time
                var deltaT = now - t1, delta_pos_x = 0, delta_pos_y = 0, stopped = true;
                vX += Gesture.SCROLL_FRICTION * deltaT;
                vY += Gesture.SCROLL_FRICTION * deltaT;
                if (vX > 0) {
                    stopped = false;
                    delta_pos_x = dirX * vX * deltaT;
                }
                if (vY > 0) {
                    stopped = false;
                    delta_pos_y = dirY * vY * deltaT;
                }
                // dispatch translation event
                var evt = Gesture.newGestureEvent(EventType.Change);
                evt.translationX = delta_pos_x;
                evt.translationY = delta_pos_y;
                _this.targetElement.dispatchEvent(evt);
                if (!stopped) {
                    _this.inertia(now, vX, dirX, x + delta_pos_x, vY, dirY, y + delta_pos_y);
                }
            });
        };
        Gesture.prototype.onTouchMove = function (e) {
            var timestamp = Date.now(); // use Date.now() because on FF e.timeStamp is not epoch based.
            e.preventDefault();
            e.stopPropagation();
            for (var i = 0, len = e.changedTouches.length; i < len; i++) {
                var touch = e.changedTouches.item(i);
                if (!this.activeTouches.hasOwnProperty(String(touch.identifier))) {
                    console.warn('end of an UNKNOWN touch', touch);
                    continue;
                }
                var data = this.activeTouches[touch.identifier];
                var evt = Gesture.newGestureEvent(EventType.Change);
                evt.translationX = touch.pageX - arrays.tail(data.rollingPageX);
                evt.translationY = touch.pageY - arrays.tail(data.rollingPageY);
                evt.pageX = touch.pageX;
                evt.pageY = touch.pageY;
                this.targetElement.dispatchEvent(evt);
                // only keep a few data points, to average the final speed
                if (data.rollingPageX.length > 3) {
                    data.rollingPageX.shift();
                    data.rollingPageY.shift();
                    data.rollingTimestamps.shift();
                }
                data.rollingPageX.push(touch.pageX);
                data.rollingPageY.push(touch.pageY);
                data.rollingTimestamps.push(timestamp);
            }
        };
        Gesture.HOLD_DELAY = 700;
        Gesture.SCROLL_FRICTION = -0.005;
        return Gesture;
    }());
    exports.Gesture = Gesture;
});
//# sourceMappingURL=touch.js.map