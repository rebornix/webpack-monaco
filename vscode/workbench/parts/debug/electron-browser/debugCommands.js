/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "vs/nls", "vs/base/common/winjs.base", "vs/base/common/severity", "vs/base/browser/ui/list/listWidget", "vs/base/common/errors", "vs/platform/keybinding/common/keybindingsRegistry", "vs/platform/list/browser/listService", "vs/platform/message/common/message", "vs/platform/workspace/common/workspace", "vs/workbench/parts/debug/common/debug", "vs/workbench/parts/debug/common/debugModel", "vs/workbench/parts/extensions/common/extensions", "vs/workbench/services/viewlet/browser/viewlet"], function (require, exports, nls, winjs_base_1, severity_1, listWidget_1, errors, keybindingsRegistry_1, listService_1, message_1, workspace_1, debug_1, debugModel_1, extensions_1, viewlet_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function registerCommands() {
        keybindingsRegistry_1.KeybindingsRegistry.registerCommandAndKeybindingRule({
            id: '_workbench.startDebug',
            weight: keybindingsRegistry_1.KeybindingsRegistry.WEIGHT.workbenchContrib(),
            handler: function (accessor, configurationOrName, folderUri) {
                var debugService = accessor.get(debug_1.IDebugService);
                if (!configurationOrName) {
                    configurationOrName = debugService.getConfigurationManager().selectedName;
                }
                if (!folderUri) {
                    var selectedLaunch = debugService.getConfigurationManager().selectedLaunch;
                    folderUri = selectedLaunch ? selectedLaunch.workspaceUri : undefined;
                }
                if (typeof configurationOrName === 'string') {
                    debugService.startDebugging(folderUri, configurationOrName);
                }
                else {
                    debugService.createProcess(folderUri, configurationOrName);
                }
            },
            when: debug_1.CONTEXT_NOT_IN_DEBUG_MODE,
            primary: undefined
        });
        keybindingsRegistry_1.KeybindingsRegistry.registerCommandAndKeybindingRule({
            id: 'workbench.customDebugRequest',
            weight: keybindingsRegistry_1.KeybindingsRegistry.WEIGHT.workbenchContrib(),
            handler: function (accessor, request, requestArgs) {
                var process = accessor.get(debug_1.IDebugService).getViewModel().focusedProcess;
                if (process) {
                    return process.session.custom(request, requestArgs);
                }
                return undefined;
            },
            when: debug_1.CONTEXT_IN_DEBUG_MODE,
            primary: undefined
        });
        keybindingsRegistry_1.KeybindingsRegistry.registerCommandAndKeybindingRule({
            id: 'debug.logToDebugConsole',
            weight: keybindingsRegistry_1.KeybindingsRegistry.WEIGHT.workbenchContrib(),
            handler: function (accessor, value) {
                if (typeof value === 'string') {
                    var debugService = accessor.get(debug_1.IDebugService);
                    // Use warning as severity to get the orange color for messages coming from the debug extension
                    debugService.logToRepl(value, severity_1.default.Warning);
                }
            },
            when: undefined,
            primary: undefined
        });
        keybindingsRegistry_1.KeybindingsRegistry.registerCommandAndKeybindingRule({
            id: 'debug.toggleBreakpoint',
            weight: keybindingsRegistry_1.KeybindingsRegistry.WEIGHT.workbenchContrib(5),
            when: debug_1.CONTEXT_BREAKPOINTS_FOCUSED,
            primary: 10 /* Space */,
            handler: function (accessor) {
                var listService = accessor.get(listService_1.IListService);
                var debugService = accessor.get(debug_1.IDebugService);
                var focused = listService.getFocused();
                // Tree only
                if (!(focused instanceof listWidget_1.List)) {
                    var tree = focused;
                    var element = tree.getFocus();
                    debugService.enableOrDisableBreakpoints(!element.enabled, element).done(null, errors.onUnexpectedError);
                }
            }
        });
        keybindingsRegistry_1.KeybindingsRegistry.registerCommandAndKeybindingRule({
            id: 'debug.renameWatchExpression',
            weight: keybindingsRegistry_1.KeybindingsRegistry.WEIGHT.workbenchContrib(5),
            when: debug_1.CONTEXT_WATCH_EXPRESSIONS_FOCUSED,
            primary: 60 /* F2 */,
            mac: { primary: 3 /* Enter */ },
            handler: function (accessor) {
                var listService = accessor.get(listService_1.IListService);
                var debugService = accessor.get(debug_1.IDebugService);
                var focused = listService.getFocused();
                // Tree only
                if (!(focused instanceof listWidget_1.List)) {
                    var element = focused.getFocus();
                    if (element instanceof debugModel_1.Expression) {
                        debugService.getViewModel().setSelectedExpression(element);
                    }
                }
            }
        });
        keybindingsRegistry_1.KeybindingsRegistry.registerCommandAndKeybindingRule({
            id: 'debug.setVariable',
            weight: keybindingsRegistry_1.KeybindingsRegistry.WEIGHT.workbenchContrib(5),
            when: debug_1.CONTEXT_VARIABLES_FOCUSED,
            primary: 60 /* F2 */,
            mac: { primary: 3 /* Enter */ },
            handler: function (accessor) {
                var listService = accessor.get(listService_1.IListService);
                var debugService = accessor.get(debug_1.IDebugService);
                var focused = listService.getFocused();
                // Tree only
                if (!(focused instanceof listWidget_1.List)) {
                    var element = focused.getFocus();
                    if (element instanceof debugModel_1.Variable) {
                        debugService.getViewModel().setSelectedExpression(element);
                    }
                }
            }
        });
        keybindingsRegistry_1.KeybindingsRegistry.registerCommandAndKeybindingRule({
            id: 'debug.removeWatchExpression',
            weight: keybindingsRegistry_1.KeybindingsRegistry.WEIGHT.workbenchContrib(),
            when: debug_1.CONTEXT_WATCH_EXPRESSIONS_FOCUSED,
            primary: 20 /* Delete */,
            mac: { primary: 2048 /* CtrlCmd */ | 1 /* Backspace */ },
            handler: function (accessor) {
                var listService = accessor.get(listService_1.IListService);
                var debugService = accessor.get(debug_1.IDebugService);
                var focused = listService.getFocused();
                // Tree only
                if (!(focused instanceof listWidget_1.List)) {
                    var element = focused.getFocus();
                    if (element instanceof debugModel_1.Expression) {
                        debugService.removeWatchExpressions(element.getId());
                    }
                }
            }
        });
        keybindingsRegistry_1.KeybindingsRegistry.registerCommandAndKeybindingRule({
            id: 'debug.removeBreakpoint',
            weight: keybindingsRegistry_1.KeybindingsRegistry.WEIGHT.workbenchContrib(),
            when: debug_1.CONTEXT_BREAKPOINTS_FOCUSED,
            primary: 20 /* Delete */,
            mac: { primary: 2048 /* CtrlCmd */ | 1 /* Backspace */ },
            handler: function (accessor) {
                var listService = accessor.get(listService_1.IListService);
                var debugService = accessor.get(debug_1.IDebugService);
                var focused = listService.getFocused();
                // Tree only
                if (!(focused instanceof listWidget_1.List)) {
                    var element = focused.getFocus();
                    if (element instanceof debugModel_1.Breakpoint) {
                        debugService.removeBreakpoints(element.getId()).done(null, errors.onUnexpectedError);
                    }
                    else if (element instanceof debugModel_1.FunctionBreakpoint) {
                        debugService.removeFunctionBreakpoints(element.getId()).done(null, errors.onUnexpectedError);
                    }
                }
            }
        });
        keybindingsRegistry_1.KeybindingsRegistry.registerCommandAndKeybindingRule({
            id: 'debug.installAdditionalDebuggers',
            weight: keybindingsRegistry_1.KeybindingsRegistry.WEIGHT.workbenchContrib(),
            when: undefined,
            primary: undefined,
            handler: function (accessor) {
                var viewletService = accessor.get(viewlet_1.IViewletService);
                return viewletService.openViewlet(extensions_1.VIEWLET_ID, true)
                    .then(function (viewlet) { return viewlet; })
                    .then(function (viewlet) {
                    viewlet.search('tag:debuggers @sort:installs');
                    viewlet.focus();
                });
            }
        });
        keybindingsRegistry_1.KeybindingsRegistry.registerCommandAndKeybindingRule({
            id: 'debug.addConfiguration',
            weight: keybindingsRegistry_1.KeybindingsRegistry.WEIGHT.workbenchContrib(),
            when: undefined,
            primary: undefined,
            handler: function (accessor, workspaceUri) {
                var manager = accessor.get(debug_1.IDebugService).getConfigurationManager();
                if (!accessor.get(workspace_1.IWorkspaceContextService).hasWorkspace()) {
                    accessor.get(message_1.IMessageService).show(severity_1.default.Info, nls.localize('noFolderDebugConfig', "Please first open a folder in order to do advanced debug configuration."));
                    return winjs_base_1.TPromise.as(null);
                }
                var launch = manager.getLaunches().filter(function (l) { return l.workspaceUri.toString() === workspaceUri; }).pop() || manager.selectedLaunch;
                return launch.openConfigFile(false).done(function (editor) {
                    if (editor) {
                        var codeEditor = editor.getControl();
                        if (codeEditor) {
                            return codeEditor.getContribution(debug_1.EDITOR_CONTRIBUTION_ID).addLaunchConfiguration();
                        }
                    }
                    return undefined;
                });
            }
        });
    }
    exports.registerCommands = registerCommands;
});
//# sourceMappingURL=debugCommands.js.map