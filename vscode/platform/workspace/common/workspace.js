define(["require", "exports", "vs/base/common/uri", "vs/platform/instantiation/common/instantiation", "vs/base/common/paths", "vs/base/common/map", "vs/base/common/platform", "vs/base/common/arrays"], function (require, exports, uri_1, instantiation_1, paths, map_1, platform_1, arrays_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.IWorkspaceContextService = instantiation_1.createDecorator('contextService');
    var LegacyWorkspace = (function () {
        function LegacyWorkspace(_resource, _ctime) {
            this._resource = _resource;
            this._ctime = _ctime;
            this._name = paths.basename(this._resource.fsPath) || this._resource.fsPath;
        }
        Object.defineProperty(LegacyWorkspace.prototype, "resource", {
            get: function () {
                return this._resource;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LegacyWorkspace.prototype, "name", {
            get: function () {
                return this._name;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LegacyWorkspace.prototype, "ctime", {
            get: function () {
                return this._ctime;
            },
            enumerable: true,
            configurable: true
        });
        LegacyWorkspace.prototype.toResource = function (workspaceRelativePath, root) {
            if (typeof workspaceRelativePath === 'string') {
                return uri_1.default.file(paths.join(root ? root.fsPath : this._resource.fsPath, workspaceRelativePath));
            }
            return null;
        };
        return LegacyWorkspace;
    }());
    exports.LegacyWorkspace = LegacyWorkspace;
    var Workspace = (function () {
        function Workspace(id, _name, roots, _configuration) {
            if (_configuration === void 0) { _configuration = null; }
            this.id = id;
            this._name = _name;
            this._configuration = _configuration;
            this._rootsMap = new map_1.TrieMap();
            this.roots = roots;
        }
        Workspace.prototype.ensureUnique = function (roots) {
            return arrays_1.distinct(roots, function (root) { return platform_1.isLinux ? root.fsPath : root.fsPath.toLowerCase(); });
        };
        Object.defineProperty(Workspace.prototype, "roots", {
            get: function () {
                return this._roots;
            },
            set: function (roots) {
                this._roots = this.ensureUnique(roots);
                this.updateRootsMap();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Workspace.prototype, "name", {
            get: function () {
                return this._name;
            },
            set: function (name) {
                this._name = name;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Workspace.prototype, "configuration", {
            get: function () {
                return this._configuration;
            },
            set: function (configuration) {
                this._configuration = configuration;
            },
            enumerable: true,
            configurable: true
        });
        Workspace.prototype.getRoot = function (resource) {
            if (!resource) {
                return null;
            }
            return this._rootsMap.findSubstr(resource.fsPath);
        };
        Workspace.prototype.updateRootsMap = function () {
            this._rootsMap = new map_1.TrieMap();
            for (var _i = 0, _a = this.roots; _i < _a.length; _i++) {
                var root = _a[_i];
                this._rootsMap.insert(root.fsPath, root);
            }
        };
        Workspace.prototype.toJSON = function () {
            return { id: this.id, roots: this.roots, name: this.name };
        };
        return Workspace;
    }());
    exports.Workspace = Workspace;
});
//# sourceMappingURL=workspace.js.map