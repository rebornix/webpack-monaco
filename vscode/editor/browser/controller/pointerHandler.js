var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "vs/base/browser/dom", "vs/base/browser/touch", "vs/editor/browser/controller/mouseHandler", "vs/editor/browser/editorDom"], function (require, exports, dom, touch_1, mouseHandler_1, editorDom_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function gestureChangeEventMerger(lastEvent, currentEvent) {
        var r = {
            translationY: currentEvent.translationY,
            translationX: currentEvent.translationX
        };
        if (lastEvent) {
            r.translationY += lastEvent.translationY;
            r.translationX += lastEvent.translationX;
        }
        return r;
    }
    ;
    /**
     * Basically IE10 and IE11
     */
    var MsPointerHandler = (function (_super) {
        __extends(MsPointerHandler, _super);
        function MsPointerHandler(context, viewController, viewHelper) {
            var _this = _super.call(this, context, viewController, viewHelper) || this;
            _this.viewHelper.linesContentDomNode.style.msTouchAction = 'none';
            _this.viewHelper.linesContentDomNode.style.msContentZooming = 'none';
            // TODO@Alex -> this expects that the view is added in 100 ms, might not be the case
            // This handler should be added when the dom node is in the dom tree
            _this._installGestureHandlerTimeout = window.setTimeout(function () {
                _this._installGestureHandlerTimeout = -1;
                if (window.MSGesture) {
                    var touchGesture_1 = new MSGesture();
                    var penGesture_1 = new MSGesture();
                    touchGesture_1.target = _this.viewHelper.linesContentDomNode;
                    penGesture_1.target = _this.viewHelper.linesContentDomNode;
                    _this.viewHelper.linesContentDomNode.addEventListener('MSPointerDown', function (e) {
                        // Circumvent IE11 breaking change in e.pointerType & TypeScript's stale definitions
                        var pointerType = e.pointerType;
                        if (pointerType === (e.MSPOINTER_TYPE_MOUSE || 'mouse')) {
                            _this._lastPointerType = 'mouse';
                            return;
                        }
                        else if (pointerType === (e.MSPOINTER_TYPE_TOUCH || 'touch')) {
                            _this._lastPointerType = 'touch';
                            touchGesture_1.addPointer(e.pointerId);
                        }
                        else {
                            _this._lastPointerType = 'pen';
                            penGesture_1.addPointer(e.pointerId);
                        }
                    });
                    _this._register(dom.addDisposableThrottledListener(_this.viewHelper.linesContentDomNode, 'MSGestureChange', function (e) { return _this._onGestureChange(e); }, gestureChangeEventMerger));
                    _this._register(dom.addDisposableListener(_this.viewHelper.linesContentDomNode, 'MSGestureTap', function (e) { return _this._onCaptureGestureTap(e); }, true));
                }
            }, 100);
            _this._lastPointerType = 'mouse';
            return _this;
        }
        MsPointerHandler.prototype._onMouseDown = function (e) {
            if (this._lastPointerType === 'mouse') {
                _super.prototype._onMouseDown.call(this, e);
            }
        };
        MsPointerHandler.prototype._onCaptureGestureTap = function (rawEvent) {
            var _this = this;
            var e = new editorDom_1.EditorMouseEvent(rawEvent, this.viewHelper.viewDomNode);
            var t = this._createMouseTarget(e, false);
            if (t.position) {
                this.viewController.moveTo(t.position);
            }
            // IE does not want to focus when coming in from the browser's address bar
            if (e.browserEvent.fromElement) {
                e.preventDefault();
                this.viewHelper.focusTextArea();
            }
            else {
                // TODO@Alex -> cancel this is focus is lost
                setTimeout(function () {
                    _this.viewHelper.focusTextArea();
                });
            }
        };
        MsPointerHandler.prototype._onGestureChange = function (e) {
            this._context.viewLayout.deltaScrollNow(-e.translationX, -e.translationY);
        };
        MsPointerHandler.prototype.dispose = function () {
            window.clearTimeout(this._installGestureHandlerTimeout);
            _super.prototype.dispose.call(this);
        };
        return MsPointerHandler;
    }(mouseHandler_1.MouseHandler));
    /**
     * Basically Edge but should be modified to handle any pointerEnabled, even without support of MSGesture
     */
    var StandardPointerHandler = (function (_super) {
        __extends(StandardPointerHandler, _super);
        function StandardPointerHandler(context, viewController, viewHelper) {
            var _this = _super.call(this, context, viewController, viewHelper) || this;
            _this.viewHelper.linesContentDomNode.style.touchAction = 'none';
            // TODO@Alex -> this expects that the view is added in 100 ms, might not be the case
            // This handler should be added when the dom node is in the dom tree
            _this._installGestureHandlerTimeout = window.setTimeout(function () {
                _this._installGestureHandlerTimeout = -1;
                // TODO@Alex: replace the usage of MSGesture here with something that works across all browsers
                if (window.MSGesture) {
                    var touchGesture_2 = new MSGesture();
                    var penGesture_2 = new MSGesture();
                    touchGesture_2.target = _this.viewHelper.linesContentDomNode;
                    penGesture_2.target = _this.viewHelper.linesContentDomNode;
                    _this.viewHelper.linesContentDomNode.addEventListener('pointerdown', function (e) {
                        var pointerType = e.pointerType;
                        if (pointerType === 'mouse') {
                            _this._lastPointerType = 'mouse';
                            return;
                        }
                        else if (pointerType === 'touch') {
                            _this._lastPointerType = 'touch';
                            touchGesture_2.addPointer(e.pointerId);
                        }
                        else {
                            _this._lastPointerType = 'pen';
                            penGesture_2.addPointer(e.pointerId);
                        }
                    });
                    _this._register(dom.addDisposableThrottledListener(_this.viewHelper.linesContentDomNode, 'MSGestureChange', function (e) { return _this._onGestureChange(e); }, gestureChangeEventMerger));
                    _this._register(dom.addDisposableListener(_this.viewHelper.linesContentDomNode, 'MSGestureTap', function (e) { return _this._onCaptureGestureTap(e); }, true));
                }
            }, 100);
            _this._lastPointerType = 'mouse';
            return _this;
        }
        StandardPointerHandler.prototype._onMouseDown = function (e) {
            if (this._lastPointerType === 'mouse') {
                _super.prototype._onMouseDown.call(this, e);
            }
        };
        StandardPointerHandler.prototype._onCaptureGestureTap = function (rawEvent) {
            var _this = this;
            var e = new editorDom_1.EditorMouseEvent(rawEvent, this.viewHelper.viewDomNode);
            var t = this._createMouseTarget(e, false);
            if (t.position) {
                this.viewController.moveTo(t.position);
            }
            // IE does not want to focus when coming in from the browser's address bar
            if (e.browserEvent.fromElement) {
                e.preventDefault();
                this.viewHelper.focusTextArea();
            }
            else {
                // TODO@Alex -> cancel this is focus is lost
                setTimeout(function () {
                    _this.viewHelper.focusTextArea();
                });
            }
        };
        StandardPointerHandler.prototype._onGestureChange = function (e) {
            this._context.viewLayout.deltaScrollNow(-e.translationX, -e.translationY);
        };
        StandardPointerHandler.prototype.dispose = function () {
            window.clearTimeout(this._installGestureHandlerTimeout);
            _super.prototype.dispose.call(this);
        };
        return StandardPointerHandler;
    }(mouseHandler_1.MouseHandler));
    var TouchHandler = (function (_super) {
        __extends(TouchHandler, _super);
        function TouchHandler(context, viewController, viewHelper) {
            var _this = _super.call(this, context, viewController, viewHelper) || this;
            _this.gesture = new touch_1.Gesture(_this.viewHelper.linesContentDomNode);
            _this._register(dom.addDisposableListener(_this.viewHelper.linesContentDomNode, touch_1.EventType.Tap, function (e) { return _this.onTap(e); }));
            _this._register(dom.addDisposableListener(_this.viewHelper.linesContentDomNode, touch_1.EventType.Change, function (e) { return _this.onChange(e); }));
            _this._register(dom.addDisposableListener(_this.viewHelper.linesContentDomNode, touch_1.EventType.Contextmenu, function (e) { return _this._onContextMenu(new editorDom_1.EditorMouseEvent(e, _this.viewHelper.viewDomNode), false); }));
            return _this;
        }
        TouchHandler.prototype.dispose = function () {
            this.gesture.dispose();
            _super.prototype.dispose.call(this);
        };
        TouchHandler.prototype.onTap = function (event) {
            event.preventDefault();
            this.viewHelper.focusTextArea();
            var target = this._createMouseTarget(new editorDom_1.EditorMouseEvent(event, this.viewHelper.viewDomNode), false);
            if (target.position) {
                this.viewController.moveTo(target.position);
            }
        };
        TouchHandler.prototype.onChange = function (e) {
            this._context.viewLayout.deltaScrollNow(-e.translationX, -e.translationY);
        };
        return TouchHandler;
    }(mouseHandler_1.MouseHandler));
    var PointerHandler = (function () {
        function PointerHandler(context, viewController, viewHelper) {
            if (window.navigator.msPointerEnabled) {
                this.handler = new MsPointerHandler(context, viewController, viewHelper);
            }
            else if (window.TouchEvent) {
                this.handler = new TouchHandler(context, viewController, viewHelper);
            }
            else if (window.navigator.pointerEnabled) {
                this.handler = new StandardPointerHandler(context, viewController, viewHelper);
            }
            else {
                this.handler = new mouseHandler_1.MouseHandler(context, viewController, viewHelper);
            }
        }
        PointerHandler.prototype.getTargetAtClientPoint = function (clientX, clientY) {
            return this.handler.getTargetAtClientPoint(clientX, clientY);
        };
        PointerHandler.prototype.dispose = function () {
            this.handler.dispose();
        };
        return PointerHandler;
    }());
    exports.PointerHandler = PointerHandler;
});
//# sourceMappingURL=pointerHandler.js.map