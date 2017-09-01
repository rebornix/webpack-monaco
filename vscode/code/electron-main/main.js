/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "electron", "vs/base/common/objects", "vs/base/common/platform", "vs/platform/environment/node/argv", "vs/base/node/pfs", "vs/code/node/paths", "vs/platform/lifecycle/electron-main/lifecycleMain", "vs/base/parts/ipc/node/ipc.net", "vs/base/common/winjs.base", "./launch", "vs/platform/instantiation/common/instantiationService", "vs/platform/instantiation/common/serviceCollection", "vs/platform/instantiation/common/descriptors", "vs/platform/log/common/log", "vs/platform/storage/node/storage", "vs/platform/backup/common/backup", "vs/platform/backup/electron-main/backupMainService", "vs/platform/environment/common/environment", "vs/platform/environment/node/environmentService", "vs/platform/configuration/common/configuration", "vs/platform/configuration/node/configurationService", "vs/platform/request/node/request", "vs/platform/request/electron-main/requestService", "vs/platform/url/common/url", "vs/platform/url/electron-main/urlService", "original-fs", "vs/code/electron-main/app", "vs/platform/history/electron-main/historyMainService", "vs/platform/history/common/history", "vs/platform/workspaces/electron-main/workspacesMainService", "vs/platform/workspaces/common/workspaces"], function (require, exports, electron_1, objects_1, platform, argv_1, pfs_1, paths_1, lifecycleMain_1, ipc_net_1, winjs_base_1, launch_1, instantiationService_1, serviceCollection_1, descriptors_1, log_1, storage_1, backup_1, backupMainService_1, environment_1, environmentService_1, configuration_1, configurationService_1, request_1, requestService_1, url_1, urlService_1, fs, app_1, historyMainService_1, history_1, workspacesMainService_1, workspaces_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function createServices(args) {
        var services = new serviceCollection_1.ServiceCollection();
        services.set(environment_1.IEnvironmentService, new descriptors_1.SyncDescriptor(environmentService_1.EnvironmentService, args, process.execPath));
        services.set(log_1.ILogService, new descriptors_1.SyncDescriptor(log_1.LogMainService));
        services.set(workspaces_1.IWorkspacesMainService, new descriptors_1.SyncDescriptor(workspacesMainService_1.WorkspacesMainService));
        services.set(history_1.IHistoryMainService, new descriptors_1.SyncDescriptor(historyMainService_1.HistoryMainService));
        services.set(lifecycleMain_1.ILifecycleService, new descriptors_1.SyncDescriptor(lifecycleMain_1.LifecycleService));
        services.set(storage_1.IStorageService, new descriptors_1.SyncDescriptor(storage_1.StorageService));
        services.set(configuration_1.IConfigurationService, new descriptors_1.SyncDescriptor(configurationService_1.ConfigurationService));
        services.set(request_1.IRequestService, new descriptors_1.SyncDescriptor(requestService_1.RequestService));
        services.set(url_1.IURLService, new descriptors_1.SyncDescriptor(urlService_1.URLService, args['open-url']));
        services.set(backup_1.IBackupMainService, new descriptors_1.SyncDescriptor(backupMainService_1.BackupMainService));
        return new instantiationService_1.InstantiationService(services, true);
    }
    function createPaths(environmentService) {
        var paths = [
            environmentService.appSettingsHome,
            environmentService.extensionsPath,
            environmentService.nodeCachedDataDir
        ];
        return winjs_base_1.TPromise.join(paths.map(function (p) { return p && pfs_1.mkdirp(p); }));
    }
    var ExpectedError = (function (_super) {
        __extends(ExpectedError, _super);
        function ExpectedError() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.isExpected = true;
            return _this;
        }
        return ExpectedError;
    }(Error));
    function setupIPC(accessor) {
        var logService = accessor.get(log_1.ILogService);
        var environmentService = accessor.get(environment_1.IEnvironmentService);
        function allowSetForegroundWindow(service) {
            var promise = winjs_base_1.TPromise.as(void 0);
            if (platform.isWindows) {
                promise = service.getMainProcessId()
                    .then(function (processId) {
                    logService.log('Sending some foreground love to the running instance:', processId);
                    try {
                        var allowSetForegroundWindow_1 = require.__$__nodeRequire('windows-foreground-love').allowSetForegroundWindow;
                        allowSetForegroundWindow_1(processId);
                    }
                    catch (e) {
                        // noop
                    }
                });
            }
            return promise;
        }
        function setup(retry) {
            return ipc_net_1.serve(environmentService.mainIPCHandle).then(function (server) {
                if (platform.isMacintosh) {
                    electron_1.app.dock.show(); // dock might be hidden at this case due to a retry
                }
                return server;
            }, function (err) {
                if (err.code !== 'EADDRINUSE') {
                    return winjs_base_1.TPromise.wrapError(err);
                }
                // Since we are the second instance, we do not want to show the dock
                if (platform.isMacintosh) {
                    electron_1.app.dock.hide();
                }
                // there's a running instance, let's connect to it
                return ipc_net_1.connect(environmentService.mainIPCHandle, 'main').then(function (client) {
                    // Tests from CLI require to be the only instance currently
                    if (environmentService.extensionTestsPath && !environmentService.debugExtensionHost.break) {
                        var msg = 'Running extension tests from the command line is currently only supported if no other instance of Code is running.';
                        logService.error(msg);
                        client.dispose();
                        return winjs_base_1.TPromise.wrapError(new Error(msg));
                    }
                    logService.log('Sending env to running instance...');
                    var channel = client.getChannel('launch');
                    var service = new launch_1.LaunchChannelClient(channel);
                    return allowSetForegroundWindow(service)
                        .then(function () { return service.start(environmentService.args, process.env); })
                        .then(function () { return client.dispose(); })
                        .then(function () { return winjs_base_1.TPromise.wrapError(new ExpectedError('Sent env to running instance. Terminating...')); });
                }, function (err) {
                    if (!retry || platform.isWindows || err.code !== 'ECONNREFUSED') {
                        return winjs_base_1.TPromise.wrapError(err);
                    }
                    // it happens on Linux and OS X that the pipe is left behind
                    // let's delete it, since we can't connect to it
                    // and the retry the whole thing
                    try {
                        fs.unlinkSync(environmentService.mainIPCHandle);
                    }
                    catch (e) {
                        logService.log('Fatal error deleting obsolete instance handle', e);
                        return winjs_base_1.TPromise.wrapError(e);
                    }
                    return setup(false);
                });
            });
        }
        return setup(true);
    }
    function quit(accessor, reason) {
        var logService = accessor.get(log_1.ILogService);
        var lifecycleService = accessor.get(lifecycleMain_1.ILifecycleService);
        var exitCode = 0;
        if (reason) {
            if (reason.isExpected) {
                logService.log(reason.message);
            }
            else {
                exitCode = 1; // signal error to the outside
                if (reason.stack) {
                    console.error(reason.stack);
                }
                else {
                    console.error("Startup error: " + reason.toString());
                }
            }
        }
        lifecycleService.kill(exitCode);
    }
    function main() {
        var args;
        try {
            args = argv_1.parseMainProcessArgv(process.argv);
            args = paths_1.validatePaths(args);
        }
        catch (err) {
            console.error(err.message);
            electron_1.app.exit(1);
            return;
        }
        var instantiationService = createServices(args);
        return instantiationService.invokeFunction(function (accessor) {
            // Patch `process.env` with the instance's environment
            var environmentService = accessor.get(environment_1.IEnvironmentService);
            var instanceEnv = {
                VSCODE_PID: String(process.pid),
                VSCODE_IPC_HOOK: environmentService.mainIPCHandle,
                VSCODE_NLS_CONFIG: process.env['VSCODE_NLS_CONFIG']
            };
            objects_1.assign(process.env, instanceEnv);
            // Startup
            return instantiationService.invokeFunction(function (a) { return createPaths(a.get(environment_1.IEnvironmentService)); })
                .then(function () { return instantiationService.invokeFunction(setupIPC); })
                .then(function (mainIpcServer) {
                var app = instantiationService.createInstance(app_1.CodeApplication, mainIpcServer, instanceEnv);
                app.startup();
            });
        }).done(null, function (err) { return instantiationService.invokeFunction(quit, err); });
    }
    main();
});
//# sourceMappingURL=main.js.map