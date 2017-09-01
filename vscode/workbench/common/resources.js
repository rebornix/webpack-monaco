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
define(["require", "exports", "vs/base/common/uri", "vs/base/common/objects", "vs/base/common/paths", "vs/platform/workspace/common/workspace", "vs/base/common/lifecycle", "vs/base/common/event", "vs/platform/configuration/common/configuration", "vs/base/common/paths", "vs/platform/contextkey/common/contextkey", "vs/editor/common/services/modeService"], function (require, exports, uri_1, objects, paths, workspace_1, lifecycle_1, event_1, configuration_1, paths_1, contextkey_1, modeService_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var ResourceContextKey = (function () {
        function ResourceContextKey(contextKeyService, _modeService) {
            this._modeService = _modeService;
            this._schemeKey = ResourceContextKey.Scheme.bindTo(contextKeyService);
            this._filenameKey = ResourceContextKey.Filename.bindTo(contextKeyService);
            this._langIdKey = ResourceContextKey.LangId.bindTo(contextKeyService);
            this._resourceKey = ResourceContextKey.Resource.bindTo(contextKeyService);
        }
        ResourceContextKey.prototype.set = function (value) {
            this._resourceKey.set(value);
            this._schemeKey.set(value && value.scheme);
            this._filenameKey.set(value && paths_1.basename(value.fsPath));
            this._langIdKey.set(value && this._modeService.getModeIdByFilenameOrFirstLine(value.fsPath));
        };
        ResourceContextKey.prototype.reset = function () {
            this._schemeKey.reset();
            this._langIdKey.reset();
            this._resourceKey.reset();
        };
        ResourceContextKey.prototype.get = function () {
            return this._resourceKey.get();
        };
        ResourceContextKey.Scheme = new contextkey_1.RawContextKey('resourceScheme', undefined);
        ResourceContextKey.Filename = new contextkey_1.RawContextKey('resourceFilename', undefined);
        ResourceContextKey.LangId = new contextkey_1.RawContextKey('resourceLangId', undefined);
        ResourceContextKey.Resource = new contextkey_1.RawContextKey('resource', undefined);
        ResourceContextKey = __decorate([
            __param(0, contextkey_1.IContextKeyService),
            __param(1, modeService_1.IModeService)
        ], ResourceContextKey);
        return ResourceContextKey;
    }());
    exports.ResourceContextKey = ResourceContextKey;
    var ResourceGlobMatcher = (function () {
        function ResourceGlobMatcher(globFn, parseFn, contextService, configurationService) {
            this.globFn = globFn;
            this.parseFn = parseFn;
            this.contextService = contextService;
            this.configurationService = configurationService;
            this.toUnbind = [];
            this.mapRootToParsedExpression = new Map();
            this.mapRootToExpressionConfig = new Map();
            this._onExpressionChange = new event_1.Emitter();
            this.toUnbind.push(this._onExpressionChange);
            this.updateExcludes(false);
            this.registerListeners();
        }
        Object.defineProperty(ResourceGlobMatcher.prototype, "onExpressionChange", {
            get: function () {
                return this._onExpressionChange.event;
            },
            enumerable: true,
            configurable: true
        });
        ResourceGlobMatcher.prototype.registerListeners = function () {
            var _this = this;
            this.toUnbind.push(this.configurationService.onDidUpdateConfiguration(function () { return _this.onConfigurationChanged(); }));
            this.toUnbind.push(this.contextService.onDidChangeWorkspaceRoots(function () { return _this.onDidChangeWorkspaceRoots(); }));
        };
        ResourceGlobMatcher.prototype.onConfigurationChanged = function () {
            this.updateExcludes(true);
        };
        ResourceGlobMatcher.prototype.onDidChangeWorkspaceRoots = function () {
            this.updateExcludes(true);
        };
        ResourceGlobMatcher.prototype.updateExcludes = function (fromEvent) {
            var _this = this;
            var changed = false;
            // Add excludes per workspaces that got added
            if (this.contextService.hasWorkspace()) {
                this.contextService.getWorkspace().roots.forEach(function (root) {
                    var rootExcludes = _this.globFn(root);
                    if (!_this.mapRootToExpressionConfig.has(root.toString()) || !objects.equals(_this.mapRootToExpressionConfig.get(root.toString()), rootExcludes)) {
                        changed = true;
                        _this.mapRootToParsedExpression.set(root.toString(), _this.parseFn(rootExcludes));
                        _this.mapRootToExpressionConfig.set(root.toString(), objects.clone(rootExcludes));
                    }
                });
            }
            // Remove excludes per workspace no longer present
            this.mapRootToExpressionConfig.forEach(function (value, root) {
                if (root === ResourceGlobMatcher.NO_ROOT) {
                    return; // always keep this one
                }
                if (!_this.contextService.getRoot(uri_1.default.parse(root))) {
                    _this.mapRootToParsedExpression.delete(root);
                    _this.mapRootToExpressionConfig.delete(root);
                    changed = true;
                }
            });
            // Always set for resources outside root as well
            var globalExcludes = this.globFn();
            if (!this.mapRootToExpressionConfig.has(ResourceGlobMatcher.NO_ROOT) || !objects.equals(this.mapRootToExpressionConfig.get(ResourceGlobMatcher.NO_ROOT), globalExcludes)) {
                changed = true;
                this.mapRootToParsedExpression.set(ResourceGlobMatcher.NO_ROOT, this.parseFn(globalExcludes));
                this.mapRootToExpressionConfig.set(ResourceGlobMatcher.NO_ROOT, objects.clone(globalExcludes));
            }
            if (fromEvent && changed) {
                this._onExpressionChange.fire();
            }
        };
        ResourceGlobMatcher.prototype.matches = function (resource) {
            var root = this.contextService.getRoot(resource);
            var expressionForRoot;
            if (root && this.mapRootToParsedExpression.has(root.toString())) {
                expressionForRoot = this.mapRootToParsedExpression.get(root.toString());
            }
            else {
                expressionForRoot = this.mapRootToParsedExpression.get(ResourceGlobMatcher.NO_ROOT);
            }
            // If the resource if from a workspace, convert its absolute path to a relative
            // path so that glob patterns have a higher probability to match. For example
            // a glob pattern of "src/**" will not match on an absolute path "/folder/src/file.txt"
            // but can match on "src/file.txt"
            var resourcePathToMatch;
            if (root) {
                resourcePathToMatch = paths.normalize(paths.relative(root.fsPath, resource.fsPath));
            }
            else {
                resourcePathToMatch = resource.fsPath;
            }
            return !!expressionForRoot(resourcePathToMatch);
        };
        ResourceGlobMatcher.prototype.dispose = function () {
            this.toUnbind = lifecycle_1.dispose(this.toUnbind);
        };
        ResourceGlobMatcher.NO_ROOT = null;
        ResourceGlobMatcher = __decorate([
            __param(2, workspace_1.IWorkspaceContextService),
            __param(3, configuration_1.IConfigurationService)
        ], ResourceGlobMatcher);
        return ResourceGlobMatcher;
    }());
    exports.ResourceGlobMatcher = ResourceGlobMatcher;
});
//# sourceMappingURL=resources.js.map