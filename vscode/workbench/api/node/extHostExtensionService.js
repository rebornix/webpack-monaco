define(["require", "exports", "vs/base/common/lifecycle", "path", "vs/base/node/pfs", "vs/base/common/severity", "vs/base/common/winjs.base", "vs/workbench/services/extensions/node/extensionDescriptionRegistry", "vs/workbench/api/node/extHostStorage", "vs/workbench/api/node/extHost.api.impl", "./extHost.protocol", "vs/workbench/api/node/extHostExtensionActivator", "vs/workbench/services/extensions/node/barrier", "fs", "vs/base/common/map"], function (require, exports, lifecycle_1, path_1, pfs_1, severity_1, winjs_base_1, extensionDescriptionRegistry_1, extHostStorage_1, extHost_api_impl_1, extHost_protocol_1, extHostExtensionActivator_1, barrier_1, fs_1, map_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var ExtensionMemento = (function () {
        function ExtensionMemento(id, global, storage) {
            var _this = this;
            this._id = id;
            this._shared = global;
            this._storage = storage;
            this._init = this._storage.getValue(this._shared, this._id, Object.create(null)).then(function (value) {
                _this._value = value;
                return _this;
            });
        }
        Object.defineProperty(ExtensionMemento.prototype, "whenReady", {
            get: function () {
                return this._init;
            },
            enumerable: true,
            configurable: true
        });
        ExtensionMemento.prototype.get = function (key, defaultValue) {
            var value = this._value[key];
            if (typeof value === 'undefined') {
                value = defaultValue;
            }
            return value;
        };
        ExtensionMemento.prototype.update = function (key, value) {
            this._value[key] = value;
            return this._storage
                .setValue(this._shared, this._id, this._value)
                .then(function () { return true; });
        };
        return ExtensionMemento;
    }());
    var ExtensionStoragePath = (function () {
        function ExtensionStoragePath(workspace, environment) {
            var _this = this;
            this._workspace = workspace;
            this._environment = environment;
            this._ready = this._getOrCreateWorkspaceStoragePath().then(function (value) { return _this._value = value; });
        }
        Object.defineProperty(ExtensionStoragePath.prototype, "whenReady", {
            get: function () {
                return this._ready;
            },
            enumerable: true,
            configurable: true
        });
        ExtensionStoragePath.prototype.value = function (extension) {
            if (this._value) {
                return path_1.join(this._value, extension.id);
            }
            return undefined;
        };
        ExtensionStoragePath.prototype._getOrCreateWorkspaceStoragePath = function () {
            if (!this._workspace) {
                return winjs_base_1.TPromise.as(undefined);
            }
            var storageName = this._workspace.id;
            var storagePath = path_1.join(this._environment.appSettingsHome, 'workspaceStorage', storageName);
            return pfs_1.dirExists(storagePath).then(function (exists) {
                if (exists) {
                    return storagePath;
                }
                return pfs_1.mkdirp(storagePath).then(function (success) {
                    return storagePath;
                }, function (err) {
                    return undefined;
                });
            });
        };
        return ExtensionStoragePath;
    }());
    var ExtHostExtensionService = (function () {
        /**
         * This class is constructed manually because it is a service, so it doesn't use any ctor injection
         */
        function ExtHostExtensionService(initData, threadService) {
            var _this = this;
            this._barrier = new barrier_1.Barrier();
            this._registry = new extensionDescriptionRegistry_1.ExtensionDescriptionRegistry(initData.extensions);
            this._threadService = threadService;
            this._mainThreadTelemetry = threadService.get(extHost_protocol_1.MainContext.MainThreadTelemetry);
            this._storage = new extHostStorage_1.ExtHostStorage(threadService);
            this._storagePath = new ExtensionStoragePath(initData.workspace, initData.environment);
            this._proxy = this._threadService.get(extHost_protocol_1.MainContext.MainThreadExtensionService);
            this._activator = null;
            // initialize API first (i.e. do not release barrier until the API is initialized)
            var apiFactory = extHost_api_impl_1.createApiFactory(initData, threadService, this);
            extHost_api_impl_1.initializeExtensionApi(this, apiFactory).then(function () {
                _this._activator = new extHostExtensionActivator_1.ExtensionsActivator(_this._registry, {
                    showMessage: function (severity, message) {
                        _this._proxy.$localShowMessage(severity, message);
                        switch (severity) {
                            case severity_1.default.Error:
                                console.error(message);
                                break;
                            case severity_1.default.Warning:
                                console.warn(message);
                                break;
                            default:
                                console.log(message);
                        }
                    },
                    actualActivateExtension: function (extensionDescription, startup) {
                        return _this._activateExtension(extensionDescription, startup);
                    }
                });
                _this._barrier.open();
            });
        }
        ExtHostExtensionService.prototype.onExtensionAPIReady = function () {
            return this._barrier.wait();
        };
        ExtHostExtensionService.prototype.isActivated = function (extensionId) {
            if (this._barrier.isOpen()) {
                return this._activator.isActivated(extensionId);
            }
            return false;
        };
        ExtHostExtensionService.prototype.activateByEvent = function (activationEvent, startup) {
            var _this = this;
            if (this._barrier.isOpen()) {
                return this._activator.activateByEvent(activationEvent, startup);
            }
            else {
                return this._barrier.wait().then(function () { return _this._activator.activateByEvent(activationEvent, startup); });
            }
        };
        ExtHostExtensionService.prototype.activateById = function (extensionId, startup) {
            var _this = this;
            if (this._barrier.isOpen()) {
                return this._activator.activateById(extensionId, startup);
            }
            else {
                return this._barrier.wait().then(function () { return _this._activator.activateById(extensionId, startup); });
            }
        };
        ExtHostExtensionService.prototype.getAllExtensionDescriptions = function () {
            return this._registry.getAllExtensionDescriptions();
        };
        ExtHostExtensionService.prototype.getExtensionDescription = function (extensionId) {
            return this._registry.getExtensionDescription(extensionId);
        };
        ExtHostExtensionService.prototype.getExtensionExports = function (extensionId) {
            if (this._barrier.isOpen()) {
                return this._activator.getActivatedExtension(extensionId).exports;
            }
            else {
                return null;
            }
        };
        // create trie to enable fast 'filename -> extension id' look up
        ExtHostExtensionService.prototype.getExtensionPathIndex = function () {
            if (!this._extensionPathIndex) {
                var trie_1 = new map_1.TrieMap();
                var extensions = this.getAllExtensionDescriptions().map(function (ext) {
                    if (!ext.main) {
                        return undefined;
                    }
                    return new winjs_base_1.TPromise(function (resolve, reject) {
                        fs_1.realpath(ext.extensionFolderPath, function (err, path) {
                            if (err) {
                                reject(err);
                            }
                            else {
                                trie_1.insert(path, ext);
                                resolve(void 0);
                            }
                        });
                    });
                });
                this._extensionPathIndex = winjs_base_1.TPromise.join(extensions).then(function () { return trie_1; });
            }
            return this._extensionPathIndex;
        };
        ExtHostExtensionService.prototype.deactivate = function (extensionId) {
            var result = winjs_base_1.TPromise.as(void 0);
            if (!this._barrier.isOpen()) {
                return result;
            }
            if (!this._activator.isActivated(extensionId)) {
                return result;
            }
            var extension = this._activator.getActivatedExtension(extensionId);
            if (!extension) {
                return result;
            }
            // call deactivate if available
            try {
                if (typeof extension.module.deactivate === 'function') {
                    result = winjs_base_1.TPromise.wrap(extension.module.deactivate()).then(null, function (err) {
                        // TODO: Do something with err if this is not the shutdown case
                        return winjs_base_1.TPromise.as(void 0);
                    });
                }
            }
            catch (err) {
                // TODO: Do something with err if this is not the shutdown case
            }
            // clean up subscriptions
            try {
                lifecycle_1.dispose(extension.subscriptions);
            }
            catch (err) {
                // TODO: Do something with err if this is not the shutdown case
            }
            return result;
        };
        // --- impl
        ExtHostExtensionService.prototype._activateExtension = function (extensionDescription, startup) {
            var _this = this;
            return this._doActivateExtension(extensionDescription, startup).then(function (activatedExtension) {
                var activationTimes = activatedExtension.activationTimes;
                _this._proxy.$onExtensionActivated(extensionDescription.id, activationTimes.startup, activationTimes.codeLoadingTime, activationTimes.activateCallTime, activationTimes.activateResolvedTime);
                return activatedExtension;
            }, function (err) {
                _this._proxy.$onExtensionActivationFailed(extensionDescription.id);
                throw err;
            });
        };
        ExtHostExtensionService.prototype._doActivateExtension = function (extensionDescription, startup) {
            var event = getTelemetryActivationEvent(extensionDescription);
            this._mainThreadTelemetry.$publicLog('activatePlugin', event);
            if (!extensionDescription.main) {
                // Treat the extension as being empty => NOT AN ERROR CASE
                return winjs_base_1.TPromise.as(new extHostExtensionActivator_1.EmptyExtension(extHostExtensionActivator_1.ExtensionActivationTimes.NONE));
            }
            var activationTimesBuilder = new extHostExtensionActivator_1.ExtensionActivationTimesBuilder(startup);
            return winjs_base_1.TPromise.join([
                loadCommonJSModule(extensionDescription.main, activationTimesBuilder),
                this._loadExtensionContext(extensionDescription)
            ]).then(function (values) {
                return ExtHostExtensionService._callActivate(values[0], values[1], activationTimesBuilder);
            }, function (errors) {
                // Avoid failing with an array of errors, fail with a single error
                if (errors[0]) {
                    return winjs_base_1.TPromise.wrapError(errors[0]);
                }
                if (errors[1]) {
                    return winjs_base_1.TPromise.wrapError(errors[1]);
                }
                return undefined;
            });
        };
        ExtHostExtensionService.prototype._loadExtensionContext = function (extensionDescription) {
            var _this = this;
            var globalState = new ExtensionMemento(extensionDescription.id, true, this._storage);
            var workspaceState = new ExtensionMemento(extensionDescription.id, false, this._storage);
            return winjs_base_1.TPromise.join([
                globalState.whenReady,
                workspaceState.whenReady,
                this._storagePath.whenReady
            ]).then(function () {
                return Object.freeze({
                    globalState: globalState,
                    workspaceState: workspaceState,
                    subscriptions: [],
                    get extensionPath() { return extensionDescription.extensionFolderPath; },
                    storagePath: _this._storagePath.value(extensionDescription),
                    asAbsolutePath: function (relativePath) { return path_1.join(extensionDescription.extensionFolderPath, relativePath); }
                });
            });
        };
        ExtHostExtensionService._callActivate = function (extensionModule, context, activationTimesBuilder) {
            // Make sure the extension's surface is not undefined
            extensionModule = extensionModule || {
                activate: undefined,
                deactivate: undefined
            };
            return this._callActivateOptional(extensionModule, context, activationTimesBuilder).then(function (extensionExports) {
                return new extHostExtensionActivator_1.ActivatedExtension(false, activationTimesBuilder.build(), extensionModule, extensionExports, context.subscriptions);
            });
        };
        ExtHostExtensionService._callActivateOptional = function (extensionModule, context, activationTimesBuilder) {
            if (typeof extensionModule.activate === 'function') {
                try {
                    activationTimesBuilder.activateCallStart();
                    var activateResult = extensionModule.activate.apply(global, [context]);
                    activationTimesBuilder.activateCallStop();
                    activationTimesBuilder.activateResolveStart();
                    return winjs_base_1.TPromise.as(activateResult).then(function (value) {
                        activationTimesBuilder.activateResolveStop();
                        return value;
                    });
                }
                catch (err) {
                    return winjs_base_1.TPromise.wrapError(err);
                }
            }
            else {
                // No activate found => the module is the extension's exports
                return winjs_base_1.TPromise.as(extensionModule);
            }
        };
        // -- called by main thread
        ExtHostExtensionService.prototype.$activateByEvent = function (activationEvent) {
            return this.activateByEvent(activationEvent, false);
        };
        return ExtHostExtensionService;
    }());
    exports.ExtHostExtensionService = ExtHostExtensionService;
    function loadCommonJSModule(modulePath, activationTimesBuilder) {
        var r = null;
        activationTimesBuilder.codeLoadingStart();
        try {
            r = require.__$__nodeRequire(modulePath);
        }
        catch (e) {
            return winjs_base_1.TPromise.wrapError(e);
        }
        finally {
            activationTimesBuilder.codeLoadingStop();
        }
        return winjs_base_1.TPromise.as(r);
    }
    function getTelemetryActivationEvent(extensionDescription) {
        var event = {
            id: extensionDescription.id,
            name: extensionDescription.name,
            publisherDisplayName: extensionDescription.publisher,
            activationEvents: extensionDescription.activationEvents ? extensionDescription.activationEvents.join(',') : null,
            isBuiltin: extensionDescription.isBuiltin
        };
        for (var contribution in extensionDescription.contributes) {
            var contributionDetails = extensionDescription.contributes[contribution];
            if (!contributionDetails) {
                continue;
            }
            switch (contribution) {
                case 'debuggers':
                    var types = contributionDetails.reduce(function (p, c) { return p ? p + ',' + c['type'] : c['type']; }, '');
                    event['contribution.debuggers'] = types;
                    break;
                case 'grammars':
                    var grammers = contributionDetails.reduce(function (p, c) { return p ? p + ',' + c['language'] : c['language']; }, '');
                    event['contribution.grammars'] = grammers;
                    break;
                case 'languages':
                    var languages = contributionDetails.reduce(function (p, c) { return p ? p + ',' + c['id'] : c['id']; }, '');
                    event['contribution.languages'] = languages;
                    break;
                case 'tmSnippets':
                    var tmSnippets = contributionDetails.reduce(function (p, c) { return p ? p + ',' + c['languageId'] : c['languageId']; }, '');
                    event['contribution.tmSnippets'] = tmSnippets;
                    break;
                default:
                    event["contribution." + contribution] = true;
            }
        }
        return event;
    }
});
//# sourceMappingURL=extHostExtensionService.js.map