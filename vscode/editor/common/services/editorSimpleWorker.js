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
define(["require", "exports", "vs/base/common/uri", "vs/base/common/winjs.base", "vs/editor/common/core/range", "vs/editor/common/diff/diffComputer", "vs/base/common/diff/diff", "vs/editor/common/core/position", "vs/editor/common/model/mirrorModel", "vs/editor/common/modes/linkComputer", "vs/editor/common/modes/supports/inplaceReplaceSupport", "vs/editor/common/model/wordHelper", "vs/editor/common/standalone/standaloneBase"], function (require, exports, uri_1, winjs_base_1, range_1, diffComputer_1, diff_1, position_1, mirrorModel_1, linkComputer_1, inplaceReplaceSupport_1, wordHelper_1, standaloneBase_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @internal
     */
    var MirrorModel = (function (_super) {
        __extends(MirrorModel, _super);
        function MirrorModel() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(MirrorModel.prototype, "uri", {
            get: function () {
                return this._uri;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MirrorModel.prototype, "version", {
            get: function () {
                return this._versionId;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MirrorModel.prototype, "eol", {
            get: function () {
                return this._eol;
            },
            enumerable: true,
            configurable: true
        });
        MirrorModel.prototype.getValue = function () {
            return this.getText();
        };
        MirrorModel.prototype.getLinesContent = function () {
            return this._lines.slice(0);
        };
        MirrorModel.prototype.getLineCount = function () {
            return this._lines.length;
        };
        MirrorModel.prototype.getLineContent = function (lineNumber) {
            return this._lines[lineNumber - 1];
        };
        MirrorModel.prototype.getWordAtPosition = function (position, wordDefinition) {
            var wordAtText = wordHelper_1.getWordAtText(position.column, wordHelper_1.ensureValidWordDefinition(wordDefinition), this._lines[position.lineNumber - 1], 0);
            if (wordAtText) {
                return new range_1.Range(position.lineNumber, wordAtText.startColumn, position.lineNumber, wordAtText.endColumn);
            }
            return null;
        };
        MirrorModel.prototype.getWordUntilPosition = function (position, wordDefinition) {
            var wordAtPosition = this.getWordAtPosition(position, wordDefinition);
            if (!wordAtPosition) {
                return {
                    word: '',
                    startColumn: position.column,
                    endColumn: position.column
                };
            }
            return {
                word: this._lines[position.lineNumber - 1].substring(wordAtPosition.startColumn - 1, position.column - 1),
                startColumn: wordAtPosition.startColumn,
                endColumn: position.column
            };
        };
        MirrorModel.prototype._getAllWords = function (wordDefinition) {
            var _this = this;
            var result = [];
            this._lines.forEach(function (line) {
                _this._wordenize(line, wordDefinition).forEach(function (info) {
                    result.push(line.substring(info.start, info.end));
                });
            });
            return result;
        };
        MirrorModel.prototype.getAllUniqueWords = function (wordDefinition, skipWordOnce) {
            var foundSkipWord = false;
            var uniqueWords = Object.create(null);
            return this._getAllWords(wordDefinition).filter(function (word) {
                if (skipWordOnce && !foundSkipWord && skipWordOnce === word) {
                    foundSkipWord = true;
                    return false;
                }
                else if (uniqueWords[word]) {
                    return false;
                }
                else {
                    uniqueWords[word] = true;
                    return true;
                }
            });
        };
        MirrorModel.prototype._wordenize = function (content, wordDefinition) {
            var result = [];
            var match;
            wordDefinition.lastIndex = 0; // reset lastIndex just to be sure
            while (match = wordDefinition.exec(content)) {
                if (match[0].length === 0) {
                    // it did match the empty string
                    break;
                }
                result.push({ start: match.index, end: match.index + match[0].length });
            }
            return result;
        };
        MirrorModel.prototype.getValueInRange = function (range) {
            range = this._validateRange(range);
            if (range.startLineNumber === range.endLineNumber) {
                return this._lines[range.startLineNumber - 1].substring(range.startColumn - 1, range.endColumn - 1);
            }
            var lineEnding = this._eol, startLineIndex = range.startLineNumber - 1, endLineIndex = range.endLineNumber - 1, resultLines = [];
            resultLines.push(this._lines[startLineIndex].substring(range.startColumn - 1));
            for (var i = startLineIndex + 1; i < endLineIndex; i++) {
                resultLines.push(this._lines[i]);
            }
            resultLines.push(this._lines[endLineIndex].substring(0, range.endColumn - 1));
            return resultLines.join(lineEnding);
        };
        MirrorModel.prototype.offsetAt = function (position) {
            position = this._validatePosition(position);
            this._ensureLineStarts();
            return this._lineStarts.getAccumulatedValue(position.lineNumber - 2) + (position.column - 1);
        };
        MirrorModel.prototype.positionAt = function (offset) {
            offset = Math.floor(offset);
            offset = Math.max(0, offset);
            this._ensureLineStarts();
            var out = this._lineStarts.getIndexOf(offset);
            var lineLength = this._lines[out.index].length;
            // Ensure we return a valid position
            return {
                lineNumber: 1 + out.index,
                column: 1 + Math.min(out.remainder, lineLength)
            };
        };
        MirrorModel.prototype._validateRange = function (range) {
            var start = this._validatePosition({ lineNumber: range.startLineNumber, column: range.startColumn });
            var end = this._validatePosition({ lineNumber: range.endLineNumber, column: range.endColumn });
            if (start.lineNumber !== range.startLineNumber
                || start.column !== range.startColumn
                || end.lineNumber !== range.endLineNumber
                || end.column !== range.endColumn) {
                return {
                    startLineNumber: start.lineNumber,
                    startColumn: start.column,
                    endLineNumber: end.lineNumber,
                    endColumn: end.column
                };
            }
            return range;
        };
        MirrorModel.prototype._validatePosition = function (position) {
            if (!position_1.Position.isIPosition(position)) {
                throw new Error('bad position');
            }
            var lineNumber = position.lineNumber, column = position.column;
            var hasChanged = false;
            if (lineNumber < 1) {
                lineNumber = 1;
                column = 1;
                hasChanged = true;
            }
            else if (lineNumber > this._lines.length) {
                lineNumber = this._lines.length;
                column = this._lines[lineNumber - 1].length + 1;
                hasChanged = true;
            }
            else {
                var maxCharacter = this._lines[lineNumber - 1].length + 1;
                if (column < 1) {
                    column = 1;
                    hasChanged = true;
                }
                else if (column > maxCharacter) {
                    column = maxCharacter;
                    hasChanged = true;
                }
            }
            if (!hasChanged) {
                return position;
            }
            else {
                return { lineNumber: lineNumber, column: column };
            }
        };
        return MirrorModel;
    }(mirrorModel_1.MirrorModel));
    /**
     * @internal
     */
    var BaseEditorSimpleWorker = (function () {
        function BaseEditorSimpleWorker() {
            this._foreignModule = null;
        }
        // ---- BEGIN diff --------------------------------------------------------------------------
        BaseEditorSimpleWorker.prototype.computeDiff = function (originalUrl, modifiedUrl, ignoreTrimWhitespace) {
            var original = this._getModel(originalUrl);
            var modified = this._getModel(modifiedUrl);
            if (!original || !modified) {
                return null;
            }
            var originalLines = original.getLinesContent();
            var modifiedLines = modified.getLinesContent();
            var diffComputer = new diffComputer_1.DiffComputer(originalLines, modifiedLines, {
                shouldPostProcessCharChanges: true,
                shouldIgnoreTrimWhitespace: ignoreTrimWhitespace,
                shouldConsiderTrimWhitespaceInEmptyCase: true,
                shouldMakePrettyDiff: true
            });
            return winjs_base_1.TPromise.as(diffComputer.computeDiff());
        };
        BaseEditorSimpleWorker.prototype.computeDirtyDiff = function (originalUrl, modifiedUrl, ignoreTrimWhitespace) {
            var original = this._getModel(originalUrl);
            var modified = this._getModel(modifiedUrl);
            if (!original || !modified) {
                return null;
            }
            var originalLines = original.getLinesContent();
            var modifiedLines = modified.getLinesContent();
            var diffComputer = new diffComputer_1.DiffComputer(originalLines, modifiedLines, {
                shouldPostProcessCharChanges: false,
                shouldIgnoreTrimWhitespace: ignoreTrimWhitespace,
                shouldConsiderTrimWhitespaceInEmptyCase: false,
                shouldMakePrettyDiff: true
            });
            return winjs_base_1.TPromise.as(diffComputer.computeDiff());
        };
        BaseEditorSimpleWorker.prototype.computeMoreMinimalEdits = function (modelUrl, edits, ranges) {
            var model = this._getModel(modelUrl);
            if (!model) {
                return winjs_base_1.TPromise.as(edits);
            }
            var result = [];
            var lastEol;
            for (var _i = 0, edits_1 = edits; _i < edits_1.length; _i++) {
                var _a = edits_1[_i], range = _a.range, text = _a.text, eol = _a.eol;
                if (typeof eol === 'number') {
                    lastEol = eol;
                }
                if (!range) {
                    // eol-change only
                    continue;
                }
                var original = model.getValueInRange(range);
                text = text.replace(/\r\n|\n|\r/g, model.eol);
                if (original === text) {
                    // noop
                    continue;
                }
                // make sure diff won't take too long
                if (Math.max(text.length, original.length) > BaseEditorSimpleWorker._diffLimit) {
                    result.push({ range: range, text: text });
                    continue;
                }
                // compute diff between original and edit.text
                var changes = diff_1.stringDiff(original, text, false);
                var editOffset = model.offsetAt(range_1.Range.lift(range).getStartPosition());
                for (var _b = 0, changes_1 = changes; _b < changes_1.length; _b++) {
                    var change = changes_1[_b];
                    var start = model.positionAt(editOffset + change.originalStart);
                    var end = model.positionAt(editOffset + change.originalStart + change.originalLength);
                    var newEdit = {
                        text: text.substr(change.modifiedStart, change.modifiedLength),
                        range: { startLineNumber: start.lineNumber, startColumn: start.column, endLineNumber: end.lineNumber, endColumn: end.column }
                    };
                    if (model.getValueInRange(newEdit.range) !== newEdit.text) {
                        result.push(newEdit);
                    }
                }
            }
            if (typeof lastEol === 'number') {
                result.push({ eol: lastEol, text: undefined, range: undefined });
            }
            return winjs_base_1.TPromise.as(result);
        };
        // ---- END minimal edits ---------------------------------------------------------------
        BaseEditorSimpleWorker.prototype.computeLinks = function (modelUrl) {
            var model = this._getModel(modelUrl);
            if (!model) {
                return null;
            }
            return winjs_base_1.TPromise.as(linkComputer_1.computeLinks(model));
        };
        // ---- BEGIN suggest --------------------------------------------------------------------------
        BaseEditorSimpleWorker.prototype.textualSuggest = function (modelUrl, position, wordDef, wordDefFlags) {
            var model = this._getModel(modelUrl);
            if (model) {
                var suggestions = [];
                var wordDefRegExp = new RegExp(wordDef, wordDefFlags);
                var currentWord = model.getWordUntilPosition(position, wordDefRegExp).word;
                for (var _i = 0, _a = model.getAllUniqueWords(wordDefRegExp); _i < _a.length; _i++) {
                    var word = _a[_i];
                    if (word !== currentWord && isNaN(Number(word))) {
                        suggestions.push({
                            type: 'text',
                            label: word,
                            insertText: word,
                            noAutoAccept: true,
                            overwriteBefore: currentWord.length
                        });
                    }
                }
                return winjs_base_1.TPromise.as({ suggestions: suggestions });
            }
            return undefined;
        };
        // ---- END suggest --------------------------------------------------------------------------
        BaseEditorSimpleWorker.prototype.navigateValueSet = function (modelUrl, range, up, wordDef, wordDefFlags) {
            var model = this._getModel(modelUrl);
            if (!model) {
                return null;
            }
            var wordDefRegExp = new RegExp(wordDef, wordDefFlags);
            if (range.startColumn === range.endColumn) {
                range = {
                    startLineNumber: range.startLineNumber,
                    startColumn: range.startColumn,
                    endLineNumber: range.endLineNumber,
                    endColumn: range.endColumn + 1
                };
            }
            var selectionText = model.getValueInRange(range);
            var wordRange = model.getWordAtPosition({ lineNumber: range.startLineNumber, column: range.startColumn }, wordDefRegExp);
            var word = null;
            if (wordRange !== null) {
                word = model.getValueInRange(wordRange);
            }
            var result = inplaceReplaceSupport_1.BasicInplaceReplace.INSTANCE.navigateValueSet(range, selectionText, wordRange, word, up);
            return winjs_base_1.TPromise.as(result);
        };
        // ---- BEGIN foreign module support --------------------------------------------------------------------------
        BaseEditorSimpleWorker.prototype.loadForeignModule = function (moduleId, createData) {
            var _this = this;
            return new winjs_base_1.TPromise(function (c, e) {
                // Use the global require to be sure to get the global config
                self.require([moduleId], function (foreignModule) {
                    var ctx = {
                        getMirrorModels: function () {
                            return _this._getModels();
                        }
                    };
                    _this._foreignModule = foreignModule.create(ctx, createData);
                    var methods = [];
                    for (var prop in _this._foreignModule) {
                        if (typeof _this._foreignModule[prop] === 'function') {
                            methods.push(prop);
                        }
                    }
                    c(methods);
                }, e);
            });
        };
        // foreign method request
        BaseEditorSimpleWorker.prototype.fmr = function (method, args) {
            if (!this._foreignModule || typeof this._foreignModule[method] !== 'function') {
                return winjs_base_1.TPromise.wrapError(new Error('Missing requestHandler or method: ' + method));
            }
            try {
                return winjs_base_1.TPromise.as(this._foreignModule[method].apply(this._foreignModule, args));
            }
            catch (e) {
                return winjs_base_1.TPromise.wrapError(e);
            }
        };
        // ---- END diff --------------------------------------------------------------------------
        // ---- BEGIN minimal edits ---------------------------------------------------------------
        BaseEditorSimpleWorker._diffLimit = 10000;
        return BaseEditorSimpleWorker;
    }());
    exports.BaseEditorSimpleWorker = BaseEditorSimpleWorker;
    /**
     * @internal
     */
    var EditorSimpleWorkerImpl = (function (_super) {
        __extends(EditorSimpleWorkerImpl, _super);
        function EditorSimpleWorkerImpl() {
            var _this = _super.call(this) || this;
            _this._models = Object.create(null);
            return _this;
        }
        EditorSimpleWorkerImpl.prototype.dispose = function () {
            this._models = Object.create(null);
        };
        EditorSimpleWorkerImpl.prototype._getModel = function (uri) {
            return this._models[uri];
        };
        EditorSimpleWorkerImpl.prototype._getModels = function () {
            var _this = this;
            var all = [];
            Object.keys(this._models).forEach(function (key) { return all.push(_this._models[key]); });
            return all;
        };
        EditorSimpleWorkerImpl.prototype.acceptNewModel = function (data) {
            this._models[data.url] = new MirrorModel(uri_1.default.parse(data.url), data.lines, data.EOL, data.versionId);
        };
        EditorSimpleWorkerImpl.prototype.acceptModelChanged = function (strURL, e) {
            if (!this._models[strURL]) {
                return;
            }
            var model = this._models[strURL];
            model.onEvents(e);
        };
        EditorSimpleWorkerImpl.prototype.acceptRemovedModel = function (strURL) {
            if (!this._models[strURL]) {
                return;
            }
            delete this._models[strURL];
        };
        return EditorSimpleWorkerImpl;
    }(BaseEditorSimpleWorker));
    exports.EditorSimpleWorkerImpl = EditorSimpleWorkerImpl;
    /**
     * Called on the worker side
     * @internal
     */
    function create() {
        return new EditorSimpleWorkerImpl();
    }
    exports.create = create;
    var global = self;
    var isWebWorker = (typeof global.importScripts === 'function');
    if (isWebWorker) {
        global.monaco = standaloneBase_1.createMonacoBaseAPI();
    }
});
//# sourceMappingURL=editorSimpleWorker.js.map