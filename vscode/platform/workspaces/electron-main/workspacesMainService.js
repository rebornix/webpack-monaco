/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", "vs/platform/workspaces/common/workspaces", "vs/base/common/winjs.base", "vs/platform/files/common/files", "vs/platform/environment/common/environment", "path", "vs/base/node/pfs", "fs", "vs/base/common/platform", "vs/base/node/extfs", "vs/base/common/event", "vs/platform/log/common/log", "vs/base/common/paths", "vs/base/common/arrays", "crypto", "vs/base/common/uri"], function (require, exports, workspaces_1, winjs_base_1, files_1, environment_1, path_1, pfs_1, fs_1, platform_1, extfs_1, event_1, log_1, paths_1, arrays_1, crypto_1, uri_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var WorkspacesMainService = (function () {
        function WorkspacesMainService(environmentService, logService) {
            this.environmentService = environmentService;
            this.logService = logService;
            this.workspacesHome = environmentService.workspacesHome;
            this._onWorkspaceSaved = new event_1.Emitter();
            this._onUntitledWorkspaceDeleted = new event_1.Emitter();
        }
        Object.defineProperty(WorkspacesMainService.prototype, "onWorkspaceSaved", {
            get: function () {
                return this._onWorkspaceSaved.event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WorkspacesMainService.prototype, "onUntitledWorkspaceDeleted", {
            get: function () {
                return this._onUntitledWorkspaceDeleted.event;
            },
            enumerable: true,
            configurable: true
        });
        WorkspacesMainService.prototype.resolveWorkspace = function (path) {
            var _this = this;
            if (!this.isWorkspacePath(path)) {
                return winjs_base_1.TPromise.as(null); // does not look like a valid workspace config file
            }
            return pfs_1.readFile(path).then(function (contents) { return _this.doResolveWorkspace(path, contents.toString()); });
        };
        WorkspacesMainService.prototype.resolveWorkspaceSync = function (path) {
            if (!this.isWorkspacePath(path)) {
                return null; // does not look like a valid workspace config file
            }
            return this.doResolveWorkspace(path, fs_1.readFileSync(path, 'utf8'));
        };
        WorkspacesMainService.prototype.isWorkspacePath = function (path) {
            return this.isInsideWorkspacesHome(path) || path_1.extname(path) === "." + workspaces_1.WORKSPACE_EXTENSION;
        };
        WorkspacesMainService.prototype.doResolveWorkspace = function (path, contents) {
            try {
                var workspace = this.doParseStoredWorkspace(path, contents);
                // TODO@Ben migration
                var legacyStoredWorkspace = workspace;
                if (legacyStoredWorkspace.folders.some(function (folder) { return typeof folder === 'string'; })) {
                    workspace.folders = legacyStoredWorkspace.folders.map(function (folder) { return ({ path: uri_1.default.parse(folder).fsPath }); });
                    fs_1.writeFileSync(path, JSON.stringify(workspace, null, '\t'));
                }
                var absoluteFolders_1 = [];
                workspace.folders.forEach(function (folder) {
                    if (path_1.isAbsolute(folder.path)) {
                        absoluteFolders_1.push(folder);
                    }
                    else {
                        absoluteFolders_1.push({
                            path: path_1.resolve(path_1.dirname(path), folder.path) // relative paths get resolved against the workspace location
                        });
                    }
                });
                return {
                    id: this.getWorkspaceId(path),
                    configPath: path,
                    folders: absoluteFolders_1
                };
            }
            catch (error) {
                this.logService.log(error.toString());
            }
            return null;
        };
        WorkspacesMainService.prototype.doParseStoredWorkspace = function (path, contents) {
            var storedWorkspace;
            try {
                storedWorkspace = JSON.parse(contents);
            }
            catch (error) {
                throw new Error(path + " cannot be parsed as JSON file (" + error + ").");
            }
            if (!Array.isArray(storedWorkspace.folders) || storedWorkspace.folders.length === 0) {
                throw new Error(path + " looks like an invalid workspace file.");
            }
            return storedWorkspace;
        };
        WorkspacesMainService.prototype.isInsideWorkspacesHome = function (path) {
            return files_1.isParent(path, this.environmentService.workspacesHome, !platform_1.isLinux /* ignore case */);
        };
        WorkspacesMainService.prototype.createWorkspace = function (folders) {
            var _a = this.createUntitledWorkspace(folders), workspace = _a.workspace, configParent = _a.configParent, storedWorkspace = _a.storedWorkspace;
            return pfs_1.mkdirp(configParent).then(function () {
                return pfs_1.writeFile(workspace.configPath, JSON.stringify(storedWorkspace, null, '\t')).then(function () { return workspace; });
            });
        };
        WorkspacesMainService.prototype.createWorkspaceSync = function (folders) {
            var _a = this.createUntitledWorkspace(folders), workspace = _a.workspace, configParent = _a.configParent, storedWorkspace = _a.storedWorkspace;
            if (!fs_1.existsSync(this.workspacesHome)) {
                fs_1.mkdirSync(this.workspacesHome);
            }
            fs_1.mkdirSync(configParent);
            fs_1.writeFileSync(workspace.configPath, JSON.stringify(storedWorkspace, null, '\t'));
            return workspace;
        };
        WorkspacesMainService.prototype.createUntitledWorkspace = function (folders) {
            var randomId = (Date.now() + Math.round(Math.random() * 1000)).toString();
            var untitledWorkspaceConfigFolder = path_1.join(this.workspacesHome, randomId);
            var untitledWorkspaceConfigPath = path_1.join(untitledWorkspaceConfigFolder, workspaces_1.UNTITLED_WORKSPACE_NAME);
            var storedWorkspace = {
                folders: folders.map(function (folder) { return ({
                    path: folder
                }); })
            };
            return {
                workspace: {
                    id: this.getWorkspaceId(untitledWorkspaceConfigPath),
                    configPath: untitledWorkspaceConfigPath
                },
                configParent: untitledWorkspaceConfigFolder,
                storedWorkspace: storedWorkspace
            };
        };
        WorkspacesMainService.prototype.getWorkspaceId = function (workspaceConfigPath) {
            if (!platform_1.isLinux) {
                workspaceConfigPath = workspaceConfigPath.toLowerCase(); // sanitize for platform file system
            }
            return crypto_1.createHash('md5').update(workspaceConfigPath).digest('hex');
        };
        WorkspacesMainService.prototype.isUntitledWorkspace = function (workspace) {
            return this.isInsideWorkspacesHome(workspace.configPath);
        };
        WorkspacesMainService.prototype.saveWorkspace = function (workspace, targetConfigPath) {
            var _this = this;
            // Return early if target is same as source
            if (paths_1.isEqual(workspace.configPath, targetConfigPath, !platform_1.isLinux)) {
                return winjs_base_1.TPromise.as(workspace);
            }
            // Read the contents of the workspace file and resolve it
            return pfs_1.readFile(workspace.configPath).then(function (rawWorkspaceContents) {
                var storedWorkspace;
                try {
                    storedWorkspace = _this.doParseStoredWorkspace(workspace.configPath, rawWorkspaceContents.toString());
                }
                catch (error) {
                    return winjs_base_1.TPromise.wrapError(error);
                }
                var sourceConfigFolder = path_1.dirname(workspace.configPath);
                var targetConfigFolder = path_1.dirname(targetConfigPath);
                // Rewrite absolute paths to relative paths if the target workspace folder
                // is a parent of the location of the workspace file itself. Otherwise keep
                // using absolute paths.
                storedWorkspace.folders.forEach(function (folder) {
                    if (!path_1.isAbsolute(folder.path)) {
                        folder.path = path_1.resolve(sourceConfigFolder, folder.path); // relative paths get resolved against the workspace location
                    }
                    if (paths_1.isEqualOrParent(folder.path, targetConfigFolder, !platform_1.isLinux)) {
                        folder.path = path_1.relative(targetConfigFolder, folder.path); // absolute paths get converted to relative ones to workspace location if possible
                    }
                });
                return pfs_1.writeFile(targetConfigPath, JSON.stringify(storedWorkspace, null, '\t')).then(function () {
                    var savedWorkspaceIdentifier = { id: _this.getWorkspaceId(targetConfigPath), configPath: targetConfigPath };
                    // Event
                    _this._onWorkspaceSaved.fire({ workspace: savedWorkspaceIdentifier, oldConfigPath: workspace.configPath });
                    // Delete untitled workspace
                    _this.deleteUntitledWorkspaceSync(workspace);
                    return savedWorkspaceIdentifier;
                });
            });
        };
        WorkspacesMainService.prototype.deleteUntitledWorkspaceSync = function (workspace) {
            if (!this.isUntitledWorkspace(workspace)) {
                return; // only supported for untitled workspaces
            }
            // Delete from disk
            this.doDeleteUntitledWorkspaceSync(workspace.configPath);
            // Event
            this._onUntitledWorkspaceDeleted.fire(workspace);
        };
        WorkspacesMainService.prototype.doDeleteUntitledWorkspaceSync = function (configPath) {
            try {
                extfs_1.delSync(path_1.dirname(configPath));
            }
            catch (error) {
                this.logService.log("Unable to delete untitled workspace " + configPath + " (" + error + ").");
            }
        };
        WorkspacesMainService.prototype.getUntitledWorkspacesSync = function () {
            var _this = this;
            var untitledWorkspacePaths = [];
            try {
                untitledWorkspacePaths = extfs_1.readdirSync(this.workspacesHome).map(function (folder) { return path_1.join(_this.workspacesHome, folder, workspaces_1.UNTITLED_WORKSPACE_NAME); });
            }
            catch (error) {
                this.logService.log("Unable to read folders in " + this.workspacesHome + " (" + error + ").");
            }
            var untitledWorkspaces = arrays_1.coalesce(untitledWorkspacePaths.map(function (untitledWorkspacePath) {
                var workspace = _this.resolveWorkspaceSync(untitledWorkspacePath);
                if (!workspace) {
                    _this.doDeleteUntitledWorkspaceSync(untitledWorkspacePath);
                    return null; // invalid workspace
                }
                return { id: workspace.id, configPath: untitledWorkspacePath };
            }));
            return untitledWorkspaces;
        };
        WorkspacesMainService = __decorate([
            __param(0, environment_1.IEnvironmentService),
            __param(1, log_1.ILogService)
        ], WorkspacesMainService);
        return WorkspacesMainService;
    }());
    exports.WorkspacesMainService = WorkspacesMainService;
});
//# sourceMappingURL=workspacesMainService.js.map