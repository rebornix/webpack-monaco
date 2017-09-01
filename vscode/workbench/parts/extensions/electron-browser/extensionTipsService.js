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
define(["require", "exports", "vs/nls", "vs/base/common/paths", "vs/base/common/winjs.base", "vs/base/common/collections", "vs/base/common/lifecycle", "vs/base/common/glob", "vs/base/common/json", "vs/platform/extensionManagement/common/extensionManagement", "vs/editor/common/services/modelService", "vs/platform/storage/common/storage", "vs/platform/node/product", "vs/platform/message/common/message", "vs/platform/instantiation/common/instantiation", "vs/workbench/parts/extensions/browser/extensionsActions", "vs/base/common/severity", "vs/platform/workspace/common/workspace", "vs/base/common/network", "vs/platform/files/common/files", "vs/workbench/parts/extensions/common/extensions", "vs/platform/configuration/common/configuration", "vs/workbench/services/configuration/common/configurationEditing", "vs/platform/telemetry/common/telemetry", "child_process", "vs/base/common/arrays"], function (require, exports, nls_1, paths, winjs_base_1, collections_1, lifecycle_1, glob_1, json, extensionManagement_1, modelService_1, storage_1, product_1, message_1, instantiation_1, extensionsActions_1, severity_1, workspace_1, network_1, files_1, extensions_1, configuration_1, configurationEditing_1, telemetry_1, cp, arrays_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var empty = Object.create(null);
    var milliSecondsInADay = 1000 * 60 * 60 * 24;
    var ExtensionTipsService = (function () {
        function ExtensionTipsService(_galleryService, _modelService, storageService, choiceService, extensionsService, instantiationService, fileService, contextService, configurationService, configurationEditingService, messageService, telemetryService) {
            this._galleryService = _galleryService;
            this._modelService = _modelService;
            this.storageService = storageService;
            this.choiceService = choiceService;
            this.extensionsService = extensionsService;
            this.instantiationService = instantiationService;
            this.fileService = fileService;
            this.contextService = contextService;
            this.configurationService = configurationService;
            this.configurationEditingService = configurationEditingService;
            this.messageService = messageService;
            this.telemetryService = telemetryService;
            this._fileBasedRecommendations = Object.create(null);
            this._exeBasedRecommendations = [];
            this._availableRecommendations = Object.create(null);
            this.importantRecommendations = Object.create(null);
            this._disposables = [];
            if (!this._galleryService.isEnabled()) {
                return;
            }
            this._suggestTips();
            this._suggestWorkspaceRecommendations();
            this._suggestBasedOnExecutables();
        }
        ExtensionTipsService.prototype.getWorkspaceRecommendations = function () {
            if (!this.contextService.hasWorkspace()) {
                return winjs_base_1.TPromise.as([]);
            }
            return this.fileService.resolveContent(this.contextService.toResource(paths.join('.vscode', 'extensions.json'))).then(function (content) {
                var extensionsContent = json.parse(content.value, []);
                if (extensionsContent.recommendations) {
                    var regEx_1 = new RegExp(extensionManagement_1.EXTENSION_IDENTIFIER_PATTERN);
                    return extensionsContent.recommendations.filter(function (element, position) {
                        return extensionsContent.recommendations.indexOf(element) === position && regEx_1.test(element);
                    });
                }
                return [];
            }, function (err) { return []; });
        };
        ExtensionTipsService.prototype.getRecommendations = function () {
            var allRecomendations = this._getAllRecommendationsInProduct();
            var fileBased = Object.keys(this._fileBasedRecommendations)
                .filter(function (recommendation) { return allRecomendations.indexOf(recommendation) !== -1; });
            var exeBased = arrays_1.distinct(this._exeBasedRecommendations);
            this.telemetryService.publicLog('extensionRecommendations:unfiltered', { fileBased: fileBased, exeBased: exeBased });
            return arrays_1.distinct(fileBased.concat(exeBased));
        };
        ExtensionTipsService.prototype.getKeymapRecommendations = function () {
            return product_1.default.keymapExtensionTips || [];
        };
        ExtensionTipsService.prototype._getAllRecommendationsInProduct = function () {
            var _this = this;
            if (!this._allRecommendations) {
                this._allRecommendations = Object.keys(this.importantRecommendations).slice();
                collections_1.forEach(this._availableRecommendations, function (_a) {
                    var ids = _a.value;
                    (_b = _this._allRecommendations).push.apply(_b, ids);
                    var _b;
                });
            }
            return this._allRecommendations;
        };
        ExtensionTipsService.prototype._suggestTips = function () {
            var _this = this;
            var extensionTips = product_1.default.extensionTips;
            if (!extensionTips) {
                return;
            }
            this.importantRecommendations = product_1.default.extensionImportantTips || Object.create(null);
            this.importantRecommendationsIgnoreList = JSON.parse(this.storageService.get('extensionsAssistant/importantRecommendationsIgnore', storage_1.StorageScope.GLOBAL, '[]'));
            // retrieve ids of previous recommendations
            var storedRecommendationsJson = JSON.parse(this.storageService.get('extensionsAssistant/recommendations', storage_1.StorageScope.GLOBAL, '[]'));
            if (Array.isArray(storedRecommendationsJson)) {
                for (var _i = 0, _a = storedRecommendationsJson; _i < _a.length; _i++) {
                    var id = _a[_i];
                    this._fileBasedRecommendations[id] = Date.now();
                }
            }
            else {
                var now_1 = Date.now();
                collections_1.forEach(storedRecommendationsJson, function (entry) {
                    if (typeof entry.value === 'number') {
                        var diff = (now_1 - entry.value) / milliSecondsInADay;
                        if (diff > 7) {
                            delete _this._fileBasedRecommendations[entry.value];
                        }
                        else {
                            _this._fileBasedRecommendations[entry.key] = entry.value;
                        }
                    }
                });
            }
            // group ids by pattern, like {**/*.md} -> [ext.foo1, ext.bar2]
            this._availableRecommendations = Object.create(null);
            collections_1.forEach(extensionTips, function (entry) {
                var id = entry.key, pattern = entry.value;
                var ids = _this._availableRecommendations[pattern];
                if (!ids) {
                    _this._availableRecommendations[pattern] = [id];
                }
                else {
                    ids.push(id);
                }
            });
            collections_1.forEach(product_1.default.extensionImportantTips, function (entry) {
                var id = entry.key, value = entry.value;
                var pattern = value.pattern;
                var ids = _this._availableRecommendations[pattern];
                if (!ids) {
                    _this._availableRecommendations[pattern] = [id];
                }
                else {
                    ids.push(id);
                }
            });
            this._modelService.onModelAdded(this._suggest, this, this._disposables);
            this._modelService.getModels().forEach(function (model) { return _this._suggest(model); });
        };
        ExtensionTipsService.prototype._suggest = function (model) {
            var _this = this;
            var uri = model.uri;
            if (!uri) {
                return;
            }
            if (uri.scheme === network_1.Schemas.inMemory || uri.scheme === network_1.Schemas.internal || uri.scheme === network_1.Schemas.vscode) {
                return;
            }
            // re-schedule this bit of the operation to be off
            // the critical path - in case glob-match is slow
            setImmediate(function () {
                var now = Date.now();
                collections_1.forEach(_this._availableRecommendations, function (entry) {
                    var pattern = entry.key, ids = entry.value;
                    if (glob_1.match(pattern, uri.fsPath)) {
                        for (var _i = 0, ids_1 = ids; _i < ids_1.length; _i++) {
                            var id = ids_1[_i];
                            _this._fileBasedRecommendations[id] = now;
                        }
                    }
                });
                _this.storageService.store('extensionsAssistant/recommendations', JSON.stringify(_this._fileBasedRecommendations), storage_1.StorageScope.GLOBAL);
                var config = _this.configurationService.getConfiguration(extensions_1.ConfigurationKey);
                if (config.ignoreRecommendations) {
                    return;
                }
                _this.extensionsService.getInstalled(extensionManagement_1.LocalExtensionType.User).done(function (local) {
                    Object.keys(_this.importantRecommendations)
                        .filter(function (id) { return _this.importantRecommendationsIgnoreList.indexOf(id) === -1; })
                        .filter(function (id) { return local.every(function (local) { return local.manifest.publisher + "." + local.manifest.name !== id; }); })
                        .forEach(function (id) {
                        var _a = _this.importantRecommendations[id], pattern = _a.pattern, name = _a.name;
                        if (!glob_1.match(pattern, uri.fsPath)) {
                            return;
                        }
                        var message = nls_1.localize('reallyRecommended2', "The '{0}' extension is recommended for this file type.", name);
                        var recommendationsAction = _this.instantiationService.createInstance(extensionsActions_1.ShowRecommendedExtensionsAction, extensionsActions_1.ShowRecommendedExtensionsAction.ID, nls_1.localize('showRecommendations', "Show Recommendations"));
                        var options = [
                            recommendationsAction.label,
                            nls_1.localize('neverShowAgain', "Don't show again"),
                            nls_1.localize('close', "Close")
                        ];
                        _this.choiceService.choose(severity_1.default.Info, message, options, 2).done(function (choice) {
                            switch (choice) {
                                case 0:
                                    _this.telemetryService.publicLog('extensionRecommendations:popup', { userReaction: 'show' });
                                    return recommendationsAction.run();
                                case 1:
                                    _this.importantRecommendationsIgnoreList.push(id);
                                    _this.storageService.store('extensionsAssistant/importantRecommendationsIgnore', JSON.stringify(_this.importantRecommendationsIgnoreList), storage_1.StorageScope.GLOBAL);
                                    _this.telemetryService.publicLog('extensionRecommendations:popup', { userReaction: 'neverShowAgain' });
                                    return _this.ignoreExtensionRecommendations();
                            }
                        }, function () {
                            _this.telemetryService.publicLog('extensionRecommendations:popup', { userReaction: 'cancelled' });
                        });
                    });
                });
            });
        };
        ExtensionTipsService.prototype._suggestWorkspaceRecommendations = function () {
            var _this = this;
            var storageKey = 'extensionsAssistant/workspaceRecommendationsIgnore';
            if (this.storageService.getBoolean(storageKey, storage_1.StorageScope.WORKSPACE, false)) {
                return;
            }
            var config = this.configurationService.getConfiguration(extensions_1.ConfigurationKey);
            if (config.ignoreRecommendations) {
                return;
            }
            this.getWorkspaceRecommendations().done(function (allRecommendations) {
                if (!allRecommendations.length) {
                    return;
                }
                _this.extensionsService.getInstalled(extensionManagement_1.LocalExtensionType.User).done(function (local) {
                    var recommendations = allRecommendations
                        .filter(function (id) { return local.every(function (local) { return local.manifest.publisher + "." + local.manifest.name !== id; }); });
                    if (!recommendations.length) {
                        return;
                    }
                    var message = nls_1.localize('workspaceRecommended', "This workspace has extension recommendations.");
                    var action = _this.instantiationService.createInstance(extensionsActions_1.ShowWorkspaceRecommendedExtensionsAction, extensionsActions_1.ShowWorkspaceRecommendedExtensionsAction.ID, nls_1.localize('showRecommendations', "Show Recommendations"));
                    var options = [
                        action.label,
                        nls_1.localize('neverShowAgain', "Don't show again"),
                        nls_1.localize('close', "Close")
                    ];
                    _this.choiceService.choose(severity_1.default.Info, message, options, 2).done(function (choice) {
                        switch (choice) {
                            case 0:
                                _this.telemetryService.publicLog('extensionWorkspaceRecommendations:popup', { userReaction: 'show' });
                                return action.run();
                            case 1:
                                _this.telemetryService.publicLog('extensionWorkspaceRecommendations:popup', { userReaction: 'neverShowAgain' });
                                return _this.storageService.store(storageKey, true, storage_1.StorageScope.WORKSPACE);
                        }
                    }, function () {
                        _this.telemetryService.publicLog('extensionWorkspaceRecommendations:popup', { userReaction: 'cancelled' });
                    });
                });
            });
        };
        ExtensionTipsService.prototype.ignoreExtensionRecommendations = function () {
            var _this = this;
            var message = nls_1.localize('ignoreExtensionRecommendations', "Do you want to ignore all extension recommendations ?");
            var options = [
                nls_1.localize('ignoreAll', "Yes, Ignore All"),
                nls_1.localize('no', "No"),
                nls_1.localize('cancel', "Cancel")
            ];
            this.choiceService.choose(severity_1.default.Info, message, options, 2).done(function (choice) {
                switch (choice) {
                    case 0:// If the user ignores the current message and selects different file type
                        // we should hide all the stacked up messages as he has selected Yes, Ignore All
                        _this.messageService.hideAll();
                        return _this.setIgnoreRecommendationsConfig(true);
                    case 1: return _this.setIgnoreRecommendationsConfig(false);
                }
            });
        };
        ExtensionTipsService.prototype._suggestBasedOnExecutables = function () {
            var _this = this;
            var cmd = process.platform === 'win32' ? 'where' : 'which';
            collections_1.forEach(product_1.default.exeBasedExtensionTips, function (entry) {
                cp.exec(cmd + " " + entry.value.replace(/,/g, ' '), function (err, stdout, stderr) {
                    if (stdout) {
                        _this._exeBasedRecommendations.push(entry.key);
                    }
                });
            });
        };
        ExtensionTipsService.prototype.setIgnoreRecommendationsConfig = function (configVal) {
            var target = configurationEditing_1.ConfigurationTarget.USER;
            var configKey = 'extensions.ignoreRecommendations';
            this.configurationEditingService.writeConfiguration(target, { key: configKey, value: configVal });
            if (configVal) {
                var ignoreWorkspaceRecommendationsStorageKey = 'extensionsAssistant/workspaceRecommendationsIgnore';
                this.storageService.store(ignoreWorkspaceRecommendationsStorageKey, true, storage_1.StorageScope.WORKSPACE);
            }
        };
        ExtensionTipsService.prototype.getKeywordsForExtension = function (extension) {
            var keywords = product_1.default.extensionKeywords || {};
            return keywords[extension] || [];
        };
        ExtensionTipsService.prototype.getRecommendationsForExtension = function (extension) {
            var str = "." + extension;
            var result = Object.create(null);
            collections_1.forEach(product_1.default.extensionTips || empty, function (entry) {
                var id = entry.key, pattern = entry.value;
                if (glob_1.match(pattern, str)) {
                    result[id] = true;
                }
            });
            collections_1.forEach(product_1.default.extensionImportantTips || empty, function (entry) {
                var id = entry.key, value = entry.value;
                if (glob_1.match(value.pattern, str)) {
                    result[id] = true;
                }
            });
            return Object.keys(result);
        };
        ExtensionTipsService.prototype.dispose = function () {
            this._disposables = lifecycle_1.dispose(this._disposables);
        };
        ExtensionTipsService = __decorate([
            __param(0, extensionManagement_1.IExtensionGalleryService),
            __param(1, modelService_1.IModelService),
            __param(2, storage_1.IStorageService),
            __param(3, message_1.IChoiceService),
            __param(4, extensionManagement_1.IExtensionManagementService),
            __param(5, instantiation_1.IInstantiationService),
            __param(6, files_1.IFileService),
            __param(7, workspace_1.IWorkspaceContextService),
            __param(8, configuration_1.IConfigurationService),
            __param(9, configurationEditing_1.IConfigurationEditingService),
            __param(10, message_1.IMessageService),
            __param(11, telemetry_1.ITelemetryService)
        ], ExtensionTipsService);
        return ExtensionTipsService;
    }());
    exports.ExtensionTipsService = ExtensionTipsService;
});
//# sourceMappingURL=extensionTipsService.js.map