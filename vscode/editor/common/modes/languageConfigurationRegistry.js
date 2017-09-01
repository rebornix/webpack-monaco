define(["require", "exports", "vs/editor/common/modes/supports/characterPair", "vs/editor/common/modes/supports/electricCharacter", "vs/editor/common/modes/supports/onEnter", "vs/editor/common/modes/supports/indentRules", "vs/editor/common/modes/supports/richEditBrackets", "vs/base/common/event", "vs/base/common/errors", "vs/base/common/strings", "vs/editor/common/model/wordHelper", "vs/editor/common/modes/supports", "vs/editor/common/core/range", "vs/editor/common/modes/languageConfiguration"], function (require, exports, characterPair_1, electricCharacter_1, onEnter_1, indentRules_1, richEditBrackets_1, event_1, errors_1, strings, wordHelper_1, supports_1, range_1, languageConfiguration_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var RichEditSupport = (function () {
        function RichEditSupport(languageIdentifier, previous, rawConf) {
            var prev = null;
            if (previous) {
                prev = previous._conf;
            }
            this._conf = RichEditSupport._mergeConf(prev, rawConf);
            if (this._conf.brackets) {
                this.brackets = new richEditBrackets_1.RichEditBrackets(languageIdentifier, this._conf.brackets);
            }
            this.onEnter = RichEditSupport._handleOnEnter(this._conf);
            this.comments = RichEditSupport._handleComments(this._conf);
            this.characterPair = new characterPair_1.CharacterPairSupport(this._conf);
            this.electricCharacter = new electricCharacter_1.BracketElectricCharacterSupport(this.brackets, this.characterPair.getAutoClosingPairs(), this._conf.__electricCharacterSupport);
            this.wordDefinition = this._conf.wordPattern || wordHelper_1.DEFAULT_WORD_REGEXP;
            this.indentationRules = this._conf.indentationRules;
            if (this._conf.indentationRules) {
                this.indentRulesSupport = new indentRules_1.IndentRulesSupport(this._conf.indentationRules);
            }
        }
        RichEditSupport._mergeConf = function (prev, current) {
            return {
                comments: (prev ? current.comments || prev.comments : current.comments),
                brackets: (prev ? current.brackets || prev.brackets : current.brackets),
                wordPattern: (prev ? current.wordPattern || prev.wordPattern : current.wordPattern),
                indentationRules: (prev ? current.indentationRules || prev.indentationRules : current.indentationRules),
                onEnterRules: (prev ? current.onEnterRules || prev.onEnterRules : current.onEnterRules),
                autoClosingPairs: (prev ? current.autoClosingPairs || prev.autoClosingPairs : current.autoClosingPairs),
                surroundingPairs: (prev ? current.surroundingPairs || prev.surroundingPairs : current.surroundingPairs),
                __electricCharacterSupport: (prev ? current.__electricCharacterSupport || prev.__electricCharacterSupport : current.__electricCharacterSupport),
            };
        };
        RichEditSupport._handleOnEnter = function (conf) {
            // on enter
            var onEnter = {};
            var empty = true;
            if (conf.brackets) {
                empty = false;
                onEnter.brackets = conf.brackets;
            }
            if (conf.indentationRules) {
                empty = false;
                onEnter.indentationRules = conf.indentationRules;
            }
            if (conf.onEnterRules) {
                empty = false;
                onEnter.regExpRules = conf.onEnterRules;
            }
            if (!empty) {
                return new onEnter_1.OnEnterSupport(onEnter);
            }
            return null;
        };
        RichEditSupport._handleComments = function (conf) {
            var commentRule = conf.comments;
            if (!commentRule) {
                return null;
            }
            // comment configuration
            var comments = {};
            if (commentRule.lineComment) {
                comments.lineCommentToken = commentRule.lineComment;
            }
            if (commentRule.blockComment) {
                var _a = commentRule.blockComment, blockStart = _a[0], blockEnd = _a[1];
                comments.blockCommentStartToken = blockStart;
                comments.blockCommentEndToken = blockEnd;
            }
            return comments;
        };
        return RichEditSupport;
    }());
    exports.RichEditSupport = RichEditSupport;
    var LanguageConfigurationRegistryImpl = (function () {
        function LanguageConfigurationRegistryImpl() {
            this._onDidChange = new event_1.Emitter();
            this.onDidChange = this._onDidChange.event;
            this._entries = [];
        }
        LanguageConfigurationRegistryImpl.prototype.register = function (languageIdentifier, configuration) {
            var _this = this;
            var previous = this._getRichEditSupport(languageIdentifier.id);
            var current = new RichEditSupport(languageIdentifier, previous, configuration);
            this._entries[languageIdentifier.id] = current;
            this._onDidChange.fire(void 0);
            return {
                dispose: function () {
                    if (_this._entries[languageIdentifier.id] === current) {
                        _this._entries[languageIdentifier.id] = previous;
                        _this._onDidChange.fire(void 0);
                    }
                }
            };
        };
        LanguageConfigurationRegistryImpl.prototype._getRichEditSupport = function (languageId) {
            return this._entries[languageId] || null;
        };
        LanguageConfigurationRegistryImpl.prototype.getIndentationRules = function (languageId) {
            var value = this._entries[languageId];
            if (!value) {
                return null;
            }
            return value.indentationRules || null;
        };
        // begin electricCharacter
        LanguageConfigurationRegistryImpl.prototype._getElectricCharacterSupport = function (languageId) {
            var value = this._getRichEditSupport(languageId);
            if (!value) {
                return null;
            }
            return value.electricCharacter || null;
        };
        LanguageConfigurationRegistryImpl.prototype.getElectricCharacters = function (languageId) {
            var electricCharacterSupport = this._getElectricCharacterSupport(languageId);
            if (!electricCharacterSupport) {
                return [];
            }
            return electricCharacterSupport.getElectricCharacters();
        };
        /**
         * Should return opening bracket type to match indentation with
         */
        LanguageConfigurationRegistryImpl.prototype.onElectricCharacter = function (character, context, column) {
            var scopedLineTokens = supports_1.createScopedLineTokens(context, column - 1);
            var electricCharacterSupport = this._getElectricCharacterSupport(scopedLineTokens.languageId);
            if (!electricCharacterSupport) {
                return null;
            }
            return electricCharacterSupport.onElectricCharacter(character, scopedLineTokens, column - scopedLineTokens.firstCharOffset);
        };
        // end electricCharacter
        LanguageConfigurationRegistryImpl.prototype.getComments = function (languageId) {
            var value = this._getRichEditSupport(languageId);
            if (!value) {
                return null;
            }
            return value.comments || null;
        };
        // begin characterPair
        LanguageConfigurationRegistryImpl.prototype._getCharacterPairSupport = function (languageId) {
            var value = this._getRichEditSupport(languageId);
            if (!value) {
                return null;
            }
            return value.characterPair || null;
        };
        LanguageConfigurationRegistryImpl.prototype.getAutoClosingPairs = function (languageId) {
            var characterPairSupport = this._getCharacterPairSupport(languageId);
            if (!characterPairSupport) {
                return [];
            }
            return characterPairSupport.getAutoClosingPairs();
        };
        LanguageConfigurationRegistryImpl.prototype.getSurroundingPairs = function (languageId) {
            var characterPairSupport = this._getCharacterPairSupport(languageId);
            if (!characterPairSupport) {
                return [];
            }
            return characterPairSupport.getSurroundingPairs();
        };
        LanguageConfigurationRegistryImpl.prototype.shouldAutoClosePair = function (character, context, column) {
            var scopedLineTokens = supports_1.createScopedLineTokens(context, column - 1);
            var characterPairSupport = this._getCharacterPairSupport(scopedLineTokens.languageId);
            if (!characterPairSupport) {
                return false;
            }
            return characterPairSupport.shouldAutoClosePair(character, scopedLineTokens, column - scopedLineTokens.firstCharOffset);
        };
        // end characterPair
        LanguageConfigurationRegistryImpl.prototype.getWordDefinition = function (languageId) {
            var value = this._getRichEditSupport(languageId);
            if (!value) {
                return wordHelper_1.ensureValidWordDefinition(null);
            }
            return wordHelper_1.ensureValidWordDefinition(value.wordDefinition || null);
        };
        // beigin Indent Rules
        LanguageConfigurationRegistryImpl.prototype.getIndentRulesSupport = function (languageId) {
            var value = this._getRichEditSupport(languageId);
            if (!value) {
                return null;
            }
            return value.indentRulesSupport || null;
        };
        /**
         * Get nearest preceiding line which doesn't match unIndentPattern or contains all whitespace.
         * Result:
         * -1: run into the boundary of embedded languages
         * 0: every line above are invalid
         * else: nearest preceding line of the same language
         */
        LanguageConfigurationRegistryImpl.prototype.getPrecedingValidLine = function (model, lineNumber, indentRulesSupport) {
            var languageID = model.getLanguageIdAtPosition(lineNumber, 0);
            if (lineNumber > 1) {
                var lastLineNumber = lineNumber - 1;
                var resultLineNumber = -1;
                for (lastLineNumber = lineNumber - 1; lastLineNumber >= 1; lastLineNumber--) {
                    if (model.getLanguageIdAtPosition(lastLineNumber, 0) !== languageID) {
                        return resultLineNumber;
                    }
                    var text = model.getLineContent(lastLineNumber);
                    if (indentRulesSupport.shouldIgnore(text) || /^\s+$/.test(text) || text === '') {
                        resultLineNumber = lastLineNumber;
                        continue;
                    }
                    return lastLineNumber;
                }
            }
            return -1;
        };
        /**
         * Get inherited indentation from above lines.
         * 1. Find the nearest preceding line which doesn't match unIndentedLinePattern.
         * 2. If this line matches indentNextLinePattern or increaseIndentPattern, it means that the indent level of `lineNumber` should be 1 greater than this line.
         * 3. If this line doesn't match any indent rules
         *   a. check whether the line above it matches indentNextLinePattern
         *   b. If not, the indent level of this line is the result
         *   c. If so, it means the indent of this line is *temporary*, go upward utill we find a line whose indent is not temporary (the same workflow a -> b -> c).
         * 4. Otherwise, we fail to get an inherited indent from aboves. Return null and we should not touch the indent of `lineNumber`
         *
         * This function only return the inherited indent based on above lines, it doesn't check whether current line should decrease or not.
         */
        LanguageConfigurationRegistryImpl.prototype.getInheritIndentForLine = function (model, lineNumber, honorIntentialIndent) {
            if (honorIntentialIndent === void 0) { honorIntentialIndent = true; }
            var indentRulesSupport = this.getIndentRulesSupport(model.getLanguageIdentifier().id);
            if (!indentRulesSupport) {
                return null;
            }
            if (lineNumber <= 1) {
                return {
                    indentation: '',
                    action: null
                };
            }
            var precedingUnIgnoredLine = this.getPrecedingValidLine(model, lineNumber, indentRulesSupport);
            if (precedingUnIgnoredLine < 0) {
                return null;
            }
            else if (precedingUnIgnoredLine < 1) {
                return {
                    indentation: '',
                    action: null
                };
            }
            var precedingUnIgnoredLineContent = model.getLineContent(precedingUnIgnoredLine);
            if (indentRulesSupport.shouldIncrease(precedingUnIgnoredLineContent) || indentRulesSupport.shouldIndentNextLine(precedingUnIgnoredLineContent)) {
                return {
                    indentation: strings.getLeadingWhitespace(precedingUnIgnoredLineContent),
                    action: languageConfiguration_1.IndentAction.Indent,
                    line: precedingUnIgnoredLine
                };
            }
            else if (indentRulesSupport.shouldDecrease(precedingUnIgnoredLineContent)) {
                return {
                    indentation: strings.getLeadingWhitespace(precedingUnIgnoredLineContent),
                    action: null,
                    line: precedingUnIgnoredLine
                };
            }
            else {
                // precedingUnIgnoredLine can not be ignored.
                // it doesn't increase indent of following lines
                // it doesn't increase just next line
                // so current line is not affect by precedingUnIgnoredLine
                // and then we should get a correct inheritted indentation from above lines
                if (precedingUnIgnoredLine === 1) {
                    return {
                        indentation: strings.getLeadingWhitespace(model.getLineContent(precedingUnIgnoredLine)),
                        action: null,
                        line: precedingUnIgnoredLine
                    };
                }
                var previousLine = precedingUnIgnoredLine - 1;
                var previousLineIndentMetadata = indentRulesSupport.getIndentMetadata(model.getLineContent(previousLine));
                if (!(previousLineIndentMetadata & (1 /* INCREASE_MASK */ | 2 /* DECREASE_MASK */)) &&
                    (previousLineIndentMetadata & 4 /* INDENT_NEXTLINE_MASK */)) {
                    var stopLine = 0;
                    for (var i = previousLine - 1; i > 0; i--) {
                        if (indentRulesSupport.shouldIndentNextLine(model.getLineContent(i))) {
                            continue;
                        }
                        stopLine = i;
                        break;
                    }
                    return {
                        indentation: strings.getLeadingWhitespace(model.getLineContent(stopLine + 1)),
                        action: null,
                        line: stopLine + 1
                    };
                }
                if (honorIntentialIndent) {
                    return {
                        indentation: strings.getLeadingWhitespace(model.getLineContent(precedingUnIgnoredLine)),
                        action: null,
                        line: precedingUnIgnoredLine
                    };
                }
                else {
                    // search from precedingUnIgnoredLine until we find one whose indent is not temporary
                    for (var i = precedingUnIgnoredLine; i > 0; i--) {
                        var lineContent = model.getLineContent(i);
                        if (indentRulesSupport.shouldIncrease(lineContent)) {
                            return {
                                indentation: strings.getLeadingWhitespace(lineContent),
                                action: languageConfiguration_1.IndentAction.Indent,
                                line: i
                            };
                        }
                        else if (indentRulesSupport.shouldIndentNextLine(lineContent)) {
                            var stopLine = 0;
                            for (var j = i - 1; j > 0; j--) {
                                if (indentRulesSupport.shouldIndentNextLine(model.getLineContent(i))) {
                                    continue;
                                }
                                stopLine = j;
                                break;
                            }
                            return {
                                indentation: strings.getLeadingWhitespace(model.getLineContent(stopLine + 1)),
                                action: null,
                                line: stopLine + 1
                            };
                        }
                        else if (indentRulesSupport.shouldDecrease(lineContent)) {
                            return {
                                indentation: strings.getLeadingWhitespace(lineContent),
                                action: null,
                                line: i
                            };
                        }
                    }
                    return {
                        indentation: strings.getLeadingWhitespace(model.getLineContent(1)),
                        action: null,
                        line: 1
                    };
                }
            }
        };
        LanguageConfigurationRegistryImpl.prototype.getGoodIndentForLine = function (virtualModel, languageId, lineNumber, indentConverter) {
            var indentRulesSupport = this.getIndentRulesSupport(languageId);
            if (!indentRulesSupport) {
                return null;
            }
            var indent = this.getInheritIndentForLine(virtualModel, lineNumber);
            var lineContent = virtualModel.getLineContent(lineNumber);
            if (indent) {
                var inheritLine = indent.line;
                if (inheritLine !== undefined) {
                    var onEnterSupport = this._getOnEnterSupport(languageId);
                    var enterResult = null;
                    try {
                        enterResult = onEnterSupport.onEnter('', virtualModel.getLineContent(inheritLine), '');
                    }
                    catch (e) {
                        errors_1.onUnexpectedError(e);
                    }
                    if (enterResult) {
                        var indentation = strings.getLeadingWhitespace(virtualModel.getLineContent(inheritLine));
                        if (enterResult.removeText) {
                            indentation = indentation.substring(0, indentation.length - enterResult.removeText);
                        }
                        if ((enterResult.indentAction === languageConfiguration_1.IndentAction.Indent) ||
                            (enterResult.indentAction === languageConfiguration_1.IndentAction.IndentOutdent)) {
                            indentation = indentConverter.shiftIndent(indentation);
                        }
                        else if (enterResult.indentAction === languageConfiguration_1.IndentAction.Outdent) {
                            indentation = indentConverter.unshiftIndent(indentation);
                        }
                        if (indentRulesSupport.shouldDecrease(lineContent)) {
                            indentation = indentConverter.unshiftIndent(indentation);
                        }
                        if (enterResult.appendText) {
                            indentation += enterResult.appendText;
                        }
                        return strings.getLeadingWhitespace(indentation);
                    }
                }
                if (indentRulesSupport.shouldDecrease(lineContent)) {
                    if (indent.action === languageConfiguration_1.IndentAction.Indent) {
                        return indent.indentation;
                    }
                    else {
                        return indentConverter.unshiftIndent(indent.indentation);
                    }
                }
                else {
                    if (indent.action === languageConfiguration_1.IndentAction.Indent) {
                        return indentConverter.shiftIndent(indent.indentation);
                    }
                    else {
                        return indent.indentation;
                    }
                }
            }
            return null;
        };
        LanguageConfigurationRegistryImpl.prototype.getIndentForEnter = function (model, range, indentConverter, autoIndent) {
            model.forceTokenization(range.startLineNumber);
            var lineTokens = model.getLineTokens(range.startLineNumber);
            var beforeEnterText;
            var afterEnterText;
            var scopedLineTokens = supports_1.createScopedLineTokens(lineTokens, range.startColumn - 1);
            var scopedLineText = scopedLineTokens.getLineContent();
            var embeddedLanguage = false;
            if (scopedLineTokens.firstCharOffset > 0 && lineTokens.getLanguageId(0) !== scopedLineTokens.languageId) {
                // we are in the embeded language content
                embeddedLanguage = true; // if embeddedLanguage is true, then we don't touch the indentation of current line
                beforeEnterText = scopedLineText.substr(0, range.startColumn - 1 - scopedLineTokens.firstCharOffset);
            }
            else {
                beforeEnterText = lineTokens.getLineContent().substring(0, range.startColumn - 1);
            }
            if (range.isEmpty()) {
                afterEnterText = scopedLineText.substr(range.startColumn - 1 - scopedLineTokens.firstCharOffset);
            }
            else {
                var endScopedLineTokens = this.getScopedLineTokens(model, range.endLineNumber, range.endColumn);
                afterEnterText = endScopedLineTokens.getLineContent().substr(range.endColumn - 1 - scopedLineTokens.firstCharOffset);
            }
            var indentRulesSupport = this.getIndentRulesSupport(scopedLineTokens.languageId);
            if (!indentRulesSupport) {
                return null;
            }
            var beforeEnterResult = beforeEnterText;
            var beforeEnterIndent = strings.getLeadingWhitespace(beforeEnterText);
            if (!autoIndent && !embeddedLanguage) {
                var beforeEnterIndentAction = this.getInheritIndentForLine(model, range.startLineNumber);
                if (indentRulesSupport.shouldDecrease(beforeEnterText)) {
                    if (beforeEnterIndentAction) {
                        beforeEnterIndent = beforeEnterIndentAction.indentation;
                        if (beforeEnterIndentAction.action !== languageConfiguration_1.IndentAction.Indent) {
                            beforeEnterIndent = indentConverter.unshiftIndent(beforeEnterIndent);
                        }
                    }
                }
                beforeEnterResult = beforeEnterIndent + strings.ltrim(strings.ltrim(beforeEnterText, ' '), '\t');
            }
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
                getLineContent: function (lineNumber) {
                    if (lineNumber === range.startLineNumber) {
                        return beforeEnterResult;
                    }
                    else {
                        return model.getLineContent(lineNumber);
                    }
                }
            };
            var currentLineIndent = strings.getLeadingWhitespace(lineTokens.getLineContent());
            var afterEnterAction = this.getInheritIndentForLine(virtualModel, range.startLineNumber + 1);
            if (!afterEnterAction) {
                var beforeEnter = embeddedLanguage ? currentLineIndent : beforeEnterIndent;
                return {
                    beforeEnter: beforeEnter,
                    afterEnter: beforeEnter
                };
            }
            var afterEnterIndent = embeddedLanguage ? currentLineIndent : afterEnterAction.indentation;
            if (afterEnterAction.action === languageConfiguration_1.IndentAction.Indent) {
                afterEnterIndent = indentConverter.shiftIndent(afterEnterIndent);
            }
            if (indentRulesSupport.shouldDecrease(afterEnterText)) {
                afterEnterIndent = indentConverter.unshiftIndent(afterEnterIndent);
            }
            return {
                beforeEnter: embeddedLanguage ? currentLineIndent : beforeEnterIndent,
                afterEnter: afterEnterIndent
            };
        };
        /**
         * We should always allow intentional indentation. It means, if users change the indentation of `lineNumber` and the content of
         * this line doesn't match decreaseIndentPattern, we should not adjust the indentation.
         */
        LanguageConfigurationRegistryImpl.prototype.getIndentActionForType = function (model, range, ch, indentConverter) {
            var scopedLineTokens = this.getScopedLineTokens(model, range.startLineNumber, range.startColumn);
            var indentRulesSupport = this.getIndentRulesSupport(scopedLineTokens.languageId);
            if (!indentRulesSupport) {
                return null;
            }
            var scopedLineText = scopedLineTokens.getLineContent();
            var beforeTypeText = scopedLineText.substr(0, range.startColumn - 1 - scopedLineTokens.firstCharOffset);
            var afterTypeText;
            // selection support
            if (range.isEmpty()) {
                afterTypeText = scopedLineText.substr(range.startColumn - 1 - scopedLineTokens.firstCharOffset);
            }
            else {
                var endScopedLineTokens = this.getScopedLineTokens(model, range.endLineNumber, range.endColumn);
                afterTypeText = endScopedLineTokens.getLineContent().substr(range.endColumn - 1 - scopedLineTokens.firstCharOffset);
            }
            // If previous content already matches decreaseIndentPattern, it means indentation of this line should already be adjusted
            // Users might change the indentation by purpose and we should honor that instead of readjusting.
            if (!indentRulesSupport.shouldDecrease(beforeTypeText + afterTypeText) && indentRulesSupport.shouldDecrease(beforeTypeText + ch + afterTypeText)) {
                // after typing `ch`, the content matches decreaseIndentPattern, we should adjust the indent to a good manner.
                // 1. Get inherited indent action
                var r = this.getInheritIndentForLine(model, range.startLineNumber, false);
                if (!r) {
                    return null;
                }
                var indentation = r.indentation;
                if (r.action !== languageConfiguration_1.IndentAction.Indent) {
                    indentation = indentConverter.unshiftIndent(indentation);
                }
                return indentation;
            }
            return null;
        };
        LanguageConfigurationRegistryImpl.prototype.getIndentMetadata = function (model, lineNumber) {
            var indentRulesSupport = this.getIndentRulesSupport(model.getLanguageIdentifier().id);
            if (!indentRulesSupport) {
                return null;
            }
            if (lineNumber < 1 || lineNumber > model.getLineCount()) {
                return null;
            }
            return indentRulesSupport.getIndentMetadata(model.getLineContent(lineNumber));
        };
        // end Indent Rules
        // begin onEnter
        LanguageConfigurationRegistryImpl.prototype._getOnEnterSupport = function (languageId) {
            var value = this._getRichEditSupport(languageId);
            if (!value) {
                return null;
            }
            return value.onEnter || null;
        };
        LanguageConfigurationRegistryImpl.prototype.getRawEnterActionAtPosition = function (model, lineNumber, column) {
            var r = this.getEnterAction(model, new range_1.Range(lineNumber, column, lineNumber, column));
            return r ? r.enterAction : null;
        };
        LanguageConfigurationRegistryImpl.prototype.getEnterAction = function (model, range) {
            var indentation = this.getIndentationAtPosition(model, range.startLineNumber, range.startColumn);
            var scopedLineTokens = this.getScopedLineTokens(model, range.startLineNumber, range.startColumn);
            var onEnterSupport = this._getOnEnterSupport(scopedLineTokens.languageId);
            if (!onEnterSupport) {
                return null;
            }
            var scopedLineText = scopedLineTokens.getLineContent();
            var beforeEnterText = scopedLineText.substr(0, range.startColumn - 1 - scopedLineTokens.firstCharOffset);
            var afterEnterText;
            // selection support
            if (range.isEmpty()) {
                afterEnterText = scopedLineText.substr(range.startColumn - 1 - scopedLineTokens.firstCharOffset);
            }
            else {
                var endScopedLineTokens = this.getScopedLineTokens(model, range.endLineNumber, range.endColumn);
                afterEnterText = endScopedLineTokens.getLineContent().substr(range.endColumn - 1 - scopedLineTokens.firstCharOffset);
            }
            var lineNumber = range.startLineNumber;
            var oneLineAboveText = '';
            if (lineNumber > 1 && scopedLineTokens.firstCharOffset === 0) {
                // This is not the first line and the entire line belongs to this mode
                var oneLineAboveScopedLineTokens = this.getScopedLineTokens(model, lineNumber - 1);
                if (oneLineAboveScopedLineTokens.languageId === scopedLineTokens.languageId) {
                    // The line above ends with text belonging to the same mode
                    oneLineAboveText = oneLineAboveScopedLineTokens.getLineContent();
                }
            }
            var enterResult = null;
            try {
                enterResult = onEnterSupport.onEnter(oneLineAboveText, beforeEnterText, afterEnterText);
            }
            catch (e) {
                errors_1.onUnexpectedError(e);
            }
            if (!enterResult) {
                return null;
            }
            else {
                // Here we add `\t` to appendText first because enterAction is leveraging appendText and removeText to change indentation.
                if (!enterResult.appendText) {
                    if ((enterResult.indentAction === languageConfiguration_1.IndentAction.Indent) ||
                        (enterResult.indentAction === languageConfiguration_1.IndentAction.IndentOutdent)) {
                        enterResult.appendText = '\t';
                    }
                    else {
                        enterResult.appendText = '';
                    }
                }
            }
            if (enterResult.removeText) {
                indentation = indentation.substring(0, indentation.length - enterResult.removeText);
            }
            return {
                enterAction: enterResult,
                indentation: indentation,
            };
        };
        LanguageConfigurationRegistryImpl.prototype.getIndentationAtPosition = function (model, lineNumber, column) {
            var lineText = model.getLineContent(lineNumber);
            var indentation = strings.getLeadingWhitespace(lineText);
            if (indentation.length > column - 1) {
                indentation = indentation.substring(0, column - 1);
            }
            return indentation;
        };
        LanguageConfigurationRegistryImpl.prototype.getScopedLineTokens = function (model, lineNumber, columnNumber) {
            model.forceTokenization(lineNumber);
            var lineTokens = model.getLineTokens(lineNumber);
            var column = isNaN(columnNumber) ? model.getLineMaxColumn(lineNumber) - 1 : columnNumber - 1;
            var scopedLineTokens = supports_1.createScopedLineTokens(lineTokens, column);
            return scopedLineTokens;
        };
        // end onEnter
        LanguageConfigurationRegistryImpl.prototype.getBracketsSupport = function (languageId) {
            var value = this._getRichEditSupport(languageId);
            if (!value) {
                return null;
            }
            return value.brackets || null;
        };
        return LanguageConfigurationRegistryImpl;
    }());
    exports.LanguageConfigurationRegistryImpl = LanguageConfigurationRegistryImpl;
    exports.LanguageConfigurationRegistry = new LanguageConfigurationRegistryImpl();
});
//# sourceMappingURL=languageConfigurationRegistry.js.map