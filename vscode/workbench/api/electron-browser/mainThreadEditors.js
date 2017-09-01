var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", "vs/base/common/lifecycle", "vs/base/common/errors", "vs/base/common/winjs.base", "vs/editor/common/services/codeEditorService", "vs/workbench/services/editor/common/editorService", "vs/workbench/services/group/common/groupService", "vs/platform/telemetry/common/telemetry", "vs/base/common/objects", "../node/extHost.protocol"], function (require, exports, lifecycle_1, errors_1, winjs_base_1, codeEditorService_1, editorService_1, groupService_1, telemetry_1, objects_1, extHost_protocol_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var MainThreadEditors = (function () {
        function MainThreadEditors(documentsAndEditors, extHostContext, _codeEditorService, workbenchEditorService, editorGroupService, telemetryService) {
            var _this = this;
            this._codeEditorService = _codeEditorService;
            this._proxy = extHostContext.get(extHost_protocol_1.ExtHostContext.ExtHostEditors);
            this._documentsAndEditors = documentsAndEditors;
            this._workbenchEditorService = workbenchEditorService;
            this._telemetryService = telemetryService;
            this._toDispose = [];
            this._textEditorsListenersMap = Object.create(null);
            this._editorPositionData = null;
            this._toDispose.push(documentsAndEditors.onTextEditorAdd(function (editors) { return editors.forEach(_this._onTextEditorAdd, _this); }));
            this._toDispose.push(documentsAndEditors.onTextEditorRemove(function (editors) { return editors.forEach(_this._onTextEditorRemove, _this); }));
            this._toDispose.push(editorGroupService.onEditorsChanged(function () { return _this._updateActiveAndVisibleTextEditors(); }));
            this._toDispose.push(editorGroupService.onEditorsMoved(function () { return _this._updateActiveAndVisibleTextEditors(); }));
        }
        MainThreadEditors.prototype.dispose = function () {
            var _this = this;
            Object.keys(this._textEditorsListenersMap).forEach(function (editorId) {
                lifecycle_1.dispose(_this._textEditorsListenersMap[editorId]);
            });
            this._textEditorsListenersMap = Object.create(null);
            this._toDispose = lifecycle_1.dispose(this._toDispose);
        };
        MainThreadEditors.prototype._onTextEditorAdd = function (textEditor) {
            var _this = this;
            var id = textEditor.getId();
            var toDispose = [];
            toDispose.push(textEditor.onConfigurationChanged(function (opts) {
                _this._proxy.$acceptOptionsChanged(id, opts);
            }));
            toDispose.push(textEditor.onSelectionChanged(function (event) {
                _this._proxy.$acceptSelectionsChanged(id, event);
            }));
            this._textEditorsListenersMap[id] = toDispose;
        };
        MainThreadEditors.prototype._onTextEditorRemove = function (id) {
            lifecycle_1.dispose(this._textEditorsListenersMap[id]);
            delete this._textEditorsListenersMap[id];
        };
        MainThreadEditors.prototype._updateActiveAndVisibleTextEditors = function () {
            // editor columns
            var editorPositionData = this._getTextEditorPositionData();
            if (!objects_1.equals(this._editorPositionData, editorPositionData)) {
                this._editorPositionData = editorPositionData;
                this._proxy.$acceptEditorPositionData(this._editorPositionData);
            }
        };
        MainThreadEditors.prototype._getTextEditorPositionData = function () {
            var result = Object.create(null);
            for (var _i = 0, _a = this._workbenchEditorService.getVisibleEditors(); _i < _a.length; _i++) {
                var workbenchEditor = _a[_i];
                var id = this._documentsAndEditors.findTextEditorIdFor(workbenchEditor);
                if (id) {
                    result[id] = workbenchEditor.position;
                }
            }
            return result;
        };
        // --- from extension host process
        MainThreadEditors.prototype.$tryShowTextDocument = function (resource, options) {
            var _this = this;
            var editorOptions = {
                preserveFocus: options.preserveFocus,
                pinned: options.pinned,
                selection: options.selection
            };
            var input = {
                resource: resource,
                options: editorOptions
            };
            return this._workbenchEditorService.openEditor(input, options.position).then(function (editor) {
                if (!editor) {
                    return undefined;
                }
                return _this._documentsAndEditors.findTextEditorIdFor(editor);
            });
        };
        MainThreadEditors.prototype.$tryShowEditor = function (id, position) {
            // check how often this is used
            this._telemetryService.publicLog('api.deprecated', { function: 'TextEditor.show' });
            var mainThreadEditor = this._documentsAndEditors.getEditor(id);
            if (mainThreadEditor) {
                var model = mainThreadEditor.getModel();
                return this._workbenchEditorService.openEditor({
                    resource: model.uri,
                    options: { preserveFocus: false }
                }, position).then(function () { return; });
            }
            return undefined;
        };
        MainThreadEditors.prototype.$tryHideEditor = function (id) {
            // check how often this is used
            this._telemetryService.publicLog('api.deprecated', { function: 'TextEditor.hide' });
            var mainThreadEditor = this._documentsAndEditors.getEditor(id);
            if (mainThreadEditor) {
                var editors = this._workbenchEditorService.getVisibleEditors();
                for (var _i = 0, editors_1 = editors; _i < editors_1.length; _i++) {
                    var editor = editors_1[_i];
                    if (mainThreadEditor.matches(editor)) {
                        return this._workbenchEditorService.closeEditor(editor.position, editor.input).then(function () { return; });
                    }
                }
            }
            return undefined;
        };
        MainThreadEditors.prototype.$trySetSelections = function (id, selections) {
            if (!this._documentsAndEditors.getEditor(id)) {
                return winjs_base_1.TPromise.wrapError(errors_1.disposed("TextEditor(" + id + ")"));
            }
            this._documentsAndEditors.getEditor(id).setSelections(selections);
            return winjs_base_1.TPromise.as(null);
        };
        MainThreadEditors.prototype.$trySetDecorations = function (id, key, ranges) {
            if (!this._documentsAndEditors.getEditor(id)) {
                return winjs_base_1.TPromise.wrapError(errors_1.disposed("TextEditor(" + id + ")"));
            }
            this._documentsAndEditors.getEditor(id).setDecorations(key, ranges);
            return winjs_base_1.TPromise.as(null);
        };
        MainThreadEditors.prototype.$tryRevealRange = function (id, range, revealType) {
            if (!this._documentsAndEditors.getEditor(id)) {
                return winjs_base_1.TPromise.wrapError(errors_1.disposed("TextEditor(" + id + ")"));
            }
            this._documentsAndEditors.getEditor(id).revealRange(range, revealType);
            return undefined;
        };
        MainThreadEditors.prototype.$trySetOptions = function (id, options) {
            if (!this._documentsAndEditors.getEditor(id)) {
                return winjs_base_1.TPromise.wrapError(errors_1.disposed("TextEditor(" + id + ")"));
            }
            this._documentsAndEditors.getEditor(id).setConfiguration(options);
            return winjs_base_1.TPromise.as(null);
        };
        MainThreadEditors.prototype.$tryApplyEdits = function (id, modelVersionId, edits, opts) {
            if (!this._documentsAndEditors.getEditor(id)) {
                return winjs_base_1.TPromise.wrapError(errors_1.disposed("TextEditor(" + id + ")"));
            }
            return winjs_base_1.TPromise.as(this._documentsAndEditors.getEditor(id).applyEdits(modelVersionId, edits, opts));
        };
        MainThreadEditors.prototype.$tryInsertSnippet = function (id, template, ranges, opts) {
            if (!this._documentsAndEditors.getEditor(id)) {
                return winjs_base_1.TPromise.wrapError(errors_1.disposed("TextEditor(" + id + ")"));
            }
            return winjs_base_1.TPromise.as(this._documentsAndEditors.getEditor(id).insertSnippet(template, ranges, opts));
        };
        MainThreadEditors.prototype.$registerTextEditorDecorationType = function (key, options) {
            this._codeEditorService.registerDecorationType(key, options);
        };
        MainThreadEditors.prototype.$removeTextEditorDecorationType = function (key) {
            this._codeEditorService.removeDecorationType(key);
        };
        MainThreadEditors.prototype.$getDiffInformation = function (id) {
            var editor = this._documentsAndEditors.getEditor(id);
            if (!editor) {
                return winjs_base_1.TPromise.wrapError(new Error('No such TextEditor'));
            }
            var codeEditor = editor.getCodeEditor();
            var codeEditorId = codeEditor.getId();
            var diffEditors = this._codeEditorService.listDiffEditors();
            var diffEditor = diffEditors.filter(function (d) { return d.getOriginalEditor().getId() === codeEditorId || d.getModifiedEditor().getId() === codeEditorId; })[0];
            if (!diffEditor) {
                return winjs_base_1.TPromise.as([]);
            }
            return winjs_base_1.TPromise.as(diffEditor.getLineChanges());
        };
        MainThreadEditors = __decorate([
            __param(2, codeEditorService_1.ICodeEditorService),
            __param(3, editorService_1.IWorkbenchEditorService),
            __param(4, groupService_1.IEditorGroupService),
            __param(5, telemetry_1.ITelemetryService)
        ], MainThreadEditors);
        return MainThreadEditors;
    }());
    exports.MainThreadEditors = MainThreadEditors;
});
//# sourceMappingURL=mainThreadEditors.js.map