define(["require", "exports", "vs/base/common/event", "vs/base/common/lifecycle", "./extHost.protocol", "./extHostDocumentData", "./extHostTextEditor", "assert", "./extHostTypeConverters"], function (require, exports, event_1, lifecycle_1, extHost_protocol_1, extHostDocumentData_1, extHostTextEditor_1, assert, typeConverters) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var ExtHostDocumentsAndEditors = (function () {
        function ExtHostDocumentsAndEditors(_mainContext, _extHostExtensions) {
            this._mainContext = _mainContext;
            this._extHostExtensions = _extHostExtensions;
            this._editors = new Map();
            this._documents = new Map();
            this._onDidAddDocuments = new event_1.Emitter();
            this._onDidRemoveDocuments = new event_1.Emitter();
            this._onDidChangeVisibleTextEditors = new event_1.Emitter();
            this._onDidChangeActiveTextEditor = new event_1.Emitter();
            this.onDidAddDocuments = this._onDidAddDocuments.event;
            this.onDidRemoveDocuments = this._onDidRemoveDocuments.event;
            this.onDidChangeVisibleTextEditors = this._onDidChangeVisibleTextEditors.event;
            this.onDidChangeActiveTextEditor = this._onDidChangeActiveTextEditor.event;
        }
        ExtHostDocumentsAndEditors.prototype.$acceptDocumentsAndEditorsDelta = function (delta) {
            var removedDocuments = [];
            var addedDocuments = [];
            var removedEditors = [];
            if (delta.removedDocuments) {
                for (var _i = 0, _a = delta.removedDocuments; _i < _a.length; _i++) {
                    var id = _a[_i];
                    var data = this._documents.get(id);
                    this._documents.delete(id);
                    removedDocuments.push(data);
                }
            }
            if (delta.addedDocuments) {
                for (var _b = 0, _c = delta.addedDocuments; _b < _c.length; _b++) {
                    var data = _c[_b];
                    assert.ok(!this._documents.has(data.url.toString()), "document '" + data.url + " already exists!'");
                    var documentData = new extHostDocumentData_1.ExtHostDocumentData(this._mainContext.get(extHost_protocol_1.MainContext.MainThreadDocuments), data.url, data.lines, data.EOL, data.modeId, data.versionId, data.isDirty);
                    this._documents.set(data.url.toString(), documentData);
                    addedDocuments.push(documentData);
                }
            }
            if (delta.removedEditors) {
                for (var _d = 0, _e = delta.removedEditors; _d < _e.length; _d++) {
                    var id = _e[_d];
                    var editor = this._editors.get(id);
                    this._editors.delete(id);
                    removedEditors.push(editor);
                }
            }
            if (delta.addedEditors) {
                for (var _f = 0, _g = delta.addedEditors; _f < _g.length; _f++) {
                    var data = _g[_f];
                    assert.ok(this._documents.has(data.document.toString()), "document '" + data.document + "' does not exist");
                    assert.ok(!this._editors.has(data.id), "editor '" + data.id + "' already exists!");
                    var documentData = this._documents.get(data.document.toString());
                    var editor = new extHostTextEditor_1.ExtHostTextEditor2(this._extHostExtensions, this._mainContext.get(extHost_protocol_1.MainContext.MainThreadTelemetry), this._mainContext.get(extHost_protocol_1.MainContext.MainThreadEditors), data.id, documentData, data.selections.map(typeConverters.toSelection), data.options, typeConverters.toViewColumn(data.editorPosition));
                    this._editors.set(data.id, editor);
                }
            }
            if (delta.newActiveEditor !== undefined) {
                assert.ok(delta.newActiveEditor === null || this._editors.has(delta.newActiveEditor), "active editor '" + delta.newActiveEditor + "' does not exist");
                this._activeEditorId = delta.newActiveEditor;
            }
            lifecycle_1.dispose(removedDocuments);
            lifecycle_1.dispose(removedEditors);
            // now that the internal state is complete, fire events
            if (delta.removedDocuments) {
                this._onDidRemoveDocuments.fire(removedDocuments);
            }
            if (delta.addedDocuments) {
                this._onDidAddDocuments.fire(addedDocuments);
            }
            if (delta.removedEditors || delta.addedEditors) {
                this._onDidChangeVisibleTextEditors.fire(this.allEditors());
            }
            if (delta.newActiveEditor !== undefined) {
                this._onDidChangeActiveTextEditor.fire(this.activeEditor());
            }
        };
        ExtHostDocumentsAndEditors.prototype.getDocument = function (strUrl) {
            return this._documents.get(strUrl);
        };
        ExtHostDocumentsAndEditors.prototype.allDocuments = function () {
            var result = [];
            this._documents.forEach(function (data) { return result.push(data); });
            return result;
        };
        ExtHostDocumentsAndEditors.prototype.getEditor = function (id) {
            return this._editors.get(id);
        };
        ExtHostDocumentsAndEditors.prototype.activeEditor = function () {
            if (!this._activeEditorId) {
                return undefined;
            }
            else {
                return this._editors.get(this._activeEditorId);
            }
        };
        ExtHostDocumentsAndEditors.prototype.allEditors = function () {
            var result = [];
            this._editors.forEach(function (data) { return result.push(data); });
            return result;
        };
        return ExtHostDocumentsAndEditors;
    }());
    exports.ExtHostDocumentsAndEditors = ExtHostDocumentsAndEditors;
});
//# sourceMappingURL=extHostDocumentsAndEditors.js.map