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
define(["require", "exports", "vs/base/common/arrays", "vs/nls", "vs/base/common/event", "vs/base/common/errors", "vs/base/common/winjs.base", "vs/base/common/lifecycle", "vs/platform/telemetry/common/telemetry", "vs/platform/extensionManagement/common/extensionManagement", "vs/platform/extensions/common/extensions", "vs/platform/lifecycle/common/lifecycle", "vs/platform/instantiation/common/instantiation", "vs/platform/storage/common/storage", "vs/platform/message/common/message", "vs/base/common/actions", "vs/platform/extensionManagement/common/extensionManagementUtil"], function (require, exports, arrays, nls_1, event_1, errors_1, winjs_base_1, lifecycle_1, telemetry_1, extensionManagement_1, extensions_1, lifecycle_2, instantiation_1, storage_1, message_1, actions_1, extensionManagementUtil_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var KeymapExtensions = (function () {
        function KeymapExtensions(instantiationService, extensionEnablementService, tipsService, choiceService, lifecycleService, telemetryService) {
            var _this = this;
            this.instantiationService = instantiationService;
            this.extensionEnablementService = extensionEnablementService;
            this.tipsService = tipsService;
            this.choiceService = choiceService;
            this.telemetryService = telemetryService;
            this.disposables = [];
            this.disposables.push(lifecycleService.onShutdown(function () { return _this.dispose(); }), instantiationService.invokeFunction(onExtensionChanged)((function (ids) {
                winjs_base_1.TPromise.join(ids.map(function (id) { return _this.checkForOtherKeymaps(id); }))
                    .then(null, errors_1.onUnexpectedError);
            })));
        }
        KeymapExtensions.prototype.getId = function () {
            return 'vs.extensions.keymapExtensions';
        };
        KeymapExtensions.prototype.checkForOtherKeymaps = function (extensionId) {
            var _this = this;
            return this.instantiationService.invokeFunction(getInstalledExtensions).then(function (extensions) {
                var keymaps = extensions.filter(function (extension) { return isKeymapExtension(_this.tipsService, extension); });
                var extension = arrays.first(keymaps, function (extension) { return extension.identifier === extensionId; });
                if (extension && extension.globallyEnabled) {
                    var otherKeymaps = keymaps.filter(function (extension) { return extension.identifier !== extensionId && extension.globallyEnabled; });
                    if (otherKeymaps.length) {
                        return _this.promptForDisablingOtherKeymaps(extension, otherKeymaps);
                    }
                }
                return undefined;
            });
        };
        KeymapExtensions.prototype.promptForDisablingOtherKeymaps = function (newKeymap, oldKeymaps) {
            var _this = this;
            var telemetryData = {
                newKeymap: newKeymap.identifier,
                oldKeymaps: oldKeymaps.map(function (k) { return k.identifier; })
            };
            this.telemetryService.publicLog('disableOtherKeymapsConfirmation', telemetryData);
            var message = nls_1.localize('disableOtherKeymapsConfirmation', "Disable other keymaps ({0}) to avoid conflicts between keybindings?", oldKeymaps.map(function (k) { return "'" + k.local.manifest.displayName + "'"; }).join(', '));
            var options = [
                nls_1.localize('yes', "Yes"),
                nls_1.localize('no', "No")
            ];
            return this.choiceService.choose(message_1.Severity.Info, message, options, 1, false)
                .then(function (value) {
                var confirmed = value === 0;
                telemetryData['confirmed'] = confirmed;
                _this.telemetryService.publicLog('disableOtherKeymaps', telemetryData);
                if (confirmed) {
                    return winjs_base_1.TPromise.join(oldKeymaps.map(function (keymap) {
                        return _this.extensionEnablementService.setEnablement(keymap.identifier, false);
                    }));
                }
                return undefined;
            }, function (error) { return winjs_base_1.TPromise.wrapError(errors_1.canceled()); })
                .then(function () { });
        };
        KeymapExtensions.prototype.dispose = function () {
            this.disposables = lifecycle_1.dispose(this.disposables);
        };
        KeymapExtensions = __decorate([
            __param(0, instantiation_1.IInstantiationService),
            __param(1, extensionManagement_1.IExtensionEnablementService),
            __param(2, extensionManagement_1.IExtensionTipsService),
            __param(3, message_1.IChoiceService),
            __param(4, lifecycle_2.ILifecycleService),
            __param(5, telemetry_1.ITelemetryService)
        ], KeymapExtensions);
        return KeymapExtensions;
    }());
    exports.KeymapExtensions = KeymapExtensions;
    function onExtensionChanged(accessor) {
        var extensionService = accessor.get(extensionManagement_1.IExtensionManagementService);
        var extensionEnablementService = accessor.get(extensionManagement_1.IExtensionEnablementService);
        return event_1.debounceEvent(event_1.any(event_1.chain(event_1.any(extensionService.onDidInstallExtension, extensionService.onDidUninstallExtension))
            .map(function (e) { return stripVersion(e.id); })
            .event, extensionEnablementService.onEnablementChanged), function (list, id) {
            if (!list) {
                return [id];
            }
            else if (list.indexOf(id) === -1) {
                list.push(id);
            }
            return list;
        });
    }
    exports.onExtensionChanged = onExtensionChanged;
    function getInstalledExtensions(accessor) {
        var extensionService = accessor.get(extensionManagement_1.IExtensionManagementService);
        var extensionEnablementService = accessor.get(extensionManagement_1.IExtensionEnablementService);
        return extensionService.getInstalled().then(function (extensions) {
            var globallyDisabled = extensionEnablementService.getGloballyDisabledExtensions();
            return extensions.map(function (extension) {
                var identifier = stripVersion(extension.id);
                return {
                    identifier: identifier,
                    local: extension,
                    globallyEnabled: globallyDisabled.indexOf(identifier) === -1
                };
            });
        });
    }
    exports.getInstalledExtensions = getInstalledExtensions;
    function isKeymapExtension(tipsService, extension) {
        var cats = extension.local.manifest.categories;
        return cats && cats.indexOf('Keymaps') !== -1 || tipsService.getKeymapRecommendations().indexOf(extension.identifier) !== -1;
    }
    exports.isKeymapExtension = isKeymapExtension;
    function stripVersion(id) {
        return extensionManagementUtil_1.getIdAndVersionFromLocalExtensionId(id).id;
    }
    var BetterMergeDisabled = (function () {
        function BetterMergeDisabled(storageService, messageService, extensionService, extensionManagementService, telemetryService) {
            extensionService.onReady().then(function () {
                if (storageService.getBoolean(extensionManagementUtil_1.BetterMergeDisabledNowKey, storage_1.StorageScope.GLOBAL, false)) {
                    storageService.remove(extensionManagementUtil_1.BetterMergeDisabledNowKey, storage_1.StorageScope.GLOBAL);
                    telemetryService.publicLog('betterMergeDisabled');
                    messageService.show(message_1.Severity.Info, {
                        message: nls_1.localize('betterMergeDisabled', "The Better Merge extension is now built-in, the installed extension was disabled and can be uninstalled."),
                        actions: [
                            new actions_1.Action('uninstall', nls_1.localize('uninstall', "Uninstall"), null, true, function () {
                                telemetryService.publicLog('betterMergeUninstall', {
                                    outcome: 'uninstall',
                                });
                                return extensionManagementService.getInstalled(extensionManagement_1.LocalExtensionType.User).then(function (extensions) {
                                    return Promise.all(extensions.filter(function (e) { return stripVersion(e.id) === extensionManagementUtil_1.BetterMergeId; })
                                        .map(function (e) { return extensionManagementService.uninstall(e, true); }));
                                });
                            }),
                            new actions_1.Action('later', nls_1.localize('later', "Later"), null, true, function () {
                                telemetryService.publicLog('betterMergeUninstall', {
                                    outcome: 'later',
                                });
                                return winjs_base_1.TPromise.as(true);
                            })
                        ]
                    });
                }
            });
        }
        BetterMergeDisabled.prototype.getId = function () {
            return 'vs.extensions.betterMergeDisabled';
        };
        BetterMergeDisabled = __decorate([
            __param(0, storage_1.IStorageService),
            __param(1, message_1.IMessageService),
            __param(2, extensions_1.IExtensionService),
            __param(3, extensionManagement_1.IExtensionManagementService),
            __param(4, telemetry_1.ITelemetryService)
        ], BetterMergeDisabled);
        return BetterMergeDisabled;
    }());
    exports.BetterMergeDisabled = BetterMergeDisabled;
});
//# sourceMappingURL=extensionsUtils.js.map