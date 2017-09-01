var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", "vs/base/common/errors", "vs/platform/search/common/search", "vs/platform/workspace/common/workspace", "vs/workbench/services/editor/common/editorService", "vs/workbench/services/textfile/common/textfiles", "vs/editor/common/editorCommon", "vs/editor/common/services/bulkEdit", "vs/base/common/winjs.base", "../node/extHost.protocol", "vs/editor/common/services/resolverService", "vs/platform/files/common/files", "vs/base/common/lifecycle", "vs/workbench/services/files/electron-browser/remoteFileService", "vs/base/common/event", "vs/workbench/api/electron-browser/extHostCustomers"], function (require, exports, errors_1, search_1, workspace_1, editorService_1, textfiles_1, editorCommon_1, bulkEdit_1, winjs_base_1, extHost_protocol_1, resolverService_1, files_1, lifecycle_1, remoteFileService_1, event_1, extHostCustomers_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var MainThreadWorkspace = (function () {
        function MainThreadWorkspace(extHostContext, _searchService, _contextService, _textFileService, _editorService, _textModelResolverService, _fileService) {
            this._searchService = _searchService;
            this._contextService = _contextService;
            this._textFileService = _textFileService;
            this._editorService = _editorService;
            this._textModelResolverService = _textModelResolverService;
            this._fileService = _fileService;
            this._toDispose = [];
            this._activeSearches = Object.create(null);
            // --- EXPERIMENT: workspace provider
            this._idPool = 0;
            this._provider = new Map();
            this._searchSessions = new Map();
            this._proxy = extHostContext.get(extHost_protocol_1.ExtHostContext.ExtHostWorkspace);
            this._contextService.onDidChangeWorkspaceRoots(this._onDidChangeWorkspace, this, this._toDispose);
        }
        MainThreadWorkspace.prototype.dispose = function () {
            lifecycle_1.dispose(this._toDispose);
            for (var requestId in this._activeSearches) {
                var search = this._activeSearches[requestId];
                search.cancel();
            }
        };
        // --- workspace ---
        MainThreadWorkspace.prototype._onDidChangeWorkspace = function () {
            this._proxy.$acceptWorkspaceData(this._contextService.getWorkspace());
        };
        // --- search ---
        MainThreadWorkspace.prototype.$startSearch = function (include, exclude, maxResults, requestId) {
            var _this = this;
            var workspace = this._contextService.getWorkspace();
            if (!workspace) {
                return undefined;
            }
            var query = {
                folderQueries: workspace.roots.map(function (root) { return ({ folder: root }); }),
                type: search_1.QueryType.File,
                maxResults: maxResults,
                includePattern: (_a = {}, _a[include] = true, _a),
                excludePattern: (_b = {}, _b[exclude] = true, _b),
            };
            this._searchService.extendQuery(query);
            var search = this._searchService.search(query).then(function (result) {
                return result.results.map(function (m) { return m.resource; });
            }, function (err) {
                if (!errors_1.isPromiseCanceledError(err)) {
                    return winjs_base_1.TPromise.wrapError(err);
                }
                return undefined;
            });
            this._activeSearches[requestId] = search;
            var onDone = function () { return delete _this._activeSearches[requestId]; };
            search.done(onDone, onDone);
            return search;
            var _a, _b;
        };
        MainThreadWorkspace.prototype.$cancelSearch = function (requestId) {
            var search = this._activeSearches[requestId];
            if (search) {
                delete this._activeSearches[requestId];
                search.cancel();
                return winjs_base_1.TPromise.as(true);
            }
            return undefined;
        };
        // --- save & edit resources ---
        MainThreadWorkspace.prototype.$saveAll = function (includeUntitled) {
            return this._textFileService.saveAll(includeUntitled).then(function (result) {
                return result.results.every(function (each) { return each.success === true; });
            });
        };
        MainThreadWorkspace.prototype.$applyWorkspaceEdit = function (edits) {
            var codeEditor;
            var editor = this._editorService.getActiveEditor();
            if (editor) {
                var candidate = editor.getControl();
                if (editorCommon_1.isCommonCodeEditor(candidate)) {
                    codeEditor = candidate;
                }
            }
            return bulkEdit_1.bulkEdit(this._textModelResolverService, codeEditor, edits, this._fileService)
                .then(function () { return true; });
        };
        MainThreadWorkspace.prototype.$registerFileSystemProvider = function (handle, authority) {
            var _this = this;
            if (!(this._fileService instanceof remoteFileService_1.RemoteFileService)) {
                throw new Error();
            }
            var emitter = new event_1.Emitter();
            var provider = {
                onDidChange: emitter.event,
                resolve: function (resource) {
                    return _this._proxy.$resolveFile(handle, resource);
                },
                update: function (resource, value) {
                    return _this._proxy.$storeFile(handle, resource, value);
                }
            };
            var searchProvider = {
                search: function (query) {
                    if (query.type !== search_1.QueryType.File) {
                        return undefined;
                    }
                    var session = ++_this._idPool;
                    return new winjs_base_1.PPromise(function (resolve, reject, progress) {
                        _this._searchSessions.set(session, { resolve: resolve, reject: reject, progress: progress, matches: [] });
                        _this._proxy.$startSearch(handle, session, query.filePattern);
                    }, function () {
                        _this._proxy.$cancelSearch(handle, session);
                    });
                }
            };
            var registrations = lifecycle_1.combinedDisposable([
                this._fileService.registerProvider(authority, provider),
                this._searchService.registerSearchResultProvider(searchProvider),
            ]);
            this._provider.set(handle, [registrations, emitter]);
        };
        MainThreadWorkspace.prototype.$unregisterFileSystemProvider = function (handle) {
            if (this._provider.has(handle)) {
                lifecycle_1.dispose(this._provider.get(handle)[0]);
                this._provider.delete(handle);
            }
        };
        MainThreadWorkspace.prototype.$onFileSystemChange = function (handle, resource) {
            var _a = this._provider.get(handle), emitter = _a[1];
            emitter.fire(resource);
        };
        ;
        MainThreadWorkspace.prototype.$updateSearchSession = function (session, data) {
            if (this._searchSessions.has(session)) {
                this._searchSessions.get(session).progress({ resource: data });
                this._searchSessions.get(session).matches.push(data);
            }
        };
        MainThreadWorkspace.prototype.$finishSearchSession = function (session, err) {
            if (this._searchSessions.has(session)) {
                var _a = this._searchSessions.get(session), matches = _a.matches, resolve = _a.resolve, reject = _a.reject;
                this._searchSessions.delete(session);
                if (err) {
                    reject(err);
                }
                else {
                    resolve({
                        limitHit: false,
                        stats: undefined,
                        results: matches.map(function (resource) { return ({ resource: resource }); })
                    });
                }
            }
        };
        MainThreadWorkspace = __decorate([
            extHostCustomers_1.extHostNamedCustomer(extHost_protocol_1.MainContext.MainThreadWorkspace),
            __param(1, search_1.ISearchService),
            __param(2, workspace_1.IWorkspaceContextService),
            __param(3, textfiles_1.ITextFileService),
            __param(4, editorService_1.IWorkbenchEditorService),
            __param(5, resolverService_1.ITextModelService),
            __param(6, files_1.IFileService)
        ], MainThreadWorkspace);
        return MainThreadWorkspace;
    }());
    exports.MainThreadWorkspace = MainThreadWorkspace;
});
//# sourceMappingURL=mainThreadWorkspace.js.map