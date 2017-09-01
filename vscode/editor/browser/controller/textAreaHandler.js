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
define(["require", "exports", "vs/base/common/platform", "vs/base/browser/browser", "vs/editor/browser/controller/textAreaInput", "vs/editor/browser/controller/textAreaState", "vs/editor/common/core/range", "vs/editor/common/core/selection", "vs/editor/common/core/position", "vs/editor/browser/config/configuration", "vs/editor/common/view/viewEvents", "vs/base/browser/fastDomNode", "vs/editor/browser/view/viewPart", "vs/editor/browser/viewParts/margin/margin", "vs/editor/browser/viewParts/lineNumbers/lineNumbers", "vs/css!./textAreaHandler"], function (require, exports, platform, browser, textAreaInput_1, textAreaState_1, range_1, selection_1, position_1, configuration_1, viewEvents, fastDomNode_1, viewPart_1, margin_1, lineNumbers_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var VisibleTextAreaData = (function () {
        function VisibleTextAreaData(top, left, width) {
            this.top = top;
            this.left = left;
            this.width = width;
        }
        VisibleTextAreaData.prototype.setWidth = function (width) {
            return new VisibleTextAreaData(this.top, this.left, width);
        };
        return VisibleTextAreaData;
    }());
    var canUseZeroSizeTextarea = (browser.isEdgeOrIE || browser.isFirefox);
    var TextAreaHandler = (function (_super) {
        __extends(TextAreaHandler, _super);
        function TextAreaHandler(context, viewController, viewHelper) {
            var _this = _super.call(this, context) || this;
            // --- end view API
            _this._primaryCursorVisibleRange = null;
            _this._viewController = viewController;
            _this._viewHelper = viewHelper;
            var conf = _this._context.configuration.editor;
            _this._pixelRatio = conf.pixelRatio;
            _this._accessibilitySupport = conf.accessibilitySupport;
            _this._contentLeft = conf.layoutInfo.contentLeft;
            _this._contentWidth = conf.layoutInfo.contentWidth;
            _this._contentHeight = conf.layoutInfo.contentHeight;
            _this._scrollLeft = 0;
            _this._scrollTop = 0;
            _this._fontInfo = conf.fontInfo;
            _this._lineHeight = conf.lineHeight;
            _this._emptySelectionClipboard = conf.emptySelectionClipboard;
            _this._visibleTextArea = null;
            _this._selections = [new selection_1.Selection(1, 1, 1, 1)];
            _this._lastCopiedValue = null;
            _this._lastCopiedValueIsFromEmptySelection = false;
            // Text Area (The focus will always be in the textarea when the cursor is blinking)
            _this.textArea = fastDomNode_1.createFastDomNode(document.createElement('textarea'));
            viewPart_1.PartFingerprints.write(_this.textArea, 6 /* TextArea */);
            _this.textArea.setClassName('inputarea');
            _this.textArea.setAttribute('wrap', 'off');
            _this.textArea.setAttribute('autocorrect', 'off');
            _this.textArea.setAttribute('autocapitalize', 'off');
            _this.textArea.setAttribute('autocomplete', 'off');
            _this.textArea.setAttribute('spellcheck', 'false');
            _this.textArea.setAttribute('aria-label', conf.viewInfo.ariaLabel);
            _this.textArea.setAttribute('role', 'textbox');
            _this.textArea.setAttribute('aria-multiline', 'true');
            _this.textArea.setAttribute('aria-haspopup', 'false');
            _this.textArea.setAttribute('aria-autocomplete', 'both');
            _this.textAreaCover = fastDomNode_1.createFastDomNode(document.createElement('div'));
            _this.textAreaCover.setPosition('absolute');
            var simpleModel = {
                getLineCount: function () {
                    return _this._context.model.getLineCount();
                },
                getLineMaxColumn: function (lineNumber) {
                    return _this._context.model.getLineMaxColumn(lineNumber);
                },
                getValueInRange: function (range, eol) {
                    return _this._context.model.getValueInRange(range, eol);
                }
            };
            var textAreaInputHost = {
                getPlainTextToCopy: function () {
                    var whatToCopy = _this._context.model.getPlainTextToCopy(_this._selections, _this._emptySelectionClipboard);
                    if (_this._emptySelectionClipboard) {
                        if (browser.isFirefox) {
                            // When writing "LINE\r\n" to the clipboard and then pasting,
                            // Firefox pastes "LINE\n", so let's work around this quirk
                            _this._lastCopiedValue = whatToCopy.replace(/\r\n/g, '\n');
                        }
                        else {
                            _this._lastCopiedValue = whatToCopy;
                        }
                        var selections = _this._selections;
                        _this._lastCopiedValueIsFromEmptySelection = (selections.length === 1 && selections[0].isEmpty());
                    }
                    return whatToCopy;
                },
                getHTMLToCopy: function () {
                    return _this._context.model.getHTMLToCopy(_this._selections, _this._emptySelectionClipboard);
                },
                getScreenReaderContent: function (currentState) {
                    if (browser.isIPad) {
                        // Do not place anything in the textarea for the iPad
                        return textAreaState_1.TextAreaState.EMPTY;
                    }
                    if (_this._accessibilitySupport === 1 /* Disabled */) {
                        // We know for a fact that a screen reader is not attached
                        return textAreaState_1.TextAreaState.EMPTY;
                    }
                    return textAreaState_1.PagedScreenReaderStrategy.fromEditorSelection(currentState, simpleModel, _this._selections[0]);
                },
                deduceModelPosition: function (viewAnchorPosition, deltaOffset, lineFeedCnt) {
                    return _this._context.model.deduceModelPositionRelativeToViewPosition(viewAnchorPosition, deltaOffset, lineFeedCnt);
                }
            };
            _this._textAreaInput = _this._register(new textAreaInput_1.TextAreaInput(textAreaInputHost, _this.textArea));
            _this._register(_this._textAreaInput.onKeyDown(function (e) {
                _this._viewController.emitKeyDown(e);
            }));
            _this._register(_this._textAreaInput.onKeyUp(function (e) {
                _this._viewController.emitKeyUp(e);
            }));
            _this._register(_this._textAreaInput.onPaste(function (e) {
                var pasteOnNewLine = false;
                if (_this._emptySelectionClipboard) {
                    pasteOnNewLine = (e.text === _this._lastCopiedValue && _this._lastCopiedValueIsFromEmptySelection);
                }
                _this._viewController.paste('keyboard', e.text, pasteOnNewLine);
            }));
            _this._register(_this._textAreaInput.onCut(function () {
                _this._viewController.cut('keyboard');
            }));
            _this._register(_this._textAreaInput.onType(function (e) {
                if (e.replaceCharCnt) {
                    _this._viewController.replacePreviousChar('keyboard', e.text, e.replaceCharCnt);
                }
                else {
                    _this._viewController.type('keyboard', e.text);
                }
            }));
            _this._register(_this._textAreaInput.onSelectionChangeRequest(function (modelSelection) {
                _this._viewController.setSelection('keyboard', modelSelection);
            }));
            _this._register(_this._textAreaInput.onCompositionStart(function () {
                var lineNumber = _this._selections[0].startLineNumber;
                var column = _this._selections[0].startColumn;
                _this._context.privateViewEventBus.emit(new viewEvents.ViewRevealRangeRequestEvent(new range_1.Range(lineNumber, column, lineNumber, column), 0 /* Simple */, true));
                // Find range pixel position
                var visibleRange = _this._viewHelper.visibleRangeForPositionRelativeToEditor(lineNumber, column);
                if (visibleRange) {
                    _this._visibleTextArea = new VisibleTextAreaData(_this._context.viewLayout.getVerticalOffsetForLineNumber(lineNumber), visibleRange.left, canUseZeroSizeTextarea ? 0 : 1);
                    _this._render();
                }
                // Show the textarea
                _this.textArea.setClassName('inputarea ime-input');
                _this._viewController.compositionStart('keyboard');
            }));
            _this._register(_this._textAreaInput.onCompositionUpdate(function (e) {
                if (browser.isEdgeOrIE) {
                    // Due to isEdgeOrIE (where the textarea was not cleared initially)
                    // we cannot assume the text consists only of the composited text
                    _this._visibleTextArea = _this._visibleTextArea.setWidth(0);
                }
                else {
                    // adjust width by its size
                    _this._visibleTextArea = _this._visibleTextArea.setWidth(measureText(e.data, _this._fontInfo));
                }
                _this._render();
            }));
            _this._register(_this._textAreaInput.onCompositionEnd(function () {
                _this._visibleTextArea = null;
                _this._render();
                _this.textArea.setClassName('inputarea');
                _this._viewController.compositionEnd('keyboard');
            }));
            _this._register(_this._textAreaInput.onFocus(function () {
                _this._context.privateViewEventBus.emit(new viewEvents.ViewFocusChangedEvent(true));
            }));
            _this._register(_this._textAreaInput.onBlur(function () {
                _this._context.privateViewEventBus.emit(new viewEvents.ViewFocusChangedEvent(false));
            }));
            return _this;
        }
        TextAreaHandler.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
        };
        // --- begin event handlers
        TextAreaHandler.prototype.onConfigurationChanged = function (e) {
            var conf = this._context.configuration.editor;
            if (e.fontInfo) {
                this._fontInfo = conf.fontInfo;
            }
            if (e.viewInfo) {
                this.textArea.setAttribute('aria-label', conf.viewInfo.ariaLabel);
            }
            if (e.layoutInfo) {
                this._contentLeft = conf.layoutInfo.contentLeft;
                this._contentWidth = conf.layoutInfo.contentWidth;
                this._contentHeight = conf.layoutInfo.contentHeight;
            }
            if (e.lineHeight) {
                this._lineHeight = conf.lineHeight;
            }
            if (e.pixelRatio) {
                this._pixelRatio = conf.pixelRatio;
            }
            if (e.accessibilitySupport) {
                this._accessibilitySupport = conf.accessibilitySupport;
                this._textAreaInput.writeScreenReaderContent('strategy changed');
            }
            if (e.emptySelectionClipboard) {
                this._emptySelectionClipboard = conf.emptySelectionClipboard;
            }
            return true;
        };
        TextAreaHandler.prototype.onCursorStateChanged = function (e) {
            this._selections = e.selections.slice(0);
            this._textAreaInput.writeScreenReaderContent('selection changed');
            return true;
        };
        TextAreaHandler.prototype.onDecorationsChanged = function (e) {
            // true for inline decorations that can end up relayouting text
            return true;
        };
        TextAreaHandler.prototype.onFlushed = function (e) {
            return true;
        };
        TextAreaHandler.prototype.onLinesChanged = function (e) {
            return true;
        };
        TextAreaHandler.prototype.onLinesDeleted = function (e) {
            return true;
        };
        TextAreaHandler.prototype.onLinesInserted = function (e) {
            return true;
        };
        TextAreaHandler.prototype.onScrollChanged = function (e) {
            this._scrollLeft = e.scrollLeft;
            this._scrollTop = e.scrollTop;
            return true;
        };
        TextAreaHandler.prototype.onZonesChanged = function (e) {
            return true;
        };
        // --- end event handlers
        // --- begin view API
        TextAreaHandler.prototype.isFocused = function () {
            return this._textAreaInput.isFocused();
        };
        TextAreaHandler.prototype.focusTextArea = function () {
            this._textAreaInput.focusTextArea();
        };
        TextAreaHandler.prototype.setAriaActiveDescendant = function (id) {
            if (id) {
                this.textArea.setAttribute('role', 'combobox');
                if (this.textArea.getAttribute('aria-activedescendant') !== id) {
                    this.textArea.setAttribute('aria-haspopup', 'true');
                    this.textArea.setAttribute('aria-activedescendant', id);
                }
            }
            else {
                this.textArea.setAttribute('role', 'textbox');
                this.textArea.removeAttribute('aria-activedescendant');
                this.textArea.removeAttribute('aria-haspopup');
            }
        };
        TextAreaHandler.prototype.prepareRender = function (ctx) {
            if (this._accessibilitySupport === 2 /* Enabled */) {
                // Do not move the textarea with the cursor, as this generates accessibility events that might confuse screen readers
                // See https://github.com/Microsoft/vscode/issues/26730
                this._primaryCursorVisibleRange = null;
            }
            else {
                var primaryCursorPosition = new position_1.Position(this._selections[0].positionLineNumber, this._selections[0].positionColumn);
                this._primaryCursorVisibleRange = ctx.visibleRangeForPosition(primaryCursorPosition);
            }
        };
        TextAreaHandler.prototype.render = function (ctx) {
            this._textAreaInput.writeScreenReaderContent('render');
            this._render();
        };
        TextAreaHandler.prototype._render = function () {
            if (this._visibleTextArea) {
                // The text area is visible for composition reasons
                this._renderInsideEditor(this._visibleTextArea.top - this._scrollTop, this._contentLeft + this._visibleTextArea.left - this._scrollLeft, this._visibleTextArea.width, this._lineHeight, true);
                return;
            }
            if (!this._primaryCursorVisibleRange) {
                // The primary cursor is outside the viewport => place textarea to the top left
                this._renderAtTopLeft();
                return;
            }
            var left = this._contentLeft + this._primaryCursorVisibleRange.left - this._scrollLeft;
            if (left < this._contentLeft || left > this._contentLeft + this._contentWidth) {
                // cursor is outside the viewport
                this._renderAtTopLeft();
                return;
            }
            var top = this._context.viewLayout.getVerticalOffsetForLineNumber(this._selections[0].positionLineNumber) - this._scrollTop;
            if (top < 0 || top > this._contentHeight) {
                // cursor is outside the viewport
                this._renderAtTopLeft();
                return;
            }
            // The primary cursor is in the viewport (at least vertically) => place textarea on the cursor
            this._renderInsideEditor(top, left, canUseZeroSizeTextarea ? 0 : 1, canUseZeroSizeTextarea ? 0 : 1, false);
        };
        TextAreaHandler.prototype._renderInsideEditor = function (top, left, width, height, useEditorFont) {
            var ta = this.textArea;
            var tac = this.textAreaCover;
            if (useEditorFont) {
                configuration_1.Configuration.applyFontInfo(ta, this._fontInfo);
            }
            else {
                ta.setFontSize(1);
                ta.setLineHeight(this._fontInfo.lineHeight);
            }
            ta.setTop(top);
            ta.setLeft(left);
            ta.setWidth(width);
            ta.setHeight(height);
            tac.setTop(0);
            tac.setLeft(0);
            tac.setWidth(0);
            tac.setHeight(0);
        };
        TextAreaHandler.prototype._renderAtTopLeft = function () {
            var ta = this.textArea;
            var tac = this.textAreaCover;
            configuration_1.Configuration.applyFontInfo(ta, this._fontInfo);
            ta.setTop(0);
            ta.setLeft(0);
            tac.setTop(0);
            tac.setLeft(0);
            if (canUseZeroSizeTextarea) {
                ta.setWidth(0);
                ta.setHeight(0);
                tac.setWidth(0);
                tac.setHeight(0);
                return;
            }
            // (in WebKit the textarea is 1px by 1px because it cannot handle input to a 0x0 textarea)
            // specifically, when doing Korean IME, setting the textare to 0x0 breaks IME badly.
            ta.setWidth(1);
            ta.setHeight(1);
            tac.setWidth(1);
            tac.setHeight(1);
            if (this._context.configuration.editor.viewInfo.glyphMargin) {
                tac.setClassName('monaco-editor-background textAreaCover ' + margin_1.Margin.CLASS_NAME);
            }
            else {
                if (this._context.configuration.editor.viewInfo.renderLineNumbers) {
                    tac.setClassName('monaco-editor-background textAreaCover ' + lineNumbers_1.LineNumbersOverlay.CLASS_NAME);
                }
                else {
                    tac.setClassName('monaco-editor-background textAreaCover');
                }
            }
        };
        return TextAreaHandler;
    }(viewPart_1.ViewPart));
    exports.TextAreaHandler = TextAreaHandler;
    function measureText(text, fontInfo) {
        // adjust width by its size
        var canvasElem = document.createElement('canvas');
        var context = canvasElem.getContext('2d');
        context.font = createFontString(fontInfo);
        var metrics = context.measureText(text);
        if (browser.isFirefox) {
            return metrics.width + 2; // +2 for Japanese...
        }
        else {
            return metrics.width;
        }
    }
    function createFontString(bareFontInfo) {
        return doCreateFontString('normal', bareFontInfo.fontWeight, bareFontInfo.fontSize, bareFontInfo.lineHeight, bareFontInfo.fontFamily);
    }
    function doCreateFontString(fontStyle, fontWeight, fontSize, lineHeight, fontFamily) {
        // The full font syntax is:
        // style | variant | weight | stretch | size/line-height | fontFamily
        // (https://developer.mozilla.org/en-US/docs/Web/CSS/font)
        // But it appears Edge and IE11 cannot properly parse `stretch`.
        return fontStyle + " normal " + fontWeight + " " + fontSize + "px / " + lineHeight + "px " + fontFamily;
    }
});
//# sourceMappingURL=textAreaHandler.js.map