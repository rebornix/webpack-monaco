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
define(["require", "exports", "vs/nls", "vs/base/common/errors", "vs/base/common/stopwatch", "vs/editor/common/model/textModel", "vs/editor/common/modes", "vs/editor/common/modes/nullMode", "vs/editor/common/modes/supports", "vs/editor/common/modes/supports/richEditBrackets", "vs/editor/common/modes/languageConfigurationRegistry", "vs/editor/common/model/wordHelper", "vs/editor/common/model/textModelEvents"], function (require, exports, nls, errors_1, stopwatch_1, textModel_1, modes_1, nullMode_1, supports_1, richEditBrackets_1, languageConfigurationRegistry_1, wordHelper_1, textModelEvents) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var ModelTokensChangedEventBuilder = (function () {
        function ModelTokensChangedEventBuilder() {
            this._ranges = [];
        }
        ModelTokensChangedEventBuilder.prototype.registerChangedTokens = function (lineNumber) {
            var ranges = this._ranges;
            var rangesLength = ranges.length;
            var previousRange = rangesLength > 0 ? ranges[rangesLength - 1] : null;
            if (previousRange && previousRange.toLineNumber === lineNumber - 1) {
                // extend previous range
                previousRange.toLineNumber++;
            }
            else {
                // insert new range
                ranges[rangesLength] = {
                    fromLineNumber: lineNumber,
                    toLineNumber: lineNumber
                };
            }
        };
        ModelTokensChangedEventBuilder.prototype.build = function () {
            if (this._ranges.length === 0) {
                return null;
            }
            return {
                ranges: this._ranges
            };
        };
        return ModelTokensChangedEventBuilder;
    }());
    var TextModelWithTokens = (function (_super) {
        __extends(TextModelWithTokens, _super);
        function TextModelWithTokens(rawTextSource, creationOptions, languageIdentifier) {
            var _this = _super.call(this, rawTextSource, creationOptions) || this;
            _this._languageIdentifier = languageIdentifier || nullMode_1.NULL_LANGUAGE_IDENTIFIER;
            _this._tokenizationListener = modes_1.TokenizationRegistry.onDidChange(function (e) {
                if (e.changedLanguages.indexOf(_this._languageIdentifier.language) === -1) {
                    return;
                }
                _this._resetTokenizationState();
                _this.emitModelTokensChangedEvent({
                    ranges: [{
                            fromLineNumber: 1,
                            toLineNumber: _this.getLineCount()
                        }]
                });
                if (_this._shouldAutoTokenize()) {
                    _this._warmUpTokens();
                }
            });
            _this._revalidateTokensTimeout = -1;
            _this._resetTokenizationState();
            return _this;
        }
        TextModelWithTokens.prototype.dispose = function () {
            this._tokenizationListener.dispose();
            this._clearTimers();
            this._lastState = null;
            _super.prototype.dispose.call(this);
        };
        TextModelWithTokens.prototype._shouldAutoTokenize = function () {
            return false;
        };
        TextModelWithTokens.prototype._resetValue = function (newValue) {
            _super.prototype._resetValue.call(this, newValue);
            // Cancel tokenization, clear all tokens and begin tokenizing
            this._resetTokenizationState();
        };
        TextModelWithTokens.prototype._resetTokenizationState = function () {
            this._clearTimers();
            for (var i = 0; i < this._lines.length; i++) {
                this._lines[i].resetTokenizationState();
            }
            this._tokenizationSupport = null;
            if (!this._isTooLargeForTokenization) {
                this._tokenizationSupport = modes_1.TokenizationRegistry.get(this._languageIdentifier.language);
            }
            if (this._tokenizationSupport) {
                var initialState = null;
                try {
                    initialState = this._tokenizationSupport.getInitialState();
                }
                catch (e) {
                    e.friendlyMessage = TextModelWithTokens.MODE_TOKENIZATION_FAILED_MSG;
                    errors_1.onUnexpectedError(e);
                    this._tokenizationSupport = null;
                }
                if (initialState) {
                    this._lines[0].setState(initialState);
                }
            }
            this._lastState = null;
            this._invalidLineStartIndex = 0;
            this._beginBackgroundTokenization();
        };
        TextModelWithTokens.prototype._clearTimers = function () {
            if (this._revalidateTokensTimeout !== -1) {
                clearTimeout(this._revalidateTokensTimeout);
                this._revalidateTokensTimeout = -1;
            }
        };
        TextModelWithTokens.prototype._withModelTokensChangedEventBuilder = function (callback) {
            var eventBuilder = new ModelTokensChangedEventBuilder();
            var result = callback(eventBuilder);
            if (!this._isDisposing) {
                var e = eventBuilder.build();
                if (e) {
                    this._eventEmitter.emit(textModelEvents.TextModelEventType.ModelTokensChanged, e);
                }
            }
            return result;
        };
        TextModelWithTokens.prototype.forceTokenization = function (lineNumber) {
            var _this = this;
            if (lineNumber < 1 || lineNumber > this.getLineCount()) {
                throw new Error('Illegal value ' + lineNumber + ' for `lineNumber`');
            }
            this._withModelTokensChangedEventBuilder(function (eventBuilder) {
                _this._updateTokensUntilLine(eventBuilder, lineNumber);
            });
        };
        TextModelWithTokens.prototype.isCheapToTokenize = function (lineNumber) {
            var firstInvalidLineNumber = this._invalidLineStartIndex + 1;
            return (firstInvalidLineNumber >= lineNumber);
        };
        TextModelWithTokens.prototype.tokenizeIfCheap = function (lineNumber) {
            if (this.isCheapToTokenize(lineNumber)) {
                this.forceTokenization(lineNumber);
            }
        };
        TextModelWithTokens.prototype.getLineTokens = function (lineNumber) {
            if (lineNumber < 1 || lineNumber > this.getLineCount()) {
                throw new Error('Illegal value ' + lineNumber + ' for `lineNumber`');
            }
            return this._getLineTokens(lineNumber);
        };
        TextModelWithTokens.prototype._getLineTokens = function (lineNumber) {
            return this._lines[lineNumber - 1].getTokens(this._languageIdentifier.id);
        };
        TextModelWithTokens.prototype.getLanguageIdentifier = function () {
            return this._languageIdentifier;
        };
        TextModelWithTokens.prototype.getModeId = function () {
            return this._languageIdentifier.language;
        };
        TextModelWithTokens.prototype.setMode = function (languageIdentifier) {
            if (this._languageIdentifier.id === languageIdentifier.id) {
                // There's nothing to do
                return;
            }
            var e = {
                oldLanguage: this._languageIdentifier.language,
                newLanguage: languageIdentifier.language
            };
            this._languageIdentifier = languageIdentifier;
            // Cancel tokenization, clear all tokens and begin tokenizing
            this._resetTokenizationState();
            this.emitModelTokensChangedEvent({
                ranges: [{
                        fromLineNumber: 1,
                        toLineNumber: this.getLineCount()
                    }]
            });
            this._emitModelModeChangedEvent(e);
        };
        TextModelWithTokens.prototype.getLanguageIdAtPosition = function (_lineNumber, _column) {
            if (!this._tokenizationSupport) {
                return this._languageIdentifier.id;
            }
            var _a = this.validatePosition({ lineNumber: _lineNumber, column: _column }), lineNumber = _a.lineNumber, column = _a.column;
            var lineTokens = this._getLineTokens(lineNumber);
            var token = lineTokens.findTokenAtOffset(column - 1);
            return token.languageId;
        };
        TextModelWithTokens.prototype._invalidateLine = function (lineIndex) {
            this._lines[lineIndex].setIsInvalid(true);
            if (lineIndex < this._invalidLineStartIndex) {
                if (this._invalidLineStartIndex < this._lines.length) {
                    this._lines[this._invalidLineStartIndex].setIsInvalid(true);
                }
                this._invalidLineStartIndex = lineIndex;
                this._beginBackgroundTokenization();
            }
        };
        TextModelWithTokens.prototype._beginBackgroundTokenization = function () {
            var _this = this;
            if (this._shouldAutoTokenize() && this._revalidateTokensTimeout === -1) {
                this._revalidateTokensTimeout = setTimeout(function () {
                    _this._revalidateTokensTimeout = -1;
                    _this._revalidateTokensNow();
                }, 0);
            }
        };
        TextModelWithTokens.prototype._warmUpTokens = function () {
            // Warm up first 100 lines (if it takes less than 50ms)
            var maxLineNumber = Math.min(100, this.getLineCount());
            this._revalidateTokensNow(maxLineNumber);
            if (this._invalidLineStartIndex < this._lines.length) {
                this._beginBackgroundTokenization();
            }
        };
        TextModelWithTokens.prototype._revalidateTokensNow = function (toLineNumber) {
            var _this = this;
            if (toLineNumber === void 0) { toLineNumber = this._invalidLineStartIndex + 1000000; }
            this._withModelTokensChangedEventBuilder(function (eventBuilder) {
                toLineNumber = Math.min(_this._lines.length, toLineNumber);
                var MAX_ALLOWED_TIME = 20, fromLineNumber = _this._invalidLineStartIndex + 1, tokenizedChars = 0, currentCharsToTokenize = 0, currentEstimatedTimeToTokenize = 0, sw = stopwatch_1.StopWatch.create(false), elapsedTime;
                // Tokenize at most 1000 lines. Estimate the tokenization speed per character and stop when:
                // - MAX_ALLOWED_TIME is reached
                // - tokenizing the next line would go above MAX_ALLOWED_TIME
                for (var lineNumber = fromLineNumber; lineNumber <= toLineNumber; lineNumber++) {
                    elapsedTime = sw.elapsed();
                    if (elapsedTime > MAX_ALLOWED_TIME) {
                        // Stop if MAX_ALLOWED_TIME is reached
                        toLineNumber = lineNumber - 1;
                        break;
                    }
                    // Compute how many characters will be tokenized for this line
                    currentCharsToTokenize = _this._lines[lineNumber - 1].text.length;
                    if (tokenizedChars > 0) {
                        // If we have enough history, estimate how long tokenizing this line would take
                        currentEstimatedTimeToTokenize = (elapsedTime / tokenizedChars) * currentCharsToTokenize;
                        if (elapsedTime + currentEstimatedTimeToTokenize > MAX_ALLOWED_TIME) {
                            // Tokenizing this line will go above MAX_ALLOWED_TIME
                            toLineNumber = lineNumber - 1;
                            break;
                        }
                    }
                    _this._updateTokensUntilLine(eventBuilder, lineNumber);
                    tokenizedChars += currentCharsToTokenize;
                    // Skip the lines that got tokenized
                    lineNumber = Math.max(lineNumber, _this._invalidLineStartIndex + 1);
                }
                elapsedTime = sw.elapsed();
                if (_this._invalidLineStartIndex < _this._lines.length) {
                    _this._beginBackgroundTokenization();
                }
            });
        };
        TextModelWithTokens.prototype._updateTokensUntilLine = function (eventBuilder, lineNumber) {
            if (!this._tokenizationSupport) {
                this._invalidLineStartIndex = this._lines.length;
                return;
            }
            var linesLength = this._lines.length;
            var endLineIndex = lineNumber - 1;
            // Validate all states up to and including endLineIndex
            for (var lineIndex = this._invalidLineStartIndex; lineIndex <= endLineIndex; lineIndex++) {
                var endStateIndex = lineIndex + 1;
                var r = null;
                var text = this._lines[lineIndex].text;
                try {
                    // Tokenize only the first X characters
                    var freshState = this._lines[lineIndex].getState().clone();
                    r = this._tokenizationSupport.tokenize2(this._lines[lineIndex].text, freshState, 0);
                }
                catch (e) {
                    e.friendlyMessage = TextModelWithTokens.MODE_TOKENIZATION_FAILED_MSG;
                    errors_1.onUnexpectedError(e);
                }
                if (!r) {
                    r = nullMode_1.nullTokenize2(this._languageIdentifier.id, text, this._lines[lineIndex].getState(), 0);
                }
                this._lines[lineIndex].setTokens(this._languageIdentifier.id, r.tokens);
                eventBuilder.registerChangedTokens(lineIndex + 1);
                this._lines[lineIndex].setIsInvalid(false);
                if (endStateIndex < linesLength) {
                    if (this._lines[endStateIndex].getState() !== null && r.endState.equals(this._lines[endStateIndex].getState())) {
                        // The end state of this line remains the same
                        var nextInvalidLineIndex = lineIndex + 1;
                        while (nextInvalidLineIndex < linesLength) {
                            if (this._lines[nextInvalidLineIndex].isInvalid()) {
                                break;
                            }
                            if (nextInvalidLineIndex + 1 < linesLength) {
                                if (this._lines[nextInvalidLineIndex + 1].getState() === null) {
                                    break;
                                }
                            }
                            else {
                                if (this._lastState === null) {
                                    break;
                                }
                            }
                            nextInvalidLineIndex++;
                        }
                        this._invalidLineStartIndex = Math.max(this._invalidLineStartIndex, nextInvalidLineIndex);
                        lineIndex = nextInvalidLineIndex - 1; // -1 because the outer loop increments it
                    }
                    else {
                        this._lines[endStateIndex].setState(r.endState);
                    }
                }
                else {
                    this._lastState = r.endState;
                }
            }
            this._invalidLineStartIndex = Math.max(this._invalidLineStartIndex, endLineIndex + 1);
        };
        TextModelWithTokens.prototype.emitModelTokensChangedEvent = function (e) {
            if (!this._isDisposing) {
                this._eventEmitter.emit(textModelEvents.TextModelEventType.ModelTokensChanged, e);
            }
        };
        TextModelWithTokens.prototype._emitModelModeChangedEvent = function (e) {
            if (!this._isDisposing) {
                this._eventEmitter.emit(textModelEvents.TextModelEventType.ModelLanguageChanged, e);
            }
        };
        // Having tokens allows implementing additional helper methods
        TextModelWithTokens.prototype.getWordAtPosition = function (_position) {
            this._assertNotDisposed();
            var position = this.validatePosition(_position);
            var lineContent = this.getLineContent(position.lineNumber);
            if (this._invalidLineStartIndex <= position.lineNumber) {
                // this line is not tokenized
                return wordHelper_1.getWordAtText(position.column, languageConfigurationRegistry_1.LanguageConfigurationRegistry.getWordDefinition(this._languageIdentifier.id), lineContent, 0);
            }
            var lineTokens = this._getLineTokens(position.lineNumber);
            var offset = position.column - 1;
            var token = lineTokens.findTokenAtOffset(offset);
            var result = wordHelper_1.getWordAtText(position.column, languageConfigurationRegistry_1.LanguageConfigurationRegistry.getWordDefinition(token.languageId), lineContent.substring(token.startOffset, token.endOffset), token.startOffset);
            if (!result && token.hasPrev && token.startOffset === offset) {
                // The position is right at the beginning of `modeIndex`, so try looking at `modeIndex` - 1 too
                var prevToken = token.prev();
                result = wordHelper_1.getWordAtText(position.column, languageConfigurationRegistry_1.LanguageConfigurationRegistry.getWordDefinition(prevToken.languageId), lineContent.substring(prevToken.startOffset, prevToken.endOffset), prevToken.startOffset);
            }
            return result;
        };
        TextModelWithTokens.prototype.getWordUntilPosition = function (position) {
            var wordAtPosition = this.getWordAtPosition(position);
            if (!wordAtPosition) {
                return {
                    word: '',
                    startColumn: position.column,
                    endColumn: position.column
                };
            }
            return {
                word: wordAtPosition.word.substr(0, position.column - wordAtPosition.startColumn),
                startColumn: wordAtPosition.startColumn,
                endColumn: position.column
            };
        };
        TextModelWithTokens.prototype.findMatchingBracketUp = function (_bracket, _position) {
            var bracket = _bracket.toLowerCase();
            var position = this.validatePosition(_position);
            var lineTokens = this._getLineTokens(position.lineNumber);
            var token = lineTokens.findTokenAtOffset(position.column - 1);
            var bracketsSupport = languageConfigurationRegistry_1.LanguageConfigurationRegistry.getBracketsSupport(token.languageId);
            if (!bracketsSupport) {
                return null;
            }
            var data = bracketsSupport.textIsBracket[bracket];
            if (!data) {
                return null;
            }
            return this._findMatchingBracketUp(data, position);
        };
        TextModelWithTokens.prototype.matchBracket = function (position) {
            return this._matchBracket(this.validatePosition(position));
        };
        TextModelWithTokens.prototype._matchBracket = function (position) {
            var lineNumber = position.lineNumber;
            var lineTokens = this._getLineTokens(lineNumber);
            var lineText = this._lines[lineNumber - 1].text;
            var currentToken = lineTokens.findTokenAtOffset(position.column - 1);
            if (!currentToken) {
                return null;
            }
            var currentModeBrackets = languageConfigurationRegistry_1.LanguageConfigurationRegistry.getBracketsSupport(currentToken.languageId);
            // check that the token is not to be ignored
            if (currentModeBrackets && !supports_1.ignoreBracketsInToken(currentToken.tokenType)) {
                // limit search to not go before `maxBracketLength`
                var searchStartOffset = Math.max(currentToken.startOffset, position.column - 1 - currentModeBrackets.maxBracketLength);
                // limit search to not go after `maxBracketLength`
                var searchEndOffset = Math.min(currentToken.endOffset, position.column - 1 + currentModeBrackets.maxBracketLength);
                // first, check if there is a bracket to the right of `position`
                var foundBracket = richEditBrackets_1.BracketsUtils.findNextBracketInToken(currentModeBrackets.forwardRegex, lineNumber, lineText, position.column - 1, searchEndOffset);
                if (foundBracket && foundBracket.startColumn === position.column) {
                    var foundBracketText = lineText.substring(foundBracket.startColumn - 1, foundBracket.endColumn - 1);
                    foundBracketText = foundBracketText.toLowerCase();
                    var r = this._matchFoundBracket(foundBracket, currentModeBrackets.textIsBracket[foundBracketText], currentModeBrackets.textIsOpenBracket[foundBracketText]);
                    // check that we can actually match this bracket
                    if (r) {
                        return r;
                    }
                }
                // it might still be the case that [currentTokenStart -> currentTokenEnd] contains multiple brackets
                while (true) {
                    var foundBracket_1 = richEditBrackets_1.BracketsUtils.findNextBracketInToken(currentModeBrackets.forwardRegex, lineNumber, lineText, searchStartOffset, searchEndOffset);
                    if (!foundBracket_1) {
                        // there are no brackets in this text
                        break;
                    }
                    // check that we didn't hit a bracket too far away from position
                    if (foundBracket_1.startColumn <= position.column && position.column <= foundBracket_1.endColumn) {
                        var foundBracketText = lineText.substring(foundBracket_1.startColumn - 1, foundBracket_1.endColumn - 1);
                        foundBracketText = foundBracketText.toLowerCase();
                        var r = this._matchFoundBracket(foundBracket_1, currentModeBrackets.textIsBracket[foundBracketText], currentModeBrackets.textIsOpenBracket[foundBracketText]);
                        // check that we can actually match this bracket
                        if (r) {
                            return r;
                        }
                    }
                    searchStartOffset = foundBracket_1.endColumn - 1;
                }
            }
            // If position is in between two tokens, try also looking in the previous token
            if (currentToken.hasPrev && currentToken.startOffset === position.column - 1) {
                var prevToken = currentToken.prev();
                var prevModeBrackets = languageConfigurationRegistry_1.LanguageConfigurationRegistry.getBracketsSupport(prevToken.languageId);
                // check that previous token is not to be ignored
                if (prevModeBrackets && !supports_1.ignoreBracketsInToken(prevToken.tokenType)) {
                    // limit search in case previous token is very large, there's no need to go beyond `maxBracketLength`
                    var searchStartOffset = Math.max(prevToken.startOffset, position.column - 1 - prevModeBrackets.maxBracketLength);
                    var searchEndOffset = currentToken.startOffset;
                    var foundBracket = richEditBrackets_1.BracketsUtils.findPrevBracketInToken(prevModeBrackets.reversedRegex, lineNumber, lineText, searchStartOffset, searchEndOffset);
                    // check that we didn't hit a bracket too far away from position
                    if (foundBracket && foundBracket.startColumn <= position.column && position.column <= foundBracket.endColumn) {
                        var foundBracketText = lineText.substring(foundBracket.startColumn - 1, foundBracket.endColumn - 1);
                        foundBracketText = foundBracketText.toLowerCase();
                        var r = this._matchFoundBracket(foundBracket, prevModeBrackets.textIsBracket[foundBracketText], prevModeBrackets.textIsOpenBracket[foundBracketText]);
                        // check that we can actually match this bracket
                        if (r) {
                            return r;
                        }
                    }
                }
            }
            return null;
        };
        TextModelWithTokens.prototype._matchFoundBracket = function (foundBracket, data, isOpen) {
            if (isOpen) {
                var matched = this._findMatchingBracketDown(data, foundBracket.getEndPosition());
                if (matched) {
                    return [foundBracket, matched];
                }
            }
            else {
                var matched = this._findMatchingBracketUp(data, foundBracket.getStartPosition());
                if (matched) {
                    return [foundBracket, matched];
                }
            }
            return null;
        };
        TextModelWithTokens.prototype._findMatchingBracketUp = function (bracket, position) {
            // console.log('_findMatchingBracketUp: ', 'bracket: ', JSON.stringify(bracket), 'startPosition: ', String(position));
            var languageId = bracket.languageIdentifier.id;
            var reversedBracketRegex = bracket.reversedRegex;
            var count = -1;
            for (var lineNumber = position.lineNumber; lineNumber >= 1; lineNumber--) {
                var lineTokens = this._getLineTokens(lineNumber);
                var lineText = this._lines[lineNumber - 1].text;
                var currentToken = void 0;
                var searchStopOffset = void 0;
                if (lineNumber === position.lineNumber) {
                    currentToken = lineTokens.findTokenAtOffset(position.column - 1);
                    searchStopOffset = position.column - 1;
                }
                else {
                    currentToken = lineTokens.lastToken();
                    if (currentToken) {
                        searchStopOffset = currentToken.endOffset;
                    }
                }
                while (currentToken) {
                    if (currentToken.languageId === languageId && !supports_1.ignoreBracketsInToken(currentToken.tokenType)) {
                        while (true) {
                            var r = richEditBrackets_1.BracketsUtils.findPrevBracketInToken(reversedBracketRegex, lineNumber, lineText, currentToken.startOffset, searchStopOffset);
                            if (!r) {
                                break;
                            }
                            var hitText = lineText.substring(r.startColumn - 1, r.endColumn - 1);
                            hitText = hitText.toLowerCase();
                            if (hitText === bracket.open) {
                                count++;
                            }
                            else if (hitText === bracket.close) {
                                count--;
                            }
                            if (count === 0) {
                                return r;
                            }
                            searchStopOffset = r.startColumn - 1;
                        }
                    }
                    currentToken = currentToken.prev();
                    if (currentToken) {
                        searchStopOffset = currentToken.endOffset;
                    }
                }
            }
            return null;
        };
        TextModelWithTokens.prototype._findMatchingBracketDown = function (bracket, position) {
            // console.log('_findMatchingBracketDown: ', 'bracket: ', JSON.stringify(bracket), 'startPosition: ', String(position));
            var languageId = bracket.languageIdentifier.id;
            var bracketRegex = bracket.forwardRegex;
            var count = 1;
            for (var lineNumber = position.lineNumber, lineCount = this.getLineCount(); lineNumber <= lineCount; lineNumber++) {
                var lineTokens = this._getLineTokens(lineNumber);
                var lineText = this._lines[lineNumber - 1].text;
                var currentToken = void 0;
                var searchStartOffset = void 0;
                if (lineNumber === position.lineNumber) {
                    currentToken = lineTokens.findTokenAtOffset(position.column - 1);
                    searchStartOffset = position.column - 1;
                }
                else {
                    currentToken = lineTokens.firstToken();
                    if (currentToken) {
                        searchStartOffset = currentToken.startOffset;
                    }
                }
                while (currentToken) {
                    if (currentToken.languageId === languageId && !supports_1.ignoreBracketsInToken(currentToken.tokenType)) {
                        while (true) {
                            var r = richEditBrackets_1.BracketsUtils.findNextBracketInToken(bracketRegex, lineNumber, lineText, searchStartOffset, currentToken.endOffset);
                            if (!r) {
                                break;
                            }
                            var hitText = lineText.substring(r.startColumn - 1, r.endColumn - 1);
                            hitText = hitText.toLowerCase();
                            if (hitText === bracket.open) {
                                count++;
                            }
                            else if (hitText === bracket.close) {
                                count--;
                            }
                            if (count === 0) {
                                return r;
                            }
                            searchStartOffset = r.endColumn - 1;
                        }
                    }
                    currentToken = currentToken.next();
                    if (currentToken) {
                        searchStartOffset = currentToken.startOffset;
                    }
                }
            }
            return null;
        };
        TextModelWithTokens.prototype.findPrevBracket = function (_position) {
            var position = this.validatePosition(_position);
            var languageId = -1;
            var modeBrackets = null;
            for (var lineNumber = position.lineNumber; lineNumber >= 1; lineNumber--) {
                var lineTokens = this._getLineTokens(lineNumber);
                var lineText = this._lines[lineNumber - 1].text;
                var currentToken = void 0;
                var searchStopOffset = void 0;
                if (lineNumber === position.lineNumber) {
                    currentToken = lineTokens.findTokenAtOffset(position.column - 1);
                    searchStopOffset = position.column - 1;
                }
                else {
                    currentToken = lineTokens.lastToken();
                    if (currentToken) {
                        searchStopOffset = currentToken.endOffset;
                    }
                }
                while (currentToken) {
                    if (languageId !== currentToken.languageId) {
                        languageId = currentToken.languageId;
                        modeBrackets = languageConfigurationRegistry_1.LanguageConfigurationRegistry.getBracketsSupport(languageId);
                    }
                    if (modeBrackets && !supports_1.ignoreBracketsInToken(currentToken.tokenType)) {
                        var r = richEditBrackets_1.BracketsUtils.findPrevBracketInToken(modeBrackets.reversedRegex, lineNumber, lineText, currentToken.startOffset, searchStopOffset);
                        if (r) {
                            return this._toFoundBracket(modeBrackets, r);
                        }
                    }
                    currentToken = currentToken.prev();
                    if (currentToken) {
                        searchStopOffset = currentToken.endOffset;
                    }
                }
            }
            return null;
        };
        TextModelWithTokens.prototype.findNextBracket = function (_position) {
            var position = this.validatePosition(_position);
            var languageId = -1;
            var modeBrackets = null;
            for (var lineNumber = position.lineNumber, lineCount = this.getLineCount(); lineNumber <= lineCount; lineNumber++) {
                var lineTokens = this._getLineTokens(lineNumber);
                var lineText = this._lines[lineNumber - 1].text;
                var currentToken = void 0;
                var searchStartOffset = void 0;
                if (lineNumber === position.lineNumber) {
                    currentToken = lineTokens.findTokenAtOffset(position.column - 1);
                    searchStartOffset = position.column - 1;
                }
                else {
                    currentToken = lineTokens.firstToken();
                    if (currentToken) {
                        searchStartOffset = currentToken.startOffset;
                    }
                }
                while (currentToken) {
                    if (languageId !== currentToken.languageId) {
                        languageId = currentToken.languageId;
                        modeBrackets = languageConfigurationRegistry_1.LanguageConfigurationRegistry.getBracketsSupport(languageId);
                    }
                    if (modeBrackets && !supports_1.ignoreBracketsInToken(currentToken.tokenType)) {
                        var r = richEditBrackets_1.BracketsUtils.findNextBracketInToken(modeBrackets.forwardRegex, lineNumber, lineText, searchStartOffset, currentToken.endOffset);
                        if (r) {
                            return this._toFoundBracket(modeBrackets, r);
                        }
                    }
                    currentToken = currentToken.next();
                    if (currentToken) {
                        searchStartOffset = currentToken.startOffset;
                    }
                }
            }
            return null;
        };
        TextModelWithTokens.prototype._toFoundBracket = function (modeBrackets, r) {
            if (!r) {
                return null;
            }
            var text = this.getValueInRange(r);
            text = text.toLowerCase();
            var data = modeBrackets.textIsBracket[text];
            if (!data) {
                return null;
            }
            return {
                range: r,
                open: data.open,
                close: data.close,
                isOpen: modeBrackets.textIsOpenBracket[text]
            };
        };
        TextModelWithTokens.MODE_TOKENIZATION_FAILED_MSG = nls.localize('mode.tokenizationSupportFailed', "The mode has failed while tokenizing the input.");
        return TextModelWithTokens;
    }(textModel_1.TextModel));
    exports.TextModelWithTokens = TextModelWithTokens;
});
//# sourceMappingURL=textModelWithTokens.js.map