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
define(["require", "exports", "./hoverOperation", "./hoverWidgets", "vs/base/browser/dom", "vs/base/browser/htmlContentRenderer", "vs/platform/opener/common/opener", "vs/base/common/uri", "vs/base/common/errors", "vs/editor/common/modes/textToHtmlTokenizer", "vs/base/common/htmlContent"], function (require, exports, hoverOperation_1, hoverWidgets_1, dom_1, htmlContentRenderer_1, opener_1, uri_1, errors_1, textToHtmlTokenizer_1, htmlContent_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var MarginComputer = (function () {
        function MarginComputer(editor) {
            this._editor = editor;
            this._lineNumber = -1;
        }
        MarginComputer.prototype.setLineNumber = function (lineNumber) {
            this._lineNumber = lineNumber;
            this._result = [];
        };
        MarginComputer.prototype.clearResult = function () {
            this._result = [];
        };
        MarginComputer.prototype.computeSync = function () {
            var toHoverMessage = function (contents) {
                return {
                    value: contents
                };
            };
            var lineDecorations = this._editor.getLineDecorations(this._lineNumber);
            var result = [];
            for (var i = 0, len = lineDecorations.length; i < len; i++) {
                var d = lineDecorations[i];
                if (!d.options.glyphMarginClassName) {
                    continue;
                }
                var hoverMessage = d.options.glyphMarginHoverMessage;
                if (!htmlContent_1.isEmptyMarkdownString(hoverMessage)) {
                    continue;
                }
                if (Array.isArray(hoverMessage)) {
                    result = result.concat(hoverMessage.map(toHoverMessage));
                }
                else {
                    result.push(toHoverMessage(hoverMessage));
                }
            }
            return result;
        };
        MarginComputer.prototype.onResult = function (result, isFromSynchronousComputation) {
            this._result = this._result.concat(result);
        };
        MarginComputer.prototype.getResult = function () {
            return this._result;
        };
        MarginComputer.prototype.getResultWithLoadingMessage = function () {
            return this.getResult();
        };
        return MarginComputer;
    }());
    var ModesGlyphHoverWidget = (function (_super) {
        __extends(ModesGlyphHoverWidget, _super);
        function ModesGlyphHoverWidget(editor, openerService, modeService) {
            var _this = _super.call(this, ModesGlyphHoverWidget.ID, editor) || this;
            _this.openerService = openerService;
            _this.modeService = modeService;
            _this.openerService = openerService || opener_1.NullOpenerService;
            _this._lastLineNumber = -1;
            _this._computer = new MarginComputer(_this._editor);
            _this._hoverOperation = new hoverOperation_1.HoverOperation(_this._computer, function (result) { return _this._withResult(result); }, null, function (result) { return _this._withResult(result); });
            return _this;
        }
        ModesGlyphHoverWidget.prototype.dispose = function () {
            this._hoverOperation.cancel();
            _super.prototype.dispose.call(this);
        };
        ModesGlyphHoverWidget.prototype.onModelDecorationsChanged = function () {
            if (this.isVisible) {
                // The decorations have changed and the hover is visible,
                // we need to recompute the displayed text
                this._hoverOperation.cancel();
                this._computer.clearResult();
                this._hoverOperation.start();
            }
        };
        ModesGlyphHoverWidget.prototype.startShowingAt = function (lineNumber) {
            if (this._lastLineNumber === lineNumber) {
                // We have to show the widget at the exact same line number as before, so no work is needed
                return;
            }
            this._hoverOperation.cancel();
            this.hide();
            this._lastLineNumber = lineNumber;
            this._computer.setLineNumber(lineNumber);
            this._hoverOperation.start();
        };
        ModesGlyphHoverWidget.prototype.hide = function () {
            this._lastLineNumber = -1;
            this._hoverOperation.cancel();
            _super.prototype.hide.call(this);
        };
        ModesGlyphHoverWidget.prototype._withResult = function (result) {
            this._messages = result;
            if (this._messages.length > 0) {
                this._renderMessages(this._lastLineNumber, this._messages);
            }
            else {
                this.hide();
            }
        };
        ModesGlyphHoverWidget.prototype._renderMessages = function (lineNumber, messages) {
            var _this = this;
            var fragment = document.createDocumentFragment();
            messages.forEach(function (msg) {
                var renderedContents = htmlContentRenderer_1.renderMarkdown(msg.value, {
                    actionCallback: function (content) { return _this.openerService.open(uri_1.default.parse(content)).then(undefined, errors_1.onUnexpectedError); },
                    codeBlockRenderer: function (languageAlias, value) {
                        // In markdown, it is possible that we stumble upon language aliases (e.g. js instead of javascript)
                        var modeId = _this.modeService.getModeIdForLanguageName(languageAlias);
                        return _this.modeService.getOrCreateMode(modeId).then(function (_) {
                            return textToHtmlTokenizer_1.tokenizeToString(value, modeId);
                        });
                    }
                });
                fragment.appendChild(dom_1.$('div.hover-row', null, renderedContents));
            });
            this.updateContents(fragment);
            this.showAt(lineNumber);
        };
        ModesGlyphHoverWidget.ID = 'editor.contrib.modesGlyphHoverWidget';
        return ModesGlyphHoverWidget;
    }(hoverWidgets_1.GlyphHoverWidget));
    exports.ModesGlyphHoverWidget = ModesGlyphHoverWidget;
});
//# sourceMappingURL=modesGlyphHover.js.map