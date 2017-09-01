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
define(["require", "exports", "vs/nls", "vs/base/common/platform", "vs/base/common/winjs.base", "vs/platform/registry/common/platform", "vs/base/common/actions", "vs/platform/configuration/common/configuration", "vs/platform/instantiation/common/extensions", "vs/workbench/common/actionRegistry", "vs/base/common/paths", "vs/workbench/browser/actions", "vs/base/common/uri", "vs/workbench/parts/files/common/files", "vs/platform/workspace/common/workspace", "vs/workbench/parts/execution/common/execution", "vs/platform/actions/common/actions", "vs/platform/instantiation/common/instantiation", "vs/workbench/services/editor/common/editorService", "vs/workbench/common/editor", "vs/platform/configuration/common/configurationRegistry", "vs/workbench/parts/terminal/common/terminal", "vs/workbench/parts/execution/electron-browser/terminal", "vs/workbench/parts/execution/electron-browser/terminalService", "vs/workbench/services/history/common/history"], function (require, exports, nls, env, winjs_base_1, platform_1, actions_1, configuration_1, extensions_1, actionRegistry_1, paths, actions_2, uri_1, files_1, workspace_1, execution_1, actions_3, instantiation_1, editorService_1, editor_1, configurationRegistry_1, terminal_1, terminal_2, terminalService_1, history_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    if (env.isWindows) {
        extensions_1.registerSingleton(execution_1.ITerminalService, terminalService_1.WinTerminalService);
    }
    else if (env.isMacintosh) {
        extensions_1.registerSingleton(execution_1.ITerminalService, terminalService_1.MacTerminalService);
    }
    else if (env.isLinux) {
        extensions_1.registerSingleton(execution_1.ITerminalService, terminalService_1.LinuxTerminalService);
    }
    terminal_2.DEFAULT_TERMINAL_LINUX_READY.then(function (defaultTerminalLinux) {
        var configurationRegistry = platform_1.Registry.as(configurationRegistry_1.Extensions.Configuration);
        configurationRegistry.registerConfiguration({
            'id': 'externalTerminal',
            'order': 100,
            'title': nls.localize('terminalConfigurationTitle', "External Terminal"),
            'type': 'object',
            'properties': {
                'terminal.explorerKind': {
                    'type': 'string',
                    'enum': [
                        'integrated',
                        'external'
                    ],
                    'description': nls.localize('explorer.openInTerminalKind', "Customizes what kind of terminal to launch."),
                    'default': 'integrated',
                    'isExecutable': false
                },
                'terminal.external.windowsExec': {
                    'type': 'string',
                    'description': nls.localize('terminal.external.windowsExec', "Customizes which terminal to run on Windows."),
                    'default': terminal_2.DEFAULT_TERMINAL_WINDOWS,
                    'isExecutable': true
                },
                'terminal.external.osxExec': {
                    'type': 'string',
                    'description': nls.localize('terminal.external.osxExec', "Customizes which terminal application to run on OS X."),
                    'default': terminal_2.DEFAULT_TERMINAL_OSX,
                    'isExecutable': true
                },
                'terminal.external.linuxExec': {
                    'type': 'string',
                    'description': nls.localize('terminal.external.linuxExec', "Customizes which terminal to run on Linux."),
                    'default': defaultTerminalLinux,
                    'isExecutable': true
                }
            }
        });
    });
    var AbstractOpenInTerminalAction = (function (_super) {
        __extends(AbstractOpenInTerminalAction, _super);
        function AbstractOpenInTerminalAction(id, label, editorService, contextService, historyService) {
            var _this = _super.call(this, id, label) || this;
            _this.editorService = editorService;
            _this.contextService = contextService;
            _this.historyService = historyService;
            _this.order = 49; // Allow other actions to position before or after
            return _this;
        }
        AbstractOpenInTerminalAction.prototype.setResource = function (resource) {
            this.resource = resource;
            this.enabled = !paths.isUNC(this.resource.fsPath);
        };
        AbstractOpenInTerminalAction.prototype.getPathToOpen = function () {
            var pathToOpen;
            // Try workspace path first
            var root = this.historyService.getLastActiveWorkspaceRoot();
            pathToOpen = this.resource ? this.resource.fsPath : (root && root.fsPath);
            // Otherwise check if we have an active file open
            if (!pathToOpen) {
                var file = editor_1.toResource(this.editorService.getActiveEditorInput(), { supportSideBySide: true, filter: 'file' });
                if (file) {
                    pathToOpen = paths.dirname(file.fsPath); // take parent folder of file
                }
            }
            return pathToOpen;
        };
        AbstractOpenInTerminalAction = __decorate([
            __param(2, editorService_1.IWorkbenchEditorService),
            __param(3, workspace_1.IWorkspaceContextService),
            __param(4, history_1.IHistoryService)
        ], AbstractOpenInTerminalAction);
        return AbstractOpenInTerminalAction;
    }(actions_1.Action));
    exports.AbstractOpenInTerminalAction = AbstractOpenInTerminalAction;
    var OpenConsoleAction = (function (_super) {
        __extends(OpenConsoleAction, _super);
        function OpenConsoleAction(id, label, terminalService, editorService, contextService, historyService) {
            var _this = _super.call(this, id, label, editorService, contextService, historyService) || this;
            _this.terminalService = terminalService;
            return _this;
        }
        OpenConsoleAction.prototype.run = function (event) {
            var pathToOpen = this.getPathToOpen();
            this.terminalService.openTerminal(pathToOpen);
            return winjs_base_1.TPromise.as(null);
        };
        OpenConsoleAction.ID = 'workbench.action.terminal.openNativeConsole';
        OpenConsoleAction.Label = env.isWindows ? nls.localize('globalConsoleActionWin', "Open New Command Prompt") :
            nls.localize('globalConsoleActionMacLinux', "Open New Terminal");
        OpenConsoleAction.ScopedLabel = env.isWindows ? nls.localize('scopedConsoleActionWin', "Open in Command Prompt") :
            nls.localize('scopedConsoleActionMacLinux', "Open in Terminal");
        OpenConsoleAction = __decorate([
            __param(2, execution_1.ITerminalService),
            __param(3, editorService_1.IWorkbenchEditorService),
            __param(4, workspace_1.IWorkspaceContextService),
            __param(5, history_1.IHistoryService)
        ], OpenConsoleAction);
        return OpenConsoleAction;
    }(AbstractOpenInTerminalAction));
    exports.OpenConsoleAction = OpenConsoleAction;
    var OpenIntegratedTerminalAction = (function (_super) {
        __extends(OpenIntegratedTerminalAction, _super);
        function OpenIntegratedTerminalAction(id, label, integratedTerminalService, editorService, contextService, historyService) {
            var _this = _super.call(this, id, label, editorService, contextService, historyService) || this;
            _this.integratedTerminalService = integratedTerminalService;
            return _this;
        }
        OpenIntegratedTerminalAction.prototype.run = function (event) {
            var pathToOpen = this.getPathToOpen();
            var instance = this.integratedTerminalService.createInstance({ cwd: pathToOpen }, true);
            if (instance) {
                this.integratedTerminalService.setActiveInstance(instance);
                this.integratedTerminalService.showPanel(true);
            }
            return winjs_base_1.TPromise.as(null);
        };
        OpenIntegratedTerminalAction.ID = 'workbench.action.terminal.openFolderInIntegratedTerminal';
        OpenIntegratedTerminalAction.Label = nls.localize('openFolderInIntegratedTerminal', "Open in Terminal");
        OpenIntegratedTerminalAction = __decorate([
            __param(2, terminal_1.ITerminalService),
            __param(3, editorService_1.IWorkbenchEditorService),
            __param(4, workspace_1.IWorkspaceContextService),
            __param(5, history_1.IHistoryService)
        ], OpenIntegratedTerminalAction);
        return OpenIntegratedTerminalAction;
    }(AbstractOpenInTerminalAction));
    exports.OpenIntegratedTerminalAction = OpenIntegratedTerminalAction;
    var ExplorerViewerActionContributor = (function (_super) {
        __extends(ExplorerViewerActionContributor, _super);
        function ExplorerViewerActionContributor(instantiationService, configurationService) {
            var _this = _super.call(this) || this;
            _this.instantiationService = instantiationService;
            _this.configurationService = configurationService;
            return _this;
        }
        ExplorerViewerActionContributor.prototype.hasSecondaryActions = function (context) {
            return !!files_1.explorerItemToFileResource(context.element);
        };
        ExplorerViewerActionContributor.prototype.getSecondaryActions = function (context) {
            var fileResource = files_1.explorerItemToFileResource(context.element);
            var resource = fileResource.resource;
            // We want the parent unless this resource is a directory
            if (!fileResource.isDirectory) {
                resource = uri_1.default.file(paths.dirname(resource.fsPath));
            }
            var configuration = this.configurationService.getConfiguration();
            var explorerKind = configuration.terminal.explorerKind;
            if (explorerKind === 'integrated') {
                var action = this.instantiationService.createInstance(OpenIntegratedTerminalAction, OpenIntegratedTerminalAction.ID, OpenIntegratedTerminalAction.Label);
                action.setResource(resource);
                return [action];
            }
            else {
                var action = this.instantiationService.createInstance(OpenConsoleAction, OpenConsoleAction.ID, OpenConsoleAction.ScopedLabel);
                action.setResource(resource);
                return [action];
            }
        };
        ExplorerViewerActionContributor = __decorate([
            __param(0, instantiation_1.IInstantiationService),
            __param(1, configuration_1.IConfigurationService)
        ], ExplorerViewerActionContributor);
        return ExplorerViewerActionContributor;
    }(actions_2.ActionBarContributor));
    exports.ExplorerViewerActionContributor = ExplorerViewerActionContributor;
    var actionBarRegistry = platform_1.Registry.as(actions_2.Extensions.Actionbar);
    actionBarRegistry.registerActionBarContributor(actions_2.Scope.VIEWER, ExplorerViewerActionContributor);
    // Register Global Action to Open Console
    platform_1.Registry.as(actionRegistry_1.Extensions.WorkbenchActions).registerWorkbenchAction(new actions_3.SyncActionDescriptor(OpenConsoleAction, OpenConsoleAction.ID, OpenConsoleAction.Label, { primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 33 /* KEY_C */ }, terminal_1.KEYBINDING_CONTEXT_TERMINAL_NOT_FOCUSED), env.isWindows ? 'Open New Command Prompt' : 'Open New Terminal');
});
//# sourceMappingURL=execution.contribution.js.map