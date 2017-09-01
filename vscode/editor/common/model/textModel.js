define(["require", "exports", "vs/base/common/eventEmitter", "vs/base/common/strings", "vs/editor/common/core/position", "vs/editor/common/core/range", "vs/editor/common/editorCommon", "vs/editor/common/model/modelLine", "vs/editor/common/model/indentationGuesser", "vs/editor/common/config/editorOptions", "vs/editor/common/viewModel/prefixSumComputer", "vs/editor/common/model/indentRanges", "vs/editor/common/model/textModelSearch", "vs/editor/common/model/textSource", "vs/editor/common/model/textModelEvents"], function (require, exports, eventEmitter_1, strings, position_1, range_1, editorCommon, modelLine_1, indentationGuesser_1, editorOptions_1, prefixSumComputer_1, indentRanges_1, textModelSearch_1, textSource_1, textModelEvents) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var USE_MIMINAL_MODEL_LINE = true;
    var LIMIT_FIND_COUNT = 999;
    exports.LONG_LINE_BOUNDARY = 10000;
    var TextModel = (function () {
        function TextModel(rawTextSource, creationOptions) {
            this._eventEmitter = new eventEmitter_1.OrderGuaranteeEventEmitter();
            var textModelData = TextModel.resolveCreationData(rawTextSource, creationOptions);
            // !!! Make a decision in the ctor and permanently respect this decision !!!
            // If a model is too large at construction time, it will never get tokenized,
            // under no circumstances.
            this._isTooLargeForTokenization = ((textModelData.text.length > TextModel.MODEL_TOKENIZATION_LIMIT)
                || (textModelData.text.lines.length > TextModel.MANY_MANY_LINES));
            this._shouldSimplifyMode = (this._isTooLargeForTokenization
                || (textModelData.text.length > TextModel.MODEL_SYNC_LIMIT));
            this._options = new editorCommon.TextModelResolvedOptions(textModelData.options);
            this._constructLines(textModelData.text);
            this._setVersionId(1);
            this._isDisposed = false;
            this._isDisposing = false;
        }
        TextModel.createFromString = function (text, options) {
            if (options === void 0) { options = TextModel.DEFAULT_CREATION_OPTIONS; }
            return new TextModel(textSource_1.RawTextSource.fromString(text), options);
        };
        TextModel.resolveCreationData = function (rawTextSource, options) {
            var textSource = textSource_1.TextSource.fromRawTextSource(rawTextSource, options.defaultEOL);
            var resolvedOpts;
            if (options.detectIndentation) {
                var guessedIndentation = indentationGuesser_1.guessIndentation(textSource.lines, options.tabSize, options.insertSpaces);
                resolvedOpts = new editorCommon.TextModelResolvedOptions({
                    tabSize: guessedIndentation.tabSize,
                    insertSpaces: guessedIndentation.insertSpaces,
                    trimAutoWhitespace: options.trimAutoWhitespace,
                    defaultEOL: options.defaultEOL
                });
            }
            else {
                resolvedOpts = new editorCommon.TextModelResolvedOptions({
                    tabSize: options.tabSize,
                    insertSpaces: options.insertSpaces,
                    trimAutoWhitespace: options.trimAutoWhitespace,
                    defaultEOL: options.defaultEOL
                });
            }
            return {
                text: textSource,
                options: resolvedOpts
            };
        };
        TextModel.prototype.addBulkListener = function (listener) {
            return this._eventEmitter.addBulkListener(listener);
        };
        TextModel.prototype._createModelLine = function (text, tabSize) {
            if (USE_MIMINAL_MODEL_LINE && this._isTooLargeForTokenization) {
                return new modelLine_1.MinimalModelLine(text, tabSize);
            }
            return new modelLine_1.ModelLine(text, tabSize);
        };
        TextModel.prototype._assertNotDisposed = function () {
            if (this._isDisposed) {
                throw new Error('Model is disposed!');
            }
        };
        TextModel.prototype.isTooLargeForHavingARichMode = function () {
            return this._shouldSimplifyMode;
        };
        TextModel.prototype.isTooLargeForTokenization = function () {
            return this._isTooLargeForTokenization;
        };
        TextModel.prototype.getOptions = function () {
            this._assertNotDisposed();
            return this._options;
        };
        TextModel.prototype.updateOptions = function (_newOpts) {
            this._assertNotDisposed();
            var tabSize = (typeof _newOpts.tabSize !== 'undefined') ? _newOpts.tabSize : this._options.tabSize;
            var insertSpaces = (typeof _newOpts.insertSpaces !== 'undefined') ? _newOpts.insertSpaces : this._options.insertSpaces;
            var trimAutoWhitespace = (typeof _newOpts.trimAutoWhitespace !== 'undefined') ? _newOpts.trimAutoWhitespace : this._options.trimAutoWhitespace;
            var newOpts = new editorCommon.TextModelResolvedOptions({
                tabSize: tabSize,
                insertSpaces: insertSpaces,
                defaultEOL: this._options.defaultEOL,
                trimAutoWhitespace: trimAutoWhitespace
            });
            if (this._options.equals(newOpts)) {
                return;
            }
            var e = this._options.createChangeEvent(newOpts);
            this._options = newOpts;
            if (e.tabSize) {
                var newTabSize = this._options.tabSize;
                for (var i = 0, len = this._lines.length; i < len; i++) {
                    this._lines[i].updateTabSize(newTabSize);
                }
            }
            this._eventEmitter.emit(textModelEvents.TextModelEventType.ModelOptionsChanged, e);
        };
        TextModel.prototype.detectIndentation = function (defaultInsertSpaces, defaultTabSize) {
            this._assertNotDisposed();
            var lines = this._lines.map(function (line) { return line.text; });
            var guessedIndentation = indentationGuesser_1.guessIndentation(lines, defaultTabSize, defaultInsertSpaces);
            this.updateOptions({
                insertSpaces: guessedIndentation.insertSpaces,
                tabSize: guessedIndentation.tabSize
            });
        };
        TextModel._normalizeIndentationFromWhitespace = function (str, tabSize, insertSpaces) {
            var spacesCnt = 0;
            for (var i = 0; i < str.length; i++) {
                if (str.charAt(i) === '\t') {
                    spacesCnt += tabSize;
                }
                else {
                    spacesCnt++;
                }
            }
            var result = '';
            if (!insertSpaces) {
                var tabsCnt = Math.floor(spacesCnt / tabSize);
                spacesCnt = spacesCnt % tabSize;
                for (var i = 0; i < tabsCnt; i++) {
                    result += '\t';
                }
            }
            for (var i = 0; i < spacesCnt; i++) {
                result += ' ';
            }
            return result;
        };
        TextModel.normalizeIndentation = function (str, tabSize, insertSpaces) {
            var firstNonWhitespaceIndex = strings.firstNonWhitespaceIndex(str);
            if (firstNonWhitespaceIndex === -1) {
                firstNonWhitespaceIndex = str.length;
            }
            return TextModel._normalizeIndentationFromWhitespace(str.substring(0, firstNonWhitespaceIndex), tabSize, insertSpaces) + str.substring(firstNonWhitespaceIndex);
        };
        TextModel.prototype.normalizeIndentation = function (str) {
            this._assertNotDisposed();
            return TextModel.normalizeIndentation(str, this._options.tabSize, this._options.insertSpaces);
        };
        TextModel.prototype.getOneIndent = function () {
            this._assertNotDisposed();
            var tabSize = this._options.tabSize;
            var insertSpaces = this._options.insertSpaces;
            if (insertSpaces) {
                var result = '';
                for (var i = 0; i < tabSize; i++) {
                    result += ' ';
                }
                return result;
            }
            else {
                return '\t';
            }
        };
        TextModel.prototype.getVersionId = function () {
            this._assertNotDisposed();
            return this._versionId;
        };
        TextModel.prototype.mightContainRTL = function () {
            return this._mightContainRTL;
        };
        TextModel.prototype.mightContainNonBasicASCII = function () {
            return this._mightContainNonBasicASCII;
        };
        TextModel.prototype.getAlternativeVersionId = function () {
            this._assertNotDisposed();
            return this._alternativeVersionId;
        };
        TextModel.prototype._ensureLineStarts = function () {
            if (!this._lineStarts) {
                var eolLength = this._EOL.length;
                var linesLength = this._lines.length;
                var lineStartValues = new Uint32Array(linesLength);
                for (var i = 0; i < linesLength; i++) {
                    lineStartValues[i] = this._lines[i].text.length + eolLength;
                }
                this._lineStarts = new prefixSumComputer_1.PrefixSumComputer(lineStartValues);
            }
        };
        TextModel.prototype.getOffsetAt = function (rawPosition) {
            this._assertNotDisposed();
            var position = this._validatePosition(rawPosition.lineNumber, rawPosition.column, false);
            this._ensureLineStarts();
            return this._lineStarts.getAccumulatedValue(position.lineNumber - 2) + position.column - 1;
        };
        TextModel.prototype.getPositionAt = function (offset) {
            this._assertNotDisposed();
            offset = Math.floor(offset);
            offset = Math.max(0, offset);
            this._ensureLineStarts();
            var out = this._lineStarts.getIndexOf(offset);
            var lineLength = this._lines[out.index].text.length;
            // Ensure we return a valid position
            return new position_1.Position(out.index + 1, Math.min(out.remainder + 1, lineLength + 1));
        };
        TextModel.prototype._increaseVersionId = function () {
            this._setVersionId(this._versionId + 1);
        };
        TextModel.prototype._setVersionId = function (newVersionId) {
            this._versionId = newVersionId;
            this._alternativeVersionId = this._versionId;
        };
        TextModel.prototype._overwriteAlternativeVersionId = function (newAlternativeVersionId) {
            this._alternativeVersionId = newAlternativeVersionId;
        };
        TextModel.prototype.isDisposed = function () {
            return this._isDisposed;
        };
        TextModel.prototype.dispose = function () {
            this._isDisposed = true;
            // Null out members, such that any use of a disposed model will throw exceptions sooner rather than later
            this._lines = null;
            this._EOL = null;
            this._BOM = null;
            this._eventEmitter.dispose();
        };
        TextModel.prototype._emitContentChanged2 = function (startLineNumber, startColumn, endLineNumber, endColumn, rangeLength, text, isUndoing, isRedoing, isFlush) {
            var e = {
                changes: [{
                        range: new range_1.Range(startLineNumber, startColumn, endLineNumber, endColumn),
                        rangeLength: rangeLength,
                        text: text,
                    }],
                eol: this._EOL,
                versionId: this.getVersionId(),
                isUndoing: isUndoing,
                isRedoing: isRedoing,
                isFlush: isFlush
            };
            if (!this._isDisposing) {
                this._eventEmitter.emit(textModelEvents.TextModelEventType.ModelContentChanged, e);
            }
        };
        TextModel.prototype._resetValue = function (newValue) {
            this._constructLines(newValue);
            this._increaseVersionId();
        };
        TextModel.prototype.equals = function (other) {
            this._assertNotDisposed();
            if (this._BOM !== other.BOM) {
                return false;
            }
            if (this._EOL !== other.EOL) {
                return false;
            }
            if (this._lines.length !== other.lines.length) {
                return false;
            }
            for (var i = 0, len = this._lines.length; i < len; i++) {
                if (this._lines[i].text !== other.lines[i]) {
                    return false;
                }
            }
            return true;
        };
        TextModel.prototype.setValue = function (value) {
            this._assertNotDisposed();
            if (value === null) {
                // There's nothing to do
                return;
            }
            var textSource = textSource_1.TextSource.fromString(value, this._options.defaultEOL);
            this.setValueFromTextSource(textSource);
        };
        TextModel.prototype.setValueFromTextSource = function (newValue) {
            this._assertNotDisposed();
            if (newValue === null) {
                // There's nothing to do
                return;
            }
            var oldFullModelRange = this.getFullModelRange();
            var oldModelValueLength = this.getValueLengthInRange(oldFullModelRange);
            var endLineNumber = this.getLineCount();
            var endColumn = this.getLineMaxColumn(endLineNumber);
            this._resetValue(newValue);
            this._emitModelRawContentChangedEvent(new textModelEvents.ModelRawContentChangedEvent([
                new textModelEvents.ModelRawFlush()
            ], this._versionId, false, false));
            this._emitContentChanged2(1, 1, endLineNumber, endColumn, oldModelValueLength, this.getValue(), false, false, true);
        };
        TextModel.prototype.getValue = function (eol, preserveBOM) {
            if (preserveBOM === void 0) { preserveBOM = false; }
            this._assertNotDisposed();
            var fullModelRange = this.getFullModelRange();
            var fullModelValue = this.getValueInRange(fullModelRange, eol);
            if (preserveBOM) {
                return this._BOM + fullModelValue;
            }
            return fullModelValue;
        };
        TextModel.prototype.getValueLength = function (eol, preserveBOM) {
            if (preserveBOM === void 0) { preserveBOM = false; }
            this._assertNotDisposed();
            var fullModelRange = this.getFullModelRange();
            var fullModelValue = this.getValueLengthInRange(fullModelRange, eol);
            if (preserveBOM) {
                return this._BOM.length + fullModelValue;
            }
            return fullModelValue;
        };
        TextModel.prototype.getValueInRange = function (rawRange, eol) {
            if (eol === void 0) { eol = editorCommon.EndOfLinePreference.TextDefined; }
            this._assertNotDisposed();
            var range = this.validateRange(rawRange);
            if (range.isEmpty()) {
                return '';
            }
            if (range.startLineNumber === range.endLineNumber) {
                return this._lines[range.startLineNumber - 1].text.substring(range.startColumn - 1, range.endColumn - 1);
            }
            var lineEnding = this._getEndOfLine(eol), startLineIndex = range.startLineNumber - 1, endLineIndex = range.endLineNumber - 1, resultLines = [];
            resultLines.push(this._lines[startLineIndex].text.substring(range.startColumn - 1));
            for (var i = startLineIndex + 1; i < endLineIndex; i++) {
                resultLines.push(this._lines[i].text);
            }
            resultLines.push(this._lines[endLineIndex].text.substring(0, range.endColumn - 1));
            return resultLines.join(lineEnding);
        };
        TextModel.prototype.getValueLengthInRange = function (rawRange, eol) {
            if (eol === void 0) { eol = editorCommon.EndOfLinePreference.TextDefined; }
            this._assertNotDisposed();
            var range = this.validateRange(rawRange);
            if (range.isEmpty()) {
                return 0;
            }
            if (range.startLineNumber === range.endLineNumber) {
                return (range.endColumn - range.startColumn);
            }
            var startOffset = this.getOffsetAt(new position_1.Position(range.startLineNumber, range.startColumn));
            var endOffset = this.getOffsetAt(new position_1.Position(range.endLineNumber, range.endColumn));
            return endOffset - startOffset;
        };
        TextModel.prototype.isDominatedByLongLines = function () {
            this._assertNotDisposed();
            var smallLineCharCount = 0, longLineCharCount = 0, i, len, lines = this._lines, lineLength;
            for (i = 0, len = this._lines.length; i < len; i++) {
                lineLength = lines[i].text.length;
                if (lineLength >= exports.LONG_LINE_BOUNDARY) {
                    longLineCharCount += lineLength;
                }
                else {
                    smallLineCharCount += lineLength;
                }
            }
            return (longLineCharCount > smallLineCharCount);
        };
        TextModel.prototype.getLineCount = function () {
            this._assertNotDisposed();
            return this._lines.length;
        };
        TextModel.prototype.getLineContent = function (lineNumber) {
            this._assertNotDisposed();
            if (lineNumber < 1 || lineNumber > this.getLineCount()) {
                throw new Error('Illegal value ' + lineNumber + ' for `lineNumber`');
            }
            return this._lines[lineNumber - 1].text;
        };
        TextModel.prototype.getIndentLevel = function (lineNumber) {
            this._assertNotDisposed();
            if (lineNumber < 1 || lineNumber > this.getLineCount()) {
                throw new Error('Illegal value ' + lineNumber + ' for `lineNumber`');
            }
            return this._lines[lineNumber - 1].getIndentLevel();
        };
        TextModel.prototype._resetIndentRanges = function () {
            this._indentRanges = null;
        };
        TextModel.prototype._getIndentRanges = function () {
            if (!this._indentRanges) {
                this._indentRanges = indentRanges_1.computeRanges(this);
            }
            return this._indentRanges;
        };
        TextModel.prototype.getIndentRanges = function () {
            this._assertNotDisposed();
            var indentRanges = this._getIndentRanges();
            return indentRanges_1.IndentRange.deepCloneArr(indentRanges);
        };
        TextModel.prototype._toValidLineIndentGuide = function (lineNumber, indentGuide) {
            var lineIndentLevel = this._lines[lineNumber - 1].getIndentLevel();
            if (lineIndentLevel === -1) {
                return indentGuide;
            }
            var maxIndentGuide = Math.ceil(lineIndentLevel / this._options.tabSize);
            return Math.min(maxIndentGuide, indentGuide);
        };
        TextModel.prototype.getLineIndentGuide = function (lineNumber) {
            this._assertNotDisposed();
            if (lineNumber < 1 || lineNumber > this.getLineCount()) {
                throw new Error('Illegal value ' + lineNumber + ' for `lineNumber`');
            }
            var indentRanges = this._getIndentRanges();
            for (var i = indentRanges.length - 1; i >= 0; i--) {
                var rng = indentRanges[i];
                if (rng.startLineNumber === lineNumber) {
                    return this._toValidLineIndentGuide(lineNumber, Math.ceil(rng.indent / this._options.tabSize));
                }
                if (rng.startLineNumber < lineNumber && lineNumber <= rng.endLineNumber) {
                    return this._toValidLineIndentGuide(lineNumber, 1 + Math.floor(rng.indent / this._options.tabSize));
                }
                if (rng.endLineNumber + 1 === lineNumber) {
                    var bestIndent = rng.indent;
                    while (i > 0) {
                        i--;
                        rng = indentRanges[i];
                        if (rng.endLineNumber + 1 === lineNumber) {
                            bestIndent = rng.indent;
                        }
                    }
                    return this._toValidLineIndentGuide(lineNumber, Math.ceil(bestIndent / this._options.tabSize));
                }
            }
            return 0;
        };
        TextModel.prototype.getLinesContent = function () {
            this._assertNotDisposed();
            var r = [];
            for (var i = 0, len = this._lines.length; i < len; i++) {
                r[i] = this._lines[i].text;
            }
            return r;
        };
        TextModel.prototype.getEOL = function () {
            this._assertNotDisposed();
            return this._EOL;
        };
        TextModel.prototype.setEOL = function (eol) {
            this._assertNotDisposed();
            var newEOL = (eol === editorCommon.EndOfLineSequence.CRLF ? '\r\n' : '\n');
            if (this._EOL === newEOL) {
                // Nothing to do
                return;
            }
            var oldFullModelRange = this.getFullModelRange();
            var oldModelValueLength = this.getValueLengthInRange(oldFullModelRange);
            var endLineNumber = this.getLineCount();
            var endColumn = this.getLineMaxColumn(endLineNumber);
            this._EOL = newEOL;
            this._lineStarts = null;
            this._increaseVersionId();
            this._emitModelRawContentChangedEvent(new textModelEvents.ModelRawContentChangedEvent([
                new textModelEvents.ModelRawEOLChanged()
            ], this._versionId, false, false));
            this._emitContentChanged2(1, 1, endLineNumber, endColumn, oldModelValueLength, this.getValue(), false, false, false);
        };
        TextModel.prototype.getLineMinColumn = function (lineNumber) {
            this._assertNotDisposed();
            return 1;
        };
        TextModel.prototype.getLineMaxColumn = function (lineNumber) {
            this._assertNotDisposed();
            if (lineNumber < 1 || lineNumber > this.getLineCount()) {
                throw new Error('Illegal value ' + lineNumber + ' for `lineNumber`');
            }
            return this._lines[lineNumber - 1].text.length + 1;
        };
        TextModel.prototype.getLineFirstNonWhitespaceColumn = function (lineNumber) {
            this._assertNotDisposed();
            if (lineNumber < 1 || lineNumber > this.getLineCount()) {
                throw new Error('Illegal value ' + lineNumber + ' for `lineNumber`');
            }
            var result = strings.firstNonWhitespaceIndex(this._lines[lineNumber - 1].text);
            if (result === -1) {
                return 0;
            }
            return result + 1;
        };
        TextModel.prototype.getLineLastNonWhitespaceColumn = function (lineNumber) {
            this._assertNotDisposed();
            if (lineNumber < 1 || lineNumber > this.getLineCount()) {
                throw new Error('Illegal value ' + lineNumber + ' for `lineNumber`');
            }
            var result = strings.lastNonWhitespaceIndex(this._lines[lineNumber - 1].text);
            if (result === -1) {
                return 0;
            }
            return result + 2;
        };
        TextModel.prototype.validateLineNumber = function (lineNumber) {
            this._assertNotDisposed();
            if (lineNumber < 1) {
                lineNumber = 1;
            }
            if (lineNumber > this._lines.length) {
                lineNumber = this._lines.length;
            }
            return lineNumber;
        };
        /**
         * @param strict Do NOT allow a position inside a high-low surrogate pair
         */
        TextModel.prototype._validatePosition = function (_lineNumber, _column, strict) {
            var lineNumber = Math.floor(typeof _lineNumber === 'number' ? _lineNumber : 1);
            var column = Math.floor(typeof _column === 'number' ? _column : 1);
            if (lineNumber < 1) {
                return new position_1.Position(1, 1);
            }
            if (lineNumber > this._lines.length) {
                return new position_1.Position(this._lines.length, this.getLineMaxColumn(this._lines.length));
            }
            if (column <= 1) {
                return new position_1.Position(lineNumber, 1);
            }
            var maxColumn = this.getLineMaxColumn(lineNumber);
            if (column >= maxColumn) {
                return new position_1.Position(lineNumber, maxColumn);
            }
            if (strict) {
                // If the position would end up in the middle of a high-low surrogate pair,
                // we move it to before the pair
                // !!At this point, column > 1
                var charCodeBefore = this._lines[lineNumber - 1].text.charCodeAt(column - 2);
                if (strings.isHighSurrogate(charCodeBefore)) {
                    return new position_1.Position(lineNumber, column - 1);
                }
            }
            return new position_1.Position(lineNumber, column);
        };
        TextModel.prototype.validatePosition = function (position) {
            this._assertNotDisposed();
            return this._validatePosition(position.lineNumber, position.column, true);
        };
        TextModel.prototype.validateRange = function (_range) {
            this._assertNotDisposed();
            var start = this._validatePosition(_range.startLineNumber, _range.startColumn, false);
            var end = this._validatePosition(_range.endLineNumber, _range.endColumn, false);
            var startLineNumber = start.lineNumber;
            var startColumn = start.column;
            var endLineNumber = end.lineNumber;
            var endColumn = end.column;
            var startLineText = this._lines[startLineNumber - 1].text;
            var endLineText = this._lines[endLineNumber - 1].text;
            var charCodeBeforeStart = (startColumn > 1 ? startLineText.charCodeAt(startColumn - 2) : 0);
            var charCodeBeforeEnd = (endColumn > 1 && endColumn <= endLineText.length ? endLineText.charCodeAt(endColumn - 2) : 0);
            var startInsideSurrogatePair = strings.isHighSurrogate(charCodeBeforeStart);
            var endInsideSurrogatePair = strings.isHighSurrogate(charCodeBeforeEnd);
            if (!startInsideSurrogatePair && !endInsideSurrogatePair) {
                return new range_1.Range(startLineNumber, startColumn, endLineNumber, endColumn);
            }
            if (startLineNumber === endLineNumber && startColumn === endColumn) {
                // do not expand a collapsed range, simply move it to a valid location
                return new range_1.Range(startLineNumber, startColumn - 1, endLineNumber, endColumn - 1);
            }
            if (startInsideSurrogatePair && endInsideSurrogatePair) {
                // expand range at both ends
                return new range_1.Range(startLineNumber, startColumn - 1, endLineNumber, endColumn + 1);
            }
            if (startInsideSurrogatePair) {
                // only expand range at the start
                return new range_1.Range(startLineNumber, startColumn - 1, endLineNumber, endColumn);
            }
            // only expand range at the end
            return new range_1.Range(startLineNumber, startColumn, endLineNumber, endColumn + 1);
        };
        TextModel.prototype.modifyPosition = function (rawPosition, offset) {
            this._assertNotDisposed();
            return this.getPositionAt(this.getOffsetAt(rawPosition) + offset);
        };
        TextModel.prototype.getFullModelRange = function () {
            this._assertNotDisposed();
            var lineCount = this.getLineCount();
            return new range_1.Range(1, 1, lineCount, this.getLineMaxColumn(lineCount));
        };
        TextModel.prototype._emitModelRawContentChangedEvent = function (e) {
            if (this._isDisposing) {
                // Do not confuse listeners by emitting any event after disposing
                return;
            }
            this._eventEmitter.emit(textModelEvents.TextModelEventType.ModelRawContentChanged2, e);
        };
        TextModel.prototype._constructLines = function (textSource) {
            var tabSize = this._options.tabSize;
            var rawLines = textSource.lines;
            var modelLines = new Array(rawLines.length);
            for (var i = 0, len = rawLines.length; i < len; i++) {
                modelLines[i] = this._createModelLine(rawLines[i], tabSize);
            }
            this._BOM = textSource.BOM;
            this._mightContainRTL = textSource.containsRTL;
            this._mightContainNonBasicASCII = !textSource.isBasicASCII;
            this._EOL = textSource.EOL;
            this._lines = modelLines;
            this._lineStarts = null;
            this._resetIndentRanges();
        };
        TextModel.prototype._getEndOfLine = function (eol) {
            switch (eol) {
                case editorCommon.EndOfLinePreference.LF:
                    return '\n';
                case editorCommon.EndOfLinePreference.CRLF:
                    return '\r\n';
                case editorCommon.EndOfLinePreference.TextDefined:
                    return this.getEOL();
            }
            throw new Error('Unknown EOL preference');
        };
        TextModel.prototype.findMatches = function (searchString, rawSearchScope, isRegex, matchCase, wordSeparators, captureMatches, limitResultCount) {
            if (limitResultCount === void 0) { limitResultCount = LIMIT_FIND_COUNT; }
            this._assertNotDisposed();
            var searchRange;
            if (range_1.Range.isIRange(rawSearchScope)) {
                searchRange = this.validateRange(rawSearchScope);
            }
            else {
                searchRange = this.getFullModelRange();
            }
            return textModelSearch_1.TextModelSearch.findMatches(this, new textModelSearch_1.SearchParams(searchString, isRegex, matchCase, wordSeparators), searchRange, captureMatches, limitResultCount);
        };
        TextModel.prototype.findNextMatch = function (searchString, rawSearchStart, isRegex, matchCase, wordSeparators, captureMatches) {
            this._assertNotDisposed();
            var searchStart = this.validatePosition(rawSearchStart);
            return textModelSearch_1.TextModelSearch.findNextMatch(this, new textModelSearch_1.SearchParams(searchString, isRegex, matchCase, wordSeparators), searchStart, captureMatches);
        };
        TextModel.prototype.findPreviousMatch = function (searchString, rawSearchStart, isRegex, matchCase, wordSeparators, captureMatches) {
            this._assertNotDisposed();
            var searchStart = this.validatePosition(rawSearchStart);
            return textModelSearch_1.TextModelSearch.findPreviousMatch(this, new textModelSearch_1.SearchParams(searchString, isRegex, matchCase, wordSeparators), searchStart, captureMatches);
        };
        TextModel.MODEL_SYNC_LIMIT = 50 * 1024 * 1024; // 50 MB
        TextModel.MODEL_TOKENIZATION_LIMIT = 20 * 1024 * 1024; // 20 MB
        TextModel.MANY_MANY_LINES = 300 * 1000; // 300K lines
        TextModel.DEFAULT_CREATION_OPTIONS = {
            tabSize: editorOptions_1.EDITOR_MODEL_DEFAULTS.tabSize,
            insertSpaces: editorOptions_1.EDITOR_MODEL_DEFAULTS.insertSpaces,
            detectIndentation: false,
            defaultEOL: editorCommon.DefaultEndOfLine.LF,
            trimAutoWhitespace: editorOptions_1.EDITOR_MODEL_DEFAULTS.trimAutoWhitespace,
        };
        return TextModel;
    }());
    exports.TextModel = TextModel;
});
//# sourceMappingURL=textModel.js.map