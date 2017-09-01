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
define(["require", "exports", "vs/nls", "vs/base/node/pfs", "semver", "path", "vs/base/common/event", "vs/base/common/arrays", "vs/base/common/objects", "vs/base/common/async", "vs/base/common/errors", "vs/base/common/winjs.base", "vs/base/common/lifecycle", "vs/base/common/paging", "vs/platform/telemetry/common/telemetry", "vs/platform/extensionManagement/common/extensionManagement", "vs/platform/extensionManagement/common/extensionManagementUtil", "vs/platform/instantiation/common/instantiation", "vs/platform/configuration/common/configuration", "vs/workbench/services/configuration/common/configurationEditing", "vs/platform/message/common/message", "vs/base/common/severity", "vs/base/common/uri", "vs/workbench/parts/extensions/common/extensions", "vs/workbench/services/editor/common/editorService", "vs/platform/url/common/url", "vs/workbench/parts/extensions/common/extensionsInput", "vs/platform/workspace/common/workspace", "vs/platform/node/product"], function (require, exports, nls, pfs_1, semver, path, event_1, arrays_1, objects_1, async_1, errors_1, winjs_base_1, lifecycle_1, paging_1, telemetry_1, extensionManagement_1, extensionManagementUtil_1, instantiation_1, configuration_1, configurationEditing_1, message_1, severity_1, uri_1, extensions_1, editorService_1, url_1, extensionsInput_1, workspace_1, product_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var Extension = (function () {
        function Extension(galleryService, stateProvider, local, gallery) {
            if (gallery === void 0) { gallery = null; }
            this.galleryService = galleryService;
            this.stateProvider = stateProvider;
            this.local = local;
            this.gallery = gallery;
            this.disabledGlobally = false;
            this.disabledForWorkspace = false;
        }
        Object.defineProperty(Extension.prototype, "type", {
            get: function () {
                return this.local ? this.local.type : null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Extension.prototype, "name", {
            get: function () {
                return this.gallery ? this.gallery.name : this.local.manifest.name;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Extension.prototype, "displayName", {
            get: function () {
                if (this.gallery) {
                    return this.gallery.displayName || this.gallery.name;
                }
                return this.local.manifest.displayName || this.local.manifest.name;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Extension.prototype, "id", {
            get: function () {
                if (this.gallery) {
                    return this.gallery.id;
                }
                return extensionManagementUtil_1.getGalleryExtensionIdFromLocal(this.local);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Extension.prototype, "publisher", {
            get: function () {
                return this.gallery ? this.gallery.publisher : this.local.manifest.publisher;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Extension.prototype, "publisherDisplayName", {
            get: function () {
                if (this.gallery) {
                    return this.gallery.publisherDisplayName || this.gallery.publisher;
                }
                if (this.local.metadata && this.local.metadata.publisherDisplayName) {
                    return this.local.metadata.publisherDisplayName;
                }
                return this.local.manifest.publisher;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Extension.prototype, "version", {
            get: function () {
                return this.local ? this.local.manifest.version : this.gallery.version;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Extension.prototype, "latestVersion", {
            get: function () {
                return this.gallery ? this.gallery.version : this.local.manifest.version;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Extension.prototype, "description", {
            get: function () {
                return this.gallery ? this.gallery.description : this.local.manifest.description;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Extension.prototype, "url", {
            get: function () {
                if (!product_1.default.extensionsGallery) {
                    return null;
                }
                return product_1.default.extensionsGallery.itemUrl + "?itemName=" + this.publisher + "." + this.name;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Extension.prototype, "iconUrl", {
            get: function () {
                return this.galleryIconUrl || this.localIconUrl || this.defaultIconUrl;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Extension.prototype, "iconUrlFallback", {
            get: function () {
                return this.galleryIconUrlFallback || this.localIconUrl || this.defaultIconUrl;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Extension.prototype, "localIconUrl", {
            get: function () {
                return this.local && this.local.manifest.icon
                    && uri_1.default.file(path.join(this.local.path, this.local.manifest.icon)).toString();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Extension.prototype, "galleryIconUrl", {
            get: function () {
                return this.gallery && this.gallery.assets.icon.uri;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Extension.prototype, "galleryIconUrlFallback", {
            get: function () {
                return this.gallery && this.gallery.assets.icon.fallbackUri;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Extension.prototype, "defaultIconUrl", {
            get: function () {
                return require.toUrl('../browser/media/defaultIcon.png');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Extension.prototype, "licenseUrl", {
            get: function () {
                return this.gallery && this.gallery.assets.license && this.gallery.assets.license.uri;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Extension.prototype, "state", {
            get: function () {
                return this.stateProvider(this);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Extension.prototype, "installCount", {
            get: function () {
                return this.gallery ? this.gallery.installCount : null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Extension.prototype, "rating", {
            get: function () {
                return this.gallery ? this.gallery.rating : null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Extension.prototype, "ratingCount", {
            get: function () {
                return this.gallery ? this.gallery.ratingCount : null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Extension.prototype, "outdated", {
            get: function () {
                return !!this.gallery && this.type === extensionManagement_1.LocalExtensionType.User && semver.gt(this.latestVersion, this.version);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Extension.prototype, "telemetryData", {
            get: function () {
                var _a = this, local = _a.local, gallery = _a.gallery;
                if (gallery) {
                    return extensionManagementUtil_1.getGalleryExtensionTelemetryData(gallery);
                }
                else {
                    return extensionManagementUtil_1.getLocalExtensionTelemetryData(local);
                }
            },
            enumerable: true,
            configurable: true
        });
        Extension.prototype.getManifest = function () {
            if (this.gallery) {
                return this.galleryService.getManifest(this.gallery);
            }
            return winjs_base_1.TPromise.as(this.local.manifest);
        };
        Extension.prototype.getReadme = function () {
            if (this.gallery) {
                return this.galleryService.getReadme(this.gallery);
            }
            if (this.local && this.local.readmeUrl) {
                var uri = uri_1.default.parse(this.local.readmeUrl);
                return pfs_1.readFile(uri.fsPath, 'utf8');
            }
            return winjs_base_1.TPromise.wrapError(new Error('not available'));
        };
        Extension.prototype.getChangelog = function () {
            if (this.gallery && this.gallery.assets.changelog) {
                return this.galleryService.getChangelog(this.gallery);
            }
            var changelogUrl = this.local && this.local.changelogUrl;
            if (!changelogUrl) {
                return winjs_base_1.TPromise.wrapError(new Error('not available'));
            }
            var uri = uri_1.default.parse(changelogUrl);
            if (uri.scheme === 'file') {
                return pfs_1.readFile(uri.fsPath, 'utf8');
            }
            return winjs_base_1.TPromise.wrapError(new Error('not available'));
        };
        Object.defineProperty(Extension.prototype, "dependencies", {
            get: function () {
                var _a = this, local = _a.local, gallery = _a.gallery;
                if (local && local.manifest.extensionDependencies) {
                    return local.manifest.extensionDependencies;
                }
                if (gallery) {
                    return gallery.properties.dependencies;
                }
                return [];
            },
            enumerable: true,
            configurable: true
        });
        return Extension;
    }());
    var ExtensionDependencies = (function () {
        function ExtensionDependencies(_extension, _identifier, _map, _dependent) {
            if (_dependent === void 0) { _dependent = null; }
            this._extension = _extension;
            this._identifier = _identifier;
            this._map = _map;
            this._dependent = _dependent;
            this._hasDependencies = null;
        }
        Object.defineProperty(ExtensionDependencies.prototype, "hasDependencies", {
            get: function () {
                if (this._hasDependencies === null) {
                    this._hasDependencies = this.computeHasDependencies();
                }
                return this._hasDependencies;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ExtensionDependencies.prototype, "extension", {
            get: function () {
                return this._extension;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ExtensionDependencies.prototype, "identifier", {
            get: function () {
                return this._identifier;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ExtensionDependencies.prototype, "dependent", {
            get: function () {
                return this._dependent;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ExtensionDependencies.prototype, "dependencies", {
            get: function () {
                var _this = this;
                if (!this.hasDependencies) {
                    return [];
                }
                return this._extension.dependencies.map(function (d) { return new ExtensionDependencies(_this._map.get(d), d, _this._map, _this); });
            },
            enumerable: true,
            configurable: true
        });
        ExtensionDependencies.prototype.computeHasDependencies = function () {
            if (this._extension && this._extension.dependencies.length > 0) {
                var dependent = this._dependent;
                while (dependent !== null) {
                    if (dependent.identifier === this.identifier) {
                        return false;
                    }
                    dependent = dependent.dependent;
                }
                return true;
            }
            return false;
        };
        return ExtensionDependencies;
    }());
    var Operation;
    (function (Operation) {
        Operation[Operation["Installing"] = 0] = "Installing";
        Operation[Operation["Updating"] = 1] = "Updating";
        Operation[Operation["Uninstalling"] = 2] = "Uninstalling";
    })(Operation || (Operation = {}));
    function toTelemetryEventName(operation) {
        switch (operation) {
            case Operation.Installing: return 'extensionGallery:install';
            case Operation.Updating: return 'extensionGallery:update';
            case Operation.Uninstalling: return 'extensionGallery:uninstall';
        }
        return '';
    }
    var ExtensionsWorkbenchService = (function () {
        function ExtensionsWorkbenchService(instantiationService, editorService, extensionService, galleryService, configurationService, configurationEditingService, telemetryService, messageService, choiceService, urlService, extensionEnablementService, tipsService, workspaceContextService) {
            var _this = this;
            this.instantiationService = instantiationService;
            this.editorService = editorService;
            this.extensionService = extensionService;
            this.galleryService = galleryService;
            this.configurationService = configurationService;
            this.configurationEditingService = configurationEditingService;
            this.telemetryService = telemetryService;
            this.messageService = messageService;
            this.choiceService = choiceService;
            this.extensionEnablementService = extensionEnablementService;
            this.tipsService = tipsService;
            this.workspaceContextService = workspaceContextService;
            this.installing = [];
            this.uninstalling = [];
            this.installed = [];
            this.disposables = [];
            this._onChange = new event_1.Emitter();
            this.stateProvider = function (ext) { return _this.getExtensionState(ext); };
            extensionService.onInstallExtension(this.onInstallExtension, this, this.disposables);
            extensionService.onDidInstallExtension(this.onDidInstallExtension, this, this.disposables);
            extensionService.onUninstallExtension(this.onUninstallExtension, this, this.disposables);
            extensionService.onDidUninstallExtension(this.onDidUninstallExtension, this, this.disposables);
            extensionEnablementService.onEnablementChanged(this.onEnablementChanged, this, this.disposables);
            this.syncDelayer = new async_1.ThrottledDelayer(ExtensionsWorkbenchService.SyncPeriod);
            this.autoUpdateDelayer = new async_1.ThrottledDelayer(1000);
            event_1.chain(urlService.onOpenURL)
                .filter(function (uri) { return /^extension/.test(uri.path); })
                .on(this.onOpenExtensionUrl, this, this.disposables);
            this._isAutoUpdateEnabled = this.configurationService.getConfiguration(extensions_1.ConfigurationKey).autoUpdate;
            this.configurationService.onDidUpdateConfiguration(function () {
                var isAutoUpdateEnabled = _this.configurationService.getConfiguration(extensions_1.ConfigurationKey).autoUpdate;
                if (_this._isAutoUpdateEnabled !== isAutoUpdateEnabled) {
                    _this._isAutoUpdateEnabled = isAutoUpdateEnabled;
                    if (_this._isAutoUpdateEnabled) {
                        _this.checkForUpdates();
                    }
                }
            }, this, this.disposables);
            this.queryLocal().done(function () { return _this.eventuallySyncWithGallery(true); });
        }
        Object.defineProperty(ExtensionsWorkbenchService.prototype, "onChange", {
            get: function () { return this._onChange.event; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ExtensionsWorkbenchService.prototype, "local", {
            get: function () {
                var _this = this;
                var installing = this.installing
                    .filter(function (e) { return !_this.installed.some(function (installed) { return installed.id === e.extension.id; }); })
                    .map(function (e) { return e.extension; });
                return this.installed.concat(installing);
            },
            enumerable: true,
            configurable: true
        });
        ExtensionsWorkbenchService.prototype.queryLocal = function () {
            var _this = this;
            return this.extensionService.getInstalled().then(function (result) {
                var installedById = arrays_1.index(_this.installed, function (e) { return e.local.id; });
                var globallyDisabledExtensions = _this.extensionEnablementService.getGloballyDisabledExtensions();
                var workspaceDisabledExtensions = _this.extensionEnablementService.getWorkspaceDisabledExtensions();
                _this.installed = result.map(function (local) {
                    var extension = installedById[local.id] || new Extension(_this.galleryService, _this.stateProvider, local);
                    extension.local = local;
                    extension.disabledGlobally = globallyDisabledExtensions.indexOf(extension.id) !== -1;
                    extension.disabledForWorkspace = workspaceDisabledExtensions.indexOf(extension.id) !== -1;
                    return extension;
                });
                _this._onChange.fire();
                return _this.local;
            });
        };
        ExtensionsWorkbenchService.prototype.queryGallery = function (options) {
            var _this = this;
            if (options === void 0) { options = {}; }
            return this.galleryService.query(options)
                .then(function (result) { return paging_1.mapPager(result, function (gallery) { return _this.fromGallery(gallery); }); })
                .then(null, function (err) {
                if (/No extension gallery service configured/.test(err.message)) {
                    return winjs_base_1.TPromise.as(paging_1.singlePagePager([]));
                }
                return winjs_base_1.TPromise.wrapError(err);
            });
        };
        ExtensionsWorkbenchService.prototype.loadDependencies = function (extension) {
            var _this = this;
            if (!extension.dependencies.length) {
                return winjs_base_1.TPromise.wrap(null);
            }
            return this.galleryService.getAllDependencies(extension.gallery)
                .then(function (galleryExtensions) { return galleryExtensions.map(function (galleryExtension) { return _this.fromGallery(galleryExtension); }); })
                .then(function (extensions) { return _this.local.concat(extensions); })
                .then(function (extensions) {
                var map = new Map();
                for (var _i = 0, extensions_2 = extensions; _i < extensions_2.length; _i++) {
                    var extension_1 = extensions_2[_i];
                    map.set(extension_1.id, extension_1);
                }
                return new ExtensionDependencies(extension, extension.id, map);
            });
        };
        ExtensionsWorkbenchService.prototype.open = function (extension, sideByside) {
            if (sideByside === void 0) { sideByside = false; }
            this.telemetryService.publicLog('extensionGallery:open', extension.telemetryData);
            return this.editorService.openEditor(this.instantiationService.createInstance(extensionsInput_1.ExtensionsInput, extension), null, sideByside);
        };
        ExtensionsWorkbenchService.prototype.fromGallery = function (gallery) {
            var _this = this;
            var installed = this.installed.filter(function (installed) { return installed.id === gallery.id; })[0];
            if (installed) {
                // Loading the compatible version only there is an engine property
                // Otherwise falling back to old way so that we will not make many roundtrips
                if (gallery.properties.engine) {
                    this.galleryService.loadCompatibleVersion(gallery).then(function (compatible) { return _this.syncLocalWithGalleryExtension(installed, compatible); });
                }
                else {
                    this.syncLocalWithGalleryExtension(installed, gallery);
                }
                return installed;
            }
            return new Extension(this.galleryService, this.stateProvider, null, gallery);
        };
        ExtensionsWorkbenchService.prototype.syncLocalWithGalleryExtension = function (local, gallery) {
            local.gallery = gallery;
            this._onChange.fire();
            this.eventuallyAutoUpdateExtensions();
        };
        ExtensionsWorkbenchService.prototype.checkForUpdates = function () {
            var _this = this;
            return this.syncDelayer.trigger(function () { return _this.syncWithGallery(); }, 0);
        };
        Object.defineProperty(ExtensionsWorkbenchService.prototype, "isAutoUpdateEnabled", {
            get: function () {
                return this._isAutoUpdateEnabled;
            },
            enumerable: true,
            configurable: true
        });
        ExtensionsWorkbenchService.prototype.setAutoUpdate = function (autoUpdate) {
            if (this.isAutoUpdateEnabled === autoUpdate) {
                return winjs_base_1.TPromise.as(null);
            }
            return this.configurationEditingService.writeConfiguration(configurationEditing_1.ConfigurationTarget.USER, { key: 'extensions.autoUpdate', value: autoUpdate });
        };
        ExtensionsWorkbenchService.prototype.eventuallySyncWithGallery = function (immediate) {
            var _this = this;
            if (immediate === void 0) { immediate = false; }
            var loop = function () { return _this.syncWithGallery().then(function () { return _this.eventuallySyncWithGallery(); }); };
            var delay = immediate ? 0 : ExtensionsWorkbenchService.SyncPeriod;
            this.syncDelayer.trigger(loop, delay)
                .done(null, function (err) { return null; });
        };
        ExtensionsWorkbenchService.prototype.syncWithGallery = function () {
            var names = this.installed
                .filter(function (e) { return e.type === extensionManagement_1.LocalExtensionType.User; })
                .map(function (e) { return e.id; });
            if (names.length === 0) {
                return winjs_base_1.TPromise.as(null);
            }
            return this.queryGallery({ names: names, pageSize: names.length });
        };
        ExtensionsWorkbenchService.prototype.eventuallyAutoUpdateExtensions = function () {
            var _this = this;
            this.autoUpdateDelayer.trigger(function () { return _this.autoUpdateExtensions(); })
                .done(null, function (err) { return null; });
        };
        ExtensionsWorkbenchService.prototype.autoUpdateExtensions = function () {
            var _this = this;
            if (!this.isAutoUpdateEnabled) {
                return winjs_base_1.TPromise.as(null);
            }
            var toUpdate = this.local.filter(function (e) { return e.outdated && (e.state !== extensions_1.ExtensionState.Installing); });
            return winjs_base_1.TPromise.join(toUpdate.map(function (e) { return _this.install(e, false); }));
        };
        ExtensionsWorkbenchService.prototype.canInstall = function (extension) {
            if (!(extension instanceof Extension)) {
                return false;
            }
            return !!extension.gallery;
        };
        ExtensionsWorkbenchService.prototype.install = function (extension, promptToInstallDependencies) {
            if (promptToInstallDependencies === void 0) { promptToInstallDependencies = true; }
            if (typeof extension === 'string') {
                return this.extensionService.install(extension);
            }
            if (!(extension instanceof Extension)) {
                return undefined;
            }
            var ext = extension;
            var gallery = ext.gallery;
            if (!gallery) {
                return winjs_base_1.TPromise.wrapError(new Error('Missing gallery'));
            }
            return this.extensionService.installFromGallery(gallery, promptToInstallDependencies);
        };
        ExtensionsWorkbenchService.prototype.setEnablement = function (extension, enable, workspace) {
            var _this = this;
            if (workspace === void 0) { workspace = false; }
            if (extension.type === extensionManagement_1.LocalExtensionType.System) {
                return winjs_base_1.TPromise.wrap(void 0);
            }
            return this.promptAndSetEnablement(extension, enable, workspace).then(function (reload) {
                _this.telemetryService.publicLog(enable ? 'extension:enable' : 'extension:disable', extension.telemetryData);
            });
        };
        ExtensionsWorkbenchService.prototype.uninstall = function (extension) {
            if (!(extension instanceof Extension)) {
                return undefined;
            }
            var ext = extension;
            var local = ext.local || this.installed.filter(function (e) { return e.id === extension.id; })[0].local;
            if (!local) {
                return winjs_base_1.TPromise.wrapError(new Error('Missing local'));
            }
            return this.extensionService.uninstall(local);
        };
        ExtensionsWorkbenchService.prototype.promptAndSetEnablement = function (extension, enable, workspace) {
            var allDependencies = this.getDependenciesRecursively(extension, this.local, enable, workspace, []);
            if (allDependencies.length > 0) {
                if (enable) {
                    return this.promptForDependenciesAndEnable(extension, allDependencies, workspace);
                }
                else {
                    return this.promptForDependenciesAndDisable(extension, allDependencies, workspace);
                }
            }
            return this.checkAndSetEnablement(extension, [], enable, workspace);
        };
        ExtensionsWorkbenchService.prototype.promptForDependenciesAndEnable = function (extension, dependencies, workspace) {
            var _this = this;
            var message = nls.localize('enableDependeciesConfirmation', "Enabling '{0}' also enable its dependencies. Would you like to continue?", extension.displayName);
            var options = [
                nls.localize('enable', "Yes"),
                nls.localize('doNotEnable', "No")
            ];
            return this.choiceService.choose(severity_1.default.Info, message, options, 1, true)
                .then(function (value) {
                if (value === 0) {
                    return _this.checkAndSetEnablement(extension, dependencies, true, workspace);
                }
                return winjs_base_1.TPromise.as(null);
            });
        };
        ExtensionsWorkbenchService.prototype.promptForDependenciesAndDisable = function (extension, dependencies, workspace) {
            var _this = this;
            var message = nls.localize('disableDependeciesConfirmation', "Would you like to disable '{0}' only or its dependencies also?", extension.displayName);
            var options = [
                nls.localize('disableOnly', "Only"),
                nls.localize('disableAll', "All"),
                nls.localize('cancel', "Cancel")
            ];
            return this.choiceService.choose(severity_1.default.Info, message, options, 2, true)
                .then(function (value) {
                if (value === 0) {
                    return _this.checkAndSetEnablement(extension, [], false, workspace);
                }
                if (value === 1) {
                    return _this.checkAndSetEnablement(extension, dependencies, false, workspace);
                }
                return winjs_base_1.TPromise.as(null);
            });
        };
        ExtensionsWorkbenchService.prototype.checkAndSetEnablement = function (extension, dependencies, enable, workspace) {
            var _this = this;
            if (!enable) {
                var dependents = this.getDependentsAfterDisablement(extension, dependencies, this.local, workspace);
                if (dependents.length) {
                    return winjs_base_1.TPromise.wrapError(new Error(this.getDependentsErrorMessage(extension, dependents)));
                }
            }
            return winjs_base_1.TPromise.join([extension].concat(dependencies).map(function (e) { return _this.doSetEnablement(e, enable, workspace); }));
        };
        ExtensionsWorkbenchService.prototype.getDependenciesRecursively = function (extension, installed, enable, workspace, checked) {
            if (checked.indexOf(extension) !== -1) {
                return [];
            }
            checked.push(extension);
            if (!extension.dependencies || extension.dependencies.length === 0) {
                return [];
            }
            var dependenciesToDisable = installed.filter(function (i) {
                // Do not include extensions which are already disabled and request is to disable
                if (!enable && (workspace ? i.disabledForWorkspace : i.disabledGlobally)) {
                    return false;
                }
                return i.type === extensionManagement_1.LocalExtensionType.User && extension.dependencies.indexOf(i.id) !== -1;
            });
            var depsOfDeps = [];
            for (var _i = 0, dependenciesToDisable_1 = dependenciesToDisable; _i < dependenciesToDisable_1.length; _i++) {
                var dep = dependenciesToDisable_1[_i];
                depsOfDeps.push.apply(depsOfDeps, this.getDependenciesRecursively(dep, installed, enable, workspace, checked));
            }
            return dependenciesToDisable.concat(depsOfDeps);
        };
        ExtensionsWorkbenchService.prototype.getDependentsAfterDisablement = function (extension, dependencies, installed, workspace) {
            return installed.filter(function (i) {
                if (i.dependencies.length === 0) {
                    return false;
                }
                if (i === extension) {
                    return false;
                }
                var disabled = workspace ? i.disabledForWorkspace : i.disabledGlobally;
                if (disabled) {
                    return false;
                }
                if (dependencies.indexOf(i) !== -1) {
                    return false;
                }
                return i.dependencies.some(function (dep) {
                    if (extension.id === dep) {
                        return true;
                    }
                    return dependencies.some(function (d) { return d.id === dep; });
                });
            });
        };
        ExtensionsWorkbenchService.prototype.getDependentsErrorMessage = function (extension, dependents) {
            if (dependents.length === 1) {
                return nls.localize('singleDependentError', "Cannot disable extension '{0}'. Extension '{1}' depends on this.", extension.displayName, dependents[0].displayName);
            }
            if (dependents.length === 2) {
                return nls.localize('twoDependentsError', "Cannot disable extension '{0}'. Extensions '{1}' and '{2}' depend on this.", extension.displayName, dependents[0].displayName, dependents[1].displayName);
            }
            return nls.localize('multipleDependentsError', "Cannot disable extension '{0}'. Extensions '{1}', '{2}' and others depend on this.", extension.displayName, dependents[0].displayName, dependents[1].displayName);
        };
        ExtensionsWorkbenchService.prototype.doSetEnablement = function (extension, enable, workspace) {
            if (workspace) {
                return this.extensionEnablementService.setEnablement(extension.id, enable, workspace);
            }
            var globalElablement = this.extensionEnablementService.setEnablement(extension.id, enable, false);
            if (enable && this.workspaceContextService.hasWorkspace()) {
                var workspaceEnablement = this.extensionEnablementService.setEnablement(extension.id, enable, true);
                return winjs_base_1.TPromise.join([globalElablement, workspaceEnablement]).then(function (values) { return values[0] || values[1]; });
            }
            return globalElablement;
        };
        Object.defineProperty(ExtensionsWorkbenchService.prototype, "allowedBadgeProviders", {
            get: function () {
                if (!this._extensionAllowedBadgeProviders) {
                    this._extensionAllowedBadgeProviders = (product_1.default.extensionAllowedBadgeProviders || []).map(function (s) { return s.toLowerCase(); });
                }
                return this._extensionAllowedBadgeProviders;
            },
            enumerable: true,
            configurable: true
        });
        ExtensionsWorkbenchService.prototype.onInstallExtension = function (event) {
            var gallery = event.gallery;
            if (!gallery) {
                return;
            }
            var extension = this.installed.filter(function (e) { return e.id === gallery.id; })[0];
            if (!extension) {
                extension = new Extension(this.galleryService, this.stateProvider, null, gallery);
            }
            extension.gallery = gallery;
            var start = new Date();
            var operation = Operation.Installing;
            this.installing.push({ operation: operation, extension: extension, start: start });
            this._onChange.fire();
        };
        ExtensionsWorkbenchService.prototype.onDidInstallExtension = function (event) {
            var local = event.local, zipPath = event.zipPath, error = event.error, gallery = event.gallery;
            var installing = gallery ? this.installing.filter(function (e) { return e.extension.id === gallery.id; })[0] : null;
            var extension = installing ? installing.extension : zipPath ? new Extension(this.galleryService, this.stateProvider, null) : null;
            if (extension) {
                this.installing = installing ? this.installing.filter(function (e) { return e !== installing; }) : this.installing;
                if (!error) {
                    extension.local = local;
                    var installed = this.installed.filter(function (e) { return e.id === extension.id; })[0];
                    if (installed) {
                        if (installing) {
                            installing.operation = Operation.Updating;
                        }
                        installed.local = local;
                    }
                    else {
                        this.installed.push(extension);
                    }
                }
                if (extension.gallery) {
                    // Report telemetry only for gallery extensions
                    this.reportTelemetry(installing, !error);
                }
            }
            this._onChange.fire();
        };
        ExtensionsWorkbenchService.prototype.onUninstallExtension = function (id) {
            var extension = this.installed.filter(function (e) { return e.local.id === id; })[0];
            var newLength = this.installed.filter(function (e) { return e.local.id !== id; }).length;
            // TODO: Ask @Joao why is this?
            if (newLength === this.installed.length) {
                return;
            }
            var start = new Date();
            var operation = Operation.Uninstalling;
            var uninstalling = this.uninstalling.filter(function (e) { return e.extension.local.id === id; })[0] || { id: id, operation: operation, extension: extension, start: start };
            this.uninstalling = [uninstalling].concat(this.uninstalling.filter(function (e) { return e.extension.local.id !== id; }));
            this._onChange.fire();
        };
        ExtensionsWorkbenchService.prototype.onDidUninstallExtension = function (_a) {
            var id = _a.id, error = _a.error;
            if (!error) {
                this.installed = this.installed.filter(function (e) { return e.local.id !== id; });
            }
            var uninstalling = this.uninstalling.filter(function (e) { return e.extension.local.id === id; })[0];
            this.uninstalling = this.uninstalling.filter(function (e) { return e.extension.local.id !== id; });
            if (!uninstalling) {
                return;
            }
            if (!error) {
                this.reportTelemetry(uninstalling, true);
            }
            this._onChange.fire();
        };
        ExtensionsWorkbenchService.prototype.onEnablementChanged = function (extensionIdentifier) {
            var extension = this.local.filter(function (e) { return e.id === extensionIdentifier; })[0];
            if (extension) {
                var globallyDisabledExtensions = this.extensionEnablementService.getGloballyDisabledExtensions();
                var workspaceDisabledExtensions = this.extensionEnablementService.getWorkspaceDisabledExtensions();
                extension.disabledGlobally = globallyDisabledExtensions.indexOf(extension.id) !== -1;
                extension.disabledForWorkspace = workspaceDisabledExtensions.indexOf(extension.id) !== -1;
                this._onChange.fire();
            }
        };
        ExtensionsWorkbenchService.prototype.getExtensionState = function (extension) {
            if (extension.gallery && this.installing.some(function (e) { return e.extension.gallery && e.extension.gallery.id === extension.gallery.id; })) {
                return extensions_1.ExtensionState.Installing;
            }
            if (this.uninstalling.some(function (e) { return e.extension.id === extension.id; })) {
                return extensions_1.ExtensionState.Uninstalling;
            }
            var local = this.installed.filter(function (e) { return e === extension || (e.gallery && extension.gallery && e.gallery.id === extension.gallery.id); })[0];
            return local ? extensions_1.ExtensionState.Installed : extensions_1.ExtensionState.Uninstalled;
        };
        ExtensionsWorkbenchService.prototype.reportTelemetry = function (active, success) {
            var data = active.extension.telemetryData;
            var duration = new Date().getTime() - active.start.getTime();
            var eventName = toTelemetryEventName(active.operation);
            this.telemetryService.publicLog(eventName, objects_1.assign(data, { success: success, duration: duration }));
        };
        ExtensionsWorkbenchService.prototype.onError = function (err) {
            if (errors_1.isPromiseCanceledError(err)) {
                return;
            }
            var message = err && err.message || '';
            if (/getaddrinfo ENOTFOUND|getaddrinfo ENOENT|connect EACCES|connect ECONNREFUSED/.test(message)) {
                return;
            }
            this.messageService.show(severity_1.default.Error, err);
        };
        ExtensionsWorkbenchService.prototype.onOpenExtensionUrl = function (uri) {
            var _this = this;
            var match = /^extension\/([^/]+)$/.exec(uri.path);
            if (!match) {
                return;
            }
            var extensionId = match[1];
            this.queryLocal().then(function (local) {
                if (local.some(function (local) { return local.id === extensionId; })) {
                    return winjs_base_1.TPromise.as(null);
                }
                return _this.queryGallery({ names: [extensionId] }).then(function (result) {
                    if (result.total < 1) {
                        return winjs_base_1.TPromise.as(null);
                    }
                    var extension = result.firstPage[0];
                    return _this.open(extension).then(function () {
                        var message = nls.localize('installConfirmation', "Would you like to install the '{0}' extension?", extension.displayName, extension.publisher);
                        var options = [
                            nls.localize('install', "Install"),
                            nls.localize('cancel', "Cancel")
                        ];
                        return _this.choiceService.choose(severity_1.default.Info, message, options, 2, false).then(function (value) {
                            if (value !== 0) {
                                return winjs_base_1.TPromise.as(null);
                            }
                            return _this.install(extension);
                        });
                    });
                });
            }).done(undefined, function (error) { return _this.onError(error); });
        };
        ExtensionsWorkbenchService.prototype.dispose = function () {
            this.syncDelayer.cancel();
            this.disposables = lifecycle_1.dispose(this.disposables);
        };
        ExtensionsWorkbenchService.SyncPeriod = 1000 * 60 * 60 * 12; // 12 hours
        ExtensionsWorkbenchService = __decorate([
            __param(0, instantiation_1.IInstantiationService),
            __param(1, editorService_1.IWorkbenchEditorService),
            __param(2, extensionManagement_1.IExtensionManagementService),
            __param(3, extensionManagement_1.IExtensionGalleryService),
            __param(4, configuration_1.IConfigurationService),
            __param(5, configurationEditing_1.IConfigurationEditingService),
            __param(6, telemetry_1.ITelemetryService),
            __param(7, message_1.IMessageService),
            __param(8, message_1.IChoiceService),
            __param(9, url_1.IURLService),
            __param(10, extensionManagement_1.IExtensionEnablementService),
            __param(11, extensionManagement_1.IExtensionTipsService),
            __param(12, workspace_1.IWorkspaceContextService)
        ], ExtensionsWorkbenchService);
        return ExtensionsWorkbenchService;
    }());
    exports.ExtensionsWorkbenchService = ExtensionsWorkbenchService;
});
//# sourceMappingURL=extensionsWorkbenchService.js.map