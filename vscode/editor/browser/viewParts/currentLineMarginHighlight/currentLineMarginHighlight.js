/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
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
define(["require", "exports", "vs/editor/browser/view/dynamicViewOverlay", "vs/platform/theme/common/themeService", "vs/editor/common/view/editorColorRegistry", "vs/css!./currentLineMarginHighlight"], function (require, exports, dynamicViewOverlay_1, themeService_1, editorColorRegistry_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var CurrentLineMarginHighlightOverlay = (function (_super) {
        __extends(CurrentLineMarginHighlightOverlay, _super);
        function CurrentLineMarginHighlightOverlay(context) {
            var _this = _super.call(this) || this;
            _this._context = context;
            _this._lineHeight = _this._context.configuration.editor.lineHeight;
            _this._renderLineHighlight = _this._context.configuration.editor.viewInfo.renderLineHighlight;
            _this._primaryCursorIsInEditableRange = true;
            _this._primaryCursorLineNumber = 1;
            _this._contentLeft = _this._context.configuration.editor.layoutInfo.contentLeft;
            _this._context.addEventHandler(_this);
            return _this;
        }
        CurrentLineMarginHighlightOverlay.prototype.dispose = function () {
            this._context.removeEventHandler(this);
            this._context = null;
            _super.prototype.dispose.call(this);
        };
        // --- begin event handlers
        CurrentLineMarginHighlightOverlay.prototype.onConfigurationChanged = function (e) {
            if (e.lineHeight) {
                this._lineHeight = this._context.configuration.editor.lineHeight;
            }
            if (e.viewInfo) {
                this._renderLineHighlight = this._context.configuration.editor.viewInfo.renderLineHighlight;
            }
            if (e.layoutInfo) {
                this._contentLeft = this._context.configuration.editor.layoutInfo.contentLeft;
            }
            return true;
        };
        CurrentLineMarginHighlightOverlay.prototype.onCursorStateChanged = function (e) {
            var hasChanged = false;
            if (this._primaryCursorIsInEditableRange !== e.isInEditableRange) {
                this._primaryCursorIsInEditableRange = e.isInEditableRange;
                hasChanged = true;
            }
            var primaryCursorLineNumber = e.selections[0].positionLineNumber;
            if (this._primaryCursorLineNumber !== primaryCursorLineNumber) {
                this._primaryCursorLineNumber = primaryCursorLineNumber;
                hasChanged = true;
            }
            return hasChanged;
        };
        CurrentLineMarginHighlightOverlay.prototype.onFlushed = function (e) {
            return true;
        };
        CurrentLineMarginHighlightOverlay.prototype.onLinesDeleted = function (e) {
            return true;
        };
        CurrentLineMarginHighlightOverlay.prototype.onLinesInserted = function (e) {
            return true;
        };
        CurrentLineMarginHighlightOverlay.prototype.onZonesChanged = function (e) {
            return true;
        };
        // --- end event handlers
        CurrentLineMarginHighlightOverlay.prototype.prepareRender = function (ctx) {
        };
        CurrentLineMarginHighlightOverlay.prototype.render = function (startLineNumber, lineNumber) {
            if (lineNumber === this._primaryCursorLineNumber) {
                if (this._shouldShowCurrentLine()) {
                    return ('<div class="current-line-margin" style="width:'
                        + String(this._contentLeft)
                        + 'px; height:'
                        + String(this._lineHeight)
                        + 'px;"></div>');
                }
                else {
                    return '';
                }
            }
            return '';
        };
        CurrentLineMarginHighlightOverlay.prototype._shouldShowCurrentLine = function () {
            return (this._renderLineHighlight === 'gutter' || this._renderLineHighlight === 'all') && this._primaryCursorIsInEditableRange;
        };
        return CurrentLineMarginHighlightOverlay;
    }(dynamicViewOverlay_1.DynamicViewOverlay));
    exports.CurrentLineMarginHighlightOverlay = CurrentLineMarginHighlightOverlay;
    themeService_1.registerThemingParticipant(function (theme, collector) {
        var lineHighlight = theme.getColor(editorColorRegistry_1.editorLineHighlight);
        if (lineHighlight) {
            collector.addRule(".monaco-editor .margin-view-overlays .current-line-margin { background-color: " + lineHighlight + "; border: none; }");
        }
        else {
            var lineHighlightBorder = theme.getColor(editorColorRegistry_1.editorLineHighlightBorder);
            if (lineHighlightBorder) {
                collector.addRule(".monaco-editor .margin-view-overlays .current-line-margin { border: 2px solid " + lineHighlightBorder + "; }");
            }
            if (theme.type === 'hc') {
                collector.addRule(".monaco-editor .margin-view-overlays .current-line-margin { border-width: 1px; }");
            }
        }
    });
});
//# sourceMappingURL=currentLineMarginHighlight.js.map