var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
define(["require", "exports", "vs/base/common/cancellation", "vs/base/common/event", "vs/base/browser/dom", "vs/editor/common/editorCommon", "vs/editor/browser/editorBrowser", "vs/css!./lightBulbWidget"], function (require, exports, cancellation_1, event_1, dom, editorCommon_1, editorBrowser_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var LightBulbWidget = (function () {
        function LightBulbWidget(editor) {
            var _this = this;
            this._options = {
                stickiness: editorCommon_1.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
                glyphMarginClassName: 'lightbulb-glyph',
                glyphMarginHoverMessage: undefined
            };
            this._onClick = new event_1.Emitter();
            this._decorationIds = [];
            this._futureFixes = new cancellation_1.CancellationTokenSource();
            this._editor = editor;
            this._mouseDownSubscription = this._editor.onMouseDown(function (e) {
                // not on glyh margin or not on 💡
                if (e.target.type !== editorBrowser_1.MouseTargetType.GUTTER_GLYPH_MARGIN
                    || _this._currentLine === undefined
                    || _this._currentLine !== e.target.position.lineNumber) {
                    return;
                }
                // a bit of extra work to make sure the menu
                // doesn't cover the line-text
                var _a = dom.getDomNodePagePosition(e.target.element), top = _a.top, height = _a.height;
                var lineHeight = _this._editor.getConfiguration().lineHeight;
                _this._onClick.fire({
                    x: e.event.posx,
                    y: top + height + Math.floor(lineHeight / 3)
                });
            });
        }
        LightBulbWidget.prototype.dispose = function () {
            this._mouseDownSubscription.dispose();
            this.hide();
        };
        Object.defineProperty(LightBulbWidget.prototype, "onClick", {
            get: function () {
                return this._onClick.event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LightBulbWidget.prototype, "model", {
            get: function () {
                return this._model;
            },
            set: function (e) {
                var _this = this;
                this._model = e;
                this.hide();
                this._futureFixes = new cancellation_1.CancellationTokenSource();
                var token = this._futureFixes.token;
                e.fixes.done(function (fixes) {
                    if (!token.isCancellationRequested && fixes && fixes.length > 0) {
                        _this.show(e);
                    }
                    else {
                        _this.hide();
                    }
                }, function (err) {
                    _this.hide();
                });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LightBulbWidget.prototype, "title", {
            get: function () {
                return this._options.glyphMarginHoverMessage && this._options.glyphMarginHoverMessage.value;
            },
            set: function (value) {
                // TODO(joh,alex) this isn't working well because the hover hover
                // message sticks around after clicking the light bulb
                // this._options.glyphMarginHoverMessage = value;
            },
            enumerable: true,
            configurable: true
        });
        LightBulbWidget.prototype.show = function (e) {
            this._currentLine = e.range.startLineNumber;
            this._decorationIds = this._editor.deltaDecorations(this._decorationIds, [{
                    options: this._options,
                    range: __assign({}, e.range, { endLineNumber: e.range.startLineNumber })
                }]);
        };
        LightBulbWidget.prototype.hide = function () {
            this._decorationIds = this._editor.deltaDecorations(this._decorationIds, []);
            this._futureFixes.cancel();
            this._currentLine = undefined;
        };
        return LightBulbWidget;
    }());
    exports.LightBulbWidget = LightBulbWidget;
});
//# sourceMappingURL=lightBulbWidget.js.map