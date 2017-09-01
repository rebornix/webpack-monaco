var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", "vs/editor/common/services/modelService", "vs/editor/common/services/modeService", "vs/base/common/winjs.base", "vs/platform/jsonschemas/common/jsonContributionRegistry", "vs/platform/registry/common/platform", "vs/editor/common/services/resolverService", "vs/workbench/parts/preferences/common/preferences"], function (require, exports, modelService_1, modeService_1, winjs_base_1, JSONContributionRegistry, platform_1, resolverService_1, preferences_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var schemaRegistry = platform_1.Registry.as(JSONContributionRegistry.Extensions.JSONContribution);
    var PreferencesContentProvider = (function () {
        function PreferencesContentProvider(modelService, textModelResolverService, preferencesService, modeService) {
            this.modelService = modelService;
            this.textModelResolverService = textModelResolverService;
            this.preferencesService = preferencesService;
            this.modeService = modeService;
            this.start();
        }
        PreferencesContentProvider.prototype.getId = function () {
            return 'vs.contentprovider';
        };
        PreferencesContentProvider.prototype.start = function () {
            var _this = this;
            this.textModelResolverService.registerTextModelContentProvider('vscode', {
                provideTextContent: function (uri) {
                    if (uri.scheme !== 'vscode') {
                        return null;
                    }
                    if (uri.authority === 'schemas') {
                        var schemas = schemaRegistry.getSchemaContributions().schemas;
                        var schema = schemas[uri.toString()];
                        if (schema) {
                            var modelContent = JSON.stringify(schema);
                            var mode = _this.modeService.getOrCreateMode('json');
                            return winjs_base_1.TPromise.as(_this.modelService.createModel(modelContent, mode, uri));
                        }
                    }
                    return _this.preferencesService.resolveContent(uri)
                        .then(function (content) {
                        if (content !== null && content !== void 0) {
                            var mode = _this.modeService.getOrCreateMode('json');
                            var model = _this.modelService.createModel(content, mode, uri);
                            return winjs_base_1.TPromise.as(model);
                        }
                        return null;
                    });
                }
            });
        };
        PreferencesContentProvider = __decorate([
            __param(0, modelService_1.IModelService),
            __param(1, resolverService_1.ITextModelService),
            __param(2, preferences_1.IPreferencesService),
            __param(3, modeService_1.IModeService)
        ], PreferencesContentProvider);
        return PreferencesContentProvider;
    }());
    exports.PreferencesContentProvider = PreferencesContentProvider;
});
//# sourceMappingURL=preferencesContentProvider.js.map