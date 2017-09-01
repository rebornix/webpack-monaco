var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", "vs/nls", "vs/base/common/errors", "vs/base/common/severity", "vs/base/common/winjs.base", "vs/platform/node/package", "path", "vs/base/common/uri", "vs/workbench/services/extensions/node/extensionDescriptionRegistry", "vs/platform/extensions/common/extensions", "vs/platform/extensionManagement/common/extensionManagement", "vs/platform/extensionManagement/common/extensionManagementUtil", "vs/platform/extensions/common/extensionsRegistry", "vs/workbench/services/extensions/electron-browser/extensionPoints", "vs/platform/message/common/message", "vs/workbench/api/node/extHost.protocol", "vs/platform/telemetry/common/telemetry", "vs/platform/environment/common/environment", "vs/platform/storage/common/storage", "vs/platform/instantiation/common/instantiation", "vs/workbench/services/extensions/electron-browser/extensionHost", "vs/workbench/services/thread/electron-browser/threadService", "vs/workbench/services/extensions/node/barrier", "vs/workbench/api/electron-browser/extHostCustomers", "vs/platform/windows/common/windows", "vs/base/common/actions"], function (require, exports, nls, errors, severity_1, winjs_base_1, package_1, path, uri_1, extensionDescriptionRegistry_1, extensions_1, extensionManagement_1, extensionManagementUtil_1, extensionsRegistry_1, extensionPoints_1, message_1, extHost_protocol_1, telemetry_1, environment_1, storage_1, instantiation_1, extensionHost_1, threadService_1, barrier_1, extHostCustomers_1, windows_1, actions_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var SystemExtensionsRoot = path.normalize(path.join(uri_1.default.parse(require.toUrl('')).fsPath, '..', 'extensions'));
    function messageWithSource(msg) {
        return messageWithSource2(msg.source, msg.message);
    }
    function messageWithSource2(source, message) {
        if (source) {
            return "[" + source + "]: " + message;
        }
        return message;
    }
    var hasOwnProperty = Object.hasOwnProperty;
    var NO_OP_VOID_PROMISE = winjs_base_1.TPromise.as(void 0);
    var ExtensionService = (function () {
        function ExtensionService(_instantiationService, _messageService, _environmentService, _telemetryService, _extensionEnablementService, _storageService, _windowService) {
            this._instantiationService = _instantiationService;
            this._messageService = _messageService;
            this._environmentService = _environmentService;
            this._telemetryService = _telemetryService;
            this._extensionEnablementService = _extensionEnablementService;
            this._storageService = _storageService;
            this._windowService = _windowService;
            this._registry = null;
            this._barrier = new barrier_1.Barrier();
            this._isDev = !this._environmentService.isBuilt || this._environmentService.isExtensionDevelopment;
            this._extensionsStatus = {};
            this._allRequestedActivateEvents = Object.create(null);
            this._extensionHostProcessFinishedActivateEvents = Object.create(null);
            this._extensionHostProcessActivationTimes = Object.create(null);
            this._extensionHostProcessWorker = null;
            this._extensionHostProcessThreadService = null;
            this._extensionHostProcessCustomers = [];
            this._extensionHostProcessProxy = null;
            this._startExtensionHostProcess([]);
            this._scanAndHandleExtensions();
        }
        ExtensionService.prototype.restartExtensionHost = function () {
            this._stopExtensionHostProcess();
            this._startExtensionHostProcess(Object.keys(this._allRequestedActivateEvents));
        };
        ExtensionService.prototype._stopExtensionHostProcess = function () {
            this._extensionHostProcessFinishedActivateEvents = Object.create(null);
            this._extensionHostProcessActivationTimes = Object.create(null);
            if (this._extensionHostProcessWorker) {
                this._extensionHostProcessWorker.dispose();
                this._extensionHostProcessWorker = null;
            }
            if (this._extensionHostProcessThreadService) {
                this._extensionHostProcessThreadService.dispose();
                this._extensionHostProcessThreadService = null;
            }
            for (var i = 0, len = this._extensionHostProcessCustomers.length; i < len; i++) {
                var customer = this._extensionHostProcessCustomers[i];
                try {
                    customer.dispose();
                }
                catch (err) {
                    errors.onUnexpectedError(err);
                }
            }
            this._extensionHostProcessCustomers = [];
            this._extensionHostProcessProxy = null;
        };
        ExtensionService.prototype._startExtensionHostProcess = function (initialActivationEvents) {
            var _this = this;
            this._stopExtensionHostProcess();
            this._extensionHostProcessWorker = this._instantiationService.createInstance(extensionHost_1.ExtensionHostProcessWorker, this);
            this._extensionHostProcessWorker.onCrashed(function (_a) {
                var code = _a[0], signal = _a[1];
                return _this._onExtensionHostCrashed(code, signal);
            });
            this._extensionHostProcessProxy = this._extensionHostProcessWorker.start().then(function (protocol) {
                return { value: _this._createExtensionHostCustomers(protocol) };
            }, function (err) {
                console.error('Error received from starting extension host');
                console.error(err);
                return null;
            });
            this._extensionHostProcessProxy.then(function () {
                initialActivationEvents.forEach(function (activationEvent) { return _this.activateByEvent(activationEvent); });
            });
        };
        ExtensionService.prototype._onExtensionHostCrashed = function (code, signal) {
            var _this = this;
            var openDevTools = new actions_1.Action('openDevTools', nls.localize('devTools', "Developer Tools"), '', true, function () {
                return _this._windowService.openDevTools().then(function () { return false; });
            });
            var restart = new actions_1.Action('restart', nls.localize('restart', "Restart Extension Host"), '', true, function () {
                _this._startExtensionHostProcess(Object.keys(_this._allRequestedActivateEvents));
                return winjs_base_1.TPromise.as(true);
            });
            console.error('Extension host terminated unexpectedly. Code: ', code, ' Signal: ', signal);
            this._stopExtensionHostProcess();
            var message = nls.localize('extensionHostProcess.crash', "Extension host terminated unexpectedly.");
            if (code === 87) {
                message = nls.localize('extensionHostProcess.unresponsiveCrash', "Extension host terminated because it was not responsive.");
            }
            this._messageService.show(severity_1.default.Error, {
                message: message,
                actions: [
                    openDevTools,
                    restart
                ]
            });
        };
        ExtensionService.prototype._createExtensionHostCustomers = function (protocol) {
            this._extensionHostProcessThreadService = this._instantiationService.createInstance(threadService_1.MainThreadService, protocol);
            var extHostContext = this._extensionHostProcessThreadService;
            // Named customers
            var namedCustomers = extHostCustomers_1.ExtHostCustomersRegistry.getNamedCustomers();
            for (var i = 0, len = namedCustomers.length; i < len; i++) {
                var _a = namedCustomers[i], id = _a[0], ctor = _a[1];
                var instance = this._instantiationService.createInstance(ctor, extHostContext);
                this._extensionHostProcessCustomers.push(instance);
                this._extensionHostProcessThreadService.set(id, instance);
            }
            // Customers
            var customers = extHostCustomers_1.ExtHostCustomersRegistry.getCustomers();
            for (var i = 0, len = customers.length; i < len; i++) {
                var ctor = customers[i];
                var instance = this._instantiationService.createInstance(ctor, extHostContext);
                this._extensionHostProcessCustomers.push(instance);
            }
            // Check that no named customers are missing
            var expected = Object.keys(extHost_protocol_1.MainContext).map(function (key) { return extHost_protocol_1.MainContext[key]; });
            this._extensionHostProcessThreadService.assertRegistered(expected);
            return this._extensionHostProcessThreadService.get(extHost_protocol_1.ExtHostContext.ExtHostExtensionService);
        };
        // ---- begin IExtensionService
        ExtensionService.prototype.activateByEvent = function (activationEvent) {
            var _this = this;
            if (this._barrier.isOpen()) {
                // Extensions have been scanned and interpreted
                if (!this._registry.containsActivationEvent(activationEvent)) {
                    // There is no extension that is interested in this activation event
                    return NO_OP_VOID_PROMISE;
                }
                // Record the fact that this activationEvent was requested (in case of a restart)
                this._allRequestedActivateEvents[activationEvent] = true;
                return this._activateByEvent(activationEvent);
            }
            else {
                // Extensions have not been scanned yet.
                // Record the fact that this activationEvent was requested (in case of a restart)
                this._allRequestedActivateEvents[activationEvent] = true;
                return this._barrier.wait().then(function () { return _this._activateByEvent(activationEvent); });
            }
        };
        ExtensionService.prototype._activateByEvent = function (activationEvent) {
            var _this = this;
            if (this._extensionHostProcessFinishedActivateEvents[activationEvent]) {
                return NO_OP_VOID_PROMISE;
            }
            return this._extensionHostProcessProxy.then(function (proxy) {
                return proxy.value.$activateByEvent(activationEvent);
            }).then(function () {
                _this._extensionHostProcessFinishedActivateEvents[activationEvent] = true;
            });
        };
        ExtensionService.prototype.onReady = function () {
            return this._barrier.wait();
        };
        ExtensionService.prototype.getExtensions = function () {
            var _this = this;
            return this.onReady().then(function () {
                return _this._registry.getAllExtensionDescriptions();
            });
        };
        ExtensionService.prototype.readExtensionPointContributions = function (extPoint) {
            var _this = this;
            return this.onReady().then(function () {
                var availableExtensions = _this._registry.getAllExtensionDescriptions();
                var result = [], resultLen = 0;
                for (var i = 0, len = availableExtensions.length; i < len; i++) {
                    var desc = availableExtensions[i];
                    if (desc.contributes && hasOwnProperty.call(desc.contributes, extPoint.name)) {
                        result[resultLen++] = new extensions_1.ExtensionPointContribution(desc, desc.contributes[extPoint.name]);
                    }
                }
                return result;
            });
        };
        ExtensionService.prototype.getExtensionsStatus = function () {
            return this._extensionsStatus;
        };
        ExtensionService.prototype.getExtensionsActivationTimes = function () {
            return this._extensionHostProcessActivationTimes;
        };
        // ---- end IExtensionService
        // --- impl
        ExtensionService.prototype._scanAndHandleExtensions = function () {
            var _this = this;
            var log = new Logger(function (severity, source, message) {
                _this._logOrShowMessage(severity, _this._isDev ? messageWithSource2(source, message) : message);
            });
            ExtensionService._scanInstalledExtensions(this._environmentService, log).then(function (installedExtensions) {
                var disabledExtensions = extensionManagementUtil_1.getGloballyDisabledExtensions(_this._extensionEnablementService, _this._storageService, installedExtensions).concat(_this._extensionEnablementService.getWorkspaceDisabledExtensions());
                _this._telemetryService.publicLog('extensionsScanned', {
                    totalCount: installedExtensions.length,
                    disabledCount: disabledExtensions.length
                });
                if (disabledExtensions.length === 0) {
                    return installedExtensions;
                }
                return installedExtensions.filter(function (e) { return disabledExtensions.every(function (id) { return !extensionManagementUtil_1.areSameExtensions({ id: id }, e); }); });
            }).then(function (extensionDescriptions) {
                _this._registry = new extensionDescriptionRegistry_1.ExtensionDescriptionRegistry(extensionDescriptions);
                var availableExtensions = _this._registry.getAllExtensionDescriptions();
                var extensionPoints = extensionsRegistry_1.ExtensionsRegistry.getExtensionPoints();
                var messageHandler = function (msg) { return _this._handleExtensionPointMessage(msg); };
                for (var i = 0, len = extensionPoints.length; i < len; i++) {
                    ExtensionService._handleExtensionPoint(extensionPoints[i], availableExtensions, messageHandler);
                }
                _this._barrier.open();
            });
        };
        ExtensionService.prototype._handleExtensionPointMessage = function (msg) {
            if (!this._extensionsStatus[msg.source]) {
                this._extensionsStatus[msg.source] = { messages: [] };
            }
            this._extensionsStatus[msg.source].messages.push(msg);
            if (msg.source === this._environmentService.extensionDevelopmentPath) {
                // This message is about the extension currently being developed
                this._showMessageToUser(msg.type, messageWithSource(msg));
            }
            else {
                this._logMessageInConsole(msg.type, messageWithSource(msg));
            }
            if (!this._isDev && msg.extensionId) {
                var type = msg.type, extensionId = msg.extensionId, extensionPointId = msg.extensionPointId, message = msg.message;
                this._telemetryService.publicLog('extensionsMessage', {
                    type: type, extensionId: extensionId, extensionPointId: extensionPointId, message: message
                });
            }
        };
        ExtensionService._scanInstalledExtensions = function (environmentService, log) {
            var version = package_1.default.version;
            var builtinExtensions = extensionPoints_1.ExtensionScanner.scanExtensions(version, log, SystemExtensionsRoot, true);
            var userExtensions = environmentService.disableExtensions || !environmentService.extensionsPath ? winjs_base_1.TPromise.as([]) : extensionPoints_1.ExtensionScanner.scanExtensions(version, log, environmentService.extensionsPath, false);
            var developedExtensions = environmentService.disableExtensions || !environmentService.isExtensionDevelopment ? winjs_base_1.TPromise.as([]) : extensionPoints_1.ExtensionScanner.scanOneOrMultipleExtensions(version, log, environmentService.extensionDevelopmentPath, false);
            return winjs_base_1.TPromise.join([builtinExtensions, userExtensions, developedExtensions]).then(function (extensionDescriptions) {
                var builtinExtensions = extensionDescriptions[0];
                var userExtensions = extensionDescriptions[1];
                var developedExtensions = extensionDescriptions[2];
                var result = {};
                builtinExtensions.forEach(function (builtinExtension) {
                    result[builtinExtension.id] = builtinExtension;
                });
                userExtensions.forEach(function (userExtension) {
                    if (result.hasOwnProperty(userExtension.id)) {
                        log.warn(userExtension.extensionFolderPath, nls.localize('overwritingExtension', "Overwriting extension {0} with {1}.", result[userExtension.id].extensionFolderPath, userExtension.extensionFolderPath));
                    }
                    result[userExtension.id] = userExtension;
                });
                developedExtensions.forEach(function (developedExtension) {
                    log.info('', nls.localize('extensionUnderDevelopment', "Loading development extension at {0}", developedExtension.extensionFolderPath));
                    if (result.hasOwnProperty(developedExtension.id)) {
                        log.warn(developedExtension.extensionFolderPath, nls.localize('overwritingExtension', "Overwriting extension {0} with {1}.", result[developedExtension.id].extensionFolderPath, developedExtension.extensionFolderPath));
                    }
                    result[developedExtension.id] = developedExtension;
                });
                return Object.keys(result).map(function (name) { return result[name]; });
            }).then(null, function (err) {
                log.error('', err);
                return [];
            });
        };
        ExtensionService._handleExtensionPoint = function (extensionPoint, availableExtensions, messageHandler) {
            var users = [], usersLen = 0;
            for (var i = 0, len = availableExtensions.length; i < len; i++) {
                var desc = availableExtensions[i];
                if (desc.contributes && hasOwnProperty.call(desc.contributes, extensionPoint.name)) {
                    users[usersLen++] = {
                        description: desc,
                        value: desc.contributes[extensionPoint.name],
                        collector: new extensionsRegistry_1.ExtensionMessageCollector(messageHandler, desc, extensionPoint.name)
                    };
                }
            }
            extensionPoint.acceptUsers(users);
        };
        ExtensionService.prototype._showMessageToUser = function (severity, msg) {
            if (severity === severity_1.default.Error || severity === severity_1.default.Warning) {
                this._messageService.show(severity, msg);
            }
            else {
                this._logMessageInConsole(severity, msg);
            }
        };
        ExtensionService.prototype._logMessageInConsole = function (severity, msg) {
            if (severity === severity_1.default.Error) {
                console.error(msg);
            }
            else if (severity === severity_1.default.Warning) {
                console.warn(msg);
            }
            else {
                console.log(msg);
            }
        };
        // -- called by extension host
        ExtensionService.prototype._logOrShowMessage = function (severity, msg) {
            if (this._isDev) {
                this._showMessageToUser(severity, msg);
            }
            else {
                this._logMessageInConsole(severity, msg);
            }
        };
        ExtensionService.prototype._onExtensionActivated = function (extensionId, startup, codeLoadingTime, activateCallTime, activateResolvedTime) {
            this._extensionHostProcessActivationTimes[extensionId] = new extensions_1.ActivationTimes(startup, codeLoadingTime, activateCallTime, activateResolvedTime);
        };
        ExtensionService = __decorate([
            __param(0, instantiation_1.IInstantiationService),
            __param(1, message_1.IMessageService),
            __param(2, environment_1.IEnvironmentService),
            __param(3, telemetry_1.ITelemetryService),
            __param(4, extensionManagement_1.IExtensionEnablementService),
            __param(5, storage_1.IStorageService),
            __param(6, windows_1.IWindowService)
        ], ExtensionService);
        return ExtensionService;
    }());
    exports.ExtensionService = ExtensionService;
    var Logger = (function () {
        function Logger(messageHandler) {
            this._messageHandler = messageHandler;
        }
        Logger.prototype.error = function (source, message) {
            this._messageHandler(severity_1.default.Error, source, message);
        };
        Logger.prototype.warn = function (source, message) {
            this._messageHandler(severity_1.default.Warning, source, message);
        };
        Logger.prototype.info = function (source, message) {
            this._messageHandler(severity_1.default.Info, source, message);
        };
        return Logger;
    }());
    exports.Logger = Logger;
});
//# sourceMappingURL=extensionService.js.map