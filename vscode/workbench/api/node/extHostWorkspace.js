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
define(["require", "exports", "vs/base/common/uri", "vs/base/common/event", "vs/base/common/paths", "vs/base/common/arrays", "path", "vs/platform/workspace/common/workspace", "vs/base/common/winjs.base", "vs/workbench/api/node/extHostTypeConverters", "./extHost.protocol", "vs/base/common/strings", "vs/base/common/async", "vs/workbench/api/node/extHostTypes", "vs/base/common/map", "vs/base/common/cancellation", "vs/platform/progress/common/progress"], function (require, exports, uri_1, event_1, paths_1, arrays_1, path_1, workspace_1, winjs_base_1, extHostTypeConverters_1, extHost_protocol_1, strings_1, async_1, extHostTypes_1, map_1, cancellation_1, progress_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var Workspace2 = (function (_super) {
        __extends(Workspace2, _super);
        function Workspace2(data) {
            var _this = _super.call(this, data.id, data.name, data.roots) || this;
            _this._folder = [];
            _this._structure = new map_1.TrieMap(function (s) { return s.split('/'); });
            // setup the workspace folder data structure
            _this.roots.forEach(function (uri, index) {
                var folder = {
                    name: path_1.basename(uri.fsPath),
                    uri: uri,
                    index: index
                };
                _this._folder.push(folder);
                _this._structure.insert(folder.uri.toString(), folder);
            });
            return _this;
        }
        Workspace2.fromData = function (data) {
            return data ? new Workspace2(data) : null;
        };
        Object.defineProperty(Workspace2.prototype, "folders", {
            get: function () {
                return this._folder.slice(0);
            },
            enumerable: true,
            configurable: true
        });
        Workspace2.prototype.getWorkspaceFolder = function (uri) {
            var str = uri.toString();
            var folder = this._structure.lookUp(str);
            if (folder) {
                // `uri` is a workspace folder so we
                var parts = str.split('/');
                while (parts.length) {
                    if (parts.pop()) {
                        break;
                    }
                }
                str = parts.join('/');
            }
            return this._structure.findSubstr(str);
        };
        return Workspace2;
    }(workspace_1.Workspace));
    var ExtHostWorkspace = (function () {
        function ExtHostWorkspace(mainContext, data) {
            this._onDidChangeWorkspace = new event_1.Emitter();
            this.onDidChangeWorkspace = this._onDidChangeWorkspace.event;
            // --- EXPERIMENT: workspace resolver
            this._handlePool = 0;
            this._fsProvider = new Map();
            this._searchSession = new Map();
            this._proxy = mainContext.get(extHost_protocol_1.MainContext.MainThreadWorkspace);
            this._workspace = Workspace2.fromData(data);
        }
        Object.defineProperty(ExtHostWorkspace.prototype, "workspace", {
            // --- workspace ---
            get: function () {
                return this._workspace;
            },
            enumerable: true,
            configurable: true
        });
        ExtHostWorkspace.prototype.getWorkspaceFolders = function () {
            if (!this._workspace) {
                return undefined;
            }
            else {
                return this._workspace.folders.slice(0);
            }
        };
        ExtHostWorkspace.prototype.getWorkspaceFolder = function (uri) {
            if (!this._workspace) {
                return undefined;
            }
            return this._workspace.getWorkspaceFolder(uri);
        };
        ExtHostWorkspace.prototype.getPath = function () {
            // this is legacy from the days before having
            // multi-root and we keep it only alive if there
            // is just one workspace folder.
            if (!this._workspace) {
                return undefined;
            }
            var roots = this._workspace.roots;
            if (roots.length === 0) {
                return undefined;
            }
            return roots[0].fsPath;
        };
        ExtHostWorkspace.prototype.getRelativePath = function (pathOrUri, includeWorkspace) {
            var path;
            if (typeof pathOrUri === 'string') {
                path = pathOrUri;
            }
            else if (typeof pathOrUri !== 'undefined') {
                path = pathOrUri.fsPath;
            }
            if (!path) {
                return path;
            }
            var folder = this.getWorkspaceFolder(typeof pathOrUri === 'string'
                ? uri_1.default.file(pathOrUri)
                : pathOrUri);
            if (!folder) {
                return paths_1.normalize(path);
            }
            if (typeof includeWorkspace === 'undefined') {
                includeWorkspace = this.workspace.roots.length > 1;
            }
            var result = path_1.relative(folder.uri.fsPath, path);
            if (includeWorkspace) {
                result = folder.name + "/" + result;
            }
            return paths_1.normalize(result);
        };
        ExtHostWorkspace.prototype.$acceptWorkspaceData = function (data) {
            // keep old workspace folder, build new workspace, and
            // capture new workspace folders. Compute delta between
            // them send that as event
            var oldRoots = this._workspace ? this._workspace.folders.sort(ExtHostWorkspace._compareWorkspaceFolder) : [];
            this._workspace = Workspace2.fromData(data);
            var newRoots = this._workspace ? this._workspace.folders.sort(ExtHostWorkspace._compareWorkspaceFolder) : [];
            var _a = arrays_1.delta(oldRoots, newRoots, ExtHostWorkspace._compareWorkspaceFolder), added = _a.added, removed = _a.removed;
            this._onDidChangeWorkspace.fire(Object.freeze({
                added: Object.freeze(added),
                removed: Object.freeze(removed)
            }));
        };
        ExtHostWorkspace._compareWorkspaceFolder = function (a, b) {
            return strings_1.compare(a.uri.toString(), b.uri.toString());
        };
        // --- search ---
        ExtHostWorkspace.prototype.findFiles = function (include, exclude, maxResults, token) {
            var _this = this;
            var requestId = ExtHostWorkspace._requestIdPool++;
            var result = this._proxy.$startSearch(include, exclude, maxResults, requestId);
            if (token) {
                token.onCancellationRequested(function () { return _this._proxy.$cancelSearch(requestId); });
            }
            return result;
        };
        ExtHostWorkspace.prototype.saveAll = function (includeUntitled) {
            return this._proxy.$saveAll(includeUntitled);
        };
        ExtHostWorkspace.prototype.appyEdit = function (edit) {
            var resourceEdits = [];
            var entries = edit.entries();
            for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
                var entry = entries_1[_i];
                var uri = entry[0], edits = entry[1];
                for (var _a = 0, edits_1 = edits; _a < edits_1.length; _a++) {
                    var edit_1 = edits_1[_a];
                    resourceEdits.push({
                        resource: uri,
                        newText: edit_1.newText,
                        newEol: extHostTypeConverters_1.EndOfLine.from(edit_1.newEol),
                        range: edit_1.range && extHostTypeConverters_1.fromRange(edit_1.range)
                    });
                }
            }
            return this._proxy.$applyWorkspaceEdit(resourceEdits);
        };
        ExtHostWorkspace.prototype.registerFileSystemProvider = function (authority, provider) {
            var _this = this;
            var handle = ++this._handlePool;
            this._fsProvider.set(handle, provider);
            var reg = provider.onDidChange(function (e) { return _this._proxy.$onFileSystemChange(handle, e); });
            this._proxy.$registerFileSystemProvider(handle, authority);
            return new extHostTypes_1.Disposable(function () {
                _this._fsProvider.delete(handle);
                reg.dispose();
            });
        };
        ExtHostWorkspace.prototype.$resolveFile = function (handle, resource) {
            var provider = this._fsProvider.get(handle);
            return async_1.asWinJsPromise(function (token) { return provider.resolveContents(resource); });
        };
        ExtHostWorkspace.prototype.$storeFile = function (handle, resource, content) {
            var provider = this._fsProvider.get(handle);
            return async_1.asWinJsPromise(function (token) { return provider.writeContents(resource, content); });
        };
        ExtHostWorkspace.prototype.$startSearch = function (handle, session, query) {
            var _this = this;
            var provider = this._fsProvider.get(handle);
            var source = new cancellation_1.CancellationTokenSource();
            var progress = new progress_1.Progress(function (chunk) { return _this._proxy.$updateSearchSession(session, chunk); });
            this._searchSession.set(session, source);
            winjs_base_1.TPromise.wrap(provider.findFiles(query, progress, source.token)).then(function () {
                _this._proxy.$finishSearchSession(session);
            }, function (err) {
                _this._proxy.$finishSearchSession(session, err);
            });
        };
        ExtHostWorkspace.prototype.$cancelSearch = function (handle, session) {
            if (this._searchSession.has(session)) {
                this._searchSession.get(session).cancel();
                this._searchSession.delete(session);
            }
        };
        ExtHostWorkspace._requestIdPool = 0;
        return ExtHostWorkspace;
    }());
    exports.ExtHostWorkspace = ExtHostWorkspace;
});
//# sourceMappingURL=extHostWorkspace.js.map