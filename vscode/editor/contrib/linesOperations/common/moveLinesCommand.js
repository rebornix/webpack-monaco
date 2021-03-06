define(["require", "exports", "vs/base/common/strings", "vs/editor/common/core/range", "vs/editor/common/core/selection", "vs/editor/common/modes/languageConfigurationRegistry", "vs/editor/common/commands/shiftCommand", "vs/editor/contrib/indentation/common/indentUtils", "vs/editor/common/modes/languageConfiguration"], function (require, exports, strings, range_1, selection_1, languageConfigurationRegistry_1, shiftCommand_1, IndentUtil, languageConfiguration_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var MoveLinesCommand = (function () {
        function MoveLinesCommand(selection, isMovingDown, autoIndent) {
            this._selection = selection;
            this._isMovingDown = isMovingDown;
            this._autoIndent = autoIndent;
            this._moveEndLineSelectionShrink = false;
        }
        MoveLinesCommand.prototype.getEditOperations = function (model, builder) {
            var modelLineCount = model.getLineCount();
            if (this._isMovingDown && this._selection.endLineNumber === modelLineCount) {
                return;
            }
            if (!this._isMovingDown && this._selection.startLineNumber === 1) {
                return;
            }
            this._moveEndPositionDown = false;
            var s = this._selection;
            if (s.startLineNumber < s.endLineNumber && s.endColumn === 1) {
                this._moveEndPositionDown = true;
                s = s.setEndPosition(s.endLineNumber - 1, model.getLineMaxColumn(s.endLineNumber - 1));
            }
            var tabSize = model.getOptions().tabSize;
            var insertSpaces = model.getOptions().insertSpaces;
            var indentConverter = this.buildIndentConverter(tabSize);
            var virtualModel = {
                getLineTokens: function (lineNumber) {
                    return model.getLineTokens(lineNumber);
                },
                getLanguageIdentifier: function () {
                    return model.getLanguageIdentifier();
                },
                getLanguageIdAtPosition: function (lineNumber, column) {
                    return model.getLanguageIdAtPosition(lineNumber, column);
                },
                getLineContent: null
            };
            if (s.startLineNumber === s.endLineNumber && model.getLineMaxColumn(s.startLineNumber) === 1) {
                // Current line is empty
                var lineNumber = s.startLineNumber;
                var otherLineNumber = (this._isMovingDown ? lineNumber + 1 : lineNumber - 1);
                if (model.getLineMaxColumn(otherLineNumber) === 1) {
                    // Other line number is empty too, so no editing is needed
                    // Add a no-op to force running by the model
                    builder.addEditOperation(new range_1.Range(1, 1, 1, 1), null);
                }
                else {
                    // Type content from other line number on line number
                    builder.addEditOperation(new range_1.Range(lineNumber, 1, lineNumber, 1), model.getLineContent(otherLineNumber));
                    // Remove content from other line number
                    builder.addEditOperation(new range_1.Range(otherLineNumber, 1, otherLineNumber, model.getLineMaxColumn(otherLineNumber)), null);
                }
                // Track selection at the other line number
                s = new selection_1.Selection(otherLineNumber, 1, otherLineNumber, 1);
            }
            else {
                var movingLineNumber, movingLineText;
                if (this._isMovingDown) {
                    movingLineNumber = s.endLineNumber + 1;
                    movingLineText = model.getLineContent(movingLineNumber);
                    // Delete line that needs to be moved
                    builder.addEditOperation(new range_1.Range(movingLineNumber - 1, model.getLineMaxColumn(movingLineNumber - 1), movingLineNumber, model.getLineMaxColumn(movingLineNumber)), null);
                    var insertingText_1 = movingLineText;
                    if (this.shouldAutoIndent(model, s)) {
                        var movingLineMatchResult = this.matchEnterRule(model, indentConverter, tabSize, movingLineNumber, s.startLineNumber - 1);
                        // if s.startLineNumber - 1 matches onEnter rule, we still honor that.
                        if (movingLineMatchResult !== null) {
                            var oldIndentation = strings.getLeadingWhitespace(model.getLineContent(movingLineNumber));
                            var newSpaceCnt = movingLineMatchResult + IndentUtil.getSpaceCnt(oldIndentation, tabSize);
                            var newIndentation = IndentUtil.generateIndent(newSpaceCnt, tabSize, insertSpaces);
                            insertingText_1 = newIndentation + this.trimLeft(movingLineText);
                        }
                        else {
                            // no enter rule matches, let's check indentatin rules then.
                            virtualModel.getLineContent = function (lineNumber) {
                                if (lineNumber === s.startLineNumber) {
                                    return model.getLineContent(movingLineNumber);
                                }
                                else {
                                    return model.getLineContent(lineNumber);
                                }
                            };
                            var indentOfMovingLine = languageConfigurationRegistry_1.LanguageConfigurationRegistry.getGoodIndentForLine(virtualModel, model.getLanguageIdAtPosition(movingLineNumber, 1), s.startLineNumber, indentConverter);
                            if (indentOfMovingLine !== null) {
                                var oldIndentation = strings.getLeadingWhitespace(model.getLineContent(movingLineNumber));
                                var newSpaceCnt = IndentUtil.getSpaceCnt(indentOfMovingLine, tabSize);
                                var oldSpaceCnt = IndentUtil.getSpaceCnt(oldIndentation, tabSize);
                                if (newSpaceCnt !== oldSpaceCnt) {
                                    var newIndentation = IndentUtil.generateIndent(newSpaceCnt, tabSize, insertSpaces);
                                    insertingText_1 = newIndentation + this.trimLeft(movingLineText);
                                }
                            }
                        }
                        // add edit operations for moving line first to make sure it's executed after we make indentation change
                        // to s.startLineNumber
                        builder.addEditOperation(new range_1.Range(s.startLineNumber, 1, s.startLineNumber, 1), insertingText_1 + '\n');
                        var ret = this.matchEnterRule(model, indentConverter, tabSize, s.startLineNumber, s.startLineNumber, insertingText_1);
                        // check if the line being moved before matches onEnter rules, if so let's adjust the indentation by onEnter rules.
                        if (ret !== null) {
                            if (ret !== 0) {
                                this.getIndentEditsOfMovingBlock(model, builder, s, tabSize, insertSpaces, ret);
                            }
                        }
                        else {
                            // it doesn't match onEnter rules, let's check indentation rules then.
                            virtualModel.getLineContent = function (lineNumber) {
                                if (lineNumber === s.startLineNumber) {
                                    return insertingText_1;
                                }
                                else if (lineNumber >= s.startLineNumber + 1 && lineNumber <= s.endLineNumber + 1) {
                                    return model.getLineContent(lineNumber - 1);
                                }
                                else {
                                    return model.getLineContent(lineNumber);
                                }
                            };
                            var newIndentatOfMovingBlock = languageConfigurationRegistry_1.LanguageConfigurationRegistry.getGoodIndentForLine(virtualModel, model.getLanguageIdAtPosition(movingLineNumber, 1), s.startLineNumber + 1, indentConverter);
                            if (newIndentatOfMovingBlock !== null) {
                                var oldIndentation = strings.getLeadingWhitespace(model.getLineContent(s.startLineNumber));
                                var newSpaceCnt = IndentUtil.getSpaceCnt(newIndentatOfMovingBlock, tabSize);
                                var oldSpaceCnt = IndentUtil.getSpaceCnt(oldIndentation, tabSize);
                                if (newSpaceCnt !== oldSpaceCnt) {
                                    var spaceCntOffset = newSpaceCnt - oldSpaceCnt;
                                    this.getIndentEditsOfMovingBlock(model, builder, s, tabSize, insertSpaces, spaceCntOffset);
                                }
                            }
                        }
                    }
                    else {
                        // Insert line that needs to be moved before
                        builder.addEditOperation(new range_1.Range(s.startLineNumber, 1, s.startLineNumber, 1), insertingText_1 + '\n');
                    }
                }
                else {
                    movingLineNumber = s.startLineNumber - 1;
                    movingLineText = model.getLineContent(movingLineNumber);
                    // Delete line that needs to be moved
                    builder.addEditOperation(new range_1.Range(movingLineNumber, 1, movingLineNumber + 1, 1), null);
                    // Insert line that needs to be moved after
                    builder.addEditOperation(new range_1.Range(s.endLineNumber, model.getLineMaxColumn(s.endLineNumber), s.endLineNumber, model.getLineMaxColumn(s.endLineNumber)), '\n' + movingLineText);
                    if (this.shouldAutoIndent(model, s)) {
                        virtualModel.getLineContent = function (lineNumber) {
                            if (lineNumber === movingLineNumber) {
                                return model.getLineContent(s.startLineNumber);
                            }
                            else {
                                return model.getLineContent(lineNumber);
                            }
                        };
                        var ret = this.matchEnterRule(model, indentConverter, tabSize, s.startLineNumber, s.startLineNumber - 2);
                        // check if s.startLineNumber - 2 matches onEnter rules, if so adjust the moving block by onEnter rules.
                        if (ret !== null) {
                            if (ret !== 0) {
                                this.getIndentEditsOfMovingBlock(model, builder, s, tabSize, insertSpaces, ret);
                            }
                        }
                        else {
                            // it doesn't match any onEnter rule, let's check indentation rules then.
                            var indentOfFirstLine = languageConfigurationRegistry_1.LanguageConfigurationRegistry.getGoodIndentForLine(virtualModel, model.getLanguageIdAtPosition(s.startLineNumber, 1), movingLineNumber, indentConverter);
                            if (indentOfFirstLine !== null) {
                                // adjust the indentation of the moving block
                                var oldIndent = strings.getLeadingWhitespace(model.getLineContent(s.startLineNumber));
                                var newSpaceCnt = IndentUtil.getSpaceCnt(indentOfFirstLine, tabSize);
                                var oldSpaceCnt = IndentUtil.getSpaceCnt(oldIndent, tabSize);
                                if (newSpaceCnt !== oldSpaceCnt) {
                                    var spaceCntOffset = newSpaceCnt - oldSpaceCnt;
                                    this.getIndentEditsOfMovingBlock(model, builder, s, tabSize, insertSpaces, spaceCntOffset);
                                }
                            }
                        }
                    }
                }
            }
            this._selectionId = builder.trackSelection(s);
        };
        MoveLinesCommand.prototype.buildIndentConverter = function (tabSize) {
            return {
                shiftIndent: function (indentation) {
                    var desiredIndentCount = shiftCommand_1.ShiftCommand.shiftIndentCount(indentation, indentation.length + 1, tabSize);
                    var newIndentation = '';
                    for (var i = 0; i < desiredIndentCount; i++) {
                        newIndentation += '\t';
                    }
                    return newIndentation;
                },
                unshiftIndent: function (indentation) {
                    var desiredIndentCount = shiftCommand_1.ShiftCommand.unshiftIndentCount(indentation, indentation.length + 1, tabSize);
                    var newIndentation = '';
                    for (var i = 0; i < desiredIndentCount; i++) {
                        newIndentation += '\t';
                    }
                    return newIndentation;
                }
            };
        };
        MoveLinesCommand.prototype.matchEnterRule = function (model, indentConverter, tabSize, line, oneLineAbove, oneLineAboveText) {
            var validPrecedingLine = oneLineAbove;
            while (validPrecedingLine >= 1) {
                // ship empty lines as empty lines just inherit indentation
                var lineContent = void 0;
                if (validPrecedingLine === oneLineAbove && oneLineAboveText !== undefined) {
                    lineContent = oneLineAboveText;
                }
                else {
                    lineContent = model.getLineContent(validPrecedingLine);
                }
                var nonWhitespaceIdx = strings.lastNonWhitespaceIndex(lineContent);
                if (nonWhitespaceIdx >= 0) {
                    break;
                }
                validPrecedingLine--;
            }
            if (validPrecedingLine < 1 || line > model.getLineCount()) {
                return null;
            }
            var maxColumn = model.getLineMaxColumn(validPrecedingLine);
            var enter = languageConfigurationRegistry_1.LanguageConfigurationRegistry.getEnterAction(model, new range_1.Range(validPrecedingLine, maxColumn, validPrecedingLine, maxColumn));
            if (enter) {
                var enterPrefix = enter.indentation;
                var enterAction = enter.enterAction;
                if (enterAction.indentAction === languageConfiguration_1.IndentAction.None) {
                    enterPrefix = enter.indentation + enterAction.appendText;
                }
                else if (enterAction.indentAction === languageConfiguration_1.IndentAction.Indent) {
                    enterPrefix = enter.indentation + enterAction.appendText;
                }
                else if (enterAction.indentAction === languageConfiguration_1.IndentAction.IndentOutdent) {
                    enterPrefix = enter.indentation;
                }
                else if (enterAction.indentAction === languageConfiguration_1.IndentAction.Outdent) {
                    enterPrefix = indentConverter.unshiftIndent(enter.indentation) + enterAction.appendText;
                }
                var movingLineText = model.getLineContent(line);
                if (this.trimLeft(movingLineText).indexOf(this.trimLeft(enterPrefix)) >= 0) {
                    var oldIndentation = strings.getLeadingWhitespace(model.getLineContent(line));
                    var newIndentation = strings.getLeadingWhitespace(enterPrefix);
                    var indentMetadataOfMovelingLine = languageConfigurationRegistry_1.LanguageConfigurationRegistry.getIndentMetadata(model, line);
                    if (indentMetadataOfMovelingLine & 2 /* DECREASE_MASK */) {
                        newIndentation = indentConverter.unshiftIndent(newIndentation);
                    }
                    var newSpaceCnt = IndentUtil.getSpaceCnt(newIndentation, tabSize);
                    var oldSpaceCnt = IndentUtil.getSpaceCnt(oldIndentation, tabSize);
                    return newSpaceCnt - oldSpaceCnt;
                }
            }
            return null;
        };
        MoveLinesCommand.prototype.trimLeft = function (str) {
            return str.replace(/^\s+/, '');
        };
        MoveLinesCommand.prototype.shouldAutoIndent = function (model, selection) {
            if (!this._autoIndent) {
                return false;
            }
            // if it's not easy to tokenize, we stop auto indent.
            if (!model.isCheapToTokenize(selection.startLineNumber)) {
                return false;
            }
            var languageAtSelectionStart = model.getLanguageIdAtPosition(selection.startLineNumber, 1);
            var languageAtSelectionEnd = model.getLanguageIdAtPosition(selection.endLineNumber, 1);
            if (languageAtSelectionStart !== languageAtSelectionEnd) {
                return false;
            }
            if (languageConfigurationRegistry_1.LanguageConfigurationRegistry.getIndentRulesSupport(languageAtSelectionStart) === null) {
                return false;
            }
            return true;
        };
        MoveLinesCommand.prototype.getIndentEditsOfMovingBlock = function (model, builder, s, tabSize, insertSpaces, offset) {
            for (var i = s.startLineNumber; i <= s.endLineNumber; i++) {
                var lineContent = model.getLineContent(i);
                var originalIndent = strings.getLeadingWhitespace(lineContent);
                var originalSpacesCnt = IndentUtil.getSpaceCnt(originalIndent, tabSize);
                var newSpacesCnt = originalSpacesCnt + offset;
                var newIndent = IndentUtil.generateIndent(newSpacesCnt, tabSize, insertSpaces);
                if (newIndent !== originalIndent) {
                    builder.addEditOperation(new range_1.Range(i, 1, i, originalIndent.length + 1), newIndent);
                    if (i === s.endLineNumber && s.endColumn <= originalIndent.length + 1 && newIndent === '') {
                        // as users select part of the original indent white spaces
                        // when we adjust the indentation of endLine, we should adjust the cursor position as well.
                        this._moveEndLineSelectionShrink = true;
                    }
                }
            }
        };
        MoveLinesCommand.prototype.computeCursorState = function (model, helper) {
            var result = helper.getTrackedSelection(this._selectionId);
            if (this._moveEndPositionDown) {
                result = result.setEndPosition(result.endLineNumber + 1, 1);
            }
            if (this._moveEndLineSelectionShrink && result.startLineNumber < result.endLineNumber) {
                result = result.setEndPosition(result.endLineNumber, 2);
            }
            return result;
        };
        return MoveLinesCommand;
    }());
    exports.MoveLinesCommand = MoveLinesCommand;
});
//# sourceMappingURL=moveLinesCommand.js.map