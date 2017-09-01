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
define(["require", "exports", "vs/editor/browser/view/dynamicViewOverlay", "vs/platform/theme/common/themeService", "vs/editor/common/view/editorColorRegistry", "vs/base/browser/dom", "vs/editor/common/core/position", "vs/css!./indentGuides"], function (require, exports, dynamicViewOverlay_1, themeService_1, editorColorRegistry_1, dom, position_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var IndentGuidesOverlay = (function (_super) {
        __extends(IndentGuidesOverlay, _super);
        function IndentGuidesOverlay(context) {
            var _this = _super.call(this) || this;
            _this._context = context;
            _this._lineHeight = _this._context.configuration.editor.lineHeight;
            _this._spaceWidth = _this._context.configuration.editor.fontInfo.spaceWidth;
            _this._enabled = _this._context.configuration.editor.viewInfo.renderIndentGuides;
            _this._renderResult = null;
            _this._context.addEventHandler(_this);
            return _this;
        }
        IndentGuidesOverlay.prototype.dispose = function () {
            this._context.removeEventHandler(this);
            this._context = null;
            this._renderResult = null;
            _super.prototype.dispose.call(this);
        };
        // --- begin event handlers
        IndentGuidesOverlay.prototype.onConfigurationChanged = function (e) {
            if (e.lineHeight) {
                this._lineHeight = this._context.configuration.editor.lineHeight;
            }
            if (e.fontInfo) {
                this._spaceWidth = this._context.configuration.editor.fontInfo.spaceWidth;
            }
            if (e.viewInfo) {
                this._enabled = this._context.configuration.editor.viewInfo.renderIndentGuides;
            }
            return true;
        };
        IndentGuidesOverlay.prototype.onDecorationsChanged = function (e) {
            // true for inline decorations
            return true;
        };
        IndentGuidesOverlay.prototype.onFlushed = function (e) {
            return true;
        };
        IndentGuidesOverlay.prototype.onLinesChanged = function (e) {
            return true;
        };
        IndentGuidesOverlay.prototype.onLinesDeleted = function (e) {
            return true;
        };
        IndentGuidesOverlay.prototype.onLinesInserted = function (e) {
            return true;
        };
        IndentGuidesOverlay.prototype.onScrollChanged = function (e) {
            return e.scrollTopChanged; // || e.scrollWidthChanged;
        };
        IndentGuidesOverlay.prototype.onZonesChanged = function (e) {
            return true;
        };
        // --- end event handlers
        IndentGuidesOverlay.prototype.prepareRender = function (ctx) {
            if (!this._enabled) {
                this._renderResult = null;
                return;
            }
            var visibleStartLineNumber = ctx.visibleRange.startLineNumber;
            var visibleEndLineNumber = ctx.visibleRange.endLineNumber;
            var tabSize = this._context.model.getTabSize();
            var tabWidth = tabSize * this._spaceWidth;
            var lineHeight = this._lineHeight;
            var indentGuideWidth = dom.computeScreenAwareSize(1);
            var output = [];
            for (var lineNumber = visibleStartLineNumber; lineNumber <= visibleEndLineNumber; lineNumber++) {
                var lineIndex = lineNumber - visibleStartLineNumber;
                var indent = this._context.model.getLineIndentGuide(lineNumber);
                var result = '';
                var leftMostVisiblePosition = ctx.visibleRangeForPosition(new position_1.Position(lineNumber, 1));
                var left = leftMostVisiblePosition ? leftMostVisiblePosition.left : 0;
                for (var i = 0; i < indent; i++) {
                    result += "<div class=\"cigr\" style=\"left:" + left + "px;height:" + lineHeight + "px;width:" + indentGuideWidth + "px\"></div>";
                    left += tabWidth;
                }
                output[lineIndex] = result;
            }
            this._renderResult = output;
        };
        IndentGuidesOverlay.prototype.render = function (startLineNumber, lineNumber) {
            if (!this._renderResult) {
                return '';
            }
            var lineIndex = lineNumber - startLineNumber;
            if (lineIndex < 0 || lineIndex >= this._renderResult.length) {
                throw new Error('Unexpected render request');
            }
            return this._renderResult[lineIndex];
        };
        return IndentGuidesOverlay;
    }(dynamicViewOverlay_1.DynamicViewOverlay));
    exports.IndentGuidesOverlay = IndentGuidesOverlay;
    themeService_1.registerThemingParticipant(function (theme, collector) {
        var editorGuideColor = theme.getColor(editorColorRegistry_1.editorIndentGuides);
        if (editorGuideColor) {
            collector.addRule(".monaco-editor .lines-content .cigr { background-color: " + editorGuideColor + "; }");
        }
    });
});
//# sourceMappingURL=indentGuides.js.map