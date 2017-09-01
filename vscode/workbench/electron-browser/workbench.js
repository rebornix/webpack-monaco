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
define(["require", "exports", "vs/nls", "vs/base/common/winjs.base", "vs/base/common/lifecycle", "vs/base/common/event", "vs/base/browser/dom", "vs/base/browser/builder", "vs/base/common/async", "vs/base/browser/browser", "vs/base/common/assert", "vs/base/common/stopwatch", "vs/base/node/startupTimers", "vs/base/common/errors", "vs/workbench/services/backup/node/backupFileService", "vs/workbench/services/backup/common/backup", "vs/base/common/errorMessage", "vs/platform/registry/common/platform", "vs/base/common/platform", "vs/platform/editor/common/editor", "vs/workbench/common/contributions", "vs/workbench/common/editor", "vs/workbench/services/history/browser/history", "vs/workbench/browser/parts/activitybar/activitybarPart", "vs/workbench/browser/parts/editor/editorPart", "vs/workbench/browser/parts/sidebar/sidebarPart", "vs/workbench/browser/parts/panel/panelPart", "vs/workbench/browser/parts/statusbar/statusbarPart", "vs/workbench/browser/parts/titlebar/titlebarPart", "vs/workbench/browser/layout", "vs/workbench/browser/actions", "vs/workbench/browser/panel", "vs/workbench/browser/parts/quickopen/quickOpenController", "vs/platform/instantiation/common/extensions", "vs/workbench/services/editor/browser/editorService", "vs/workbench/services/part/common/partService", "vs/platform/workspace/common/workspace", "vs/platform/storage/common/storage", "vs/workbench/services/contextview/electron-browser/contextmenuService", "vs/workbench/services/keybinding/electron-browser/keybindingService", "vs/platform/configuration/common/configuration", "vs/workbench/services/configuration/common/configurationEditing", "vs/workbench/services/configuration/node/configurationEditingService", "vs/workbench/services/configuration/common/jsonEditing", "vs/workbench/services/configuration/node/jsonEditingService", "vs/platform/contextkey/browser/contextKeyService", "vs/platform/keybinding/common/keybinding", "vs/workbench/services/keybinding/common/keybindingEditing", "vs/platform/contextkey/common/contextkey", "vs/workbench/services/activity/common/activityBarService", "vs/workbench/services/viewlet/browser/viewlet", "vs/workbench/services/viewlet/browser/viewletService", "vs/workbench/services/files/electron-browser/remoteFileService", "vs/platform/files/common/files", "vs/platform/list/browser/listService", "vs/workbench/services/configurationResolver/common/configurationResolver", "vs/workbench/services/configurationResolver/node/configurationResolverService", "vs/workbench/services/panel/common/panelService", "vs/workbench/services/title/common/titleService", "vs/workbench/services/editor/common/editorService", "vs/platform/quickOpen/common/quickOpen", "vs/platform/clipboard/common/clipboardService", "vs/platform/clipboard/electron-browser/clipboardService", "vs/workbench/services/group/common/groupService", "vs/workbench/services/history/common/history", "vs/platform/instantiation/common/instantiation", "vs/platform/instantiation/common/descriptors", "vs/workbench/services/textfile/electron-browser/textFileService", "vs/workbench/services/textfile/common/textfiles", "vs/workbench/services/scm/common/scm", "vs/workbench/services/scm/common/scmService", "vs/platform/progress/common/progress", "vs/workbench/services/progress/browser/progressService2", "vs/workbench/services/textmodelResolver/common/textModelResolverService", "vs/editor/common/services/resolverService", "vs/platform/lifecycle/common/lifecycle", "vs/platform/windows/common/windows", "vs/platform/message/common/message", "vs/platform/statusbar/common/statusbar", "vs/platform/actions/common/actions", "vs/platform/actions/common/menuService", "vs/platform/contextview/browser/contextView", "vs/platform/environment/common/environment", "vs/platform/telemetry/common/telemetry", "vs/workbench/common/actionRegistry", "vs/workbench/electron-browser/actions", "vs/platform/keybinding/common/keybindingsRegistry", "vs/workbench/browser/parts/quickopen/quickopen", "vs/workbench/services/workspace/common/workspaceEditing", "vs/workbench/services/workspace/node/workspaceEditingService", "vs/base/common/uri", "vs/platform/workspaces/common/workspaces", "vs/workbench/services/workspace/node/workspaceMigrationService", "vs/css!./media/workbench"], function (require, exports, nls_1, winjs_base_1, lifecycle_1, event_1, DOM, builder_1, async_1, browser, assert, stopwatch_1, startupTimers_1, errors, backupFileService_1, backup_1, errorMessage_1, platform_1, platform_2, editor_1, contributions_1, editor_2, history_1, activitybarPart_1, editorPart_1, sidebarPart_1, panelPart_1, statusbarPart_1, titlebarPart_1, layout_1, actions_1, panel_1, quickOpenController_1, extensions_1, editorService_1, partService_1, workspace_1, storage_1, contextmenuService_1, keybindingService_1, configuration_1, configurationEditing_1, configurationEditingService_1, jsonEditing_1, jsonEditingService_1, contextKeyService_1, keybinding_1, keybindingEditing_1, contextkey_1, activityBarService_1, viewlet_1, viewletService_1, remoteFileService_1, files_1, listService_1, configurationResolver_1, configurationResolverService_1, panelService_1, titleService_1, editorService_2, quickOpen_1, clipboardService_1, clipboardService_2, groupService_1, history_2, instantiation_1, descriptors_1, textFileService_1, textfiles_1, scm_1, scmService_1, progress_1, progressService2_1, textModelResolverService_1, resolverService_1, lifecycle_2, windows_1, message_1, statusbar_1, actions_2, menuService_1, contextView_1, environment_1, telemetry_1, actionRegistry_1, actions_3, keybindingsRegistry_1, quickopen_1, workspaceEditing_1, workspaceEditingService_1, uri_1, workspaces_1, workspaceMigrationService_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MessagesVisibleContext = new contextkey_1.RawContextKey('globalMessageVisible', false);
    exports.EditorsVisibleContext = new contextkey_1.RawContextKey('editorIsOpen', false);
    exports.InZenModeContext = new contextkey_1.RawContextKey('inZenMode', false);
    exports.NoEditorsVisibleContext = exports.EditorsVisibleContext.toNegated();
    var Identifiers = {
        WORKBENCH_CONTAINER: 'workbench.main.container',
        TITLEBAR_PART: 'workbench.parts.titlebar',
        ACTIVITYBAR_PART: 'workbench.parts.activitybar',
        SIDEBAR_PART: 'workbench.parts.sidebar',
        PANEL_PART: 'workbench.parts.panel',
        EDITOR_PART: 'workbench.parts.editor',
        STATUSBAR_PART: 'workbench.parts.statusbar'
    };
    /**
     * The workbench creates and lays out all parts that make up the workbench.
     */
    var Workbench = (function () {
        function Workbench(parent, container, configuration, serviceCollection, instantiationService, contextService, storageService, lifecycleService, messageService, configurationService, telemetryService, environmentService, windowService) {
            var _this = this;
            this.instantiationService = instantiationService;
            this.contextService = contextService;
            this.storageService = storageService;
            this.lifecycleService = lifecycleService;
            this.messageService = messageService;
            this.configurationService = configurationService;
            this.telemetryService = telemetryService;
            this.environmentService = environmentService;
            this.windowService = windowService;
            this.parent = parent;
            this.container = container;
            this.workbenchParams = {
                configuration: configuration,
                serviceCollection: serviceCollection
            };
            this.hasFilesToCreateOpenOrDiff =
                (configuration.filesToCreate && configuration.filesToCreate.length > 0) ||
                    (configuration.filesToOpen && configuration.filesToOpen.length > 0) ||
                    (configuration.filesToDiff && configuration.filesToDiff.length > 0);
            this.toDispose = [];
            this.toShutdown = [];
            this.editorBackgroundDelayer = new async_1.Delayer(50);
            this.closeEmptyWindowScheduler = new async_1.RunOnceScheduler(function () { return _this.onAllEditorsClosed(); }, 50);
            this._onTitleBarVisibilityChange = new event_1.Emitter();
            this.creationPromise = new winjs_base_1.TPromise(function (c) {
                _this.creationPromiseComplete = c;
            });
        }
        Object.defineProperty(Workbench.prototype, "onTitleBarVisibilityChange", {
            get: function () {
                return this._onTitleBarVisibilityChange.event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Workbench.prototype, "onEditorLayout", {
            get: function () {
                return event_1.chain(this.editorPart.onLayout)
                    .map(function () { return void 0; })
                    .event;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Starts the workbench and creates the HTML elements on the container. A workbench can only be started
         * once. Use the shutdown function to free up resources created by the workbench on startup.
         */
        Workbench.prototype.startup = function (callbacks) {
            var _this = this;
            assert.ok(!this.workbenchStarted, 'Can not start a workbench that was already started');
            assert.ok(!this.workbenchShutdown, 'Can not start a workbench that was shutdown');
            try {
                this.workbenchStarted = true;
                this.callbacks = callbacks;
                // Create Workbench
                this.createWorkbench();
                // Install some global actions
                this.createGlobalActions();
                // Services
                this.initServices();
                if (this.callbacks && this.callbacks.onServicesCreated) {
                    this.callbacks.onServicesCreated();
                }
                // Contexts
                this.messagesVisibleContext = exports.MessagesVisibleContext.bindTo(this.contextKeyService);
                this.editorsVisibleContext = exports.EditorsVisibleContext.bindTo(this.contextKeyService);
                this.inZenMode = exports.InZenModeContext.bindTo(this.contextKeyService);
                // Register Listeners
                this.registerListeners();
                // Settings
                this.initSettings();
                // Create Workbench and Parts
                this.renderWorkbench();
                // Workbench Layout
                this.createWorkbenchLayout();
                // Load composites and editors in parallel
                var compositeAndEditorPromises = [];
                // Restore last opened viewlet
                var viewletRestoreStopWatch_1;
                var viewletIdToRestore_1;
                if (!this.sideBarHidden) {
                    if (this.shouldRestoreLastOpenedViewlet()) {
                        viewletIdToRestore_1 = this.storageService.get(sidebarPart_1.SidebarPart.activeViewletSettingsKey, storage_1.StorageScope.WORKSPACE);
                    }
                    if (!viewletIdToRestore_1) {
                        viewletIdToRestore_1 = this.viewletService.getDefaultViewletId();
                    }
                    viewletRestoreStopWatch_1 = stopwatch_1.StopWatch.create();
                    var viewletTimer = startupTimers_1.startTimer('restore:viewlet');
                    compositeAndEditorPromises.push(viewletTimer.while(this.viewletService.openViewlet(viewletIdToRestore_1)).then(function () {
                        viewletRestoreStopWatch_1.stop();
                    }));
                }
                // Load Panel
                var panelRegistry = platform_1.Registry.as(panel_1.Extensions.Panels);
                var panelId = this.storageService.get(panelPart_1.PanelPart.activePanelSettingsKey, storage_1.StorageScope.WORKSPACE, panelRegistry.getDefaultPanelId());
                if (!this.panelHidden && !!panelId) {
                    compositeAndEditorPromises.push(this.panelPart.openPanel(panelId, false));
                }
                // Load Editors
                var editorRestoreStopWatch_1 = stopwatch_1.StopWatch.create();
                var restoredEditors_1 = [];
                var editorsTimer = startupTimers_1.startTimer('restore:editors');
                compositeAndEditorPromises.push(editorsTimer.while(this.resolveEditorsToOpen().then(function (inputs) {
                    var editorOpenPromise;
                    if (inputs.length) {
                        editorOpenPromise = _this.editorService.openEditors(inputs.map(function (input) { return { input: input, position: editor_1.Position.ONE }; }));
                    }
                    else {
                        editorOpenPromise = _this.editorPart.restoreEditors();
                    }
                    return editorOpenPromise.then(function (editors) {
                        _this.handleEditorBackground(); // make sure we show the proper background in the editor area
                        editorRestoreStopWatch_1.stop();
                        for (var _i = 0, editors_1 = editors; _i < editors_1.length; _i++) {
                            var editor = editors_1[_i];
                            if (editor) {
                                if (editor.input) {
                                    restoredEditors_1.push(editor.input.getName());
                                }
                                else {
                                    restoredEditors_1.push("other:" + editor.getId());
                                }
                            }
                        }
                    });
                })));
                if (this.storageService.getBoolean(Workbench.zenModeActiveSettingKey, storage_1.StorageScope.WORKSPACE, false)) {
                    this.toggleZenMode(true);
                }
                // Flag workbench as created once done
                var workbenchDone_1 = function (error) {
                    _this.workbenchCreated = true;
                    _this.creationPromiseComplete(true);
                    if (_this.callbacks && _this.callbacks.onWorkbenchStarted) {
                        _this.callbacks.onWorkbenchStarted({
                            customKeybindingsCount: _this.keybindingService.customKeybindingsCount(),
                            restoreViewletDuration: viewletRestoreStopWatch_1 ? Math.round(viewletRestoreStopWatch_1.elapsed()) : 0,
                            restoreEditorsDuration: Math.round(editorRestoreStopWatch_1.elapsed()),
                            pinnedViewlets: _this.activitybarPart.getPinned(),
                            restoredViewlet: viewletIdToRestore_1,
                            restoredEditors: restoredEditors_1
                        });
                    }
                    if (error) {
                        errors.onUnexpectedError(error);
                    }
                };
                // Join viewlet, panel and editor promises
                winjs_base_1.TPromise.join(compositeAndEditorPromises).then(function () { return workbenchDone_1(); }, function (error) { return workbenchDone_1(error); });
            }
            catch (error) {
                // Print out error
                console.error(errorMessage_1.toErrorMessage(error, true));
                // Rethrow
                throw error;
            }
        };
        Workbench.prototype.createGlobalActions = function () {
            var isDeveloping = !this.environmentService.isBuilt || this.environmentService.isExtensionDevelopment;
            // Actions registered here to adjust for developing vs built workbench
            var workbenchActionsRegistry = platform_1.Registry.as(actionRegistry_1.Extensions.WorkbenchActions);
            workbenchActionsRegistry.registerWorkbenchAction(new actions_2.SyncActionDescriptor(actions_3.ReloadWindowAction, actions_3.ReloadWindowAction.ID, actions_3.ReloadWindowAction.LABEL, isDeveloping ? { primary: 2048 /* CtrlCmd */ | 48 /* KEY_R */ } : void 0), 'Reload Window');
            workbenchActionsRegistry.registerWorkbenchAction(new actions_2.SyncActionDescriptor(actions_3.ToggleDevToolsAction, actions_3.ToggleDevToolsAction.ID, actions_3.ToggleDevToolsAction.LABEL, isDeveloping ? { primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 39 /* KEY_I */, mac: { primary: 2048 /* CtrlCmd */ | 512 /* Alt */ | 39 /* KEY_I */ } } : void 0), 'Developer: Toggle Developer Tools', nls_1.localize('developer', "Developer"));
            workbenchActionsRegistry.registerWorkbenchAction(new actions_2.SyncActionDescriptor(actions_3.OpenRecentAction, actions_3.OpenRecentAction.ID, actions_3.OpenRecentAction.LABEL, { primary: isDeveloping ? null : 2048 /* CtrlCmd */ | 48 /* KEY_R */, mac: { primary: 256 /* WinCtrl */ | 48 /* KEY_R */ } }), 'File: Open Recent...', nls_1.localize('file', "File"));
            var recentFilesPickerContext = contextkey_1.ContextKeyExpr.and(quickopen_1.inQuickOpenContext, contextkey_1.ContextKeyExpr.has(actions_3.inRecentFilesPickerContextKey));
            var quickOpenNavigateNextInRecentFilesPickerId = 'workbench.action.quickOpenNavigateNextInRecentFilesPicker';
            keybindingsRegistry_1.KeybindingsRegistry.registerCommandAndKeybindingRule({
                id: quickOpenNavigateNextInRecentFilesPickerId,
                weight: keybindingsRegistry_1.KeybindingsRegistry.WEIGHT.workbenchContrib(50),
                handler: quickopen_1.getQuickNavigateHandler(quickOpenNavigateNextInRecentFilesPickerId, true),
                when: recentFilesPickerContext,
                primary: 2048 /* CtrlCmd */ | 48 /* KEY_R */,
                mac: { primary: 256 /* WinCtrl */ | 48 /* KEY_R */ }
            });
            var quickOpenNavigatePreviousInRecentFilesPicker = 'workbench.action.quickOpenNavigatePreviousInRecentFilesPicker';
            keybindingsRegistry_1.KeybindingsRegistry.registerCommandAndKeybindingRule({
                id: quickOpenNavigatePreviousInRecentFilesPicker,
                weight: keybindingsRegistry_1.KeybindingsRegistry.WEIGHT.workbenchContrib(50),
                handler: quickopen_1.getQuickNavigateHandler(quickOpenNavigatePreviousInRecentFilesPicker, false),
                when: recentFilesPickerContext,
                primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 48 /* KEY_R */,
                mac: { primary: 256 /* WinCtrl */ | 1024 /* Shift */ | 48 /* KEY_R */ }
            });
        };
        Workbench.prototype.resolveEditorsToOpen = function () {
            // Files to open, diff or create
            if (this.hasFilesToCreateOpenOrDiff) {
                var filesToCreate = this.toInputs(this.workbenchParams.configuration.filesToCreate);
                var filesToOpen = this.toInputs(this.workbenchParams.configuration.filesToOpen);
                var filesToDiff = this.toInputs(this.workbenchParams.configuration.filesToDiff);
                // Files to diff is exclusive
                if (filesToDiff && filesToDiff.length === 2) {
                    return winjs_base_1.TPromise.as([{
                            leftResource: filesToDiff[0].resource,
                            rightResource: filesToDiff[1].resource,
                            options: { pinned: true }
                        }]);
                }
                else {
                    var filesToCreateInputs = filesToCreate.map(function (resourceInput) {
                        return {
                            filePath: resourceInput.resource.fsPath,
                            options: { pinned: true }
                        };
                    });
                    return winjs_base_1.TPromise.as([].concat(filesToOpen).concat(filesToCreateInputs));
                }
            }
            else if (!this.contextService.hasWorkspace() && this.openUntitledFile()) {
                if (this.editorPart.hasEditorsToRestore()) {
                    return winjs_base_1.TPromise.as([]); // do not open any empty untitled file if we have editors to restore
                }
                return this.backupFileService.hasBackups().then(function (hasBackups) {
                    if (hasBackups) {
                        return winjs_base_1.TPromise.as([]); // do not open any empty untitled file if we have backups to restore
                    }
                    return winjs_base_1.TPromise.as([{}]);
                });
            }
            return winjs_base_1.TPromise.as([]);
        };
        Workbench.prototype.toInputs = function (paths) {
            if (!paths || !paths.length) {
                return [];
            }
            return paths.map(function (p) {
                var input = {};
                input.resource = uri_1.default.file(p.filePath);
                input.options = {
                    pinned: true // opening on startup is always pinned and not preview
                };
                if (p.lineNumber) {
                    input.options.selection = {
                        startLineNumber: p.lineNumber,
                        startColumn: p.columnNumber
                    };
                }
                return input;
            });
        };
        Workbench.prototype.openUntitledFile = function () {
            var startupEditor = this.configurationService.lookup('workbench.startupEditor');
            // Fallback to previous workbench.welcome.enabled setting in case startupEditor is not defined
            if (!startupEditor.user && !startupEditor.workspace) {
                var welcomeEnabled = this.configurationService.lookup('workbench.welcome.enabled');
                if (typeof welcomeEnabled.value === 'boolean') {
                    return !welcomeEnabled.value;
                }
            }
            return startupEditor.value === 'newUntitledFile';
        };
        Workbench.prototype.initServices = function () {
            var _this = this;
            var serviceCollection = this.workbenchParams.serviceCollection;
            this.toDispose.push(this.lifecycleService.onWillShutdown(function (event) { return _this.onWillShutdown(event); }));
            this.toDispose.push(this.lifecycleService.onShutdown(this.shutdownComponents, this));
            // Services we contribute
            serviceCollection.set(partService_1.IPartService, this);
            // Clipboard
            serviceCollection.set(clipboardService_1.IClipboardService, new clipboardService_2.ClipboardService());
            // Status bar
            this.statusbarPart = this.instantiationService.createInstance(statusbarPart_1.StatusbarPart, Identifiers.STATUSBAR_PART);
            this.toDispose.push(this.statusbarPart);
            this.toShutdown.push(this.statusbarPart);
            serviceCollection.set(statusbar_1.IStatusbarService, this.statusbarPart);
            // Progress 2
            serviceCollection.set(progress_1.IProgressService2, new descriptors_1.SyncDescriptor(progressService2_1.ProgressService2));
            // Keybindings
            this.contextKeyService = this.instantiationService.createInstance(contextKeyService_1.ContextKeyService);
            serviceCollection.set(contextkey_1.IContextKeyService, this.contextKeyService);
            this.keybindingService = this.instantiationService.createInstance(keybindingService_1.WorkbenchKeybindingService, window);
            serviceCollection.set(keybinding_1.IKeybindingService, this.keybindingService);
            // List
            serviceCollection.set(listService_1.IListService, this.instantiationService.createInstance(listService_1.ListService));
            // Context Menu
            serviceCollection.set(contextView_1.IContextMenuService, new descriptors_1.SyncDescriptor(contextmenuService_1.ContextMenuService));
            // Menus/Actions
            serviceCollection.set(actions_2.IMenuService, new descriptors_1.SyncDescriptor(menuService_1.MenuService));
            // Sidebar part
            this.sidebarPart = this.instantiationService.createInstance(sidebarPart_1.SidebarPart, Identifiers.SIDEBAR_PART);
            this.toDispose.push(this.sidebarPart);
            this.toShutdown.push(this.sidebarPart);
            // Viewlet service
            this.viewletService = this.instantiationService.createInstance(viewletService_1.ViewletService, this.sidebarPart);
            serviceCollection.set(viewlet_1.IViewletService, this.viewletService);
            // Panel service (panel part)
            this.panelPart = this.instantiationService.createInstance(panelPart_1.PanelPart, Identifiers.PANEL_PART);
            this.toDispose.push(this.panelPart);
            this.toShutdown.push(this.panelPart);
            serviceCollection.set(panelService_1.IPanelService, this.panelPart);
            // Activity service (activitybar part)
            this.activitybarPart = this.instantiationService.createInstance(activitybarPart_1.ActivitybarPart, Identifiers.ACTIVITYBAR_PART);
            this.toDispose.push(this.activitybarPart);
            this.toShutdown.push(this.activitybarPart);
            serviceCollection.set(activityBarService_1.IActivityBarService, this.activitybarPart);
            // Editor service (editor part)
            this.editorPart = this.instantiationService.createInstance(editorPart_1.EditorPart, Identifiers.EDITOR_PART, !this.hasFilesToCreateOpenOrDiff);
            this.toDispose.push(this.editorPart);
            this.toShutdown.push(this.editorPart);
            this.editorService = this.instantiationService.createInstance(editorService_1.WorkbenchEditorService, this.editorPart);
            serviceCollection.set(editorService_2.IWorkbenchEditorService, this.editorService);
            serviceCollection.set(groupService_1.IEditorGroupService, this.editorPart);
            // Title bar
            this.titlebarPart = this.instantiationService.createInstance(titlebarPart_1.TitlebarPart, Identifiers.TITLEBAR_PART);
            this.toDispose.push(this.titlebarPart);
            this.toShutdown.push(this.titlebarPart);
            serviceCollection.set(titleService_1.ITitleService, this.titlebarPart);
            // File Service
            var fileService = this.instantiationService.createInstance(remoteFileService_1.RemoteFileService);
            serviceCollection.set(files_1.IFileService, fileService);
            this.toDispose.push(fileService.onFileChanges(function (e) { return _this.configurationService.handleWorkspaceFileEvents(e); }));
            // History
            serviceCollection.set(history_2.IHistoryService, new descriptors_1.SyncDescriptor(history_1.HistoryService));
            // Backup File Service
            this.backupFileService = this.instantiationService.createInstance(backupFileService_1.BackupFileService, this.workbenchParams.configuration.backupPath);
            serviceCollection.set(backup_1.IBackupFileService, this.backupFileService);
            // Text File Service
            serviceCollection.set(textfiles_1.ITextFileService, new descriptors_1.SyncDescriptor(textFileService_1.TextFileService));
            // SCM Service
            serviceCollection.set(scm_1.ISCMService, new descriptors_1.SyncDescriptor(scmService_1.SCMService));
            // Text Model Resolver Service
            serviceCollection.set(resolverService_1.ITextModelService, new descriptors_1.SyncDescriptor(textModelResolverService_1.TextModelResolverService));
            // JSON Editing
            var jsonEditingService = this.instantiationService.createInstance(jsonEditingService_1.JSONEditingService);
            serviceCollection.set(jsonEditing_1.IJSONEditingService, jsonEditingService);
            // Configuration Editing
            this.configurationEditingService = this.instantiationService.createInstance(configurationEditingService_1.ConfigurationEditingService);
            serviceCollection.set(configurationEditing_1.IConfigurationEditingService, this.configurationEditingService);
            // Workspace Editing
            serviceCollection.set(workspaceEditing_1.IWorkspaceEditingService, new descriptors_1.SyncDescriptor(workspaceEditingService_1.WorkspaceEditingService));
            // Keybinding Editing
            serviceCollection.set(keybindingEditing_1.IKeybindingEditingService, this.instantiationService.createInstance(keybindingEditing_1.KeybindingsEditingService));
            // Configuration Resolver
            serviceCollection.set(configurationResolver_1.IConfigurationResolverService, new descriptors_1.SyncDescriptor(configurationResolverService_1.ConfigurationResolverService, process.env));
            // Workspace Migrating
            this.workspaceMigrationService = this.instantiationService.createInstance(workspaceMigrationService_1.WorkspaceMigrationService);
            serviceCollection.set(workspaceEditing_1.IWorkspaceMigrationService, this.workspaceMigrationService);
            // Quick open service (quick open controller)
            this.quickOpen = this.instantiationService.createInstance(quickOpenController_1.QuickOpenController);
            this.toDispose.push(this.quickOpen);
            this.toShutdown.push(this.quickOpen);
            serviceCollection.set(quickOpen_1.IQuickOpenService, this.quickOpen);
            // Contributed services
            var contributedServices = extensions_1.getServices();
            for (var _i = 0, contributedServices_1 = contributedServices; _i < contributedServices_1.length; _i++) {
                var contributedService = contributedServices_1[_i];
                serviceCollection.set(contributedService.id, contributedService.descriptor);
            }
            // Set the some services to registries that have been created eagerly
            platform_1.Registry.as(actions_1.Extensions.Actionbar).setInstantiationService(this.instantiationService);
            platform_1.Registry.as(contributions_1.Extensions.Workbench).setInstantiationService(this.instantiationService);
            platform_1.Registry.as(editor_2.Extensions.Editors).setInstantiationService(this.instantiationService);
        };
        Workbench.prototype.initSettings = function () {
            // Sidebar visibility
            this.sideBarHidden = this.storageService.getBoolean(Workbench.sidebarHiddenSettingKey, storage_1.StorageScope.WORKSPACE, !this.contextService.hasWorkspace());
            // Panel part visibility
            var panelRegistry = platform_1.Registry.as(panel_1.Extensions.Panels);
            this.panelHidden = this.storageService.getBoolean(Workbench.panelHiddenSettingKey, storage_1.StorageScope.WORKSPACE, true);
            if (!panelRegistry.getDefaultPanelId()) {
                this.panelHidden = true; // we hide panel part if there is no default panel
            }
            // Sidebar position
            var sideBarPosition = this.configurationService.lookup(Workbench.sidebarPositionConfigurationKey).value;
            this.sideBarPosition = (sideBarPosition === 'right') ? partService_1.Position.RIGHT : partService_1.Position.LEFT;
            // Statusbar visibility
            var statusBarVisible = this.configurationService.lookup(Workbench.statusbarVisibleConfigurationKey).value;
            this.statusBarHidden = !statusBarVisible;
            // Activity bar visibility
            var activityBarVisible = this.configurationService.lookup(Workbench.activityBarVisibleConfigurationKey).value;
            this.activityBarHidden = !activityBarVisible;
            // Font aliasing
            this.fontAliasing = this.configurationService.lookup(Workbench.fontAliasingConfigurationKey).value;
            // Zen mode
            this.zenMode = {
                active: false,
                transitionedToFullScreen: false,
                wasSideBarVisible: false,
                wasPanelVisible: false
            };
        };
        /**
         * Returns whether the workbench has been started.
         */
        Workbench.prototype.isStarted = function () {
            return this.workbenchStarted && !this.workbenchShutdown;
        };
        /**
         * Returns whether the workbench has been fully created.
         */
        Workbench.prototype.isCreated = function () {
            return this.workbenchCreated && this.workbenchStarted;
        };
        Workbench.prototype.joinCreation = function () {
            return this.creationPromise;
        };
        Workbench.prototype.hasFocus = function (part) {
            var activeElement = document.activeElement;
            if (!activeElement) {
                return false;
            }
            var container = this.getContainer(part);
            return DOM.isAncestor(activeElement, container);
        };
        Workbench.prototype.getContainer = function (part) {
            var container = null;
            switch (part) {
                case partService_1.Parts.TITLEBAR_PART:
                    container = this.titlebarPart.getContainer();
                    break;
                case partService_1.Parts.ACTIVITYBAR_PART:
                    container = this.activitybarPart.getContainer();
                    break;
                case partService_1.Parts.SIDEBAR_PART:
                    container = this.sidebarPart.getContainer();
                    break;
                case partService_1.Parts.PANEL_PART:
                    container = this.panelPart.getContainer();
                    break;
                case partService_1.Parts.EDITOR_PART:
                    container = this.editorPart.getContainer();
                    break;
                case partService_1.Parts.STATUSBAR_PART:
                    container = this.statusbarPart.getContainer();
                    break;
            }
            return container && container.getHTMLElement();
        };
        Workbench.prototype.isVisible = function (part) {
            switch (part) {
                case partService_1.Parts.TITLEBAR_PART:
                    return this.getCustomTitleBarStyle() && !browser.isFullscreen();
                case partService_1.Parts.SIDEBAR_PART:
                    return !this.sideBarHidden;
                case partService_1.Parts.PANEL_PART:
                    return !this.panelHidden;
                case partService_1.Parts.STATUSBAR_PART:
                    return !this.statusBarHidden;
                case partService_1.Parts.ACTIVITYBAR_PART:
                    return !this.activityBarHidden;
            }
            return true; // any other part cannot be hidden
        };
        Workbench.prototype.getTitleBarOffset = function () {
            var offset = 0;
            if (this.isVisible(partService_1.Parts.TITLEBAR_PART)) {
                offset = 22 / browser.getZoomFactor(); // adjust the position based on title bar size and zoom factor
            }
            return offset;
        };
        Workbench.prototype.getCustomTitleBarStyle = function () {
            if (!platform_2.isMacintosh) {
                return null; // custom title bar is only supported on Mac currently
            }
            var isDev = !this.environmentService.isBuilt || this.environmentService.isExtensionDevelopment;
            if (isDev) {
                return null; // not enabled when developing due to https://github.com/electron/electron/issues/3647
            }
            var windowConfig = this.configurationService.getConfiguration();
            if (windowConfig && windowConfig.window) {
                var useNativeTabs = windowConfig.window.nativeTabs;
                if (useNativeTabs) {
                    return null; // native tabs on sierra do not work with custom title style
                }
                var style = windowConfig.window.titleBarStyle;
                if (style === 'custom') {
                    return style;
                }
            }
            return null;
        };
        Workbench.prototype.setStatusBarHidden = function (hidden, skipLayout) {
            this.statusBarHidden = hidden;
            // Layout
            if (!skipLayout) {
                this.workbenchLayout.layout();
            }
        };
        Workbench.prototype.setActivityBarHidden = function (hidden, skipLayout) {
            this.activityBarHidden = hidden;
            // Layout
            if (!skipLayout) {
                this.workbenchLayout.layout();
            }
        };
        Workbench.prototype.setSideBarHidden = function (hidden, skipLayout) {
            var _this = this;
            this.sideBarHidden = hidden;
            // Adjust CSS
            if (hidden) {
                this.workbench.addClass('nosidebar');
            }
            else {
                this.workbench.removeClass('nosidebar');
            }
            // If sidebar becomes hidden, also hide the current active Viewlet if any
            var promise = winjs_base_1.TPromise.as(null);
            if (hidden && this.sidebarPart.getActiveViewlet()) {
                promise = this.sidebarPart.hideActiveViewlet().then(function () {
                    var activeEditor = _this.editorPart.getActiveEditor();
                    var activePanel = _this.panelPart.getActivePanel();
                    // Pass Focus to Editor or Panel if Sidebar is now hidden
                    if (_this.hasFocus(partService_1.Parts.PANEL_PART) && activePanel) {
                        activePanel.focus();
                    }
                    else if (activeEditor) {
                        activeEditor.focus();
                    }
                });
            }
            else if (!hidden && !this.sidebarPart.getActiveViewlet()) {
                var viewletToOpen = this.sidebarPart.getLastActiveViewletId();
                if (viewletToOpen) {
                    promise = this.sidebarPart.openViewlet(viewletToOpen, true);
                }
            }
            return promise.then(function () {
                // Remember in settings
                var defaultHidden = !_this.contextService.hasWorkspace();
                if (hidden !== defaultHidden) {
                    _this.storageService.store(Workbench.sidebarHiddenSettingKey, hidden ? 'true' : 'false', storage_1.StorageScope.WORKSPACE);
                }
                else {
                    _this.storageService.remove(Workbench.sidebarHiddenSettingKey, storage_1.StorageScope.WORKSPACE);
                }
                // Layout
                if (!skipLayout) {
                    _this.workbenchLayout.layout();
                }
            });
        };
        Workbench.prototype.setPanelHidden = function (hidden, skipLayout) {
            var _this = this;
            this.panelHidden = hidden;
            // Adjust CSS
            if (hidden) {
                this.workbench.addClass('nopanel');
            }
            else {
                this.workbench.removeClass('nopanel');
            }
            // If panel part becomes hidden, also hide the current active panel if any
            var promise = winjs_base_1.TPromise.as(null);
            if (hidden && this.panelPart.getActivePanel()) {
                promise = this.panelPart.hideActivePanel().then(function () {
                    // Pass Focus to Editor if Panel part is now hidden
                    var editor = _this.editorPart.getActiveEditor();
                    if (editor) {
                        editor.focus();
                    }
                });
            }
            else if (!hidden && !this.panelPart.getActivePanel()) {
                var panelToOpen = this.panelPart.getLastActivePanelId();
                if (panelToOpen) {
                    promise = this.panelPart.openPanel(panelToOpen, true);
                }
            }
            return promise.then(function () {
                // Remember in settings
                if (!hidden) {
                    _this.storageService.store(Workbench.panelHiddenSettingKey, 'false', storage_1.StorageScope.WORKSPACE);
                }
                else {
                    _this.storageService.remove(Workbench.panelHiddenSettingKey, storage_1.StorageScope.WORKSPACE);
                }
                // Layout
                if (!skipLayout) {
                    _this.workbenchLayout.layout();
                }
            });
        };
        Workbench.prototype.toggleMaximizedPanel = function () {
            this.workbenchLayout.layout({ toggleMaximizedPanel: true });
        };
        Workbench.prototype.isPanelMaximized = function () {
            return this.workbenchLayout.isPanelMaximized();
        };
        Workbench.prototype.getSideBarPosition = function () {
            return this.sideBarPosition;
        };
        Workbench.prototype.setSideBarPosition = function (position) {
            if (this.sideBarHidden) {
                this.setSideBarHidden(false, true /* Skip Layout */).done(undefined, errors.onUnexpectedError);
            }
            var newPositionValue = (position === partService_1.Position.LEFT) ? 'left' : 'right';
            var oldPositionValue = (this.sideBarPosition === partService_1.Position.LEFT) ? 'left' : 'right';
            this.sideBarPosition = position;
            // Adjust CSS
            this.activitybarPart.getContainer().removeClass(oldPositionValue);
            this.sidebarPart.getContainer().removeClass(oldPositionValue);
            this.activitybarPart.getContainer().addClass(newPositionValue);
            this.sidebarPart.getContainer().addClass(newPositionValue);
            // Update Styles
            this.activitybarPart.updateStyles();
            this.sidebarPart.updateStyles();
            // Layout
            this.workbenchLayout.layout();
        };
        Workbench.prototype.setFontAliasing = function (aliasing) {
            this.fontAliasing = aliasing;
            document.body.style['-webkit-font-smoothing'] = (aliasing === 'default' ? '' : aliasing);
        };
        Workbench.prototype.dispose = function () {
            if (this.isStarted()) {
                this.shutdownComponents();
                this.workbenchShutdown = true;
            }
            this.toDispose = lifecycle_1.dispose(this.toDispose);
        };
        /**
         * Asks the workbench and all its UI components inside to lay out according to
         * the containers dimension the workbench is living in.
         */
        Workbench.prototype.layout = function (options) {
            if (this.isStarted()) {
                this.workbenchLayout.layout(options);
            }
        };
        Workbench.prototype.onWillShutdown = function (event) {
            if (event.reason === lifecycle_2.ShutdownReason.RELOAD) {
                var workspace = event.payload;
                // We are transitioning into a workspace from an empty workspace or workspace, and
                // as such we want to migrate UI state from the current workspace to the new one.
                if (workspaces_1.isWorkspaceIdentifier(workspace)) {
                    event.veto(this.instantiationService.createInstance(workspaceMigrationService_1.WorkspaceMigrationService).migrate(workspace).then(function () { return false; }, function () { return false; }));
                }
            }
        };
        Workbench.prototype.shutdownComponents = function (reason) {
            if (reason === void 0) { reason = lifecycle_2.ShutdownReason.QUIT; }
            // Restore sidebar if we are being shutdown as a matter of a reload
            if (reason === lifecycle_2.ShutdownReason.RELOAD) {
                this.storageService.store(Workbench.sidebarRestoreSettingKey, 'true', storage_1.StorageScope.WORKSPACE);
            }
            // Preserve zen mode only on reload. Real quit gets out of zen mode so novice users do not get stuck in zen mode.
            var zenConfig = this.configurationService.getConfiguration('zenMode');
            var zenModeActive = (zenConfig.restore || reason === lifecycle_2.ShutdownReason.RELOAD) && this.zenMode.active;
            if (zenModeActive) {
                this.storageService.store(Workbench.zenModeActiveSettingKey, true, storage_1.StorageScope.WORKSPACE);
            }
            else {
                this.storageService.remove(Workbench.zenModeActiveSettingKey, storage_1.StorageScope.WORKSPACE);
            }
            // Pass shutdown on to each participant
            this.toShutdown.forEach(function (s) { return s.shutdown(); });
        };
        Workbench.prototype.registerListeners = function () {
            var _this = this;
            // Listen to editor changes
            this.toDispose.push(this.editorPart.onEditorsChanged(function () { return _this.onEditorsChanged(); }));
            // Handle message service and quick open events
            this.toDispose.push(this.messageService.onMessagesShowing(function () { return _this.messagesVisibleContext.set(true); }));
            this.toDispose.push(this.messageService.onMessagesCleared(function () { return _this.messagesVisibleContext.reset(); }));
            this.toDispose.push(this.quickOpen.onShow(function () { return _this.messageService.suspend(); })); // when quick open is open, don't show messages behind
            this.toDispose.push(this.quickOpen.onHide(function () { return _this.messageService.resume(); })); // resume messages once quick open is closed again
            // Configuration changes
            this.toDispose.push(this.configurationService.onDidUpdateConfiguration(function () { return _this.onDidUpdateConfiguration(); }));
            // Fullscreen changes
            this.toDispose.push(browser.onDidChangeFullscreen(function () { return _this.onFullscreenChanged(); }));
        };
        Workbench.prototype.onFullscreenChanged = function () {
            if (!this.isCreated) {
                return; // we need to be ready
            }
            // Apply as CSS class
            var isFullscreen = browser.isFullscreen();
            if (isFullscreen) {
                this.addClass('fullscreen');
            }
            else {
                this.removeClass('fullscreen');
                if (this.zenMode.transitionedToFullScreen && this.zenMode.active) {
                    this.toggleZenMode();
                }
            }
            // Changing fullscreen state of the window has an impact on custom title bar visibility, so we need to update
            var hasCustomTitle = this.getCustomTitleBarStyle() === 'custom';
            if (hasCustomTitle) {
                this._onTitleBarVisibilityChange.fire();
                this.layout(); // handle title bar when fullscreen changes
            }
        };
        Workbench.prototype.onEditorsChanged = function () {
            var visibleEditors = this.editorService.getVisibleEditors().length;
            // Close when empty: check if we should close the window based on the setting
            // Overruled by: window has a workspace opened or this window is for extension development
            // or setting is disabled. Also enabled when running with --wait from the command line.
            if (visibleEditors === 0 && !this.contextService.hasWorkspace() && !this.environmentService.isExtensionDevelopment) {
                var closeWhenEmpty = this.configurationService.lookup(Workbench.closeWhenEmptyConfigurationKey).value;
                if (closeWhenEmpty || this.environmentService.args.wait) {
                    this.closeEmptyWindowScheduler.schedule();
                }
            }
            // We update the editorpart class to indicate if an editor is opened or not
            // through a delay to accomodate for fast editor switching
            this.handleEditorBackground();
        };
        Workbench.prototype.handleEditorBackground = function () {
            var visibleEditors = this.editorService.getVisibleEditors().length;
            var editorContainer = this.editorPart.getContainer();
            if (visibleEditors === 0) {
                this.editorsVisibleContext.reset();
                this.editorBackgroundDelayer.trigger(function () { return editorContainer.addClass('empty'); });
            }
            else {
                this.editorsVisibleContext.set(true);
                this.editorBackgroundDelayer.trigger(function () { return editorContainer.removeClass('empty'); });
            }
        };
        Workbench.prototype.onAllEditorsClosed = function () {
            var visibleEditors = this.editorService.getVisibleEditors().length;
            if (visibleEditors === 0) {
                this.windowService.closeWindow();
            }
        };
        Workbench.prototype.onDidUpdateConfiguration = function (skipLayout) {
            var newSidebarPositionValue = this.configurationService.lookup(Workbench.sidebarPositionConfigurationKey).value;
            var newSidebarPosition = (newSidebarPositionValue === 'right') ? partService_1.Position.RIGHT : partService_1.Position.LEFT;
            if (newSidebarPosition !== this.getSideBarPosition()) {
                this.setSideBarPosition(newSidebarPosition);
            }
            var fontAliasing = this.configurationService.lookup(Workbench.fontAliasingConfigurationKey).value;
            if (fontAliasing !== this.fontAliasing) {
                this.setFontAliasing(fontAliasing);
            }
            if (!this.zenMode.active) {
                var newStatusbarHiddenValue = !this.configurationService.lookup(Workbench.statusbarVisibleConfigurationKey).value;
                if (newStatusbarHiddenValue !== this.statusBarHidden) {
                    this.setStatusBarHidden(newStatusbarHiddenValue, skipLayout);
                }
                var newActivityBarHiddenValue = !this.configurationService.lookup(Workbench.activityBarVisibleConfigurationKey).value;
                if (newActivityBarHiddenValue !== this.activityBarHidden) {
                    this.setActivityBarHidden(newActivityBarHiddenValue, skipLayout);
                }
            }
        };
        Workbench.prototype.createWorkbenchLayout = function () {
            this.workbenchLayout = this.instantiationService.createInstance(layout_1.WorkbenchLayout, builder_1.$(this.container), // Parent
            this.workbench, // Workbench Container
            {
                titlebar: this.titlebarPart,
                activitybar: this.activitybarPart,
                editor: this.editorPart,
                sidebar: this.sidebarPart,
                panel: this.panelPart,
                statusbar: this.statusbarPart,
            }, this.quickOpen // Quickopen
            );
            this.toDispose.push(this.workbenchLayout);
        };
        Workbench.prototype.createWorkbench = function () {
            // Create Workbench DIV Off-DOM
            this.workbenchContainer = builder_1.$('.monaco-workbench-container');
            this.workbench = builder_1.$().div({ 'class': 'monaco-workbench ' + (platform_2.isWindows ? 'windows' : platform_2.isLinux ? 'linux' : 'mac'), id: Identifiers.WORKBENCH_CONTAINER }).appendTo(this.workbenchContainer);
        };
        Workbench.prototype.renderWorkbench = function () {
            // Apply sidebar state as CSS class
            if (this.sideBarHidden) {
                this.workbench.addClass('nosidebar');
            }
            if (this.panelHidden) {
                this.workbench.addClass('nopanel');
            }
            // Apply font aliasing
            this.setFontAliasing(this.fontAliasing);
            // Apply title style if shown
            var titleStyle = this.getCustomTitleBarStyle();
            if (titleStyle) {
                DOM.addClass(this.parent, "titlebar-style-" + titleStyle);
            }
            // Apply fullscreen state
            if (browser.isFullscreen()) {
                this.workbench.addClass('fullscreen');
            }
            // Create Parts
            this.createTitlebarPart();
            this.createActivityBarPart();
            this.createSidebarPart();
            this.createEditorPart();
            this.createPanelPart();
            this.createStatusbarPart();
            // Add Workbench to DOM
            this.workbenchContainer.build(this.container);
        };
        Workbench.prototype.createTitlebarPart = function () {
            var titlebarContainer = builder_1.$(this.workbench).div({
                'class': ['part', 'titlebar'],
                id: Identifiers.TITLEBAR_PART,
                role: 'contentinfo'
            });
            this.titlebarPart.create(titlebarContainer);
        };
        Workbench.prototype.createActivityBarPart = function () {
            var activitybarPartContainer = builder_1.$(this.workbench)
                .div({
                'class': ['part', 'activitybar', this.sideBarPosition === partService_1.Position.LEFT ? 'left' : 'right'],
                id: Identifiers.ACTIVITYBAR_PART,
                role: 'navigation'
            });
            this.activitybarPart.create(activitybarPartContainer);
        };
        Workbench.prototype.createSidebarPart = function () {
            var sidebarPartContainer = builder_1.$(this.workbench)
                .div({
                'class': ['part', 'sidebar', this.sideBarPosition === partService_1.Position.LEFT ? 'left' : 'right'],
                id: Identifiers.SIDEBAR_PART,
                role: 'complementary'
            });
            this.sidebarPart.create(sidebarPartContainer);
        };
        Workbench.prototype.createPanelPart = function () {
            var panelPartContainer = builder_1.$(this.workbench)
                .div({
                'class': ['part', 'panel'],
                id: Identifiers.PANEL_PART,
                role: 'complementary'
            });
            this.panelPart.create(panelPartContainer);
        };
        Workbench.prototype.createEditorPart = function () {
            var editorContainer = builder_1.$(this.workbench)
                .div({
                'class': ['part', 'editor', 'empty'],
                id: Identifiers.EDITOR_PART,
                role: 'main'
            });
            this.editorPart.create(editorContainer);
        };
        Workbench.prototype.createStatusbarPart = function () {
            var statusbarContainer = builder_1.$(this.workbench).div({
                'class': ['part', 'statusbar'],
                id: Identifiers.STATUSBAR_PART,
                role: 'contentinfo'
            });
            this.statusbarPart.create(statusbarContainer);
        };
        Workbench.prototype.getEditorPart = function () {
            assert.ok(this.workbenchStarted, 'Workbench is not started. Call startup() first.');
            return this.editorPart;
        };
        Workbench.prototype.getSidebarPart = function () {
            assert.ok(this.workbenchStarted, 'Workbench is not started. Call startup() first.');
            return this.sidebarPart;
        };
        Workbench.prototype.getPanelPart = function () {
            assert.ok(this.workbenchStarted, 'Workbench is not started. Call startup() first.');
            return this.panelPart;
        };
        Workbench.prototype.getInstantiationService = function () {
            assert.ok(this.workbenchStarted, 'Workbench is not started. Call startup() first.');
            return this.instantiationService;
        };
        Workbench.prototype.addClass = function (clazz) {
            if (this.workbench) {
                this.workbench.addClass(clazz);
            }
        };
        Workbench.prototype.removeClass = function (clazz) {
            if (this.workbench) {
                this.workbench.removeClass(clazz);
            }
        };
        Workbench.prototype.getWorkbenchElementId = function () {
            return Identifiers.WORKBENCH_CONTAINER;
        };
        Workbench.prototype.toggleZenMode = function (skipLayout) {
            this.zenMode.active = !this.zenMode.active;
            // Check if zen mode transitioned to full screen and if now we are out of zen mode -> we need to go out of full screen
            var toggleFullScreen = false;
            if (this.zenMode.active) {
                var config = this.configurationService.getConfiguration('zenMode');
                toggleFullScreen = !browser.isFullscreen() && config.fullScreen;
                this.zenMode.transitionedToFullScreen = toggleFullScreen;
                this.zenMode.wasSideBarVisible = this.isVisible(partService_1.Parts.SIDEBAR_PART);
                this.zenMode.wasPanelVisible = this.isVisible(partService_1.Parts.PANEL_PART);
                this.setPanelHidden(true, true).done(undefined, errors.onUnexpectedError);
                this.setSideBarHidden(true, true).done(undefined, errors.onUnexpectedError);
                if (config.hideActivityBar) {
                    this.setActivityBarHidden(true, true);
                }
                if (config.hideStatusBar) {
                    this.setStatusBarHidden(true, true);
                }
                if (config.hideTabs) {
                    this.editorPart.hideTabs(true);
                }
            }
            else {
                if (this.zenMode.wasPanelVisible) {
                    this.setPanelHidden(false, true).done(undefined, errors.onUnexpectedError);
                }
                if (this.zenMode.wasSideBarVisible) {
                    this.setSideBarHidden(false, true).done(undefined, errors.onUnexpectedError);
                }
                // Status bar and activity bar visibility come from settings -> update their visibility.
                this.onDidUpdateConfiguration(true);
                this.editorPart.hideTabs(false);
                var activeEditor = this.editorPart.getActiveEditor();
                if (activeEditor) {
                    activeEditor.focus();
                }
                toggleFullScreen = this.zenMode.transitionedToFullScreen && browser.isFullscreen();
            }
            this.inZenMode.set(this.zenMode.active);
            if (!skipLayout) {
                this.layout();
            }
            if (toggleFullScreen) {
                this.windowService.toggleFullScreen().done(undefined, errors.onUnexpectedError);
            }
        };
        // Resize requested part along the main axis
        // layout will do all the math for us and adjusts the other Parts
        Workbench.prototype.resizePart = function (part, sizeChange) {
            switch (part) {
                case partService_1.Parts.SIDEBAR_PART:
                case partService_1.Parts.PANEL_PART:
                case partService_1.Parts.EDITOR_PART:
                    this.workbenchLayout.resizePart(part, sizeChange);
                    break;
                default:
                    return; // Cannot resize other parts
            }
        };
        Workbench.prototype.shouldRestoreLastOpenedViewlet = function () {
            if (!this.environmentService.isBuilt) {
                return true; // always restore sidebar when we are in development mode
            }
            var restore = this.storageService.getBoolean(Workbench.sidebarRestoreSettingKey, storage_1.StorageScope.WORKSPACE);
            if (restore) {
                this.storageService.remove(Workbench.sidebarRestoreSettingKey, storage_1.StorageScope.WORKSPACE); // only support once
            }
            return restore;
        };
        Workbench.sidebarHiddenSettingKey = 'workbench.sidebar.hidden';
        Workbench.sidebarRestoreSettingKey = 'workbench.sidebar.restore';
        Workbench.panelHiddenSettingKey = 'workbench.panel.hidden';
        Workbench.zenModeActiveSettingKey = 'workbench.zenmode.active';
        Workbench.sidebarPositionConfigurationKey = 'workbench.sideBar.location';
        Workbench.statusbarVisibleConfigurationKey = 'workbench.statusBar.visible';
        Workbench.activityBarVisibleConfigurationKey = 'workbench.activityBar.visible';
        Workbench.closeWhenEmptyConfigurationKey = 'window.closeWhenEmpty';
        Workbench.fontAliasingConfigurationKey = 'workbench.fontAliasing';
        Workbench = __decorate([
            __param(4, instantiation_1.IInstantiationService),
            __param(5, workspace_1.IWorkspaceContextService),
            __param(6, storage_1.IStorageService),
            __param(7, lifecycle_2.ILifecycleService),
            __param(8, message_1.IMessageService),
            __param(9, configuration_1.IConfigurationService),
            __param(10, telemetry_1.ITelemetryService),
            __param(11, environment_1.IEnvironmentService),
            __param(12, windows_1.IWindowService)
        ], Workbench);
        return Workbench;
    }());
    exports.Workbench = Workbench;
});
//# sourceMappingURL=workbench.js.map