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
define(["require", "exports", "vs/editor/common/core/range", "vs/editor/common/editorCommon", "vs/editor/common/model/editStack", "vs/editor/common/model/textModelWithDecorations", "vs/base/common/strings", "vs/base/common/arrays", "vs/editor/common/core/position", "vs/editor/common/model/textSource", "vs/editor/common/model/textModel", "vs/editor/common/model/textModelEvents"], function (require, exports, range_1, editorCommon, editStack_1, textModelWithDecorations_1, strings, arrays, position_1, textSource_1, textModel_1, textModelEvents) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var EditableTextModel = (function (_super) {
        __extends(EditableTextModel, _super);
        function EditableTextModel(rawTextSource, creationOptions, languageIdentifier) {
            var _this = _super.call(this, rawTextSource, creationOptions, languageIdentifier) || this;
            _this._commandManager = new editStack_1.EditStack(_this);
            _this._isUndoing = false;
            _this._isRedoing = false;
            _this._hasEditableRange = false;
            _this._editableRangeId = null;
            _this._trimAutoWhitespaceLines = null;
            return _this;
        }
        EditableTextModel.createFromString = function (text, options, languageIdentifier) {
            if (options === void 0) { options = textModel_1.TextModel.DEFAULT_CREATION_OPTIONS; }
            if (languageIdentifier === void 0) { languageIdentifier = null; }
            return new EditableTextModel(textSource_1.RawTextSource.fromString(text), options, languageIdentifier);
        };
        EditableTextModel.prototype.onDidChangeRawContent = function (listener) {
            return this._eventEmitter.addListener(textModelEvents.TextModelEventType.ModelRawContentChanged2, listener);
        };
        EditableTextModel.prototype.onDidChangeContent = function (listener) {
            return this._eventEmitter.addListener(textModelEvents.TextModelEventType.ModelContentChanged, listener);
        };
        EditableTextModel.prototype.dispose = function () {
            this._commandManager = null;
            _super.prototype.dispose.call(this);
        };
        EditableTextModel.prototype._resetValue = function (newValue) {
            _super.prototype._resetValue.call(this, newValue);
            // Destroy my edit history and settings
            this._commandManager = new editStack_1.EditStack(this);
            this._hasEditableRange = false;
            this._editableRangeId = null;
            this._trimAutoWhitespaceLines = null;
        };
        EditableTextModel.prototype.pushStackElement = function () {
            this._commandManager.pushStackElement();
        };
        EditableTextModel.prototype.pushEditOperations = function (beforeCursorState, editOperations, cursorStateComputer) {
            try {
                this._eventEmitter.beginDeferredEmit();
                return this._pushEditOperations(beforeCursorState, editOperations, cursorStateComputer);
            }
            finally {
                this._eventEmitter.endDeferredEmit();
            }
        };
        EditableTextModel.prototype._pushEditOperations = function (beforeCursorState, editOperations, cursorStateComputer) {
            var _this = this;
            if (this._options.trimAutoWhitespace && this._trimAutoWhitespaceLines) {
                // Go through each saved line number and insert a trim whitespace edit
                // if it is safe to do so (no conflicts with other edits).
                var incomingEdits = editOperations.map(function (op) {
                    return {
                        range: _this.validateRange(op.range),
                        text: op.text
                    };
                });
                // Sometimes, auto-formatters change ranges automatically which can cause undesired auto whitespace trimming near the cursor
                // We'll use the following heuristic: if the edits occur near the cursor, then it's ok to trim auto whitespace
                var editsAreNearCursors = true;
                for (var i = 0, len = beforeCursorState.length; i < len; i++) {
                    var sel = beforeCursorState[i];
                    var foundEditNearSel = false;
                    for (var j = 0, lenJ = incomingEdits.length; j < lenJ; j++) {
                        var editRange = incomingEdits[j].range;
                        var selIsAbove = editRange.startLineNumber > sel.endLineNumber;
                        var selIsBelow = sel.startLineNumber > editRange.endLineNumber;
                        if (!selIsAbove && !selIsBelow) {
                            foundEditNearSel = true;
                            break;
                        }
                    }
                    if (!foundEditNearSel) {
                        editsAreNearCursors = false;
                        break;
                    }
                }
                if (editsAreNearCursors) {
                    for (var i = 0, len = this._trimAutoWhitespaceLines.length; i < len; i++) {
                        var trimLineNumber = this._trimAutoWhitespaceLines[i];
                        var maxLineColumn = this.getLineMaxColumn(trimLineNumber);
                        var allowTrimLine = true;
                        for (var j = 0, lenJ = incomingEdits.length; j < lenJ; j++) {
                            var editRange = incomingEdits[j].range;
                            var editText = incomingEdits[j].text;
                            if (trimLineNumber < editRange.startLineNumber || trimLineNumber > editRange.endLineNumber) {
                                // `trimLine` is completely outside this edit
                                continue;
                            }
                            // At this point:
                            //   editRange.startLineNumber <= trimLine <= editRange.endLineNumber
                            if (trimLineNumber === editRange.startLineNumber && editRange.startColumn === maxLineColumn
                                && editRange.isEmpty() && editText && editText.length > 0 && editText.charAt(0) === '\n') {
                                // This edit inserts a new line (and maybe other text) after `trimLine`
                                continue;
                            }
                            // Looks like we can't trim this line as it would interfere with an incoming edit
                            allowTrimLine = false;
                            break;
                        }
                        if (allowTrimLine) {
                            editOperations.push({
                                identifier: null,
                                range: new range_1.Range(trimLineNumber, 1, trimLineNumber, maxLineColumn),
                                text: null,
                                forceMoveMarkers: false,
                                isAutoWhitespaceEdit: false
                            });
                        }
                    }
                }
                this._trimAutoWhitespaceLines = null;
            }
            return this._commandManager.pushEditOperation(beforeCursorState, editOperations, cursorStateComputer);
        };
        /**
         * Transform operations such that they represent the same logic edit,
         * but that they also do not cause OOM crashes.
         */
        EditableTextModel.prototype._reduceOperations = function (operations) {
            if (operations.length < 1000) {
                // We know from empirical testing that a thousand edits work fine regardless of their shape.
                return operations;
            }
            // At one point, due to how events are emitted and how each operation is handled,
            // some operations can trigger a high ammount of temporary string allocations,
            // that will immediately get edited again.
            // e.g. a formatter inserting ridiculous ammounts of \n on a model with a single line
            // Therefore, the strategy is to collapse all the operations into a huge single edit operation
            return [this._toSingleEditOperation(operations)];
        };
        EditableTextModel.prototype._toSingleEditOperation = function (operations) {
            var forceMoveMarkers = false, firstEditRange = operations[0].range, lastEditRange = operations[operations.length - 1].range, entireEditRange = new range_1.Range(firstEditRange.startLineNumber, firstEditRange.startColumn, lastEditRange.endLineNumber, lastEditRange.endColumn), lastEndLineNumber = firstEditRange.startLineNumber, lastEndColumn = firstEditRange.startColumn, result = [];
            for (var i = 0, len = operations.length; i < len; i++) {
                var operation = operations[i], range = operation.range;
                forceMoveMarkers = forceMoveMarkers || operation.forceMoveMarkers;
                // (1) -- Push old text
                for (var lineNumber = lastEndLineNumber; lineNumber < range.startLineNumber; lineNumber++) {
                    if (lineNumber === lastEndLineNumber) {
                        result.push(this._lines[lineNumber - 1].text.substring(lastEndColumn - 1));
                    }
                    else {
                        result.push('\n');
                        result.push(this._lines[lineNumber - 1].text);
                    }
                }
                if (range.startLineNumber === lastEndLineNumber) {
                    result.push(this._lines[range.startLineNumber - 1].text.substring(lastEndColumn - 1, range.startColumn - 1));
                }
                else {
                    result.push('\n');
                    result.push(this._lines[range.startLineNumber - 1].text.substring(0, range.startColumn - 1));
                }
                // (2) -- Push new text
                if (operation.lines) {
                    for (var j = 0, lenJ = operation.lines.length; j < lenJ; j++) {
                        if (j !== 0) {
                            result.push('\n');
                        }
                        result.push(operation.lines[j]);
                    }
                }
                lastEndLineNumber = operation.range.endLineNumber;
                lastEndColumn = operation.range.endColumn;
            }
            return {
                sortIndex: 0,
                identifier: operations[0].identifier,
                range: entireEditRange,
                rangeLength: this.getValueLengthInRange(entireEditRange),
                lines: result.join('').split('\n'),
                forceMoveMarkers: forceMoveMarkers,
                isAutoWhitespaceEdit: false
            };
        };
        EditableTextModel._sortOpsAscending = function (a, b) {
            var r = range_1.Range.compareRangesUsingEnds(a.range, b.range);
            if (r === 0) {
                return a.sortIndex - b.sortIndex;
            }
            return r;
        };
        EditableTextModel._sortOpsDescending = function (a, b) {
            var r = range_1.Range.compareRangesUsingEnds(a.range, b.range);
            if (r === 0) {
                return b.sortIndex - a.sortIndex;
            }
            return -r;
        };
        EditableTextModel.prototype.applyEdits = function (rawOperations) {
            try {
                this._eventEmitter.beginDeferredEmit();
                var markersTracker = this._acquireMarkersTracker();
                return this._applyEdits(markersTracker, rawOperations);
            }
            finally {
                this._releaseMarkersTracker();
                this._eventEmitter.endDeferredEmit();
            }
        };
        EditableTextModel.prototype._applyEdits = function (markersTracker, rawOperations) {
            if (rawOperations.length === 0) {
                return [];
            }
            var mightContainRTL = this._mightContainRTL;
            var mightContainNonBasicASCII = this._mightContainNonBasicASCII;
            var canReduceOperations = true;
            var operations = [];
            for (var i = 0; i < rawOperations.length; i++) {
                var op = rawOperations[i];
                if (canReduceOperations && op._isTracked) {
                    canReduceOperations = false;
                }
                var validatedRange = this.validateRange(op.range);
                if (!mightContainRTL && op.text) {
                    // check if the new inserted text contains RTL
                    mightContainRTL = strings.containsRTL(op.text);
                }
                if (!mightContainNonBasicASCII && op.text) {
                    mightContainNonBasicASCII = !strings.isBasicASCII(op.text);
                }
                operations[i] = {
                    sortIndex: i,
                    identifier: op.identifier,
                    range: validatedRange,
                    rangeLength: this.getValueLengthInRange(validatedRange),
                    lines: op.text ? op.text.split(/\r\n|\r|\n/) : null,
                    forceMoveMarkers: op.forceMoveMarkers,
                    isAutoWhitespaceEdit: op.isAutoWhitespaceEdit || false
                };
            }
            // Sort operations ascending
            operations.sort(EditableTextModel._sortOpsAscending);
            for (var i = 0, count = operations.length - 1; i < count; i++) {
                var rangeEnd = operations[i].range.getEndPosition();
                var nextRangeStart = operations[i + 1].range.getStartPosition();
                if (nextRangeStart.isBefore(rangeEnd)) {
                    // overlapping ranges
                    throw new Error('Overlapping ranges are not allowed!');
                }
            }
            if (canReduceOperations) {
                operations = this._reduceOperations(operations);
            }
            var editableRange = this.getEditableRange();
            var editableRangeStart = editableRange.getStartPosition();
            var editableRangeEnd = editableRange.getEndPosition();
            for (var i = 0; i < operations.length; i++) {
                var operationRange = operations[i].range;
                if (!editableRangeStart.isBeforeOrEqual(operationRange.getStartPosition()) || !operationRange.getEndPosition().isBeforeOrEqual(editableRangeEnd)) {
                    throw new Error('Editing outside of editable range not allowed!');
                }
            }
            // Delta encode operations
            var reverseRanges = EditableTextModel._getInverseEditRanges(operations);
            var reverseOperations = [];
            var newTrimAutoWhitespaceCandidates = [];
            for (var i = 0; i < operations.length; i++) {
                var op = operations[i];
                var reverseRange = reverseRanges[i];
                reverseOperations[i] = {
                    identifier: op.identifier,
                    range: reverseRange,
                    text: this.getValueInRange(op.range),
                    forceMoveMarkers: op.forceMoveMarkers
                };
                if (this._options.trimAutoWhitespace && op.isAutoWhitespaceEdit && op.range.isEmpty()) {
                    // Record already the future line numbers that might be auto whitespace removal candidates on next edit
                    for (var lineNumber = reverseRange.startLineNumber; lineNumber <= reverseRange.endLineNumber; lineNumber++) {
                        var currentLineContent = '';
                        if (lineNumber === reverseRange.startLineNumber) {
                            currentLineContent = this.getLineContent(op.range.startLineNumber);
                            if (strings.firstNonWhitespaceIndex(currentLineContent) !== -1) {
                                continue;
                            }
                        }
                        newTrimAutoWhitespaceCandidates.push({ lineNumber: lineNumber, oldContent: currentLineContent });
                    }
                }
            }
            this._mightContainRTL = mightContainRTL;
            this._mightContainNonBasicASCII = mightContainNonBasicASCII;
            this._doApplyEdits(markersTracker, operations);
            this._trimAutoWhitespaceLines = null;
            if (this._options.trimAutoWhitespace && newTrimAutoWhitespaceCandidates.length > 0) {
                // sort line numbers auto whitespace removal candidates for next edit descending
                newTrimAutoWhitespaceCandidates.sort(function (a, b) { return b.lineNumber - a.lineNumber; });
                this._trimAutoWhitespaceLines = [];
                for (var i = 0, len = newTrimAutoWhitespaceCandidates.length; i < len; i++) {
                    var lineNumber = newTrimAutoWhitespaceCandidates[i].lineNumber;
                    if (i > 0 && newTrimAutoWhitespaceCandidates[i - 1].lineNumber === lineNumber) {
                        // Do not have the same line number twice
                        continue;
                    }
                    var prevContent = newTrimAutoWhitespaceCandidates[i].oldContent;
                    var lineContent = this.getLineContent(lineNumber);
                    if (lineContent.length === 0 || lineContent === prevContent || strings.firstNonWhitespaceIndex(lineContent) !== -1) {
                        continue;
                    }
                    this._trimAutoWhitespaceLines.push(lineNumber);
                }
            }
            return reverseOperations;
        };
        /**
         * Assumes `operations` are validated and sorted ascending
         */
        EditableTextModel._getInverseEditRanges = function (operations) {
            var result = [];
            var prevOpEndLineNumber;
            var prevOpEndColumn;
            var prevOp = null;
            for (var i = 0, len = operations.length; i < len; i++) {
                var op = operations[i];
                var startLineNumber = void 0;
                var startColumn = void 0;
                if (prevOp) {
                    if (prevOp.range.endLineNumber === op.range.startLineNumber) {
                        startLineNumber = prevOpEndLineNumber;
                        startColumn = prevOpEndColumn + (op.range.startColumn - prevOp.range.endColumn);
                    }
                    else {
                        startLineNumber = prevOpEndLineNumber + (op.range.startLineNumber - prevOp.range.endLineNumber);
                        startColumn = op.range.startColumn;
                    }
                }
                else {
                    startLineNumber = op.range.startLineNumber;
                    startColumn = op.range.startColumn;
                }
                var resultRange = void 0;
                if (op.lines && op.lines.length > 0) {
                    // the operation inserts something
                    var lineCount = op.lines.length;
                    var firstLine = op.lines[0];
                    var lastLine = op.lines[lineCount - 1];
                    if (lineCount === 1) {
                        // single line insert
                        resultRange = new range_1.Range(startLineNumber, startColumn, startLineNumber, startColumn + firstLine.length);
                    }
                    else {
                        // multi line insert
                        resultRange = new range_1.Range(startLineNumber, startColumn, startLineNumber + lineCount - 1, lastLine.length + 1);
                    }
                }
                else {
                    // There is nothing to insert
                    resultRange = new range_1.Range(startLineNumber, startColumn, startLineNumber, startColumn);
                }
                prevOpEndLineNumber = resultRange.endLineNumber;
                prevOpEndColumn = resultRange.endColumn;
                result.push(resultRange);
                prevOp = op;
            }
            return result;
        };
        EditableTextModel.prototype._doApplyEdits = function (markersTracker, operations) {
            var _this = this;
            var tabSize = this._options.tabSize;
            // Sort operations descending
            operations.sort(EditableTextModel._sortOpsDescending);
            var rawContentChanges = [];
            var contentChanges = [];
            var lineEditsQueue = [];
            var queueLineEdit = function (lineEdit) {
                if (lineEdit.startColumn === lineEdit.endColumn && lineEdit.text.length === 0) {
                    // empty edit => ignore it
                    return;
                }
                lineEditsQueue.push(lineEdit);
            };
            var flushLineEdits = function () {
                if (lineEditsQueue.length === 0) {
                    return;
                }
                lineEditsQueue.reverse();
                // `lineEditsQueue` now contains edits from smaller (line number,column) to larger (line number,column)
                var currentLineNumber = lineEditsQueue[0].lineNumber;
                var currentLineNumberStart = 0;
                for (var i = 1, len = lineEditsQueue.length; i < len; i++) {
                    var lineNumber = lineEditsQueue[i].lineNumber;
                    if (lineNumber === currentLineNumber) {
                        continue;
                    }
                    _this._invalidateLine(currentLineNumber - 1);
                    _this._lines[currentLineNumber - 1].applyEdits(markersTracker, lineEditsQueue.slice(currentLineNumberStart, i), tabSize);
                    if (_this._lineStarts) {
                        // update prefix sum
                        _this._lineStarts.changeValue(currentLineNumber - 1, _this._lines[currentLineNumber - 1].text.length + _this._EOL.length);
                    }
                    rawContentChanges.push(new textModelEvents.ModelRawLineChanged(currentLineNumber, _this._lines[currentLineNumber - 1].text));
                    currentLineNumber = lineNumber;
                    currentLineNumberStart = i;
                }
                _this._invalidateLine(currentLineNumber - 1);
                _this._lines[currentLineNumber - 1].applyEdits(markersTracker, lineEditsQueue.slice(currentLineNumberStart, lineEditsQueue.length), tabSize);
                if (_this._lineStarts) {
                    // update prefix sum
                    _this._lineStarts.changeValue(currentLineNumber - 1, _this._lines[currentLineNumber - 1].text.length + _this._EOL.length);
                }
                rawContentChanges.push(new textModelEvents.ModelRawLineChanged(currentLineNumber, _this._lines[currentLineNumber - 1].text));
                lineEditsQueue = [];
            };
            var minTouchedLineNumber = operations[operations.length - 1].range.startLineNumber;
            var maxTouchedLineNumber = operations[0].range.endLineNumber + 1;
            var totalLinesCountDelta = 0;
            for (var i = 0, len = operations.length; i < len; i++) {
                var op = operations[i];
                // console.log();
                // console.log('-------------------');
                // console.log('OPERATION #' + (i));
                // console.log('op: ', op);
                // console.log('<<<\n' + this._lines.map(l => l.text).join('\n') + '\n>>>');
                var startLineNumber = op.range.startLineNumber;
                var startColumn = op.range.startColumn;
                var endLineNumber = op.range.endLineNumber;
                var endColumn = op.range.endColumn;
                if (startLineNumber === endLineNumber && startColumn === endColumn && (!op.lines || op.lines.length === 0)) {
                    // no-op
                    continue;
                }
                var deletingLinesCnt = endLineNumber - startLineNumber;
                var insertingLinesCnt = (op.lines ? op.lines.length - 1 : 0);
                var editingLinesCnt = Math.min(deletingLinesCnt, insertingLinesCnt);
                totalLinesCountDelta += (insertingLinesCnt - deletingLinesCnt);
                // Iterating descending to overlap with previous op
                // in case there are common lines being edited in both
                for (var j = editingLinesCnt; j >= 0; j--) {
                    var editLineNumber = startLineNumber + j;
                    queueLineEdit({
                        lineNumber: editLineNumber,
                        startColumn: (editLineNumber === startLineNumber ? startColumn : 1),
                        endColumn: (editLineNumber === endLineNumber ? endColumn : this.getLineMaxColumn(editLineNumber)),
                        text: (op.lines ? op.lines[j] : ''),
                        forceMoveMarkers: op.forceMoveMarkers
                    });
                }
                if (editingLinesCnt < deletingLinesCnt) {
                    // Must delete some lines
                    // Flush any pending line edits
                    flushLineEdits();
                    var spliceStartLineNumber = startLineNumber + editingLinesCnt;
                    var spliceStartColumn = this.getLineMaxColumn(spliceStartLineNumber);
                    var endLineRemains = this._lines[endLineNumber - 1].split(markersTracker, endColumn, false, tabSize);
                    this._invalidateLine(spliceStartLineNumber - 1);
                    var spliceCnt = endLineNumber - spliceStartLineNumber;
                    // Collect all these markers
                    var markersOnDeletedLines = [];
                    for (var j = 0; j < spliceCnt; j++) {
                        var deleteLineIndex = spliceStartLineNumber + j;
                        var deleteLineMarkers = this._lines[deleteLineIndex].getMarkers();
                        if (deleteLineMarkers) {
                            markersOnDeletedLines = markersOnDeletedLines.concat(deleteLineMarkers);
                        }
                    }
                    this._lines.splice(spliceStartLineNumber, spliceCnt);
                    if (this._lineStarts) {
                        // update prefix sum
                        this._lineStarts.removeValues(spliceStartLineNumber, spliceCnt);
                    }
                    // Reconstruct first line
                    this._lines[spliceStartLineNumber - 1].append(markersTracker, spliceStartLineNumber, endLineRemains, tabSize);
                    if (this._lineStarts) {
                        // update prefix sum
                        this._lineStarts.changeValue(spliceStartLineNumber - 1, this._lines[spliceStartLineNumber - 1].text.length + this._EOL.length);
                    }
                    // Update deleted markers
                    var deletedMarkersPosition = new position_1.Position(spliceStartLineNumber, spliceStartColumn);
                    for (var j = 0, lenJ = markersOnDeletedLines.length; j < lenJ; j++) {
                        markersOnDeletedLines[j].updatePosition(markersTracker, deletedMarkersPosition);
                    }
                    this._lines[spliceStartLineNumber - 1].addMarkers(markersOnDeletedLines);
                    rawContentChanges.push(new textModelEvents.ModelRawLineChanged(spliceStartLineNumber, this._lines[spliceStartLineNumber - 1].text));
                    rawContentChanges.push(new textModelEvents.ModelRawLinesDeleted(spliceStartLineNumber + 1, spliceStartLineNumber + spliceCnt));
                }
                if (editingLinesCnt < insertingLinesCnt) {
                    // Must insert some lines
                    // Flush any pending line edits
                    flushLineEdits();
                    var spliceLineNumber = startLineNumber + editingLinesCnt;
                    var spliceColumn = (spliceLineNumber === startLineNumber ? startColumn : 1);
                    if (op.lines) {
                        spliceColumn += op.lines[editingLinesCnt].length;
                    }
                    // Split last line
                    var leftoverLine = this._lines[spliceLineNumber - 1].split(markersTracker, spliceColumn, op.forceMoveMarkers, tabSize);
                    if (this._lineStarts) {
                        // update prefix sum
                        this._lineStarts.changeValue(spliceLineNumber - 1, this._lines[spliceLineNumber - 1].text.length + this._EOL.length);
                    }
                    rawContentChanges.push(new textModelEvents.ModelRawLineChanged(spliceLineNumber, this._lines[spliceLineNumber - 1].text));
                    this._invalidateLine(spliceLineNumber - 1);
                    // Lines in the middle
                    var newLines = [];
                    var newLinesContent = [];
                    var newLinesLengths = new Uint32Array(insertingLinesCnt - editingLinesCnt);
                    for (var j = editingLinesCnt + 1; j <= insertingLinesCnt; j++) {
                        newLines.push(this._createModelLine(op.lines[j], tabSize));
                        newLinesContent.push(op.lines[j]);
                        newLinesLengths[j - editingLinesCnt - 1] = op.lines[j].length + this._EOL.length;
                    }
                    this._lines = arrays.arrayInsert(this._lines, startLineNumber + editingLinesCnt, newLines);
                    newLinesContent[newLinesContent.length - 1] += leftoverLine.text;
                    if (this._lineStarts) {
                        // update prefix sum
                        this._lineStarts.insertValues(startLineNumber + editingLinesCnt, newLinesLengths);
                    }
                    // Last line
                    this._lines[startLineNumber + insertingLinesCnt - 1].append(markersTracker, startLineNumber + insertingLinesCnt, leftoverLine, tabSize);
                    if (this._lineStarts) {
                        // update prefix sum
                        this._lineStarts.changeValue(startLineNumber + insertingLinesCnt - 1, this._lines[startLineNumber + insertingLinesCnt - 1].text.length + this._EOL.length);
                    }
                    rawContentChanges.push(new textModelEvents.ModelRawLinesInserted(spliceLineNumber + 1, startLineNumber + insertingLinesCnt, newLinesContent.join('\n')));
                }
                contentChanges.push({
                    range: new range_1.Range(startLineNumber, startColumn, endLineNumber, endColumn),
                    rangeLength: op.rangeLength,
                    text: op.lines ? op.lines.join(this.getEOL()) : ''
                });
                // console.log('AFTER:');
                // console.log('<<<\n' + this._lines.map(l => l.text).join('\n') + '\n>>>');
            }
            flushLineEdits();
            maxTouchedLineNumber = Math.max(1, Math.min(this.getLineCount(), maxTouchedLineNumber + totalLinesCountDelta));
            if (totalLinesCountDelta !== 0) {
                // must update line numbers all the way to the bottom
                maxTouchedLineNumber = this.getLineCount();
            }
            for (var lineNumber = minTouchedLineNumber; lineNumber <= maxTouchedLineNumber; lineNumber++) {
                this._lines[lineNumber - 1].updateLineNumber(markersTracker, lineNumber);
            }
            if (rawContentChanges.length !== 0 || contentChanges.length !== 0) {
                this._increaseVersionId();
                this._emitModelRawContentChangedEvent(new textModelEvents.ModelRawContentChangedEvent(rawContentChanges, this.getVersionId(), this._isUndoing, this._isRedoing));
                var e = {
                    changes: contentChanges,
                    eol: this._EOL,
                    versionId: this.getVersionId(),
                    isUndoing: this._isUndoing,
                    isRedoing: this._isRedoing,
                    isFlush: false
                };
                this._eventEmitter.emit(textModelEvents.TextModelEventType.ModelContentChanged, e);
            }
            // this._assertLineNumbersOK();
            this._resetIndentRanges();
        };
        EditableTextModel.prototype._assertLineNumbersOK = function () {
            var foundMarkersCnt = 0;
            for (var i = 0, len = this._lines.length; i < len; i++) {
                var line = this._lines[i];
                var lineNumber = i + 1;
                var markers = line.getMarkers();
                if (markers !== null) {
                    for (var j = 0, lenJ = markers.length; j < lenJ; j++) {
                        foundMarkersCnt++;
                        var markerId = markers[j].id;
                        var marker = this._markerIdToMarker[markerId];
                        if (marker.position.lineNumber !== lineNumber) {
                            throw new Error('Misplaced marker with id ' + markerId);
                        }
                    }
                }
            }
            var totalMarkersCnt = Object.keys(this._markerIdToMarker).length;
            if (totalMarkersCnt !== foundMarkersCnt) {
                throw new Error('There are misplaced markers!');
            }
        };
        EditableTextModel.prototype._undo = function () {
            this._isUndoing = true;
            var r = this._commandManager.undo();
            this._isUndoing = false;
            if (!r) {
                return null;
            }
            this._overwriteAlternativeVersionId(r.recordedVersionId);
            return r.selections;
        };
        EditableTextModel.prototype.undo = function () {
            try {
                this._eventEmitter.beginDeferredEmit();
                this._acquireMarkersTracker();
                return this._undo();
            }
            finally {
                this._releaseMarkersTracker();
                this._eventEmitter.endDeferredEmit();
            }
        };
        EditableTextModel.prototype._redo = function () {
            this._isRedoing = true;
            var r = this._commandManager.redo();
            this._isRedoing = false;
            if (!r) {
                return null;
            }
            this._overwriteAlternativeVersionId(r.recordedVersionId);
            return r.selections;
        };
        EditableTextModel.prototype.redo = function () {
            try {
                this._eventEmitter.beginDeferredEmit();
                this._acquireMarkersTracker();
                return this._redo();
            }
            finally {
                this._releaseMarkersTracker();
                this._eventEmitter.endDeferredEmit();
            }
        };
        EditableTextModel.prototype.setEditableRange = function (range) {
            var _this = this;
            this._commandManager.clear();
            if (!this._hasEditableRange && !range) {
                // Nothing to do
                return;
            }
            this.changeDecorations(function (changeAccessor) {
                if (_this._hasEditableRange) {
                    changeAccessor.removeDecoration(_this._editableRangeId);
                    _this._editableRangeId = null;
                    _this._hasEditableRange = false;
                }
                if (range) {
                    _this._hasEditableRange = true;
                    _this._editableRangeId = changeAccessor.addDecoration(range, EditableTextModel._DECORATION_OPTION);
                }
            });
        };
        EditableTextModel.prototype.hasEditableRange = function () {
            return this._hasEditableRange;
        };
        EditableTextModel.prototype.getEditableRange = function () {
            if (this._hasEditableRange) {
                return this.getDecorationRange(this._editableRangeId);
            }
            else {
                return this.getFullModelRange();
            }
        };
        EditableTextModel._DECORATION_OPTION = textModelWithDecorations_1.ModelDecorationOptions.register({
            stickiness: editorCommon.TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges
        });
        return EditableTextModel;
    }(textModelWithDecorations_1.TextModelWithDecorations));
    exports.EditableTextModel = EditableTextModel;
});
//# sourceMappingURL=editableTextModel.js.map