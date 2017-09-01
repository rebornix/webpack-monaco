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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", "vs/base/common/uri", "path", "vs/base/common/arrays", "vs/workbench/parts/welcome/walkThrough/node/walkThroughInput", "vs/workbench/services/part/common/partService", "vs/platform/instantiation/common/instantiation", "vs/workbench/services/editor/common/editorService", "vs/platform/editor/common/editor", "vs/base/common/errors", "vs/platform/windows/common/windows", "vs/base/common/winjs.base", "vs/platform/workspace/common/workspace", "vs/platform/configuration/common/configuration", "vs/workbench/services/configuration/common/configurationEditing", "vs/nls", "vs/base/common/actions", "vs/platform/telemetry/common/telemetry", "vs/platform/telemetry/common/experiments", "vs/platform/environment/common/environment", "vs/base/common/network", "vs/workbench/services/backup/common/backup", "vs/platform/message/common/message", "vs/workbench/parts/extensions/electron-browser/extensionsUtils", "vs/platform/extensionManagement/common/extensionManagement", "vs/workbench/parts/welcome/page/electron-browser/vs_code_welcome_page", "vs/platform/lifecycle/common/lifecycle", "vs/base/common/lifecycle", "vs/base/common/labels", "vs/base/common/platform", "vs/platform/theme/common/themeService", "vs/platform/theme/common/colorRegistry", "vs/workbench/parts/welcome/walkThrough/node/walkThroughUtils", "vs/workbench/parts/extensions/common/extensions", "vs/platform/storage/common/storage", "vs/platform/workspaces/common/workspaces", "vs/css!./welcomePage"], function (require, exports, uri_1, path, arrays, walkThroughInput_1, partService_1, instantiation_1, editorService_1, editor_1, errors_1, windows_1, winjs_base_1, workspace_1, configuration_1, configurationEditing_1, nls_1, actions_1, telemetry_1, experiments_1, environment_1, network_1, backup_1, message_1, extensionsUtils_1, extensionManagement_1, vs_code_welcome_page_1, lifecycle_1, lifecycle_2, labels_1, platform_1, themeService_1, colorRegistry_1, walkThroughUtils_1, extensions_1, storage_1, workspaces_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    vs_code_welcome_page_1.used();
    var configurationKey = 'workbench.startupEditor';
    var oldConfigurationKey = 'workbench.welcome.enabled';
    var telemetryFrom = 'welcomePage';
    var WelcomePageContribution = (function () {
        function WelcomePageContribution(partService, instantiationService, configurationService, editorService, backupFileService, telemetryService, lifecycleService, storageService) {
            var enabled = isWelcomePageEnabled(configurationService);
            if (enabled && lifecycleService.startupKind !== lifecycle_1.StartupKind.ReloadedWindow) {
                winjs_base_1.TPromise.join([
                    backupFileService.hasBackups(),
                    partService.joinCreation()
                ]).then(function (_a) {
                    var hasBackups = _a[0];
                    var activeInput = editorService.getActiveEditorInput();
                    if (!activeInput && !hasBackups) {
                        return instantiationService.createInstance(WelcomePage)
                            .openEditor();
                    }
                    return undefined;
                }).then(null, errors_1.onUnexpectedError);
            }
        }
        WelcomePageContribution.prototype.getId = function () {
            return 'vs.welcomePage';
        };
        WelcomePageContribution = __decorate([
            __param(0, partService_1.IPartService),
            __param(1, instantiation_1.IInstantiationService),
            __param(2, configuration_1.IConfigurationService),
            __param(3, editorService_1.IWorkbenchEditorService),
            __param(4, backup_1.IBackupFileService),
            __param(5, telemetry_1.ITelemetryService),
            __param(6, lifecycle_1.ILifecycleService),
            __param(7, storage_1.IStorageService)
        ], WelcomePageContribution);
        return WelcomePageContribution;
    }());
    exports.WelcomePageContribution = WelcomePageContribution;
    function isWelcomePageEnabled(configurationService) {
        var startupEditor = configurationService.lookup(configurationKey);
        if (!startupEditor.user && !startupEditor.workspace) {
            var welcomeEnabled = configurationService.lookup(oldConfigurationKey);
            if (welcomeEnabled.value !== undefined && welcomeEnabled.value !== null) {
                return welcomeEnabled.value;
            }
        }
        return startupEditor.value === 'welcomePage';
    }
    var WelcomePageAction = (function (_super) {
        __extends(WelcomePageAction, _super);
        function WelcomePageAction(id, label, instantiationService) {
            var _this = _super.call(this, id, label) || this;
            _this.instantiationService = instantiationService;
            return _this;
        }
        WelcomePageAction.prototype.run = function () {
            return this.instantiationService.createInstance(WelcomePage)
                .openEditor()
                .then(function () { return undefined; });
        };
        WelcomePageAction.ID = 'workbench.action.showWelcomePage';
        WelcomePageAction.LABEL = nls_1.localize('welcomePage', "Welcome");
        WelcomePageAction = __decorate([
            __param(2, instantiation_1.IInstantiationService)
        ], WelcomePageAction);
        return WelcomePageAction;
    }(actions_1.Action));
    exports.WelcomePageAction = WelcomePageAction;
    var extensionPacks = [
        { name: nls_1.localize('welcomePage.javaScript', "JavaScript"), id: 'dbaeumer.vscode-eslint' },
        { name: nls_1.localize('welcomePage.typeScript', "TypeScript"), id: 'eg2.tslint' },
        { name: nls_1.localize('welcomePage.python', "Python"), id: 'donjayamanne.python' },
        // { name: localize('welcomePage.go', "Go"), id: 'lukehoban.go' },
        { name: nls_1.localize('welcomePage.php', "PHP"), id: 'felixfbecker.php-pack' },
        { name: nls_1.localize('welcomePage.azure', "Azure"), title: nls_1.localize('welcomePage.showAzureExtensions', "Show Azure extensions"), id: 'workbench.extensions.action.showAzureExtensions', isCommand: true },
        { name: nls_1.localize('welcomePage.docker', "Docker"), id: 'PeterJausovec.vscode-docker' },
    ];
    var keymapExtensions = [
        { name: nls_1.localize('welcomePage.vim', "Vim"), id: 'vscodevim.vim', isKeymap: true },
        { name: nls_1.localize('welcomePage.sublime', "Sublime"), id: 'ms-vscode.sublime-keybindings', isKeymap: true },
        { name: nls_1.localize('welcomePage.atom', "Atom"), id: 'ms-vscode.atom-keybindings', isKeymap: true },
    ];
    var extensionPackStrings = {
        installEvent: 'installExtension',
        installedEvent: 'installedExtension',
        detailsEvent: 'detailsExtension',
        alreadyInstalled: nls_1.localize('welcomePage.extensionPackAlreadyInstalled', "Support for {0} is already installed."),
        reloadAfterInstall: nls_1.localize('welcomePage.willReloadAfterInstallingExtensionPack', "The window will reload after installing additional support for {0}."),
        installing: nls_1.localize('welcomePage.installingExtensionPack', "Installing additional support for {0}..."),
        extensionNotFound: nls_1.localize('welcomePage.extensionPackNotFound', "Support for {0} with id {1} could not be found."),
    };
    var keymapStrings = {
        installEvent: 'installKeymap',
        installedEvent: 'installedKeymap',
        detailsEvent: 'detailsKeymap',
        alreadyInstalled: nls_1.localize('welcomePage.keymapAlreadyInstalled', "The {0} keyboard shortcuts are already installed."),
        reloadAfterInstall: nls_1.localize('welcomePage.willReloadAfterInstallingKeymap', "The window will reload after installing the {0} keyboard shortcuts."),
        installing: nls_1.localize('welcomePage.installingKeymap', "Installing the {0} keyboard shortcuts..."),
        extensionNotFound: nls_1.localize('welcomePage.keymapNotFound', "The {0} keyboard shortcuts with id {1} could not be found."),
    };
    var welcomeInputTypeId = 'workbench.editors.welcomePageInput';
    var WelcomePage = (function () {
        function WelcomePage(editorService, instantiationService, windowService, windowsService, contextService, configurationService, configurationEditingService, environmentService, messageService, extensionEnablementService, extensionGalleryService, extensionManagementService, tipsService, extensionsWorkbenchService, lifecycleService, themeService, experimentService, telemetryService) {
            var _this = this;
            this.editorService = editorService;
            this.instantiationService = instantiationService;
            this.windowService = windowService;
            this.windowsService = windowsService;
            this.contextService = contextService;
            this.configurationService = configurationService;
            this.configurationEditingService = configurationEditingService;
            this.environmentService = environmentService;
            this.messageService = messageService;
            this.extensionEnablementService = extensionEnablementService;
            this.extensionGalleryService = extensionGalleryService;
            this.extensionManagementService = extensionManagementService;
            this.tipsService = tipsService;
            this.extensionsWorkbenchService = extensionsWorkbenchService;
            this.themeService = themeService;
            this.experimentService = experimentService;
            this.telemetryService = telemetryService;
            this.disposables = [];
            this.disposables.push(lifecycleService.onShutdown(function () { return _this.dispose(); }));
            var recentlyOpened = this.windowService.getRecentlyOpened();
            var installedExtensions = this.instantiationService.invokeFunction(extensionsUtils_1.getInstalledExtensions);
            var resource = uri_1.default.parse(require.toUrl('./vs_code_welcome_page'))
                .with({
                scheme: network_1.Schemas.walkThrough,
                query: JSON.stringify({ moduleId: 'vs/workbench/parts/welcome/page/electron-browser/vs_code_welcome_page' })
            });
            this.editorInput = this.instantiationService.createInstance(walkThroughInput_1.WalkThroughInput, {
                typeId: welcomeInputTypeId,
                name: nls_1.localize('welcome.title', "Welcome"),
                resource: resource,
                telemetryFrom: telemetryFrom,
                onReady: function (container) { return _this.onReady(container, recentlyOpened, installedExtensions); }
            });
        }
        WelcomePage.prototype.openEditor = function () {
            return this.editorService.openEditor(this.editorInput, { pinned: true }, editor_1.Position.ONE);
        };
        WelcomePage.prototype.onReady = function (container, recentlyOpened, installedExtensions) {
            var _this = this;
            var enabled = isWelcomePageEnabled(this.configurationService);
            var showOnStartup = container.querySelector('#showOnStartup');
            if (enabled) {
                showOnStartup.setAttribute('checked', 'checked');
            }
            showOnStartup.addEventListener('click', function (e) {
                _this.configurationEditingService.writeConfiguration(configurationEditing_1.ConfigurationTarget.USER, { key: configurationKey, value: showOnStartup.checked ? 'welcomePage' : 'newUntitledFile' });
            });
            recentlyOpened.then(function (_a) {
                var workspaces = _a.workspaces;
                var context = _this.contextService.getWorkspace();
                workspaces = workspaces.filter(function (workspace) {
                    if (_this.contextService.hasMultiFolderWorkspace() && typeof workspace !== 'string' && context.id === workspace.id) {
                        return false; // do not show current workspace
                    }
                    if (_this.contextService.hasFolderWorkspace() && workspaces_1.isSingleFolderWorkspaceIdentifier(workspace) && _this.pathEquals(context.roots[0].fsPath, workspace)) {
                        return false; // do not show current workspace (single folder case)
                    }
                    return true;
                });
                if (!workspaces.length) {
                    var recent = container.querySelector('.welcomePage');
                    recent.classList.add('emptyRecent');
                    return;
                }
                var ul = container.querySelector('.recent ul');
                var before = ul.firstElementChild;
                workspaces.slice(0, 5).forEach(function (workspace) {
                    var label;
                    var parent;
                    var wsPath;
                    if (workspaces_1.isSingleFolderWorkspaceIdentifier(workspace)) {
                        label = path.basename(workspace);
                        parent = path.dirname(workspace);
                        wsPath = workspace;
                    }
                    else {
                        label = workspaces_1.getWorkspaceLabel(workspace, _this.environmentService);
                        parent = path.dirname(workspace.configPath);
                        wsPath = workspace.configPath;
                    }
                    var li = document.createElement('li');
                    var a = document.createElement('a');
                    var name = label;
                    var parentFolder = parent;
                    if (!name && parentFolder) {
                        var tmp = name;
                        name = parentFolder;
                        parentFolder = tmp;
                    }
                    var tildifiedParentFolder = labels_1.tildify(parentFolder, _this.environmentService.userHome);
                    a.innerText = name;
                    a.title = label;
                    a.setAttribute('aria-label', nls_1.localize('welcomePage.openFolderWithPath', "Open folder {0} with path {1}", name, tildifiedParentFolder));
                    a.href = 'javascript:void(0)';
                    a.addEventListener('click', function (e) {
                        _this.telemetryService.publicLog('workbenchActionExecuted', {
                            id: 'openRecentFolder',
                            from: telemetryFrom
                        });
                        _this.windowsService.openWindow([wsPath], { forceNewWindow: e.ctrlKey || e.metaKey });
                        e.preventDefault();
                        e.stopPropagation();
                    });
                    li.appendChild(a);
                    var span = document.createElement('span');
                    span.classList.add('path');
                    span.classList.add('detail');
                    span.innerText = tildifiedParentFolder;
                    span.title = label;
                    li.appendChild(span);
                    ul.insertBefore(li, before);
                });
            }).then(null, errors_1.onUnexpectedError);
            this.addExtensionList(container, '.extensionPackList', extensionPacks, extensionPackStrings);
            this.addExtensionList(container, '.keymapList', keymapExtensions, keymapStrings);
            this.updateInstalledExtensions(container, installedExtensions);
            this.disposables.push(this.instantiationService.invokeFunction(extensionsUtils_1.onExtensionChanged)(function (ids) {
                for (var _i = 0, ids_1 = ids; _i < ids_1.length; _i++) {
                    var id = ids_1[_i];
                    if (container.querySelector(".installExtension[data-extension=\"" + id + "\"], .enabledExtension[data-extension=\"" + id + "\"]")) {
                        var installedExtensions_1 = _this.instantiationService.invokeFunction(extensionsUtils_1.getInstalledExtensions);
                        _this.updateInstalledExtensions(container, installedExtensions_1);
                        break;
                    }
                }
                ;
            }));
            if (this.experimentService.getExperiments().deployToAzureQuickLink) {
                container.querySelector('.showInterfaceOverview').remove();
            }
            else {
                container.querySelector('.deployToAzure').remove();
            }
        };
        WelcomePage.prototype.addExtensionList = function (container, listSelector, suggestions, strings) {
            var _this = this;
            var list = container.querySelector(listSelector);
            if (list) {
                suggestions.forEach(function (extension, i) {
                    if (i) {
                        list.appendChild(document.createTextNode(nls_1.localize('welcomePage.extensionListSeparator', ", ")));
                    }
                    var a = document.createElement('a');
                    a.innerText = extension.name;
                    a.title = extension.title || (extension.isKeymap ? nls_1.localize('welcomePage.installKeymap', "Install {0} keymap", extension.name) : nls_1.localize('welcomePage.installExtensionPack', "Install additional support for {0}", extension.name));
                    if (extension.isCommand) {
                        a.href = "command:" + extension.id;
                        list.appendChild(a);
                    }
                    else {
                        a.classList.add('installExtension');
                        a.setAttribute('data-extension', extension.id);
                        a.href = 'javascript:void(0)';
                        a.addEventListener('click', function (e) {
                            _this.installExtension(extension, strings);
                            e.preventDefault();
                            e.stopPropagation();
                        });
                        list.appendChild(a);
                        var span = document.createElement('span');
                        span.innerText = extension.name;
                        span.title = extension.isKeymap ? nls_1.localize('welcomePage.installedKeymap', "{0} keymap is already installed", extension.name) : nls_1.localize('welcomePage.installedExtensionPack', "{0} support is already installed", extension.name);
                        span.classList.add('enabledExtension');
                        span.setAttribute('data-extension', extension.id);
                        list.appendChild(span);
                    }
                });
            }
        };
        WelcomePage.prototype.pathEquals = function (path1, path2) {
            if (!platform_1.isLinux) {
                path1 = path1.toLowerCase();
                path2 = path2.toLowerCase();
            }
            return path1 === path2;
        };
        WelcomePage.prototype.installExtension = function (extensionSuggestion, strings) {
            var _this = this;
            this.telemetryService.publicLog(strings.installEvent, {
                from: telemetryFrom,
                extensionId: extensionSuggestion.id,
            });
            this.instantiationService.invokeFunction(extensionsUtils_1.getInstalledExtensions).then(function (extensions) {
                var installedExtension = arrays.first(extensions, function (extension) { return extension.identifier === extensionSuggestion.id; });
                if (installedExtension && installedExtension.globallyEnabled) {
                    _this.telemetryService.publicLog(strings.installedEvent, {
                        from: telemetryFrom,
                        extensionId: extensionSuggestion.id,
                        outcome: 'already_enabled',
                    });
                    _this.messageService.show(message_1.Severity.Info, strings.alreadyInstalled.replace('{0}', extensionSuggestion.name));
                    return;
                }
                var foundAndInstalled = installedExtension ? winjs_base_1.TPromise.as(true) : _this.extensionGalleryService.query({ names: [extensionSuggestion.id] })
                    .then(function (result) {
                    var extension = result.firstPage[0];
                    if (!extension) {
                        return false;
                    }
                    return _this.extensionManagementService.installFromGallery(extension, false)
                        .then(function () {
                        // TODO: Do this as part of the install to avoid multiple events.
                        return _this.extensionEnablementService.setEnablement(extensionSuggestion.id, false);
                    }).then(function () {
                        return true;
                    });
                });
                _this.messageService.show(message_1.Severity.Info, {
                    message: strings.reloadAfterInstall.replace('{0}', extensionSuggestion.name),
                    actions: [
                        new actions_1.Action('ok', nls_1.localize('ok', "OK"), null, true, function () {
                            var messageDelay = winjs_base_1.TPromise.timeout(300);
                            messageDelay.then(function () {
                                _this.messageService.show(message_1.Severity.Info, {
                                    message: strings.installing.replace('{0}', extensionSuggestion.name),
                                    actions: [message_1.CloseAction]
                                });
                            });
                            winjs_base_1.TPromise.join(extensionSuggestion.isKeymap ? extensions.filter(function (extension) { return extensionsUtils_1.isKeymapExtension(_this.tipsService, extension) && extension.globallyEnabled; })
                                .map(function (extension) {
                                return _this.extensionEnablementService.setEnablement(extension.identifier, false);
                            }) : []).then(function () {
                                return foundAndInstalled.then(function (found) {
                                    messageDelay.cancel();
                                    if (found) {
                                        return _this.extensionEnablementService.setEnablement(extensionSuggestion.id, true)
                                            .then(function () {
                                            _this.telemetryService.publicLog(strings.installedEvent, {
                                                from: telemetryFrom,
                                                extensionId: extensionSuggestion.id,
                                                outcome: installedExtension ? 'enabled' : 'installed',
                                            });
                                            return _this.windowService.reloadWindow();
                                        });
                                    }
                                    else {
                                        _this.telemetryService.publicLog(strings.installedEvent, {
                                            from: telemetryFrom,
                                            extensionId: extensionSuggestion.id,
                                            outcome: 'not_found',
                                        });
                                        _this.messageService.show(message_1.Severity.Error, strings.extensionNotFound.replace('{0}', extensionSuggestion.name).replace('{1}', extensionSuggestion.id));
                                        return undefined;
                                    }
                                });
                            }).then(null, function (err) {
                                _this.telemetryService.publicLog(strings.installedEvent, {
                                    from: telemetryFrom,
                                    extensionId: extensionSuggestion.id,
                                    outcome: errors_1.isPromiseCanceledError(err) ? 'canceled' : 'error',
                                    error: String(err),
                                });
                                _this.messageService.show(message_1.Severity.Error, err);
                            });
                            return winjs_base_1.TPromise.as(true);
                        }),
                        new actions_1.Action('details', nls_1.localize('details', "Details"), null, true, function () {
                            _this.telemetryService.publicLog(strings.detailsEvent, {
                                from: telemetryFrom,
                                extensionId: extensionSuggestion.id,
                            });
                            _this.extensionsWorkbenchService.queryGallery({ names: [extensionSuggestion.id] })
                                .then(function (result) { return _this.extensionsWorkbenchService.open(result.firstPage[0]); })
                                .then(null, errors_1.onUnexpectedError);
                            return winjs_base_1.TPromise.as(false);
                        }),
                        new actions_1.Action('cancel', nls_1.localize('cancel', "Cancel"), null, true, function () {
                            _this.telemetryService.publicLog(strings.installedEvent, {
                                from: telemetryFrom,
                                extensionId: extensionSuggestion.id,
                                outcome: 'user_canceled',
                            });
                            return winjs_base_1.TPromise.as(true);
                        })
                    ]
                });
            }).then(null, function (err) {
                _this.telemetryService.publicLog(strings.installedEvent, {
                    from: telemetryFrom,
                    extensionId: extensionSuggestion.id,
                    outcome: errors_1.isPromiseCanceledError(err) ? 'canceled' : 'error',
                    error: String(err),
                });
                _this.messageService.show(message_1.Severity.Error, err);
            });
        };
        WelcomePage.prototype.updateInstalledExtensions = function (container, installedExtensions) {
            installedExtensions.then(function (extensions) {
                var elements = container.querySelectorAll('.installExtension, .enabledExtension');
                for (var i = 0; i < elements.length; i++) {
                    elements[i].classList.remove('installed');
                }
                extensions.filter(function (ext) { return ext.globallyEnabled; })
                    .map(function (ext) { return ext.identifier; })
                    .forEach(function (id) {
                    var install = container.querySelectorAll(".installExtension[data-extension=\"" + id + "\"]");
                    for (var i = 0; i < install.length; i++) {
                        install[i].classList.add('installed');
                    }
                    var enabled = container.querySelectorAll(".enabledExtension[data-extension=\"" + id + "\"]");
                    for (var i = 0; i < enabled.length; i++) {
                        enabled[i].classList.add('installed');
                    }
                });
            }).then(null, errors_1.onUnexpectedError);
        };
        WelcomePage.prototype.dispose = function () {
            this.disposables = lifecycle_2.dispose(this.disposables);
        };
        WelcomePage = __decorate([
            __param(0, editorService_1.IWorkbenchEditorService),
            __param(1, instantiation_1.IInstantiationService),
            __param(2, windows_1.IWindowService),
            __param(3, windows_1.IWindowsService),
            __param(4, workspace_1.IWorkspaceContextService),
            __param(5, configuration_1.IConfigurationService),
            __param(6, configurationEditing_1.IConfigurationEditingService),
            __param(7, environment_1.IEnvironmentService),
            __param(8, message_1.IMessageService),
            __param(9, extensionManagement_1.IExtensionEnablementService),
            __param(10, extensionManagement_1.IExtensionGalleryService),
            __param(11, extensionManagement_1.IExtensionManagementService),
            __param(12, extensionManagement_1.IExtensionTipsService),
            __param(13, extensions_1.IExtensionsWorkbenchService),
            __param(14, lifecycle_1.ILifecycleService),
            __param(15, themeService_1.IThemeService),
            __param(16, experiments_1.IExperimentService),
            __param(17, telemetry_1.ITelemetryService)
        ], WelcomePage);
        return WelcomePage;
    }());
    var WelcomeInputFactory = (function () {
        function WelcomeInputFactory() {
        }
        WelcomeInputFactory.prototype.serialize = function (editorInput) {
            return '{}';
        };
        WelcomeInputFactory.prototype.deserialize = function (instantiationService, serializedEditorInput) {
            return instantiationService.createInstance(WelcomePage)
                .editorInput;
        };
        WelcomeInputFactory.ID = welcomeInputTypeId;
        return WelcomeInputFactory;
    }());
    exports.WelcomeInputFactory = WelcomeInputFactory;
    // theming
    var buttonBackground = colorRegistry_1.registerColor('welcomePage.buttonBackground', { dark: null, light: null, hc: null }, nls_1.localize('welcomePage.buttonBackground', 'Background color for the buttons on the Welcome page.'));
    var buttonHoverBackground = colorRegistry_1.registerColor('welcomePage.buttonHoverBackground', { dark: null, light: null, hc: null }, nls_1.localize('welcomePage.buttonHoverBackground', 'Hover background color for the buttons on the Welcome page.'));
    themeService_1.registerThemingParticipant(function (theme, collector) {
        var foregroundColor = theme.getColor(colorRegistry_1.foreground);
        if (foregroundColor) {
            collector.addRule(".monaco-workbench > .part.editor > .content .welcomePage .caption { color: " + foregroundColor + "; }");
        }
        var descriptionColor = theme.getColor(colorRegistry_1.descriptionForeground);
        if (descriptionColor) {
            collector.addRule(".monaco-workbench > .part.editor > .content .welcomePage .detail { color: " + descriptionColor + "; }");
        }
        var buttonColor = walkThroughUtils_1.getExtraColor(theme, buttonBackground, { dark: 'rgba(0, 0, 0, .2)', extra_dark: 'rgba(200, 235, 255, .042)', light: 'rgba(0,0,0,.04)', hc: 'black' });
        if (buttonColor) {
            collector.addRule(".monaco-workbench > .part.editor > .content .welcomePage .commands li button { background: " + buttonColor + "; }");
        }
        var buttonHoverColor = walkThroughUtils_1.getExtraColor(theme, buttonHoverBackground, { dark: 'rgba(200, 235, 255, .072)', extra_dark: 'rgba(200, 235, 255, .072)', light: 'rgba(0,0,0,.10)', hc: null });
        if (buttonHoverColor) {
            collector.addRule(".monaco-workbench > .part.editor > .content .welcomePage .commands li button:hover { background: " + buttonHoverColor + "; }");
        }
        var link = theme.getColor(colorRegistry_1.textLinkForeground);
        if (link) {
            collector.addRule(".monaco-workbench > .part.editor > .content .welcomePage a { color: " + link + "; }");
        }
        var activeLink = theme.getColor(colorRegistry_1.textLinkActiveForeground);
        if (activeLink) {
            collector.addRule(".monaco-workbench > .part.editor > .content .welcomePage a:hover,\n\t\t\t.monaco-workbench > .part.editor > .content .welcomePage a:active { color: " + activeLink + "; }");
        }
        var focusColor = theme.getColor(colorRegistry_1.focusBorder);
        if (focusColor) {
            collector.addRule(".monaco-workbench > .part.editor > .content .welcomePage a:focus { outline-color: " + focusColor + "; }");
        }
        var border = theme.getColor(colorRegistry_1.contrastBorder);
        if (border) {
            collector.addRule(".monaco-workbench > .part.editor > .content .welcomePage .commands li button { border-color: " + border + "; }");
        }
        var activeBorder = theme.getColor(colorRegistry_1.activeContrastBorder);
        if (activeBorder) {
            collector.addRule(".monaco-workbench > .part.editor > .content .welcomePage .commands li button:hover { outline-color: " + activeBorder + "; }");
        }
    });
});
//# sourceMappingURL=welcomePage.js.map