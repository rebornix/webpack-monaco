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
define(["require", "exports", "vs/editor/browser/view/dynamicViewOverlay", "vs/platform/theme/common/themeService", "vs/editor/common/view/editorColorRegistry", "vs/css!./currentLineHighlight"], function (require, exports, dynamicViewOverlay_1, themeService_1, editorColorRegistry_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var CurrentLineHighlightOverlay = (function (_super) {
        __extends(CurrentLineHighlightOverlay, _super);
        function CurrentLineHighlightOverlay(context) {
            var _this = _super.call(this) || this;
            _this._context = context;
            _this._lineHeight = _this._context.configuration.editor.lineHeight;
            _this._readOnly = _this._context.configuration.editor.readOnly;
            _this._renderLineHighlight = _this._context.configuration.editor.viewInfo.renderLineHighlight;
            _this._selectionIsEmpty = true;
            _this._primaryCursorIsInEditableRange = true;
            _this._primaryCursorLineNumber = 1;
            _this._scrollWidth = 0;
            _this._contentWidth = _this._context.configuration.editor.layoutInfo.contentWidth;
            _this._context.addEventHandler(_this);
            return _this;
        }
        CurrentLineHighlightOverlay.prototype.dispose = function () {
            this._context.removeEventHandler(this);
            this._context = null;
            _super.prototype.dispose.call(this);
        };
        // --- begin event handlers
        CurrentLineHighlightOverlay.prototype.onConfigurationChanged = function (e) {
            if (e.lineHeight) {
                this._lineHeight = this._context.configuration.editor.lineHeight;
            }
            if (e.readOnly) {
                this._readOnly = this._context.configuration.editor.readOnly;
            }
            if (e.viewInfo) {
                this._renderLineHighlight = this._context.configuration.editor.viewInfo.renderLineHighlight;
            }
            if (e.layoutInfo) {
                this._contentWidth = this._context.configuration.editor.layoutInfo.contentWidth;
            }
            return true;
        };
        CurrentLineHighlightOverlay.prototype.onCursorStateChanged = function (e) {
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
            var selectionIsEmpty = e.selections[0].isEmpty();
            if (this._selectionIsEmpty !== selectionIsEmpty) {
                this._selectionIsEmpty = selectionIsEmpty;
                hasChanged = true;
                return true;
            }
            return hasChanged;
        };
        CurrentLineHighlightOverlay.prototype.onFlushed = function (e) {
            return true;
        };
        CurrentLineHighlightOverlay.prototype.onLinesDeleted = function (e) {
            return true;
        };
        CurrentLineHighlightOverlay.prototype.onLinesInserted = function (e) {
            return true;
        };
        CurrentLineHighlightOverlay.prototype.onScrollChanged = function (e) {
            return e.scrollWidthChanged;
        };
        CurrentLineHighlightOverlay.prototype.onZonesChanged = function (e) {
            return true;
        };
        // --- end event handlers
        CurrentLineHighlightOverlay.prototype.prepareRender = function (ctx) {
            this._scrollWidth = ctx.scrollWidth;
        };
        CurrentLineHighlightOverlay.prototype.render = function (startLineNumber, lineNumber) {
            if (lineNumber === this._primaryCursorLineNumber) {
                if (this._shouldShowCurrentLine()) {
                    return ('<div class="current-line" style="width:'
                        + String(Math.max(this._scrollWidth, this._contentWidth))
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
        CurrentLineHighlightOverlay.prototype._shouldShowCurrentLine = function () {
            return (this._renderLineHighlight === 'line' || this._renderLineHighlight === 'all') &&
                this._selectionIsEmpty &&
                this._primaryCursorIsInEditableRange;
        };
        return CurrentLineHighlightOverlay;
    }(dynamicViewOverlay_1.DynamicViewOverlay));
    exports.CurrentLineHighlightOverlay = CurrentLineHighlightOverlay;
    themeService_1.registerThemingParticipant(function (theme, collector) {
        var lineHighlight = theme.getColor(editorColorRegistry_1.editorLineHighlight);
        if (lineHighlight) {
            collector.addRule(".monaco-editor .view-overlays .current-line { background-color: " + lineHighlight + "; }");
        }
        if (!lineHighlight || lineHighlight.isTransparent() || theme.defines(editorColorRegistry_1.editorLineHighlightBorder)) {
            var lineHighlightBorder = theme.getColor(editorColorRegistry_1.editorLineHighlightBorder);
            if (lineHighlightBorder) {
                collector.addRule(".monaco-editor .view-overlays .current-line { border: 2px solid " + lineHighlightBorder + "; }");
                if (theme.type === 'hc') {
                    collector.addRule(".monaco-editor .view-overlays .current-line { border-width: 1px; }");
                }
            }
        }
    });
});
//# sourceMappingURL=currentLineHighlight.js.map