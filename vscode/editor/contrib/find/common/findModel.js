define(["require", "exports", "vs/base/common/async", "vs/base/common/lifecycle", "vs/editor/contrib/find/common/replacePattern", "vs/editor/common/commands/replaceCommand", "vs/editor/common/core/position", "vs/editor/common/core/range", "vs/editor/common/editorCommon", "./findDecorations", "./replaceAllCommand", "vs/editor/common/core/selection", "vs/editor/common/model/textModelSearch", "vs/editor/common/controller/cursorEvents"], function (require, exports, async_1, lifecycle_1, replacePattern_1, replaceCommand_1, position_1, range_1, editorCommon, findDecorations_1, replaceAllCommand_1, selection_1, textModelSearch_1, cursorEvents_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ToggleCaseSensitiveKeybinding = {
        primary: 512 /* Alt */ | 33 /* KEY_C */,
        mac: { primary: 2048 /* CtrlCmd */ | 512 /* Alt */ | 33 /* KEY_C */ }
    };
    exports.ToggleWholeWordKeybinding = {
        primary: 512 /* Alt */ | 53 /* KEY_W */,
        mac: { primary: 2048 /* CtrlCmd */ | 512 /* Alt */ | 53 /* KEY_W */ }
    };
    exports.ToggleRegexKeybinding = {
        primary: 512 /* Alt */ | 48 /* KEY_R */,
        mac: { primary: 2048 /* CtrlCmd */ | 512 /* Alt */ | 48 /* KEY_R */ }
    };
    exports.ToggleSearchScopeKeybinding = {
        primary: 512 /* Alt */ | 42 /* KEY_L */,
        mac: { primary: 2048 /* CtrlCmd */ | 512 /* Alt */ | 42 /* KEY_L */ }
    };
    exports.ShowPreviousFindTermKeybinding = {
        primary: 512 /* Alt */ | 16 /* UpArrow */
    };
    exports.ShowNextFindTermKeybinding = {
        primary: 512 /* Alt */ | 18 /* DownArrow */
    };
    exports.FIND_IDS = {
        StartFindAction: 'actions.find',
        NextMatchFindAction: 'editor.action.nextMatchFindAction',
        PreviousMatchFindAction: 'editor.action.previousMatchFindAction',
        NextSelectionMatchFindAction: 'editor.action.nextSelectionMatchFindAction',
        PreviousSelectionMatchFindAction: 'editor.action.previousSelectionMatchFindAction',
        AddSelectionToNextFindMatchAction: 'editor.action.addSelectionToNextFindMatch',
        AddSelectionToPreviousFindMatchAction: 'editor.action.addSelectionToPreviousFindMatch',
        MoveSelectionToNextFindMatchAction: 'editor.action.moveSelectionToNextFindMatch',
        MoveSelectionToPreviousFindMatchAction: 'editor.action.moveSelectionToPreviousFindMatch',
        StartFindReplaceAction: 'editor.action.startFindReplaceAction',
        CloseFindWidgetCommand: 'closeFindWidget',
        ToggleCaseSensitiveCommand: 'toggleFindCaseSensitive',
        ToggleWholeWordCommand: 'toggleFindWholeWord',
        ToggleRegexCommand: 'toggleFindRegex',
        ToggleSearchScopeCommand: 'toggleFindInSelection',
        ReplaceOneAction: 'editor.action.replaceOne',
        ReplaceAllAction: 'editor.action.replaceAll',
        SelectAllMatchesAction: 'editor.action.selectAllMatches',
        ShowPreviousFindTermAction: 'find.history.showPrevious',
        ShowNextFindTermAction: 'find.history.showNext'
    };
    exports.MATCHES_LIMIT = 999;
    var FindModelBoundToEditorModel = (function () {
        function FindModelBoundToEditorModel(editor, state) {
            var _this = this;
            this._editor = editor;
            this._state = state;
            this._toDispose = [];
            this._isDisposed = false;
            this._decorations = new findDecorations_1.FindDecorations(editor);
            this._toDispose.push(this._decorations);
            this._updateDecorationsScheduler = new async_1.RunOnceScheduler(function () { return _this.research(false); }, 100);
            this._toDispose.push(this._updateDecorationsScheduler);
            this._toDispose.push(this._editor.onDidChangeCursorPosition(function (e) {
                if (e.reason === cursorEvents_1.CursorChangeReason.Explicit
                    || e.reason === cursorEvents_1.CursorChangeReason.Undo
                    || e.reason === cursorEvents_1.CursorChangeReason.Redo) {
                    _this._decorations.setStartPosition(_this._editor.getPosition());
                }
            }));
            this._ignoreModelContentChanged = false;
            this._toDispose.push(this._editor.onDidChangeModelContent(function (e) {
                if (_this._ignoreModelContentChanged) {
                    return;
                }
                if (e.isFlush) {
                    // a model.setValue() was called
                    _this._decorations.reset();
                }
                _this._decorations.setStartPosition(_this._editor.getPosition());
                _this._updateDecorationsScheduler.schedule();
            }));
            this._toDispose.push(this._state.addChangeListener(function (e) { return _this._onStateChanged(e); }));
            this.research(false, this._state.searchScope);
        }
        FindModelBoundToEditorModel.prototype.dispose = function () {
            this._isDisposed = true;
            this._toDispose = lifecycle_1.dispose(this._toDispose);
        };
        FindModelBoundToEditorModel.prototype._onStateChanged = function (e) {
            if (this._isDisposed) {
                // The find model is disposed during a find state changed event
                return;
            }
            if (e.searchString || e.isReplaceRevealed || e.isRegex || e.wholeWord || e.matchCase || e.searchScope) {
                if (e.searchScope) {
                    this.research(e.moveCursor, this._state.searchScope);
                }
                else {
                    this.research(e.moveCursor);
                }
            }
        };
        FindModelBoundToEditorModel._getSearchRange = function (model, searchOnlyEditableRange, findScope) {
            var searchRange;
            if (searchOnlyEditableRange) {
                searchRange = model.getEditableRange();
            }
            else {
                searchRange = model.getFullModelRange();
            }
            // If we have set now or before a find scope, use it for computing the search range
            if (findScope) {
                searchRange = searchRange.intersectRanges(findScope);
            }
            return searchRange;
        };
        FindModelBoundToEditorModel.prototype.research = function (moveCursor, newFindScope) {
            var findScope = null;
            if (typeof newFindScope !== 'undefined') {
                findScope = newFindScope;
            }
            else {
                findScope = this._decorations.getFindScope();
            }
            if (findScope !== null) {
                if (findScope.startLineNumber !== findScope.endLineNumber) {
                    // multiline find scope => expand to line starts / ends
                    findScope = new range_1.Range(findScope.startLineNumber, 1, findScope.endLineNumber, this._editor.getModel().getLineMaxColumn(findScope.endLineNumber));
                }
            }
            var findMatches = this._findMatches(findScope, false, exports.MATCHES_LIMIT);
            this._decorations.set(findMatches.map(function (match) { return match.range; }), findScope);
            this._state.changeMatchInfo(this._decorations.getCurrentMatchesPosition(this._editor.getSelection()), this._decorations.getCount(), undefined);
            if (moveCursor) {
                this._moveToNextMatch(this._decorations.getStartPosition());
            }
        };
        FindModelBoundToEditorModel.prototype._hasMatches = function () {
            return (this._state.matchesCount > 0);
        };
        FindModelBoundToEditorModel.prototype._cannotFind = function () {
            if (!this._hasMatches()) {
                var findScope = this._decorations.getFindScope();
                if (findScope) {
                    // Reveal the selection so user is reminded that 'selection find' is on.
                    this._editor.revealRangeInCenterIfOutsideViewport(findScope);
                }
                return true;
            }
            return false;
        };
        FindModelBoundToEditorModel.prototype._setCurrentFindMatch = function (match) {
            var matchesPosition = this._decorations.setCurrentFindMatch(match);
            this._state.changeMatchInfo(matchesPosition, this._decorations.getCount(), match);
            this._editor.setSelection(match);
            this._editor.revealRangeInCenterIfOutsideViewport(match);
        };
        FindModelBoundToEditorModel.prototype._moveToPrevMatch = function (before, isRecursed) {
            if (isRecursed === void 0) { isRecursed = false; }
            if (this._cannotFind()) {
                return;
            }
            var findScope = this._decorations.getFindScope();
            var searchRange = FindModelBoundToEditorModel._getSearchRange(this._editor.getModel(), this._state.isReplaceRevealed, findScope);
            // ...(----)...|...
            if (searchRange.getEndPosition().isBefore(before)) {
                before = searchRange.getEndPosition();
            }
            // ...|...(----)...
            if (before.isBefore(searchRange.getStartPosition())) {
                before = searchRange.getEndPosition();
            }
            var lineNumber = before.lineNumber, column = before.column;
            var model = this._editor.getModel();
            var position = new position_1.Position(lineNumber, column);
            var prevMatch = model.findPreviousMatch(this._state.searchString, position, this._state.isRegex, this._state.matchCase, this._state.wholeWord ? this._editor.getConfiguration().wordSeparators : null, false);
            if (prevMatch && prevMatch.range.isEmpty() && prevMatch.range.getStartPosition().equals(position)) {
                // Looks like we're stuck at this position, unacceptable!
                var isUsingLineStops = this._state.isRegex && (this._state.searchString.indexOf('^') >= 0
                    || this._state.searchString.indexOf('$') >= 0);
                if (isUsingLineStops || column === 1) {
                    if (lineNumber === 1) {
                        lineNumber = model.getLineCount();
                    }
                    else {
                        lineNumber--;
                    }
                    column = model.getLineMaxColumn(lineNumber);
                }
                else {
                    column--;
                }
                position = new position_1.Position(lineNumber, column);
                prevMatch = model.findPreviousMatch(this._state.searchString, position, this._state.isRegex, this._state.matchCase, this._state.wholeWord ? this._editor.getConfiguration().wordSeparators : null, false);
            }
            if (!prevMatch) {
                // there is precisely one match and selection is on top of it
                return null;
            }
            if (!isRecursed && !searchRange.containsRange(prevMatch.range)) {
                return this._moveToPrevMatch(prevMatch.range.getStartPosition(), true);
            }
            this._setCurrentFindMatch(prevMatch.range);
        };
        FindModelBoundToEditorModel.prototype.moveToPrevMatch = function () {
            this._moveToPrevMatch(this._editor.getSelection().getStartPosition());
        };
        FindModelBoundToEditorModel.prototype._moveToNextMatch = function (after) {
            var nextMatch = this._getNextMatch(after, false, true);
            if (nextMatch) {
                this._setCurrentFindMatch(nextMatch.range);
            }
        };
        FindModelBoundToEditorModel.prototype._getNextMatch = function (after, captureMatches, forceMove, isRecursed) {
            if (isRecursed === void 0) { isRecursed = false; }
            if (this._cannotFind()) {
                return null;
            }
            var findScope = this._decorations.getFindScope();
            var searchRange = FindModelBoundToEditorModel._getSearchRange(this._editor.getModel(), this._state.isReplaceRevealed, findScope);
            // ...(----)...|...
            if (searchRange.getEndPosition().isBefore(after)) {
                after = searchRange.getStartPosition();
            }
            // ...|...(----)...
            if (after.isBefore(searchRange.getStartPosition())) {
                after = searchRange.getStartPosition();
            }
            var lineNumber = after.lineNumber, column = after.column;
            var model = this._editor.getModel();
            var position = new position_1.Position(lineNumber, column);
            var nextMatch = model.findNextMatch(this._state.searchString, position, this._state.isRegex, this._state.matchCase, this._state.wholeWord ? this._editor.getConfiguration().wordSeparators : null, captureMatches);
            if (forceMove && nextMatch && nextMatch.range.isEmpty() && nextMatch.range.getStartPosition().equals(position)) {
                // Looks like we're stuck at this position, unacceptable!
                var isUsingLineStops = this._state.isRegex && (this._state.searchString.indexOf('^') >= 0
                    || this._state.searchString.indexOf('$') >= 0);
                if (isUsingLineStops || column === model.getLineMaxColumn(lineNumber)) {
                    if (lineNumber === model.getLineCount()) {
                        lineNumber = 1;
                    }
                    else {
                        lineNumber++;
                    }
                    column = 1;
                }
                else {
                    column++;
                }
                position = new position_1.Position(lineNumber, column);
                nextMatch = model.findNextMatch(this._state.searchString, position, this._state.isRegex, this._state.matchCase, this._state.wholeWord ? this._editor.getConfiguration().wordSeparators : null, captureMatches);
            }
            if (!nextMatch) {
                // there is precisely one match and selection is on top of it
                return null;
            }
            if (!isRecursed && !searchRange.containsRange(nextMatch.range)) {
                return this._getNextMatch(nextMatch.range.getEndPosition(), captureMatches, forceMove, true);
            }
            return nextMatch;
        };
        FindModelBoundToEditorModel.prototype.moveToNextMatch = function () {
            this._moveToNextMatch(this._editor.getSelection().getEndPosition());
        };
        FindModelBoundToEditorModel.prototype._getReplacePattern = function () {
            if (this._state.isRegex) {
                return replacePattern_1.parseReplaceString(this._state.replaceString);
            }
            return replacePattern_1.ReplacePattern.fromStaticValue(this._state.replaceString);
        };
        FindModelBoundToEditorModel.prototype.replace = function () {
            if (!this._hasMatches()) {
                return;
            }
            var replacePattern = this._getReplacePattern();
            var selection = this._editor.getSelection();
            var nextMatch = this._getNextMatch(selection.getStartPosition(), replacePattern.hasReplacementPatterns, false);
            if (nextMatch) {
                if (selection.equalsRange(nextMatch.range)) {
                    // selection sits on a find match => replace it!
                    var replaceString = replacePattern.buildReplaceString(nextMatch.matches);
                    var command = new replaceCommand_1.ReplaceCommand(selection, replaceString);
                    this._executeEditorCommand('replace', command);
                    this._decorations.setStartPosition(new position_1.Position(selection.startLineNumber, selection.startColumn + replaceString.length));
                    this.research(true);
                }
                else {
                    this._decorations.setStartPosition(this._editor.getPosition());
                    this._setCurrentFindMatch(nextMatch.range);
                }
            }
        };
        FindModelBoundToEditorModel.prototype._findMatches = function (findScope, captureMatches, limitResultCount) {
            var searchRange = FindModelBoundToEditorModel._getSearchRange(this._editor.getModel(), this._state.isReplaceRevealed, findScope);
            return this._editor.getModel().findMatches(this._state.searchString, searchRange, this._state.isRegex, this._state.matchCase, this._state.wholeWord ? this._editor.getConfiguration().wordSeparators : null, captureMatches, limitResultCount);
        };
        FindModelBoundToEditorModel.prototype.replaceAll = function () {
            if (!this._hasMatches()) {
                return;
            }
            var findScope = this._decorations.getFindScope();
            if (findScope === null && this._state.matchesCount >= exports.MATCHES_LIMIT) {
                // Doing a replace on the entire file that is over 1k matches
                this._largeReplaceAll();
            }
            else {
                this._regularReplaceAll(findScope);
            }
            this.research(false);
        };
        FindModelBoundToEditorModel.prototype._largeReplaceAll = function () {
            var searchParams = new textModelSearch_1.SearchParams(this._state.searchString, this._state.isRegex, this._state.matchCase, this._state.wholeWord ? this._editor.getConfiguration().wordSeparators : null);
            var searchData = searchParams.parseSearchRequest();
            if (!searchData) {
                return;
            }
            var model = this._editor.getModel();
            var modelText = model.getValue(editorCommon.EndOfLinePreference.LF);
            var fullModelRange = model.getFullModelRange();
            var replacePattern = this._getReplacePattern();
            var resultText;
            if (replacePattern.hasReplacementPatterns) {
                resultText = modelText.replace(searchData.regex, function () {
                    return replacePattern.buildReplaceString(arguments);
                });
            }
            else {
                resultText = modelText.replace(searchData.regex, replacePattern.buildReplaceString(null));
            }
            var command = new replaceCommand_1.ReplaceCommandThatPreservesSelection(fullModelRange, resultText, this._editor.getSelection());
            this._executeEditorCommand('replaceAll', command);
        };
        FindModelBoundToEditorModel.prototype._regularReplaceAll = function (findScope) {
            var replacePattern = this._getReplacePattern();
            // Get all the ranges (even more than the highlighted ones)
            var matches = this._findMatches(findScope, replacePattern.hasReplacementPatterns, 1073741824 /* MAX_SAFE_SMALL_INTEGER */);
            var replaceStrings = [];
            for (var i = 0, len = matches.length; i < len; i++) {
                replaceStrings[i] = replacePattern.buildReplaceString(matches[i].matches);
            }
            var command = new replaceAllCommand_1.ReplaceAllCommand(this._editor.getSelection(), matches.map(function (m) { return m.range; }), replaceStrings);
            this._executeEditorCommand('replaceAll', command);
        };
        FindModelBoundToEditorModel.prototype.selectAllMatches = function () {
            if (!this._hasMatches()) {
                return;
            }
            var findScope = this._decorations.getFindScope();
            // Get all the ranges (even more than the highlighted ones)
            var matches = this._findMatches(findScope, false, 1073741824 /* MAX_SAFE_SMALL_INTEGER */);
            var selections = matches.map(function (m) { return new selection_1.Selection(m.range.startLineNumber, m.range.startColumn, m.range.endLineNumber, m.range.endColumn); });
            // If one of the ranges is the editor selection, then maintain it as primary
            var editorSelection = this._editor.getSelection();
            for (var i = 0, len = selections.length; i < len; i++) {
                var sel = selections[i];
                if (sel.equalsRange(editorSelection)) {
                    selections = [editorSelection].concat(selections.slice(0, i)).concat(selections.slice(i + 1));
                    break;
                }
            }
            this._editor.setSelections(selections);
        };
        FindModelBoundToEditorModel.prototype._executeEditorCommand = function (source, command) {
            try {
                this._ignoreModelContentChanged = true;
                this._editor.pushUndoStop();
                this._editor.executeCommand(source, command);
                this._editor.pushUndoStop();
            }
            finally {
                this._ignoreModelContentChanged = false;
            }
        };
        return FindModelBoundToEditorModel;
    }());
    exports.FindModelBoundToEditorModel = FindModelBoundToEditorModel;
});
//# sourceMappingURL=findModel.js.map