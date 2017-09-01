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
define(["require", "exports", "vs/base/common/arrays", "vs/base/common/winjs.base", "vs/platform/workspace/common/workspace", "vs/platform/windows/common/windows", "vs/platform/environment/common/environment", "vs/workbench/services/configuration/common/jsonEditing", "vs/platform/workspaces/common/workspaces", "vs/base/common/platform", "path", "vs/base/common/paths"], function (require, exports, arrays_1, winjs_base_1, workspace_1, windows_1, environment_1, jsonEditing_1, workspaces_1, platform_1, path_1, paths_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var WorkspaceEditingService = (function () {
        function WorkspaceEditingService(jsonEditingService, contextService, environmentService, windowsService, workspacesService) {
            this.jsonEditingService = jsonEditingService;
            this.contextService = contextService;
            this.environmentService = environmentService;
            this.windowsService = windowsService;
            this.workspacesService = workspacesService;
        }
        WorkspaceEditingService.prototype.addRoots = function (rootsToAdd) {
            if (!this.isSupported()) {
                return winjs_base_1.TPromise.as(void 0); // we need a workspace to begin with
            }
            var roots = this.contextService.getWorkspace().roots;
            return this.doSetRoots(roots.concat(rootsToAdd));
        };
        WorkspaceEditingService.prototype.removeRoots = function (rootsToRemove) {
            if (!this.isSupported()) {
                return winjs_base_1.TPromise.as(void 0); // we need a workspace to begin with
            }
            var roots = this.contextService.getWorkspace().roots;
            var rootsToRemoveRaw = rootsToRemove.map(function (root) { return root.toString(); });
            return this.doSetRoots(roots.filter(function (root) { return rootsToRemoveRaw.indexOf(root.toString()) === -1; }));
        };
        WorkspaceEditingService.prototype.isSupported = function () {
            // TODO@Ben multi root
            return (this.environmentService.appQuality !== 'stable' // not yet enabled in stable
                && this.contextService.hasMultiFolderWorkspace() // we need a multi folder workspace to begin with
            );
        };
        WorkspaceEditingService.prototype.doSetRoots = function (newRoots) {
            var workspace = this.contextService.getWorkspace();
            var currentWorkspaceRoots = this.contextService.getWorkspace().roots.map(function (root) { return root.fsPath; });
            var newWorkspaceRoots = this.validateRoots(newRoots);
            // See if there are any changes
            if (arrays_1.equals(currentWorkspaceRoots, newWorkspaceRoots)) {
                return winjs_base_1.TPromise.as(void 0);
            }
            // Apply to config
            if (newWorkspaceRoots.length) {
                var workspaceConfigFolder_1 = path_1.dirname(workspace.configuration.fsPath);
                var value = newWorkspaceRoots.map(function (newWorkspaceRoot) {
                    if (paths_1.isEqualOrParent(newWorkspaceRoot, workspaceConfigFolder_1, !platform_1.isLinux)) {
                        newWorkspaceRoot = path_1.relative(workspaceConfigFolder_1, newWorkspaceRoot); // absolute paths get converted to relative ones to workspace location if possible
                    }
                    return { path: newWorkspaceRoot };
                });
                return this.jsonEditingService.write(workspace.configuration, { key: 'folders', value: value }, true);
            }
            else {
                // TODO: Sandeep - Removing all roots?
            }
            return winjs_base_1.TPromise.as(null);
        };
        WorkspaceEditingService.prototype.validateRoots = function (roots) {
            if (!roots) {
                return [];
            }
            // Prevent duplicates
            return arrays_1.distinct(roots.map(function (root) { return root.fsPath; }), function (root) { return platform_1.isLinux ? root : root.toLowerCase(); });
        };
        WorkspaceEditingService = __decorate([
            __param(0, jsonEditing_1.IJSONEditingService),
            __param(1, workspace_1.IWorkspaceContextService),
            __param(2, environment_1.IEnvironmentService),
            __param(3, windows_1.IWindowsService),
            __param(4, workspaces_1.IWorkspacesService)
        ], WorkspaceEditingService);
        return WorkspaceEditingService;
    }());
    exports.WorkspaceEditingService = WorkspaceEditingService;
});
//# sourceMappingURL=workspaceEditingService.js.map