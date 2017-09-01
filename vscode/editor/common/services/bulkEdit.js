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
define(["require", "exports", "vs/nls", "vs/base/common/arrays", "vs/base/common/collections", "vs/base/common/lifecycle", "vs/base/common/uri", "vs/base/common/winjs.base", "vs/editor/common/core/editOperation", "vs/editor/common/core/range", "vs/editor/common/core/selection"], function (require, exports, nls, arrays_1, collections_1, lifecycle_1, uri_1, winjs_base_1, editOperation_1, range_1, selection_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var ChangeRecorder = (function () {
        function ChangeRecorder(fileService) {
            this._fileService = fileService;
        }
        ChangeRecorder.prototype.start = function () {
            var changes = Object.create(null);
            var stop;
            if (this._fileService) {
                stop = this._fileService.onFileChanges(function (event) {
                    event.changes.forEach(function (change) {
                        var key = String(change.resource);
                        var array = changes[key];
                        if (!array) {
                            changes[key] = array = [];
                        }
                        array.push(change);
                    });
                });
            }
            return {
                stop: function () { return stop && stop.dispose(); },
                hasChanged: function (resource) { return !!changes[resource.toString()]; },
                allChanges: function () { return arrays_1.flatten(collections_1.values(changes)); }
            };
        };
        return ChangeRecorder;
    }());
    var EditTask = (function () {
        function EditTask(modelReference) {
            this._endCursorSelection = null;
            this._modelReference = modelReference;
            this._edits = [];
        }
        Object.defineProperty(EditTask.prototype, "_model", {
            get: function () { return this._modelReference.object.textEditorModel; },
            enumerable: true,
            configurable: true
        });
        EditTask.prototype.addEdit = function (edit) {
            if (typeof edit.newEol === 'number') {
                // honor eol-change
                this._newEol = edit.newEol;
            }
            if (edit.range || edit.newText) {
                // create edit operation
                var range = void 0;
                if (!edit.range) {
                    range = this._model.getFullModelRange();
                }
                else {
                    range = range_1.Range.lift(edit.range);
                }
                this._edits.push(editOperation_1.EditOperation.replaceMove(range, edit.newText));
            }
        };
        EditTask.prototype.apply = function () {
            var _this = this;
            if (this._edits.length > 0) {
                this._edits = this._edits.map(function (value, index) { return ({ value: value, index: index }); }).sort(function (a, b) {
                    var ret = range_1.Range.compareRangesUsingStarts(a.value.range, b.value.range);
                    if (ret === 0) {
                        ret = a.index - b.index;
                    }
                    return ret;
                }).map(function (element) { return element.value; });
                this._initialSelections = this._getInitialSelections();
                this._model.pushStackElement();
                this._model.pushEditOperations(this._initialSelections, this._edits, function (edits) { return _this._getEndCursorSelections(edits); });
                this._model.pushStackElement();
            }
            if (this._newEol !== undefined) {
                this._model.pushStackElement();
                this._model.setEOL(this._newEol);
                this._model.pushStackElement();
            }
        };
        EditTask.prototype._getInitialSelections = function () {
            var firstRange = this._edits[0].range;
            var initialSelection = new selection_1.Selection(firstRange.startLineNumber, firstRange.startColumn, firstRange.endLineNumber, firstRange.endColumn);
            return [initialSelection];
        };
        EditTask.prototype._getEndCursorSelections = function (inverseEditOperations) {
            var relevantEditIndex = 0;
            for (var i = 0; i < inverseEditOperations.length; i++) {
                var editRange = inverseEditOperations[i].range;
                for (var j = 0; j < this._initialSelections.length; j++) {
                    var selectionRange = this._initialSelections[j];
                    if (range_1.Range.areIntersectingOrTouching(editRange, selectionRange)) {
                        relevantEditIndex = i;
                        break;
                    }
                }
            }
            var srcRange = inverseEditOperations[relevantEditIndex].range;
            this._endCursorSelection = new selection_1.Selection(srcRange.endLineNumber, srcRange.endColumn, srcRange.endLineNumber, srcRange.endColumn);
            return [this._endCursorSelection];
        };
        EditTask.prototype.getEndCursorSelection = function () {
            return this._endCursorSelection;
        };
        EditTask.prototype.dispose = function () {
            if (this._model) {
                this._modelReference.dispose();
                this._modelReference = null;
            }
        };
        return EditTask;
    }());
    var SourceModelEditTask = (function (_super) {
        __extends(SourceModelEditTask, _super);
        function SourceModelEditTask(modelReference, initialSelections) {
            var _this = _super.call(this, modelReference) || this;
            _this._knownInitialSelections = initialSelections;
            return _this;
        }
        SourceModelEditTask.prototype._getInitialSelections = function () {
            return this._knownInitialSelections;
        };
        return SourceModelEditTask;
    }(EditTask));
    var BulkEditModel = (function () {
        function BulkEditModel(textModelResolverService, sourceModel, sourceSelections, edits, progress) {
            if (progress === void 0) { progress = null; }
            this.progress = progress;
            this._numberOfResourcesToModify = 0;
            this._numberOfChanges = 0;
            this._edits = Object.create(null);
            this._textModelResolverService = textModelResolverService;
            this._sourceModel = sourceModel;
            this._sourceSelections = sourceSelections;
            this._sourceModelTask = null;
            for (var _i = 0, edits_1 = edits; _i < edits_1.length; _i++) {
                var edit = edits_1[_i];
                this._addEdit(edit);
            }
        }
        BulkEditModel.prototype.resourcesCount = function () {
            return this._numberOfResourcesToModify;
        };
        BulkEditModel.prototype.changeCount = function () {
            return this._numberOfChanges;
        };
        BulkEditModel.prototype._addEdit = function (edit) {
            var array = this._edits[edit.resource.toString()];
            if (!array) {
                this._edits[edit.resource.toString()] = array = [];
                this._numberOfResourcesToModify += 1;
            }
            this._numberOfChanges += 1;
            array.push(edit);
        };
        BulkEditModel.prototype.prepare = function () {
            var _this = this;
            if (this._tasks) {
                throw new Error('illegal state - already prepared');
            }
            this._tasks = [];
            var promises = [];
            if (this.progress) {
                this.progress.total(this._numberOfResourcesToModify * 2);
            }
            collections_1.forEach(this._edits, function (entry) {
                var promise = _this._textModelResolverService.createModelReference(uri_1.default.parse(entry.key)).then(function (ref) {
                    var model = ref.object;
                    if (!model || !model.textEditorModel) {
                        throw new Error("Cannot load file " + entry.key);
                    }
                    var textEditorModel = model.textEditorModel;
                    var task;
                    if (_this._sourceModel && textEditorModel.uri.toString() === _this._sourceModel.toString()) {
                        _this._sourceModelTask = new SourceModelEditTask(ref, _this._sourceSelections);
                        task = _this._sourceModelTask;
                    }
                    else {
                        task = new EditTask(ref);
                    }
                    entry.value.forEach(function (edit) { return task.addEdit(edit); });
                    _this._tasks.push(task);
                    if (_this.progress) {
                        _this.progress.worked(1);
                    }
                });
                promises.push(promise);
            });
            return winjs_base_1.TPromise.join(promises).then(function (_) { return _this; });
        };
        BulkEditModel.prototype.apply = function () {
            var _this = this;
            this._tasks.forEach(function (task) { return _this.applyTask(task); });
            var r = null;
            if (this._sourceModelTask) {
                r = this._sourceModelTask.getEndCursorSelection();
            }
            return r;
        };
        BulkEditModel.prototype.applyTask = function (task) {
            task.apply();
            if (this.progress) {
                this.progress.worked(1);
            }
        };
        BulkEditModel.prototype.dispose = function () {
            this._tasks = lifecycle_1.dispose(this._tasks);
        };
        return BulkEditModel;
    }());
    function bulkEdit(textModelResolverService, editor, edits, fileService, progress) {
        if (progress === void 0) { progress = null; }
        var bulk = createBulkEdit(textModelResolverService, editor, fileService);
        bulk.add(edits);
        bulk.progress(progress);
        return bulk.finish();
    }
    exports.bulkEdit = bulkEdit;
    function createBulkEdit(textModelResolverService, editor, fileService) {
        var all = [];
        var recording = new ChangeRecorder(fileService).start();
        var progressRunner;
        function progress(progress) {
            progressRunner = progress;
        }
        function add(edits) {
            all.push.apply(all, edits);
        }
        function getConcurrentEdits() {
            var names;
            for (var _i = 0, all_1 = all; _i < all_1.length; _i++) {
                var edit = all_1[_i];
                if (recording.hasChanged(edit.resource)) {
                    if (!names) {
                        names = [];
                    }
                    names.push(edit.resource.fsPath);
                }
            }
            if (names) {
                return nls.localize('conflict', "These files have changed in the meantime: {0}", names.join(', '));
            }
            return undefined;
        }
        function finish() {
            if (all.length === 0) {
                return winjs_base_1.TPromise.as(undefined);
            }
            var concurrentEdits = getConcurrentEdits();
            if (concurrentEdits) {
                return winjs_base_1.TPromise.wrapError(new Error(concurrentEdits));
            }
            var uri;
            var selections;
            if (editor && editor.getModel()) {
                uri = editor.getModel().uri;
                selections = editor.getSelections();
            }
            var model = new BulkEditModel(textModelResolverService, uri, selections, all, progressRunner);
            return model.prepare().then(function (_) {
                var concurrentEdits = getConcurrentEdits();
                if (concurrentEdits) {
                    throw new Error(concurrentEdits);
                }
                recording.stop();
                var result = model.apply();
                model.dispose();
                return result;
            });
        }
        function ariaMessage() {
            var editCount = all.length;
            var resourceCount = collections_1.size(collections_1.groupBy(all, function (edit) { return edit.resource.toString(); }));
            if (editCount === 0) {
                return nls.localize('summary.0', "Made no edits");
            }
            else if (editCount > 1 && resourceCount > 1) {
                return nls.localize('summary.nm', "Made {0} text edits in {1} files", editCount, resourceCount);
            }
            else {
                return nls.localize('summary.n0', "Made {0} text edits in one file", editCount, resourceCount);
            }
        }
        return {
            progress: progress,
            add: add,
            finish: finish,
            ariaMessage: ariaMessage
        };
    }
    exports.createBulkEdit = createBulkEdit;
});
//# sourceMappingURL=bulkEdit.js.map