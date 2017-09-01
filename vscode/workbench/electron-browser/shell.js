/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "vs/nls", "vs/base/common/platform", "vs/base/browser/builder", "vs/base/browser/dom", "vs/base/browser/ui/aria/aria", "vs/base/common/lifecycle", "vs/base/common/errors", "vs/base/common/errorMessage", "vs/platform/node/product", "vs/platform/instantiation/common/descriptors", "vs/platform/node/package", "vs/platform/contextview/browser/contextViewService", "vs/workbench/electron-browser/workbench", "vs/platform/telemetry/common/telemetry", "vs/platform/telemetry/common/telemetryUtils", "vs/platform/telemetry/common/experiments", "vs/platform/telemetry/common/telemetryIpc", "vs/platform/telemetry/common/telemetryService", "vs/platform/telemetry/browser/idleMonitor", "vs/platform/telemetry/browser/errorTelemetry", "vs/workbench/electron-browser/window", "vs/platform/telemetry/node/workbenchCommonProperties", "vs/platform/telemetry/node/commonProperties", "vs/workbench/services/telemetry/common/workspaceStats", "vs/platform/windows/common/windows", "vs/platform/windows/electron-browser/windowService", "vs/workbench/services/message/electron-browser/messageService", "vs/platform/request/node/request", "vs/platform/request/electron-browser/requestService", "vs/platform/configuration/common/configuration", "vs/workbench/services/search/node/searchService", "vs/workbench/services/lifecycle/electron-browser/lifecycleService", "vs/platform/markers/common/markerService", "vs/editor/common/services/modelService", "vs/editor/common/services/modelServiceImpl", "vs/editor/browser/services/codeEditorServiceImpl", "vs/editor/common/services/codeEditorService", "vs/platform/integrity/node/integrityServiceImpl", "vs/platform/integrity/common/integrity", "vs/editor/common/services/editorWorkerServiceImpl", "vs/editor/common/services/editorWorkerService", "vs/workbench/services/extensions/electron-browser/extensionService", "vs/platform/storage/common/storage", "vs/platform/instantiation/common/serviceCollection", "vs/platform/instantiation/common/instantiationService", "vs/platform/contextview/browser/contextView", "vs/platform/lifecycle/common/lifecycle", "vs/platform/markers/common/markers", "vs/platform/environment/common/environment", "vs/platform/message/common/message", "vs/platform/message/common/messageIpc", "vs/platform/search/common/search", "vs/platform/commands/common/commands", "vs/platform/commands/common/commandService", "vs/platform/workspace/common/workspace", "vs/platform/extensions/common/extensions", "vs/workbench/services/mode/common/workbenchModeService", "vs/editor/common/services/modeService", "vs/workbench/services/untitled/common/untitledEditorService", "vs/workbench/services/crashReporter/common/crashReporterService", "vs/workbench/services/crashReporter/electron-browser/crashReporterService", "vs/workbench/electron-browser/nodeCachedDataManager", "vs/base/parts/ipc/common/ipc", "vs/base/parts/ipc/node/ipc.net", "vs/platform/extensionManagement/common/extensionManagementIpc", "vs/platform/extensionManagement/common/extensionManagement", "vs/platform/extensionManagement/common/extensionEnablementService", "vs/workbench/services/timer/common/timerService", "electron", "vs/editor/common/config/fontInfo", "vs/editor/browser/config/configuration", "vs/base/browser/browser", "vs/workbench/services/themes/common/workbenchThemeService", "vs/workbench/services/themes/electron-browser/workbenchThemeService", "vs/editor/common/services/resourceConfiguration", "vs/editor/common/services/resourceConfigurationImpl", "vs/platform/theme/common/themeService", "vs/platform/theme/common/colorRegistry", "vs/workbench/services/textMate/electron-browser/TMSyntax", "vs/workbench/services/textMate/electron-browser/textMateService", "vs/platform/broadcast/electron-browser/broadcastService", "vs/css!./media/shell", "vs/platform/opener/browser/opener.contribution"], function (require, exports, nls, platform, builder_1, dom, aria, lifecycle_1, errors, errorMessage_1, product_1, descriptors_1, package_1, contextViewService_1, workbench_1, telemetry_1, telemetryUtils_1, experiments_1, telemetryIpc_1, telemetryService_1, idleMonitor_1, errorTelemetry_1, window_1, workbenchCommonProperties_1, commonProperties_1, workspaceStats_1, windows_1, windowService_1, messageService_1, request_1, requestService_1, configuration_1, searchService_1, lifecycleService_1, markerService_1, modelService_1, modelServiceImpl_1, codeEditorServiceImpl_1, codeEditorService_1, integrityServiceImpl_1, integrity_1, editorWorkerServiceImpl_1, editorWorkerService_1, extensionService_1, storage_1, serviceCollection_1, instantiationService_1, contextView_1, lifecycle_2, markers_1, environment_1, message_1, messageIpc_1, search_1, commands_1, commandService_1, workspace_1, extensions_1, workbenchModeService_1, modeService_1, untitledEditorService_1, crashReporterService_1, crashReporterService_2, nodeCachedDataManager_1, ipc_1, ipc_net_1, extensionManagementIpc_1, extensionManagement_1, extensionEnablementService_1, timerService_1, electron_1, fontInfo_1, configuration_2, browser, workbenchThemeService_1, workbenchThemeService_2, resourceConfiguration_1, resourceConfigurationImpl_1, themeService_1, colorRegistry_1, TMSyntax_1, textMateService_1, broadcastService_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var currentWindow = electron_1.remote.getCurrentWindow();
    /**
     * The workbench shell contains the workbench with a rich header containing navigation and the activity bar.
     * With the Shell being the top level element in the page, it is also responsible for driving the layouting.
     */
    var WorkbenchShell = (function () {
        function WorkbenchShell(container, coreServices, mainProcessServices, configuration) {
            this.container = container;
            this.configuration = configuration;
            this.contextService = coreServices.contextService;
            this.configurationService = coreServices.configurationService;
            this.environmentService = coreServices.environmentService;
            this.timerService = coreServices.timerService;
            this.storageService = coreServices.storageService;
            this.mainProcessServices = mainProcessServices;
            this.toUnbind = [];
            this.previousErrorTime = 0;
        }
        WorkbenchShell.prototype.createContents = function (parent) {
            var _this = this;
            // ARIA
            aria.setARIAContainer(document.body);
            // Workbench Container
            var workbenchContainer = builder_1.$(parent).div();
            // Instantiation service with services
            var _a = this.initServiceCollection(parent.getHTMLElement()), instantiationService = _a[0], serviceCollection = _a[1];
            // Workbench
            this.workbench = instantiationService.createInstance(workbench_1.Workbench, parent.getHTMLElement(), workbenchContainer.getHTMLElement(), this.configuration, serviceCollection);
            this.workbench.startup({
                onWorkbenchStarted: function (info) {
                    // run workbench started logic
                    _this.onWorkbenchStarted(info);
                    // start cached data manager
                    instantiationService.createInstance(nodeCachedDataManager_1.NodeCachedDataManager);
                    // Set lifecycle phase to `Runnning` so that other contributions
                    // can now do something
                    _this.lifecycleService.phase = lifecycle_2.LifecyclePhase.Running;
                }
            });
            // Window
            this.workbench.getInstantiationService().createInstance(window_1.ElectronWindow, this.container);
            // Handle case where workbench is not starting up properly
            var timeoutHandle = setTimeout(function () {
                console.warn('Workbench did not finish loading in 10 seconds, that might be a problem that should be reported.');
            }, 10000);
            this.workbench.joinCreation().then(function () {
                clearTimeout(timeoutHandle);
            });
            return workbenchContainer;
        };
        WorkbenchShell.prototype.onWorkbenchStarted = function (info) {
            var _this = this;
            // Telemetry: workspace info
            var _a = this.configuration, filesToOpen = _a.filesToOpen, filesToCreate = _a.filesToCreate, filesToDiff = _a.filesToDiff;
            this.telemetryService.publicLog('workspaceLoad', {
                userAgent: navigator.userAgent,
                windowSize: { innerHeight: window.innerHeight, innerWidth: window.innerWidth, outerHeight: window.outerHeight, outerWidth: window.outerWidth },
                emptyWorkbench: !this.contextService.hasWorkspace(),
                'workbench.filesToOpen': filesToOpen && filesToOpen.length || void 0,
                'workbench.filesToCreate': filesToCreate && filesToCreate.length || void 0,
                'workbench.filesToDiff': filesToDiff && filesToDiff.length || void 0,
                customKeybindingsCount: info.customKeybindingsCount,
                theme: this.themeService.getColorTheme().id,
                language: platform.language,
                experiments: this.experimentService.getExperiments(),
                pinnedViewlets: info.pinnedViewlets,
                restoredViewlet: info.restoredViewlet,
                restoredEditors: info.restoredEditors.length,
                startupKind: this.lifecycleService.startupKind
            });
            // Telemetry: startup metrics
            this.timerService.workbenchStarted = Date.now();
            this.timerService.restoreEditorsDuration = info.restoreEditorsDuration;
            this.timerService.restoreViewletDuration = info.restoreViewletDuration;
            this.extensionService.onReady().done(function () {
                _this.telemetryService.publicLog('startupTime', _this.timerService.startupMetrics);
            });
            // Telemetry: workspace tags
            var workspaceStats = this.workbench.getInstantiationService().createInstance(workspaceStats_1.WorkspaceStats);
            workspaceStats.reportWorkspaceTags(this.configuration);
            workspaceStats.reportCloudStats();
            if ((platform.isLinux || platform.isMacintosh) && process.getuid() === 0) {
                this.messageService.show(message_1.Severity.Warning, nls.localize('runningAsRoot', "It is recommended not to run Code as 'root'."));
            }
        };
        WorkbenchShell.prototype.initServiceCollection = function (container) {
            var _this = this;
            var disposables = [];
            var serviceCollection = new serviceCollection_1.ServiceCollection();
            serviceCollection.set(workspace_1.IWorkspaceContextService, this.contextService);
            serviceCollection.set(configuration_1.IConfigurationService, this.configurationService);
            serviceCollection.set(environment_1.IEnvironmentService, this.environmentService);
            serviceCollection.set(timerService_1.ITimerService, this.timerService);
            serviceCollection.set(storage_1.IStorageService, this.storageService);
            this.mainProcessServices.forEach(function (serviceIdentifier, serviceInstance) {
                serviceCollection.set(serviceIdentifier, serviceInstance);
            });
            var instantiationService = new instantiationService_1.InstantiationService(serviceCollection, true);
            this.broadcastService = new broadcastService_1.BroadcastService(currentWindow.id);
            serviceCollection.set(broadcastService_1.IBroadcastService, this.broadcastService);
            serviceCollection.set(windows_1.IWindowService, new descriptors_1.SyncDescriptor(windowService_1.WindowService, currentWindow.id));
            var sharedProcess = serviceCollection.get(windows_1.IWindowsService).whenSharedProcessReady()
                .then(function () { return ipc_net_1.connect(_this.environmentService.sharedIPCHandle, "window:" + currentWindow.id); });
            sharedProcess
                .done(function (client) { return client.registerChannel('choice', instantiationService.createInstance(messageIpc_1.ChoiceChannel)); });
            // Warm up font cache information before building up too many dom elements
            configuration_2.restoreFontInfo(this.storageService);
            configuration_2.readFontInfo(fontInfo_1.BareFontInfo.createFromRawSettings(this.configurationService.getConfiguration('editor'), browser.getZoomLevel()));
            // Experiments
            this.experimentService = instantiationService.createInstance(experiments_1.ExperimentService);
            serviceCollection.set(experiments_1.IExperimentService, this.experimentService);
            // Telemetry
            this.sendMachineIdToMain(this.storageService);
            if (this.environmentService.isBuilt && !this.environmentService.isExtensionDevelopment && !!product_1.default.enableTelemetry) {
                var channel = ipc_1.getDelayedChannel(sharedProcess.then(function (c) { return c.getChannel('telemetryAppender'); }));
                var commit = product_1.default.commit;
                var version = package_1.default.version;
                var config = {
                    appender: new telemetryIpc_1.TelemetryAppenderClient(channel),
                    commonProperties: workbenchCommonProperties_1.resolveWorkbenchCommonProperties(this.storageService, commit, version),
                    piiPaths: [this.environmentService.appRoot, this.environmentService.extensionsPath]
                };
                var telemetryService = instantiationService.createInstance(telemetryService_1.TelemetryService, config);
                this.telemetryService = telemetryService;
                var errorTelemetry = new errorTelemetry_1.default(telemetryService);
                var idleMonitor = new idleMonitor_1.IdleMonitor(2 * 60 * 1000); // 2 minutes
                var listener = idleMonitor.onStatusChange(function (status) {
                    return _this.telemetryService.publicLog(status === idleMonitor_1.UserStatus.Active
                        ? telemetryService_1.TelemetryService.IDLE_STOP_EVENT_NAME
                        : telemetryService_1.TelemetryService.IDLE_START_EVENT_NAME);
                });
                disposables.push(telemetryService, errorTelemetry, listener, idleMonitor);
            }
            else {
                this.telemetryService = telemetryUtils_1.NullTelemetryService;
            }
            serviceCollection.set(telemetry_1.ITelemetryService, this.telemetryService);
            disposables.push(telemetryUtils_1.configurationTelemetry(this.telemetryService, this.configurationService));
            var crashReporterService = crashReporterService_1.NullCrashReporterService;
            if (product_1.default.crashReporter && product_1.default.hockeyApp) {
                crashReporterService = instantiationService.createInstance(crashReporterService_2.CrashReporterService);
            }
            serviceCollection.set(crashReporterService_1.ICrashReporterService, crashReporterService);
            this.messageService = instantiationService.createInstance(messageService_1.MessageService, container);
            serviceCollection.set(message_1.IMessageService, this.messageService);
            serviceCollection.set(message_1.IChoiceService, this.messageService);
            var lifecycleService = instantiationService.createInstance(lifecycleService_1.LifecycleService);
            this.toUnbind.push(lifecycleService.onShutdown(function (reason) { return lifecycle_1.dispose(disposables); }));
            this.toUnbind.push(lifecycleService.onShutdown(function (reason) { return configuration_2.saveFontInfo(_this.storageService); }));
            serviceCollection.set(lifecycle_2.ILifecycleService, lifecycleService);
            disposables.push(telemetryUtils_1.lifecycleTelemetry(this.telemetryService, lifecycleService));
            this.lifecycleService = lifecycleService;
            var extensionManagementChannel = ipc_1.getDelayedChannel(sharedProcess.then(function (c) { return c.getChannel('extensions'); }));
            serviceCollection.set(extensionManagement_1.IExtensionManagementService, new descriptors_1.SyncDescriptor(extensionManagementIpc_1.ExtensionManagementChannelClient, extensionManagementChannel));
            var extensionEnablementService = instantiationService.createInstance(extensionEnablementService_1.ExtensionEnablementService);
            serviceCollection.set(extensionManagement_1.IExtensionEnablementService, extensionEnablementService);
            disposables.push(extensionEnablementService);
            this.extensionService = instantiationService.createInstance(extensionService_1.ExtensionService);
            serviceCollection.set(extensions_1.IExtensionService, this.extensionService);
            this.timerService.beforeExtensionLoad = Date.now();
            this.extensionService.onReady().done(function () {
                _this.timerService.afterExtensionLoad = Date.now();
            });
            this.themeService = instantiationService.createInstance(workbenchThemeService_2.WorkbenchThemeService, document.body);
            serviceCollection.set(workbenchThemeService_1.IWorkbenchThemeService, this.themeService);
            serviceCollection.set(commands_1.ICommandService, new descriptors_1.SyncDescriptor(commandService_1.CommandService));
            this.contextViewService = instantiationService.createInstance(contextViewService_1.ContextViewService, this.container);
            serviceCollection.set(contextView_1.IContextViewService, this.contextViewService);
            serviceCollection.set(request_1.IRequestService, new descriptors_1.SyncDescriptor(requestService_1.RequestService));
            serviceCollection.set(markers_1.IMarkerService, new descriptors_1.SyncDescriptor(markerService_1.MarkerService));
            serviceCollection.set(modeService_1.IModeService, new descriptors_1.SyncDescriptor(workbenchModeService_1.WorkbenchModeServiceImpl));
            serviceCollection.set(modelService_1.IModelService, new descriptors_1.SyncDescriptor(modelServiceImpl_1.ModelServiceImpl));
            serviceCollection.set(resourceConfiguration_1.ITextResourceConfigurationService, new descriptors_1.SyncDescriptor(resourceConfigurationImpl_1.TextResourceConfigurationService));
            serviceCollection.set(editorWorkerService_1.IEditorWorkerService, new descriptors_1.SyncDescriptor(editorWorkerServiceImpl_1.EditorWorkerServiceImpl));
            serviceCollection.set(untitledEditorService_1.IUntitledEditorService, new descriptors_1.SyncDescriptor(untitledEditorService_1.UntitledEditorService));
            serviceCollection.set(textMateService_1.ITextMateService, new descriptors_1.SyncDescriptor(TMSyntax_1.TextMateService));
            serviceCollection.set(search_1.ISearchService, new descriptors_1.SyncDescriptor(searchService_1.SearchService));
            serviceCollection.set(codeEditorService_1.ICodeEditorService, new descriptors_1.SyncDescriptor(codeEditorServiceImpl_1.CodeEditorServiceImpl));
            serviceCollection.set(integrity_1.IIntegrityService, new descriptors_1.SyncDescriptor(integrityServiceImpl_1.IntegrityServiceImpl));
            return [instantiationService, serviceCollection];
        };
        WorkbenchShell.prototype.sendMachineIdToMain = function (storageService) {
            workbenchCommonProperties_1.getOrCreateMachineId(storageService).then(function (machineId) {
                electron_1.ipcRenderer.send(commonProperties_1.machineIdIpcChannel, machineId);
            }).then(null, errors.onUnexpectedError);
        };
        WorkbenchShell.prototype.open = function () {
            var _this = this;
            // Listen on unexpected errors
            errors.setUnexpectedErrorHandler(function (error) {
                _this.onUnexpectedError(error);
            });
            // Shell Class for CSS Scoping
            builder_1.$(this.container).addClass('monaco-shell');
            // Controls
            this.content = builder_1.$('.monaco-shell-content').appendTo(this.container).getHTMLElement();
            // Create Contents
            this.contentsContainer = this.createContents(builder_1.$(this.content));
            // Layout
            this.layout();
            // Listeners
            this.registerListeners();
        };
        WorkbenchShell.prototype.registerListeners = function () {
            var _this = this;
            // Resize
            builder_1.$(window).on(dom.EventType.RESIZE, function () { return _this.layout(); }, this.toUnbind);
        };
        WorkbenchShell.prototype.onUnexpectedError = function (error) {
            var errorMsg = errorMessage_1.toErrorMessage(error, true);
            if (!errorMsg) {
                return;
            }
            var now = Date.now();
            if (errorMsg === this.previousErrorValue && now - this.previousErrorTime <= 1000) {
                return; // Return if error message identical to previous and shorter than 1 second
            }
            this.previousErrorTime = now;
            this.previousErrorValue = errorMsg;
            // Log to console
            console.error(errorMsg);
            // Show to user if friendly message provided
            if (error && error.friendlyMessage && this.messageService) {
                this.messageService.show(message_1.Severity.Error, error.friendlyMessage);
            }
        };
        WorkbenchShell.prototype.layout = function () {
            var clArea = builder_1.$(this.container).getClientArea();
            var contentsSize = new builder_1.Dimension(clArea.width, clArea.height);
            this.contentsContainer.size(contentsSize.width, contentsSize.height);
            this.contextViewService.layout();
            this.workbench.layout();
        };
        WorkbenchShell.prototype.joinCreation = function () {
            return this.workbench.joinCreation();
        };
        WorkbenchShell.prototype.dispose = function () {
            // Workbench
            if (this.workbench) {
                this.workbench.dispose();
            }
            this.contextViewService.dispose();
            // Listeners
            this.toUnbind = lifecycle_1.dispose(this.toUnbind);
            // Container
            builder_1.$(this.container).empty();
        };
        return WorkbenchShell;
    }());
    exports.WorkbenchShell = WorkbenchShell;
    themeService_1.registerThemingParticipant(function (theme, collector) {
        // Foreground
        var windowForeground = theme.getColor(colorRegistry_1.foreground);
        if (windowForeground) {
            collector.addRule(".monaco-shell { color: " + windowForeground + "; }");
        }
        // Selection
        var windowSelectionBackground = theme.getColor(colorRegistry_1.selectionBackground);
        if (windowSelectionBackground) {
            collector.addRule(".monaco-shell ::selection { background-color: " + windowSelectionBackground + "; }");
        }
        // Input placeholder
        var placeholderForeground = theme.getColor(colorRegistry_1.inputPlaceholderForeground);
        if (placeholderForeground) {
            collector.addRule(".monaco-shell input::-webkit-input-placeholder { color: " + placeholderForeground + "; }");
            collector.addRule(".monaco-shell textarea::-webkit-input-placeholder { color: " + placeholderForeground + "; }");
        }
        // List highlight
        var listHighlightForegroundColor = theme.getColor(colorRegistry_1.listHighlightForeground);
        if (listHighlightForegroundColor) {
            collector.addRule("\n\t\t\t.monaco-shell .monaco-tree .monaco-tree-row .monaco-highlighted-label .highlight,\n\t\t\t.monaco-shell .monaco-list .monaco-list-row .monaco-highlighted-label .highlight {\n\t\t\t\tcolor: " + listHighlightForegroundColor + ";\n\t\t\t}\n\t\t");
        }
        // We need to set the workbench background color so that on Windows we get subpixel-antialiasing.
        var workbenchBackground;
        switch (theme.type) {
            case 'dark':
                workbenchBackground = '#252526';
                break;
            case 'light':
                workbenchBackground = '#F3F3F3';
                break;
            default:
                workbenchBackground = '#000000';
        }
        collector.addRule(".monaco-workbench { background-color: " + workbenchBackground + "; }");
        // Scrollbars
        var scrollbarShadowColor = theme.getColor(colorRegistry_1.scrollbarShadow);
        if (scrollbarShadowColor) {
            collector.addRule("\n\t\t\t.monaco-shell .monaco-scrollable-element > .shadow.top {\n\t\t\t\tbox-shadow: " + scrollbarShadowColor + " 0 6px 6px -6px inset;\n\t\t\t}\n\n\t\t\t.monaco-shell .monaco-scrollable-element > .shadow.left {\n\t\t\t\tbox-shadow: " + scrollbarShadowColor + " 6px 0 6px -6px inset;\n\t\t\t}\n\n\t\t\t.monaco-shell .monaco-scrollable-element > .shadow.top.left {\n\t\t\t\tbox-shadow: " + scrollbarShadowColor + " 6px 6px 6px -6px inset;\n\t\t\t}\n\t\t");
        }
        var scrollbarSliderBackgroundColor = theme.getColor(colorRegistry_1.scrollbarSliderBackground);
        if (scrollbarSliderBackgroundColor) {
            collector.addRule("\n\t\t\t.monaco-shell .monaco-scrollable-element > .scrollbar > .slider {\n\t\t\t\tbackground: " + scrollbarSliderBackgroundColor + ";\n\t\t\t}\n\t\t");
        }
        var scrollbarSliderHoverBackgroundColor = theme.getColor(colorRegistry_1.scrollbarSliderHoverBackground);
        if (scrollbarSliderHoverBackgroundColor) {
            collector.addRule("\n\t\t\t.monaco-shell .monaco-scrollable-element > .scrollbar > .slider:hover {\n\t\t\t\tbackground: " + scrollbarSliderHoverBackgroundColor + ";\n\t\t\t}\n\t\t");
        }
        var scrollbarSliderActiveBackgroundColor = theme.getColor(colorRegistry_1.scrollbarSliderActiveBackground);
        if (scrollbarSliderActiveBackgroundColor) {
            collector.addRule("\n\t\t\t.monaco-shell .monaco-scrollable-element > .scrollbar > .slider.active {\n\t\t\t\tbackground: " + scrollbarSliderActiveBackgroundColor + ";\n\t\t\t}\n\t\t");
        }
        // Focus outline
        var focusOutline = theme.getColor(colorRegistry_1.focusBorder);
        if (focusOutline) {
            collector.addRule("\n\t\t\t.monaco-shell [tabindex=\"0\"]:focus,\n\t\t\t.monaco-shell .synthetic-focus,\n\t\t\t.monaco-shell select:focus,\n\t\t\t.monaco-shell .monaco-tree.focused.no-focused-item:focus:before,\n\t\t\t.monaco-shell input[type=\"button\"]:focus,\n\t\t\t.monaco-shell input[type=\"text\"]:focus,\n\t\t\t.monaco-shell button:focus,\n\t\t\t.monaco-shell textarea:focus,\n\t\t\t.monaco-shell input[type=\"search\"]:focus,\n\t\t\t.monaco-shell input[type=\"checkbox\"]:focus {\n\t\t\t\toutline-color: " + focusOutline + ";\n\t\t\t}\n\t\t");
        }
    });
});
//# sourceMappingURL=shell.js.map