/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "vs/nls", "vs/base/common/winjs.base", "vs/workbench/electron-browser/shell", "vs/base/browser/browser", "vs/base/browser/dom", "vs/base/common/errors", "vs/base/common/comparers", "vs/base/common/platform", "vs/base/common/paths", "vs/base/common/uri", "vs/base/common/strings", "vs/workbench/services/configuration/node/configuration", "vs/platform/instantiation/common/descriptors", "vs/platform/instantiation/common/serviceCollection", "vs/base/node/pfs", "vs/platform/environment/node/environmentService", "path", "graceful-fs", "vs/workbench/services/timer/node/timerService", "vs/workbench/services/keybinding/electron-browser/keybindingService", "vs/platform/windows/common/windows", "vs/platform/windows/common/windowsIpc", "vs/platform/storage/common/storageService", "vs/base/parts/ipc/electron-browser/ipc.electron-browser", "electron", "vs/platform/update/common/updateIpc", "vs/platform/update/common/update", "vs/platform/url/common/urlIpc", "vs/platform/url/common/url", "vs/platform/workspaces/common/workspacesIpc", "vs/platform/workspaces/common/workspaces", "vs/platform/credentials/common/credentials", "vs/platform/credentials/node/credentialsIpc", "vs/platform/storage/common/migration", "fs"], function (require, exports, nls, winjs_base_1, shell_1, browser, dom_1, errors, comparer, platform, paths, uri_1, strings, configuration_1, descriptors_1, serviceCollection_1, pfs_1, environmentService_1, path, gracefulFs, timerService_1, keybindingService_1, windows_1, windowsIpc_1, storageService_1, ipc_electron_browser_1, electron_1, updateIpc_1, update_1, urlIpc_1, url_1, workspacesIpc_1, workspaces_1, credentials_1, credentialsIpc_1, migration_1, fs) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    gracefulFs.gracefulify(fs); // enable gracefulFs
    var currentWindowId = electron_1.remote.getCurrentWindow().id;
    function startup(configuration) {
        // Ensure others can listen to zoom level changes
        browser.setZoomFactor(electron_1.webFrame.getZoomFactor());
        // See https://github.com/Microsoft/vscode/issues/26151
        // Can be trusted because we are not setting it ourselves.
        browser.setZoomLevel(electron_1.webFrame.getZoomLevel(), true /* isTrusted */);
        browser.setFullscreen(!!configuration.fullscreen);
        keybindingService_1.KeyboardMapperFactory.INSTANCE._onKeyboardLayoutChanged(configuration.isISOKeyboard);
        browser.setAccessibilitySupport(configuration.accessibilitySupport ? 2 /* Enabled */ : 1 /* Disabled */);
        // Setup Intl
        comparer.setFileNameComparer(new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' }));
        // Open workbench
        return openWorkbench(configuration);
    }
    exports.startup = startup;
    function openWorkbench(configuration) {
        var mainProcessClient = new ipc_electron_browser_1.Client(String("window" + currentWindowId));
        var mainServices = createMainProcessServices(mainProcessClient);
        var environmentService = new environmentService_1.EnvironmentService(configuration, configuration.execPath);
        // Since the configuration service is one of the core services that is used in so many places, we initialize it
        // right before startup of the workbench shell to have its data ready for consumers
        return createAndInitializeWorkspaceService(configuration, environmentService, mainServices.get(workspaces_1.IWorkspacesService)).then(function (workspaceService) {
            var timerService = new timerService_1.TimerService(window.MonacoEnvironment.timers, !workspaceService.hasWorkspace());
            var storageService = createStorageService(configuration, workspaceService, environmentService);
            timerService.beforeDOMContentLoaded = Date.now();
            return dom_1.domContentLoaded().then(function () {
                timerService.afterDOMContentLoaded = Date.now();
                // Open Shell
                timerService.beforeWorkbenchOpen = Date.now();
                var shell = new shell_1.WorkbenchShell(document.body, {
                    contextService: workspaceService,
                    configurationService: workspaceService,
                    environmentService: environmentService,
                    timerService: timerService,
                    storageService: storageService
                }, mainServices, configuration);
                shell.open();
                // Inform user about loading issues from the loader
                self.require.config({
                    onError: function (err) {
                        if (err.errorCode === 'load') {
                            shell.onUnexpectedError(loaderError(err));
                        }
                    }
                });
            });
        });
    }
    function createAndInitializeWorkspaceService(configuration, environmentService, workspacesService) {
        return migrateWorkspaceId(configuration).then(function () {
            return validateWorkspacePath(configuration).then(function () {
                var workspaceService;
                if (configuration.workspace || configuration.folderPath) {
                    workspaceService = new configuration_1.WorkspaceServiceImpl(configuration.workspace || configuration.folderPath, environmentService, workspacesService);
                }
                else {
                    workspaceService = new configuration_1.EmptyWorkspaceServiceImpl(environmentService);
                }
                return workspaceService.initialize().then(function () { return workspaceService; }, function (error) { return new configuration_1.EmptyWorkspaceServiceImpl(environmentService); });
            });
        });
    }
    // TODO@Ben migration
    function migrateWorkspaceId(configuration) {
        if (!configuration.workspace || !configuration.workspace.configPath) {
            return winjs_base_1.TPromise.as(null);
        }
        return pfs_1.readFile(configuration.workspace.configPath).then(function (data) {
            try {
                var raw = JSON.parse(data.toString());
                if (raw.id) {
                    var previousWorkspaceId = raw.id;
                    delete raw.id;
                    migration_1.migrateStorageToMultiRootWorkspace(uri_1.default.from({ path: previousWorkspaceId, scheme: 'root' }).toString(), configuration.workspace, window.localStorage);
                    return pfs_1.writeFile(configuration.workspace.configPath, JSON.stringify(raw, null, '\t'));
                }
            }
            catch (error) { }
            ;
            return void 0;
        }).then(function () { return void 0; }, function () { return void 0; });
    }
    function validateWorkspacePath(configuration) {
        if (!configuration.folderPath) {
            return winjs_base_1.TPromise.as(null);
        }
        return pfs_1.realpath(configuration.folderPath).then(function (realFolderPath) {
            // for some weird reason, node adds a trailing slash to UNC paths
            // we never ever want trailing slashes as our workspace path unless
            // someone opens root ("/").
            // See also https://github.com/nodejs/io.js/issues/1765
            if (paths.isUNC(realFolderPath) && strings.endsWith(realFolderPath, paths.nativeSep)) {
                realFolderPath = strings.rtrim(realFolderPath, paths.nativeSep);
            }
            // update config
            configuration.folderPath = realFolderPath;
        }, function (error) {
            errors.onUnexpectedError(error);
            return null; // treat invalid paths as empty workspace
        });
    }
    function createStorageService(configuration, workspaceService, environmentService) {
        var workspace = workspaceService.getWorkspace();
        var workspaceId;
        var secondaryWorkspaceId;
        // in multi root workspace mode we use the provided ID as key for workspace storage
        if (workspaceService.hasMultiFolderWorkspace()) {
            workspaceId = uri_1.default.from({ path: workspace.id, scheme: 'root' }).toString();
        }
        else if (workspaceService.hasFolderWorkspace()) {
            var legacyWorkspace = workspaceService.getLegacyWorkspace();
            workspaceId = legacyWorkspace.resource.toString();
            secondaryWorkspaceId = legacyWorkspace.ctime;
        }
        else if (configuration.backupPath) {
            workspaceId = uri_1.default.from({ path: path.basename(configuration.backupPath), scheme: 'empty' }).toString();
        }
        var disableStorage = !!environmentService.extensionTestsPath; // never keep any state when running extension tests!
        var storage = disableStorage ? storageService_1.inMemoryLocalStorageInstance : window.localStorage;
        return new storageService_1.StorageService(storage, storage, workspaceId, secondaryWorkspaceId);
    }
    function createMainProcessServices(mainProcessClient) {
        var serviceCollection = new serviceCollection_1.ServiceCollection();
        var windowsChannel = mainProcessClient.getChannel('windows');
        serviceCollection.set(windows_1.IWindowsService, new windowsIpc_1.WindowsChannelClient(windowsChannel));
        var updateChannel = mainProcessClient.getChannel('update');
        serviceCollection.set(update_1.IUpdateService, new descriptors_1.SyncDescriptor(updateIpc_1.UpdateChannelClient, updateChannel));
        var urlChannel = mainProcessClient.getChannel('url');
        serviceCollection.set(url_1.IURLService, new descriptors_1.SyncDescriptor(urlIpc_1.URLChannelClient, urlChannel, currentWindowId));
        var workspacesChannel = mainProcessClient.getChannel('workspaces');
        serviceCollection.set(workspaces_1.IWorkspacesService, new workspacesIpc_1.WorkspacesChannelClient(workspacesChannel));
        var credentialsChannel = mainProcessClient.getChannel('credentials');
        serviceCollection.set(credentials_1.ICredentialsService, new credentialsIpc_1.CredentialsChannelClient(credentialsChannel));
        return serviceCollection;
    }
    function loaderError(err) {
        if (platform.isWeb) {
            return new Error(nls.localize('loaderError', "Failed to load a required file. Either you are no longer connected to the internet or the server you are connected to is offline. Please refresh the browser to try again."));
        }
        return new Error(nls.localize('loaderErrorNative', "Failed to load a required file. Please restart the application to try again. Details: {0}", JSON.stringify(err)));
    }
});
//# sourceMappingURL=main.js.map