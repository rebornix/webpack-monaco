var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", "vs/editor/common/services/modelService", "vs/editor/common/editorCommon", "vs/base/common/strings", "vs/base/common/arrays", "vs/base/common/lifecycle", "vs/editor/common/services/codeEditorService", "vs/base/common/event", "../node/extHost.protocol", "./mainThreadEditor", "vs/workbench/services/textfile/common/textfiles", "vs/workbench/services/editor/common/editorService", "vs/workbench/api/electron-browser/extHostCustomers", "vs/workbench/api/electron-browser/mainThreadDocuments", "vs/workbench/api/electron-browser/mainThreadEditors", "vs/editor/common/services/modeService", "vs/platform/files/common/files", "vs/editor/common/services/resolverService", "vs/workbench/services/untitled/common/untitledEditorService", "vs/workbench/services/group/common/groupService", "vs/platform/telemetry/common/telemetry"], function (require, exports, modelService_1, editorCommon_1, strings_1, arrays_1, lifecycle_1, codeEditorService_1, event_1, extHost_protocol_1, mainThreadEditor_1, textfiles_1, editorService_1, extHostCustomers_1, mainThreadDocuments_1, mainThreadEditors_1, modeService_1, files_1, resolverService_1, untitledEditorService_1, groupService_1, telemetry_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var cmp;
    (function (cmp) {
        function compareModels(a, b) {
            return strings_1.compare(a.uri.toString(), b.uri.toString());
        }
        cmp.compareModels = compareModels;
        function compareEditors(a, b) {
            var ret = strings_1.compare(a.editor.getId(), b.editor.getId());
            if (ret === 0) {
                ret = strings_1.compare(a.document.uri.toString(), b.document.uri.toString());
            }
            return ret;
        }
        cmp.compareEditors = compareEditors;
    })(cmp || (cmp = {}));
    var EditorAndModel = (function () {
        function EditorAndModel(editor, document) {
            this.editor = editor;
            this.document = document;
            this.id = editor.getId() + "," + document.uri.toString();
        }
        return EditorAndModel;
    }());
    var DocumentAndEditorStateDelta = (function () {
        function DocumentAndEditorStateDelta(removedDocuments, addedDocuments, removedEditors, addedEditors, oldActiveEditor, newActiveEditor) {
            this.removedDocuments = removedDocuments;
            this.addedDocuments = addedDocuments;
            this.removedEditors = removedEditors;
            this.addedEditors = addedEditors;
            this.oldActiveEditor = oldActiveEditor;
            this.newActiveEditor = newActiveEditor;
            this.isEmpty = this.removedDocuments.length === 0
                && this.addedDocuments.length === 0
                && this.removedEditors.length === 0
                && this.addedEditors.length === 0
                && oldActiveEditor === newActiveEditor;
        }
        DocumentAndEditorStateDelta.prototype.toString = function () {
            var ret = 'DocumentAndEditorStateDelta\n';
            ret += "\tRemoved Documents: [" + this.removedDocuments.map(function (d) { return d.uri.toString(true); }).join(', ') + "]\n";
            ret += "\tAdded Documents: [" + this.addedDocuments.map(function (d) { return d.uri.toString(true); }).join(', ') + "]\n";
            ret += "\tRemoved Editors: [" + this.removedEditors.map(function (e) { return e.id; }).join(', ') + "]\n";
            ret += "\tAdded Editors: [" + this.addedEditors.map(function (e) { return e.id; }).join(', ') + "]\n";
            ret += "\tNew Active Editor: " + this.newActiveEditor + "\n";
            return ret;
        };
        return DocumentAndEditorStateDelta;
    }());
    var DocumentAndEditorState = (function () {
        function DocumentAndEditorState(documents, editors, activeEditor) {
            this.documents = documents;
            this.editors = editors;
            this.activeEditor = activeEditor;
            this.documents = documents.sort(cmp.compareModels);
            this.editors = editors.sort(cmp.compareEditors);
        }
        DocumentAndEditorState.compute = function (before, after) {
            if (!before) {
                return new DocumentAndEditorStateDelta([], after.documents, [], after.editors, undefined, after.activeEditor);
            }
            var documentDelta = arrays_1.delta(before.documents, after.documents, cmp.compareModels);
            var editorDelta = arrays_1.delta(before.editors, after.editors, cmp.compareEditors);
            var oldActiveEditor = before.activeEditor !== after.activeEditor ? before.activeEditor : undefined;
            var newActiveEditor = before.activeEditor !== after.activeEditor ? after.activeEditor : undefined;
            return new DocumentAndEditorStateDelta(documentDelta.removed, documentDelta.added, editorDelta.removed, editorDelta.added, oldActiveEditor, newActiveEditor);
        };
        return DocumentAndEditorState;
    }());
    var MainThreadDocumentAndEditorStateComputer = (function () {
        function MainThreadDocumentAndEditorStateComputer(_onDidChangeState, _modelService, _codeEditorService, _workbenchEditorService) {
            this._onDidChangeState = _onDidChangeState;
            this._modelService = _modelService;
            this._codeEditorService = _codeEditorService;
            this._workbenchEditorService = _workbenchEditorService;
            this._toDispose = [];
            this._toDisposeOnEditorRemove = new Map();
            this._modelService.onModelAdded(this._updateState, this, this._toDispose);
            this._modelService.onModelRemoved(this._updateState, this, this._toDispose);
            this._codeEditorService.onCodeEditorAdd(this._onDidAddEditor, this, this._toDispose);
            this._codeEditorService.onCodeEditorRemove(this._onDidRemoveEditor, this, this._toDispose);
            this._codeEditorService.listCodeEditors().forEach(this._onDidAddEditor, this);
            this._updateState();
        }
        MainThreadDocumentAndEditorStateComputer.prototype.dispose = function () {
            this._toDispose = lifecycle_1.dispose(this._toDispose);
        };
        MainThreadDocumentAndEditorStateComputer.prototype._onDidAddEditor = function (e) {
            var _this = this;
            this._toDisposeOnEditorRemove.set(e.getId(), e.onDidChangeModel(function () { return _this._updateState(); }));
            this._toDisposeOnEditorRemove.set(e.getId(), e.onDidFocusEditor(function () { return _this._updateState(); }));
            this._toDisposeOnEditorRemove.set(e.getId(), e.onDidBlurEditor(function () { return _this._updateState(); }));
            this._updateState();
        };
        MainThreadDocumentAndEditorStateComputer.prototype._onDidRemoveEditor = function (e) {
            var sub = this._toDisposeOnEditorRemove.get(e.getId());
            if (sub) {
                this._toDisposeOnEditorRemove.delete(e.getId());
                sub.dispose();
                this._updateState();
            }
        };
        MainThreadDocumentAndEditorStateComputer.prototype._updateState = function () {
            // models: ignore too large models
            var models = this._modelService.getModels();
            for (var i = 0; i < models.length; i++) {
                if (models[i].isTooLargeForHavingARichMode()) {
                    models.splice(i, 1);
                    i--;
                }
            }
            // editor: only take those that have a not too large model
            var editors = [];
            var activeEditor = null;
            for (var _i = 0, _a = this._codeEditorService.listCodeEditors(); _i < _a.length; _i++) {
                var editor = _a[_i];
                var model = editor.getModel();
                if (model && !model.isTooLargeForHavingARichMode()
                    && !model.isDisposed() // model disposed
                    && Boolean(this._modelService.getModel(model.uri)) // model disposing, the flag didn't flip yet but the model service already removed it
                ) {
                    var apiEditor = new EditorAndModel(editor, model);
                    editors.push(apiEditor);
                    if (editor.isFocused()) {
                        activeEditor = apiEditor.id;
                    }
                }
            }
            // active editor: if none of the previous editors had focus we try
            // to match the action workbench editor with one of editor we have
            // just computed
            if (!activeEditor) {
                var workbenchEditor = this._workbenchEditorService.getActiveEditor();
                if (workbenchEditor) {
                    var workbenchEditorControl = workbenchEditor.getControl();
                    var candidate = void 0;
                    if (editorCommon_1.isCommonCodeEditor(workbenchEditorControl)) {
                        candidate = workbenchEditorControl;
                    }
                    else if (editorCommon_1.isCommonDiffEditor(workbenchEditorControl)) {
                        candidate = workbenchEditorControl.getModifiedEditor();
                    }
                    if (candidate) {
                        for (var _b = 0, editors_1 = editors; _b < editors_1.length; _b++) {
                            var _c = editors_1[_b], editor = _c.editor, id = _c.id;
                            if (candidate === editor) {
                                activeEditor = id;
                                break;
                            }
                        }
                    }
                }
            }
            // compute new state and compare against old
            var newState = new DocumentAndEditorState(models, editors, activeEditor);
            var delta = DocumentAndEditorState.compute(this._currentState, newState);
            if (!delta.isEmpty) {
                this._currentState = newState;
                this._onDidChangeState(delta);
            }
        };
        MainThreadDocumentAndEditorStateComputer = __decorate([
            __param(1, modelService_1.IModelService),
            __param(2, codeEditorService_1.ICodeEditorService),
            __param(3, editorService_1.IWorkbenchEditorService)
        ], MainThreadDocumentAndEditorStateComputer);
        return MainThreadDocumentAndEditorStateComputer;
    }());
    var MainThreadDocumentsAndEditors = (function () {
        function MainThreadDocumentsAndEditors(extHostContext, _modelService, _textFileService, _workbenchEditorService, codeEditorService, modeService, fileService, textModelResolverService, untitledEditorService, editorGroupService, telemetryService) {
            var _this = this;
            this._modelService = _modelService;
            this._textFileService = _textFileService;
            this._workbenchEditorService = _workbenchEditorService;
            this._editors = Object.create(null);
            this._onTextEditorAdd = new event_1.Emitter();
            this._onTextEditorRemove = new event_1.Emitter();
            this._onDocumentAdd = new event_1.Emitter();
            this._onDocumentRemove = new event_1.Emitter();
            this.onTextEditorAdd = this._onTextEditorAdd.event;
            this.onTextEditorRemove = this._onTextEditorRemove.event;
            this.onDocumentAdd = this._onDocumentAdd.event;
            this.onDocumentRemove = this._onDocumentRemove.event;
            this._proxy = extHostContext.get(extHost_protocol_1.ExtHostContext.ExtHostDocumentsAndEditors);
            var mainThreadDocuments = new mainThreadDocuments_1.MainThreadDocuments(this, extHostContext, this._modelService, modeService, this._textFileService, fileService, textModelResolverService, untitledEditorService);
            extHostContext.set(extHost_protocol_1.MainContext.MainThreadDocuments, mainThreadDocuments);
            var mainThreadEditors = new mainThreadEditors_1.MainThreadEditors(this, extHostContext, codeEditorService, this._workbenchEditorService, editorGroupService, telemetryService);
            extHostContext.set(extHost_protocol_1.MainContext.MainThreadEditors, mainThreadEditors);
            // It is expected that the ctor of the state computer calls our `_onDelta`.
            this._stateComputer = new MainThreadDocumentAndEditorStateComputer(function (delta) { return _this._onDelta(delta); }, _modelService, codeEditorService, _workbenchEditorService);
            this._toDispose = [
                mainThreadDocuments,
                mainThreadEditors,
                this._stateComputer,
                this._onTextEditorAdd,
                this._onTextEditorRemove,
                this._onDocumentAdd,
                this._onDocumentRemove,
            ];
        }
        MainThreadDocumentsAndEditors.prototype.dispose = function () {
            this._toDispose = lifecycle_1.dispose(this._toDispose);
        };
        MainThreadDocumentsAndEditors.prototype._onDelta = function (delta) {
            var _this = this;
            var removedDocuments;
            var removedEditors = [];
            var addedEditors = [];
            // removed models
            removedDocuments = delta.removedDocuments.map(function (m) { return m.uri.toString(); });
            // added editors
            for (var _i = 0, _a = delta.addedEditors; _i < _a.length; _i++) {
                var apiEditor = _a[_i];
                var mainThreadEditor = new mainThreadEditor_1.MainThreadTextEditor(apiEditor.id, apiEditor.document, apiEditor.editor, { onGainedFocus: function () { }, onLostFocus: function () { } }, this._modelService);
                this._editors[apiEditor.id] = mainThreadEditor;
                addedEditors.push(mainThreadEditor);
            }
            // removed editors
            for (var _b = 0, _c = delta.removedEditors; _b < _c.length; _b++) {
                var id = _c[_b].id;
                var mainThreadEditor = this._editors[id];
                if (mainThreadEditor) {
                    mainThreadEditor.dispose();
                    delete this._editors[id];
                    removedEditors.push(id);
                }
            }
            var extHostDelta = Object.create(null);
            var empty = true;
            if (delta.newActiveEditor !== undefined) {
                empty = false;
                extHostDelta.newActiveEditor = delta.newActiveEditor;
            }
            if (removedDocuments.length > 0) {
                empty = false;
                extHostDelta.removedDocuments = removedDocuments;
            }
            if (removedEditors.length > 0) {
                empty = false;
                extHostDelta.removedEditors = removedEditors;
            }
            if (delta.addedDocuments.length > 0) {
                empty = false;
                extHostDelta.addedDocuments = delta.addedDocuments.map(function (m) { return _this._toModelAddData(m); });
            }
            if (delta.addedEditors.length > 0) {
                empty = false;
                extHostDelta.addedEditors = addedEditors.map(function (e) { return _this._toTextEditorAddData(e); });
            }
            if (!empty) {
                // first update ext host
                this._proxy.$acceptDocumentsAndEditorsDelta(extHostDelta);
                // second update dependent state listener
                this._onDocumentRemove.fire(removedDocuments);
                this._onDocumentAdd.fire(delta.addedDocuments);
                this._onTextEditorRemove.fire(removedEditors);
                this._onTextEditorAdd.fire(addedEditors);
            }
        };
        MainThreadDocumentsAndEditors.prototype._toModelAddData = function (model) {
            return {
                url: model.uri,
                versionId: model.getVersionId(),
                lines: model.getLinesContent(),
                EOL: model.getEOL(),
                modeId: model.getLanguageIdentifier().language,
                isDirty: this._textFileService.isDirty(model.uri)
            };
        };
        MainThreadDocumentsAndEditors.prototype._toTextEditorAddData = function (textEditor) {
            return {
                id: textEditor.getId(),
                document: textEditor.getModel().uri,
                options: textEditor.getConfiguration(),
                selections: textEditor.getSelections(),
                editorPosition: this._findEditorPosition(textEditor)
            };
        };
        MainThreadDocumentsAndEditors.prototype._findEditorPosition = function (editor) {
            for (var _i = 0, _a = this._workbenchEditorService.getVisibleEditors(); _i < _a.length; _i++) {
                var workbenchEditor = _a[_i];
                if (editor.matches(workbenchEditor)) {
                    return workbenchEditor.position;
                }
            }
            return undefined;
        };
        MainThreadDocumentsAndEditors.prototype.findTextEditorIdFor = function (editor) {
            for (var id in this._editors) {
                if (this._editors[id].matches(editor)) {
                    return id;
                }
            }
            return undefined;
        };
        MainThreadDocumentsAndEditors.prototype.getEditor = function (id) {
            return this._editors[id];
        };
        MainThreadDocumentsAndEditors = __decorate([
            extHostCustomers_1.extHostCustomer,
            __param(1, modelService_1.IModelService),
            __param(2, textfiles_1.ITextFileService),
            __param(3, editorService_1.IWorkbenchEditorService),
            __param(4, codeEditorService_1.ICodeEditorService),
            __param(5, modeService_1.IModeService),
            __param(6, files_1.IFileService),
            __param(7, resolverService_1.ITextModelService),
            __param(8, untitledEditorService_1.IUntitledEditorService),
            __param(9, groupService_1.IEditorGroupService),
            __param(10, telemetry_1.ITelemetryService)
        ], MainThreadDocumentsAndEditors);
        return MainThreadDocumentsAndEditors;
    }());
    exports.MainThreadDocumentsAndEditors = MainThreadDocumentsAndEditors;
});
//# sourceMappingURL=mainThreadDocumentsAndEditors.js.map