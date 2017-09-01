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
define(["require", "exports", "electron", "vs/base/common/platform", "vs/code/electron-main/windows", "vs/platform/windows/common/windows", "vs/platform/windows/common/windowsIpc", "vs/platform/windows/electron-main/windowsService", "vs/platform/lifecycle/electron-main/lifecycleMain", "vs/code/electron-main/menus", "vs/code/node/shellEnv", "vs/platform/update/common/update", "vs/platform/update/common/updateIpc", "vs/platform/update/electron-main/updateService", "vs/base/parts/ipc/electron-main/ipc.electron-main", "vs/base/parts/ipc/node/ipc.net", "vs/code/electron-main/sharedProcess", "./launch", "vs/platform/instantiation/common/instantiation", "vs/platform/instantiation/common/serviceCollection", "vs/platform/instantiation/common/descriptors", "vs/platform/log/common/log", "vs/platform/storage/node/storage", "vs/platform/environment/common/environment", "vs/platform/configuration/common/configuration", "vs/platform/url/common/url", "vs/platform/url/common/urlIpc", "vs/platform/telemetry/common/telemetry", "vs/platform/telemetry/common/telemetryUtils", "vs/platform/telemetry/common/telemetryIpc", "vs/platform/telemetry/common/telemetryService", "vs/platform/credentials/common/credentials", "vs/platform/credentials/node/credentialsService", "vs/platform/credentials/node/credentialsIpc", "vs/platform/telemetry/node/commonProperties", "vs/base/parts/ipc/common/ipc", "vs/platform/node/product", "vs/platform/node/package", "./auth", "vs/base/common/lifecycle", "vs/platform/windows/electron-main/windows", "vs/platform/history/common/history", "vs/base/common/types", "vs/code/electron-main/window", "vs/code/electron-main/keyboard", "vs/base/common/uri", "vs/platform/workspaces/common/workspacesIpc", "vs/platform/workspaces/common/workspaces", "path", "vs/base/node/pfs"], function (require, exports, electron_1, platform, windows_1, windows_2, windowsIpc_1, windowsService_1, lifecycleMain_1, menus_1, shellEnv_1, update_1, updateIpc_1, updateService_1, ipc_electron_main_1, ipc_net_1, sharedProcess_1, launch_1, instantiation_1, serviceCollection_1, descriptors_1, log_1, storage_1, environment_1, configuration_1, url_1, urlIpc_1, telemetry_1, telemetryUtils_1, telemetryIpc_1, telemetryService_1, credentials_1, credentialsService_1, credentialsIpc_1, commonProperties_1, ipc_1, product_1, package_1, auth_1, lifecycle_1, windows_3, history_1, types_1, window_1, keyboard_1, uri_1, workspacesIpc_1, workspaces_1, path_1, pfs_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var CodeApplication = (function () {
        function CodeApplication(mainIpcServer, userEnv, instantiationService, logService, environmentService, lifecycleService, configurationService, storageService, historyService) {
            this.mainIpcServer = mainIpcServer;
            this.userEnv = userEnv;
            this.instantiationService = instantiationService;
            this.logService = logService;
            this.environmentService = environmentService;
            this.lifecycleService = lifecycleService;
            this.configurationService = configurationService;
            this.storageService = storageService;
            this.historyService = historyService;
            this.toDispose = [mainIpcServer, configurationService];
            this.registerListeners();
        }
        CodeApplication.prototype.registerListeners = function () {
            var _this = this;
            // We handle uncaught exceptions here to prevent electron from opening a dialog to the user
            process.on('uncaughtException', function (err) {
                if (err) {
                    // take only the message and stack property
                    var friendlyError = {
                        message: err.message,
                        stack: err.stack
                    };
                    // handle on client side
                    if (_this.windowsMainService) {
                        _this.windowsMainService.sendToFocused('vscode:reportError', JSON.stringify(friendlyError));
                    }
                }
                _this.logService.error("[uncaught exception in main]: " + err);
                if (err.stack) {
                    _this.logService.error(err.stack);
                }
            });
            electron_1.app.on('will-quit', function () {
                _this.logService.log('App#will-quit: disposing resources');
                _this.dispose();
            });
            electron_1.app.on('accessibility-support-changed', function (event, accessibilitySupportEnabled) {
                if (_this.windowsMainService) {
                    _this.windowsMainService.sendToAll('vscode:accessibilitySupportChanged', accessibilitySupportEnabled);
                }
            });
            electron_1.app.on('activate', function (event, hasVisibleWindows) {
                _this.logService.log('App#activate');
                // Mac only event: open new window when we get activated
                if (!hasVisibleWindows && _this.windowsMainService) {
                    _this.windowsMainService.openNewWindow(windows_2.OpenContext.DOCK);
                }
            });
            var isValidWebviewSource = function (source) {
                return !source || uri_1.default.parse(source.toLowerCase()).toString().startsWith(uri_1.default.file(_this.environmentService.appRoot.toLowerCase()).toString());
            };
            electron_1.app.on('web-contents-created', function (event, contents) {
                contents.on('will-attach-webview', function (event, webPreferences, params) {
                    delete webPreferences.preload;
                    webPreferences.nodeIntegration = false;
                    // Verify URLs being loaded
                    if (isValidWebviewSource(params.src) && isValidWebviewSource(webPreferences.preloadURL)) {
                        return;
                    }
                    // Otherwise prevent loading
                    _this.logService.error('webContents#web-contents-created: Prevented webview attach');
                    event.preventDefault();
                });
                contents.on('will-navigate', function (event) {
                    _this.logService.error('webContents#will-navigate: Prevented webcontent navigation');
                    event.preventDefault();
                });
            });
            var macOpenFiles = [];
            var runningTimeout = null;
            electron_1.app.on('open-file', function (event, path) {
                _this.logService.log('App#open-file: ', path);
                event.preventDefault();
                // Keep in array because more might come!
                macOpenFiles.push(path);
                // Clear previous handler if any
                if (runningTimeout !== null) {
                    clearTimeout(runningTimeout);
                    runningTimeout = null;
                }
                // Handle paths delayed in case more are coming!
                runningTimeout = setTimeout(function () {
                    if (_this.windowsMainService) {
                        _this.windowsMainService.open({
                            context: windows_2.OpenContext.DOCK /* can also be opening from finder while app is running */,
                            cli: _this.environmentService.args,
                            pathsToOpen: macOpenFiles,
                            preferNewWindow: true /* dropping on the dock or opening from finder prefers to open in a new window */
                        });
                        macOpenFiles = [];
                        runningTimeout = null;
                    }
                }, 100);
            });
            electron_1.app.on('new-window-for-tab', function () {
                _this.windowsMainService.openNewWindow(windows_2.OpenContext.DESKTOP); //macOS native tab "+" button
            });
            electron_1.ipcMain.on('vscode:exit', function (event, code) {
                _this.logService.log('IPC#vscode:exit', code);
                _this.dispose();
                _this.lifecycleService.kill(code);
            });
            electron_1.ipcMain.on(commonProperties_1.machineIdIpcChannel, function (event, machineId) {
                _this.logService.log('IPC#vscode-machineId');
                _this.storageService.setItem(commonProperties_1.machineIdStorageKey, machineId);
            });
            electron_1.ipcMain.on('vscode:fetchShellEnv', function (event, windowId) {
                var webContents = electron_1.BrowserWindow.fromId(windowId).webContents;
                shellEnv_1.getShellEnvironment().then(function (shellEnv) {
                    if (!webContents.isDestroyed()) {
                        webContents.send('vscode:acceptShellEnv', shellEnv);
                    }
                }, function (err) {
                    if (!webContents.isDestroyed()) {
                        webContents.send('vscode:acceptShellEnv', {});
                    }
                    _this.logService.error('Error fetching shell env', err);
                });
            });
            electron_1.ipcMain.on('vscode:broadcast', function (event, windowId, broadcast) {
                if (_this.windowsMainService && broadcast.channel && !types_1.isUndefinedOrNull(broadcast.payload)) {
                    _this.logService.log('IPC#vscode:broadcast', broadcast.channel, broadcast.payload);
                    // Handle specific events on main side
                    _this.onBroadcast(broadcast.channel, broadcast.payload);
                    // Send to all windows (except sender window)
                    _this.windowsMainService.sendToAll('vscode:broadcast', broadcast, [windowId]);
                }
            });
            // Keyboard layout changes
            keyboard_1.KeyboardLayoutMonitor.INSTANCE.onDidChangeKeyboardLayout(function (isISOKeyboard) {
                if (_this.windowsMainService) {
                    _this.windowsMainService.sendToAll('vscode:keyboardLayoutChanged', isISOKeyboard);
                }
            });
        };
        CodeApplication.prototype.onBroadcast = function (event, payload) {
            // Theme changes
            if (event === 'vscode:changeColorTheme' && typeof payload === 'string') {
                var data = JSON.parse(payload);
                this.storageService.setItem(window_1.CodeWindow.themeStorageKey, data.id);
                this.storageService.setItem(window_1.CodeWindow.themeBackgroundStorageKey, data.background);
            }
        };
        CodeApplication.prototype.startup = function () {
            var _this = this;
            this.logService.log('Starting VS Code in verbose mode');
            this.logService.log("from: " + this.environmentService.appRoot);
            this.logService.log('args:', this.environmentService.args);
            // Make sure we associate the program with the app user model id
            // This will help Windows to associate the running program with
            // any shortcut that is pinned to the taskbar and prevent showing
            // two icons in the taskbar for the same app.
            if (platform.isWindows && product_1.default.win32AppUserModelId) {
                electron_1.app.setAppUserModelId(product_1.default.win32AppUserModelId);
            }
            // Create Electron IPC Server
            this.electronIpcServer = new ipc_electron_main_1.Server();
            // Spawn shared process
            this.sharedProcess = new sharedProcess_1.SharedProcess(this.environmentService, this.userEnv);
            this.toDispose.push(this.sharedProcess);
            this.sharedProcessClient = this.sharedProcess.whenReady().then(function () { return ipc_net_1.connect(_this.environmentService.sharedIPCHandle, 'main'); });
            // Services
            var appInstantiationService = this.initServices();
            // Setup Auth Handler
            var authHandler = appInstantiationService.createInstance(auth_1.ProxyAuthHandler);
            this.toDispose.push(authHandler);
            // Open Windows
            appInstantiationService.invokeFunction(function (accessor) { return _this.openFirstWindow(accessor); });
            // Post Open Windows Tasks
            appInstantiationService.invokeFunction(function (accessor) { return _this.afterWindowOpen(accessor); });
        };
        CodeApplication.prototype.initServices = function () {
            var _this = this;
            var services = new serviceCollection_1.ServiceCollection();
            services.set(update_1.IUpdateService, new descriptors_1.SyncDescriptor(updateService_1.UpdateService));
            services.set(windows_3.IWindowsMainService, new descriptors_1.SyncDescriptor(windows_1.WindowsManager));
            services.set(windows_2.IWindowsService, new descriptors_1.SyncDescriptor(windowsService_1.WindowsService, this.sharedProcess));
            services.set(launch_1.ILaunchService, new descriptors_1.SyncDescriptor(launch_1.LaunchService));
            services.set(credentials_1.ICredentialsService, new descriptors_1.SyncDescriptor(credentialsService_1.CredentialsService));
            // Telemtry
            if (this.environmentService.isBuilt && !this.environmentService.isExtensionDevelopment && !!product_1.default.enableTelemetry) {
                var channel = ipc_1.getDelayedChannel(this.sharedProcessClient.then(function (c) { return c.getChannel('telemetryAppender'); }));
                var appender = new telemetryIpc_1.TelemetryAppenderClient(channel);
                var commonProperties = commonProperties_1.resolveCommonProperties(product_1.default.commit, package_1.default.version)
                    .then(function (result) { return Object.defineProperty(result, 'common.machineId', {
                    get: function () { return _this.storageService.getItem(commonProperties_1.machineIdStorageKey); },
                    enumerable: true
                }); });
                var piiPaths = [this.environmentService.appRoot, this.environmentService.extensionsPath];
                var config = { appender: appender, commonProperties: commonProperties, piiPaths: piiPaths };
                services.set(telemetry_1.ITelemetryService, new descriptors_1.SyncDescriptor(telemetryService_1.TelemetryService, config));
            }
            else {
                services.set(telemetry_1.ITelemetryService, telemetryUtils_1.NullTelemetryService);
            }
            return this.instantiationService.createChild(services);
        };
        CodeApplication.prototype.openFirstWindow = function (accessor) {
            var _this = this;
            var appInstantiationService = accessor.get(instantiation_1.IInstantiationService);
            // TODO@Joao: unfold this
            this.windowsMainService = accessor.get(windows_3.IWindowsMainService);
            // TODO@Joao: so ugly...
            this.windowsMainService.onWindowsCountChanged(function (e) {
                if (!platform.isMacintosh && e.newCount === 0) {
                    _this.sharedProcess.dispose();
                }
            });
            // Register more Main IPC services
            var launchService = accessor.get(launch_1.ILaunchService);
            var launchChannel = new launch_1.LaunchChannel(launchService);
            this.mainIpcServer.registerChannel('launch', launchChannel);
            // Register more Electron IPC services
            var updateService = accessor.get(update_1.IUpdateService);
            var updateChannel = new updateIpc_1.UpdateChannel(updateService);
            this.electronIpcServer.registerChannel('update', updateChannel);
            var urlService = accessor.get(url_1.IURLService);
            var urlChannel = appInstantiationService.createInstance(urlIpc_1.URLChannel, urlService);
            this.electronIpcServer.registerChannel('url', urlChannel);
            var workspacesService = accessor.get(workspaces_1.IWorkspacesMainService);
            var workspacesChannel = appInstantiationService.createInstance(workspacesIpc_1.WorkspacesChannel, workspacesService);
            this.electronIpcServer.registerChannel('workspaces', workspacesChannel);
            var windowsService = accessor.get(windows_2.IWindowsService);
            var windowsChannel = new windowsIpc_1.WindowsChannel(windowsService);
            this.electronIpcServer.registerChannel('windows', windowsChannel);
            this.sharedProcessClient.done(function (client) { return client.registerChannel('windows', windowsChannel); });
            var credentialsService = accessor.get(credentials_1.ICredentialsService);
            var credentialsChannel = new credentialsIpc_1.CredentialsChannel(credentialsService);
            this.electronIpcServer.registerChannel('credentials', credentialsChannel);
            // Lifecycle
            this.lifecycleService.ready();
            // Propagate to clients
            this.windowsMainService.ready(this.userEnv);
            // Open our first window
            var args = this.environmentService.args;
            var context = !!process.env['VSCODE_CLI'] ? windows_2.OpenContext.CLI : windows_2.OpenContext.DESKTOP;
            if (args['new-window'] && args._.length === 0) {
                this.windowsMainService.open({ context: context, cli: args, forceNewWindow: true, forceEmpty: true, initialStartup: true }); // new window if "-n" was used without paths
            }
            else if (global.macOpenFiles && global.macOpenFiles.length && (!args._ || !args._.length)) {
                this.windowsMainService.open({ context: windows_2.OpenContext.DOCK, cli: args, pathsToOpen: global.macOpenFiles, initialStartup: true }); // mac: open-file event received on startup
            }
            else {
                this.windowsMainService.open({ context: context, cli: args, forceNewWindow: args['new-window'] || (!args._.length && args['unity-launch']), diffMode: args.diff, initialStartup: true }); // default: read paths from cli
            }
        };
        CodeApplication.prototype.afterWindowOpen = function (accessor) {
            var _this = this;
            var appInstantiationService = accessor.get(instantiation_1.IInstantiationService);
            // Setup Windows mutex
            var windowsMutex = null;
            if (platform.isWindows) {
                try {
                    var Mutex_1 = require.__$__nodeRequire('windows-mutex').Mutex;
                    windowsMutex = new Mutex_1(product_1.default.win32MutexName);
                    this.toDispose.push({ dispose: function () { return windowsMutex.release(); } });
                }
                catch (e) {
                    // noop
                }
            }
            // Install Menu
            appInstantiationService.createInstance(menus_1.CodeMenu);
            // Jump List
            this.historyService.updateWindowsJumpList();
            this.historyService.onRecentlyOpenedChange(function () { return _this.historyService.updateWindowsJumpList(); });
            // Start shared process here
            this.sharedProcess.spawn();
            // Helps application icon refresh after an update with new icon is installed (macOS)
            // TODO@Ben remove after a couple of releases
            if (platform.isMacintosh) {
                if (!this.storageService.getItem(CodeApplication.APP_ICON_REFRESH_KEY)) {
                    this.storageService.setItem(CodeApplication.APP_ICON_REFRESH_KEY, true);
                    // 'exe' => /Applications/Visual Studio Code - Insiders.app/Contents/MacOS/Electron
                    var appPath = path_1.dirname(path_1.dirname(path_1.dirname(electron_1.app.getPath('exe'))));
                    var infoPlistPath = path_1.join(appPath, 'Contents', 'Info.plist');
                    pfs_1.touch(appPath).done(null, function (error) { });
                    pfs_1.touch(infoPlistPath).done(null, function (error) { });
                }
            }
        };
        CodeApplication.prototype.dispose = function () {
            this.toDispose = lifecycle_1.dispose(this.toDispose);
        };
        CodeApplication.APP_ICON_REFRESH_KEY = 'macOSAppIconRefresh';
        CodeApplication = __decorate([
            __param(2, instantiation_1.IInstantiationService),
            __param(3, log_1.ILogService),
            __param(4, environment_1.IEnvironmentService),
            __param(5, lifecycleMain_1.ILifecycleService),
            __param(6, configuration_1.IConfigurationService),
            __param(7, storage_1.IStorageService),
            __param(8, history_1.IHistoryMainService)
        ], CodeApplication);
        return CodeApplication;
    }());
    exports.CodeApplication = CodeApplication;
});
//# sourceMappingURL=app.js.map