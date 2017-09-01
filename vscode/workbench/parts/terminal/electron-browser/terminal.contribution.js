/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "vs/workbench/parts/debug/browser/debugActions", "vs/nls", "vs/workbench/browser/panel", "vs/base/common/platform", "vs/platform/configuration/common/configurationRegistry", "vs/workbench/parts/terminal/common/terminal", "vs/workbench/parts/terminal/electron-browser/terminal", "vs/workbench/common/actionRegistry", "vs/platform/contextkey/common/contextkey", "vs/workbench/parts/terminal/electron-browser/terminalActions", "vs/platform/registry/common/platform", "vs/workbench/parts/quickopen/browser/commandsHandler", "vs/platform/actions/common/actions", "vs/workbench/parts/terminal/electron-browser/terminalService", "vs/editor/contrib/toggleTabFocusMode/common/toggleTabFocusMode", "vs/platform/instantiation/common/extensions", "vs/platform/keybinding/common/keybindingsRegistry", "vs/workbench/browser/parts/editor/editorActions", "vs/editor/common/config/editorOptions", "./terminalColorRegistry", "vs/workbench/electron-browser/actions", "vs/workbench/browser/parts/quickopen/quickopen", "vs/workbench/browser/quickopen", "vs/workbench/browser/actions", "vs/platform/commands/common/commands", "vs/css!./media/scrollbar", "vs/css!./media/terminal", "vs/css!./media/xterm", "vs/css!./media/widgets"], function (require, exports, debugActions, nls, panel, platform, configurationRegistry_1, terminal_1, terminal_2, actionRegistry_1, contextkey_1, terminalActions_1, platform_1, commandsHandler_1, actions_1, terminalService_1, toggleTabFocusMode_1, extensions_1, keybindingsRegistry_1, editorActions_1, editorOptions_1, terminalColorRegistry_1, actions_2, quickopen_1, quickopen_2, actions_3, commands_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var quickOpenRegistry = platform_1.Registry.as(quickopen_2.Extensions.Quickopen);
    var inTerminalsPicker = 'inTerminalPicker';
    quickOpenRegistry.registerQuickOpenHandler(new quickopen_2.QuickOpenHandlerDescriptor('vs/workbench/parts/terminal/browser/terminalQuickOpen', 'TerminalPickerHandler', terminalActions_1.TERMINAL_PICKER_PREFIX, inTerminalsPicker, nls.localize('quickOpen.terminal', "Show All Opened Terminals")));
    var quickOpenNavigateNextInTerminalPickerId = 'workbench.action.quickOpenNavigateNextInTerminalPicker';
    commands_1.CommandsRegistry.registerCommand(quickOpenNavigateNextInTerminalPickerId, { handler: quickopen_1.getQuickNavigateHandler(quickOpenNavigateNextInTerminalPickerId, true) });
    var quickOpenNavigatePreviousInTerminalPickerId = 'workbench.action.quickOpenNavigatePreviousInTerminalPicker';
    commands_1.CommandsRegistry.registerCommand(quickOpenNavigatePreviousInTerminalPickerId, { handler: quickopen_1.getQuickNavigateHandler(quickOpenNavigatePreviousInTerminalPickerId, false) });
    var registry = platform_1.Registry.as(actionRegistry_1.Extensions.WorkbenchActions);
    registry.registerWorkbenchAction(new actions_1.SyncActionDescriptor(terminalActions_1.QuickOpenTermAction, terminalActions_1.QuickOpenTermAction.ID, terminalActions_1.QuickOpenTermAction.LABEL), 'Quick Open Terminal');
    var actionBarRegistry = platform_1.Registry.as(actions_3.Extensions.Actionbar);
    actionBarRegistry.registerActionBarContributor(actions_3.Scope.VIEWER, terminalActions_1.QuickOpenActionTermContributor);
    var configurationRegistry = platform_1.Registry.as(configurationRegistry_1.Extensions.Configuration);
    configurationRegistry.registerConfiguration({
        'id': 'terminal',
        'order': 100,
        'title': nls.localize('terminalIntegratedConfigurationTitle', "Integrated Terminal"),
        'type': 'object',
        'properties': {
            'terminal.integrated.shell.linux': {
                'description': nls.localize('terminal.integrated.shell.linux', "The path of the shell that the terminal uses on Linux."),
                'type': 'string',
                'default': terminal_2.TERMINAL_DEFAULT_SHELL_LINUX
            },
            'terminal.integrated.shellArgs.linux': {
                'description': nls.localize('terminal.integrated.shellArgs.linux', "The command line arguments to use when on the Linux terminal."),
                'type': 'array',
                'items': {
                    'type': 'string'
                },
                'default': []
            },
            'terminal.integrated.shell.osx': {
                'description': nls.localize('terminal.integrated.shell.osx', "The path of the shell that the terminal uses on OS X."),
                'type': 'string',
                'default': terminal_2.TERMINAL_DEFAULT_SHELL_OSX
            },
            'terminal.integrated.shellArgs.osx': {
                'description': nls.localize('terminal.integrated.shellArgs.osx', "The command line arguments to use when on the OS X terminal."),
                'type': 'array',
                'items': {
                    'type': 'string'
                },
                // Unlike on Linux, ~/.profile is not sourced when logging into a macOS session. This
                // is the reason terminals on macOS typically run login shells by default which set up
                // the environment. See http://unix.stackexchange.com/a/119675/115410
                'default': ['-l']
            },
            'terminal.integrated.shell.windows': {
                'description': nls.localize('terminal.integrated.shell.windows', "The path of the shell that the terminal uses on Windows. When using shells shipped with Windows (cmd, PowerShell or Bash on Ubuntu)."),
                'type': 'string',
                'default': terminal_2.TERMINAL_DEFAULT_SHELL_WINDOWS
            },
            'terminal.integrated.shellArgs.windows': {
                'description': nls.localize('terminal.integrated.shellArgs.windows', "The command line arguments to use when on the Windows terminal."),
                'type': 'array',
                'items': {
                    'type': 'string'
                },
                'default': []
            },
            'terminal.integrated.rightClickCopyPaste': {
                'description': nls.localize('terminal.integrated.rightClickCopyPaste', "When set, this will prevent the context menu from appearing when right clicking within the terminal, instead it will copy when there is a selection and paste when there is no selection."),
                'type': 'boolean',
                'default': terminal_1.TERMINAL_DEFAULT_RIGHT_CLICK_COPY_PASTE
            },
            'terminal.integrated.fontFamily': {
                'description': nls.localize('terminal.integrated.fontFamily', "Controls the font family of the terminal, this defaults to editor.fontFamily's value."),
                'type': 'string'
            },
            'terminal.integrated.fontLigatures': {
                'description': nls.localize('terminal.integrated.fontLigatures', "Controls whether font ligatures are enabled in the terminal."),
                'type': 'boolean',
                'default': false
            },
            'terminal.integrated.fontSize': {
                'description': nls.localize('terminal.integrated.fontSize', "Controls the font size in pixels of the terminal."),
                'type': 'number',
                'default': editorOptions_1.EDITOR_FONT_DEFAULTS.fontSize
            },
            'terminal.integrated.lineHeight': {
                'description': nls.localize('terminal.integrated.lineHeight', "Controls the line height of the terminal, this number is multipled by the terminal font size to get the actual line-height in pixels."),
                'type': 'number',
                'default': 1.2
            },
            'terminal.integrated.enableBold': {
                'type': 'boolean',
                'description': nls.localize('terminal.integrated.enableBold', "Whether to enable bold text within the terminal, this requires support from the terminal shell."),
                'default': true
            },
            'terminal.integrated.cursorBlinking': {
                'description': nls.localize('terminal.integrated.cursorBlinking', "Controls whether the terminal cursor blinks."),
                'type': 'boolean',
                'default': false
            },
            'terminal.integrated.cursorStyle': {
                'description': nls.localize('terminal.integrated.cursorStyle', "Controls the style of terminal cursor."),
                'enum': [terminal_1.TerminalCursorStyle.BLOCK, terminal_1.TerminalCursorStyle.LINE, terminal_1.TerminalCursorStyle.UNDERLINE],
                'default': terminal_1.TerminalCursorStyle.BLOCK
            },
            'terminal.integrated.scrollback': {
                'description': nls.localize('terminal.integrated.scrollback', "Controls the maximum amount of lines the terminal keeps in its buffer."),
                'type': 'number',
                'default': 1000
            },
            'terminal.integrated.setLocaleVariables': {
                'description': nls.localize('terminal.integrated.setLocaleVariables', "Controls whether locale variables are set at startup of the terminal, this defaults to true on OS X, false on other platforms."),
                'type': 'boolean',
                'default': platform.isMacintosh
            },
            'terminal.integrated.cwd': {
                'description': nls.localize('terminal.integrated.cwd', "An explicit start path where the terminal will be launched, this is used as the current working directory (cwd) for the shell process. This may be particularly useful in workspace settings if the root directory is not a convenient cwd."),
                'type': 'string',
                'default': undefined
            },
            'terminal.integrated.confirmOnExit': {
                'description': nls.localize('terminal.integrated.confirmOnExit', "Whether to confirm on exit if there are active terminal sessions."),
                'type': 'boolean',
                'default': false
            },
            'terminal.integrated.commandsToSkipShell': {
                'description': nls.localize('terminal.integrated.commandsToSkipShell', "A set of command IDs whose keybindings will not be sent to the shell and instead always be handled by Code. This allows the use of keybindings that would normally be consumed by the shell to act the same as when the terminal is not focused, for example ctrl+p to launch Quick Open."),
                'type': 'array',
                'items': {
                    'type': 'string'
                },
                'default': [
                    toggleTabFocusMode_1.ToggleTabFocusModeAction.ID,
                    editorActions_1.FocusActiveGroupAction.ID,
                    quickopen_1.QUICKOPEN_ACTION_ID,
                    commandsHandler_1.ShowAllCommandsAction.ID,
                    terminalActions_1.CreateNewTerminalAction.ID,
                    terminalActions_1.CopyTerminalSelectionAction.ID,
                    terminalActions_1.KillTerminalAction.ID,
                    terminalActions_1.FocusActiveTerminalAction.ID,
                    terminalActions_1.FocusPreviousTerminalAction.ID,
                    terminalActions_1.FocusNextTerminalAction.ID,
                    terminalActions_1.FocusTerminalAtIndexAction.getId(1),
                    terminalActions_1.FocusTerminalAtIndexAction.getId(2),
                    terminalActions_1.FocusTerminalAtIndexAction.getId(3),
                    terminalActions_1.FocusTerminalAtIndexAction.getId(4),
                    terminalActions_1.FocusTerminalAtIndexAction.getId(5),
                    terminalActions_1.FocusTerminalAtIndexAction.getId(6),
                    terminalActions_1.FocusTerminalAtIndexAction.getId(7),
                    terminalActions_1.FocusTerminalAtIndexAction.getId(8),
                    terminalActions_1.FocusTerminalAtIndexAction.getId(9),
                    terminalActions_1.TerminalPasteAction.ID,
                    terminalActions_1.RunSelectedTextInTerminalAction.ID,
                    terminalActions_1.RunActiveFileInTerminalAction.ID,
                    terminalActions_1.ToggleTerminalAction.ID,
                    terminalActions_1.ScrollDownTerminalAction.ID,
                    terminalActions_1.ScrollDownPageTerminalAction.ID,
                    terminalActions_1.ScrollToBottomTerminalAction.ID,
                    terminalActions_1.ScrollUpTerminalAction.ID,
                    terminalActions_1.ScrollUpPageTerminalAction.ID,
                    terminalActions_1.ScrollToTopTerminalAction.ID,
                    terminalActions_1.ClearTerminalAction.ID,
                    debugActions.StartAction.ID,
                    debugActions.StopAction.ID,
                    debugActions.RunAction.ID,
                    debugActions.RestartAction.ID,
                    debugActions.ContinueAction.ID,
                    debugActions.PauseAction.ID,
                    editorActions_1.OpenNextRecentlyUsedEditorInGroupAction.ID,
                    editorActions_1.OpenPreviousRecentlyUsedEditorInGroupAction.ID,
                    editorActions_1.FocusFirstGroupAction.ID,
                    editorActions_1.FocusSecondGroupAction.ID,
                    editorActions_1.FocusThirdGroupAction.ID,
                    terminalActions_1.SelectAllTerminalAction.ID,
                    terminalActions_1.FocusTerminalFindWidgetAction.ID,
                    terminalActions_1.HideTerminalFindWidgetAction.ID,
                    terminalActions_1.ShowPreviousFindTermTerminalFindWidgetAction.ID,
                    terminalActions_1.ShowNextFindTermTerminalFindWidgetAction.ID,
                    actions_2.NavigateUpAction.ID,
                    actions_2.NavigateDownAction.ID,
                    actions_2.NavigateRightAction.ID,
                    actions_2.NavigateLeftAction.ID,
                    terminalActions_1.DeleteWordLeftTerminalAction.ID,
                    terminalActions_1.DeleteWordRightTerminalAction.ID,
                    'workbench.action.quickOpenNavigateNextInViewPicker'
                ].sort()
            },
            'terminal.integrated.env.osx': {
                'description': nls.localize('terminal.integrated.env.osx', "Object with environment variables that will be added to the VS Code process to be used by the terminal on OS X"),
                'type': 'object',
                'default': {}
            },
            'terminal.integrated.env.linux': {
                'description': nls.localize('terminal.integrated.env.linux', "Object with environment variables that will be added to the VS Code process to be used by the terminal on Linux"),
                'type': 'object',
                'default': {}
            },
            'terminal.integrated.env.windows': {
                'description': nls.localize('terminal.integrated.env.windows', "Object with environment variables that will be added to the VS Code process to be used by the terminal on Windows"),
                'type': 'object',
                'default': {}
            }
        }
    });
    extensions_1.registerSingleton(terminal_1.ITerminalService, terminalService_1.TerminalService);
    platform_1.Registry.as(panel.Extensions.Panels).registerPanel(new panel.PanelDescriptor('vs/workbench/parts/terminal/electron-browser/terminalPanel', 'TerminalPanel', terminal_1.TERMINAL_PANEL_ID, nls.localize('terminal', "Terminal"), 'terminal', 40, terminalActions_1.ToggleTerminalAction.ID));
    // On mac cmd+` is reserved to cycle between windows, that's why the keybindings use WinCtrl
    var category = nls.localize('terminalCategory', "Terminal");
    var actionRegistry = platform_1.Registry.as(actionRegistry_1.Extensions.WorkbenchActions);
    actionRegistry.registerWorkbenchAction(new actions_1.SyncActionDescriptor(terminalActions_1.KillTerminalAction, terminalActions_1.KillTerminalAction.ID, terminalActions_1.KillTerminalAction.LABEL), 'Terminal: Kill the Active Terminal Instance', category);
    actionRegistry.registerWorkbenchAction(new actions_1.SyncActionDescriptor(terminalActions_1.CopyTerminalSelectionAction, terminalActions_1.CopyTerminalSelectionAction.ID, terminalActions_1.CopyTerminalSelectionAction.LABEL, {
        primary: 2048 /* CtrlCmd */ | 33 /* KEY_C */,
        linux: { primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 33 /* KEY_C */ }
    }, contextkey_1.ContextKeyExpr.and(terminal_1.KEYBINDING_CONTEXT_TERMINAL_TEXT_SELECTED, terminal_1.KEYBINDING_CONTEXT_TERMINAL_FOCUS)), 'Terminal: Copy Selection', category);
    actionRegistry.registerWorkbenchAction(new actions_1.SyncActionDescriptor(terminalActions_1.CreateNewTerminalAction, terminalActions_1.CreateNewTerminalAction.ID, terminalActions_1.CreateNewTerminalAction.LABEL, {
        primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 86 /* US_BACKTICK */,
        mac: { primary: 256 /* WinCtrl */ | 1024 /* Shift */ | 86 /* US_BACKTICK */ }
    }), 'Terminal: Create New Integrated Terminal', category);
    actionRegistry.registerWorkbenchAction(new actions_1.SyncActionDescriptor(terminalActions_1.FocusActiveTerminalAction, terminalActions_1.FocusActiveTerminalAction.ID, terminalActions_1.FocusActiveTerminalAction.LABEL), 'Terminal: Focus Terminal', category);
    actionRegistry.registerWorkbenchAction(new actions_1.SyncActionDescriptor(terminalActions_1.FocusNextTerminalAction, terminalActions_1.FocusNextTerminalAction.ID, terminalActions_1.FocusNextTerminalAction.LABEL), 'Terminal: Focus Next Terminal', category);
    actionRegistry.registerWorkbenchAction(new actions_1.SyncActionDescriptor(terminalActions_1.FocusPreviousTerminalAction, terminalActions_1.FocusPreviousTerminalAction.ID, terminalActions_1.FocusPreviousTerminalAction.LABEL), 'Terminal: Focus Previous Terminal', category);
    for (var i = 1; i < 10; i++) {
        actionRegistry.registerWorkbenchAction(new actions_1.SyncActionDescriptor(terminalActions_1.FocusTerminalAtIndexAction, terminalActions_1.FocusTerminalAtIndexAction.getId(i), terminalActions_1.FocusTerminalAtIndexAction.getLabel(i)), 'Terminal: Focus Terminal ' + i, category);
    }
    actionRegistry.registerWorkbenchAction(new actions_1.SyncActionDescriptor(terminalActions_1.TerminalPasteAction, terminalActions_1.TerminalPasteAction.ID, terminalActions_1.TerminalPasteAction.LABEL, {
        primary: 2048 /* CtrlCmd */ | 52 /* KEY_V */,
        linux: { primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 52 /* KEY_V */ },
        // Don't apply to Mac since cmd+v works
        mac: { primary: null }
    }, terminal_1.KEYBINDING_CONTEXT_TERMINAL_FOCUS), 'Terminal: Paste into Active Terminal', category);
    actionRegistry.registerWorkbenchAction(new actions_1.SyncActionDescriptor(terminalActions_1.SelectAllTerminalAction, terminalActions_1.SelectAllTerminalAction.ID, terminalActions_1.SelectAllTerminalAction.LABEL, {
        // Don't use ctrl+a by default as that would override the common go to start
        // of prompt shell binding
        primary: null,
        // Technically this doesn't need to be here as it will fall back to this
        // behavior anyway when handed to xterm.js, having this handled by VS Code
        // makes it easier for users to see how it works though.
        mac: { primary: 2048 /* CtrlCmd */ | 31 /* KEY_A */ }
    }, terminal_1.KEYBINDING_CONTEXT_TERMINAL_FOCUS), 'Terminal: Select All', category);
    actionRegistry.registerWorkbenchAction(new actions_1.SyncActionDescriptor(terminalActions_1.RunSelectedTextInTerminalAction, terminalActions_1.RunSelectedTextInTerminalAction.ID, terminalActions_1.RunSelectedTextInTerminalAction.LABEL), 'Terminal: Run Selected Text In Active Terminal', category);
    actionRegistry.registerWorkbenchAction(new actions_1.SyncActionDescriptor(terminalActions_1.RunActiveFileInTerminalAction, terminalActions_1.RunActiveFileInTerminalAction.ID, terminalActions_1.RunActiveFileInTerminalAction.LABEL), 'Terminal: Run Active File In Active Terminal', category);
    actionRegistry.registerWorkbenchAction(new actions_1.SyncActionDescriptor(terminalActions_1.ToggleTerminalAction, terminalActions_1.ToggleTerminalAction.ID, terminalActions_1.ToggleTerminalAction.LABEL, {
        primary: 2048 /* CtrlCmd */ | 86 /* US_BACKTICK */,
        mac: { primary: 256 /* WinCtrl */ | 86 /* US_BACKTICK */ }
    }), 'View: Toggle Integrated Terminal', nls.localize('viewCategory', "View"));
    actionRegistry.registerWorkbenchAction(new actions_1.SyncActionDescriptor(terminalActions_1.ScrollDownTerminalAction, terminalActions_1.ScrollDownTerminalAction.ID, terminalActions_1.ScrollDownTerminalAction.LABEL, {
        primary: 2048 /* CtrlCmd */ | 18 /* DownArrow */,
        linux: { primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 18 /* DownArrow */ }
    }, terminal_1.KEYBINDING_CONTEXT_TERMINAL_FOCUS), 'Terminal: Scroll Down (Line)', category);
    actionRegistry.registerWorkbenchAction(new actions_1.SyncActionDescriptor(terminalActions_1.ScrollDownPageTerminalAction, terminalActions_1.ScrollDownPageTerminalAction.ID, terminalActions_1.ScrollDownPageTerminalAction.LABEL, {
        primary: 1024 /* Shift */ | 12 /* PageDown */,
        mac: { primary: 12 /* PageDown */ }
    }, terminal_1.KEYBINDING_CONTEXT_TERMINAL_FOCUS), 'Terminal: Scroll Down (Page)', category);
    actionRegistry.registerWorkbenchAction(new actions_1.SyncActionDescriptor(terminalActions_1.ScrollToBottomTerminalAction, terminalActions_1.ScrollToBottomTerminalAction.ID, terminalActions_1.ScrollToBottomTerminalAction.LABEL, {
        primary: 2048 /* CtrlCmd */ | 13 /* End */,
        linux: { primary: 1024 /* Shift */ | 13 /* End */ }
    }, terminal_1.KEYBINDING_CONTEXT_TERMINAL_FOCUS), 'Terminal: Scroll to Bottom', category);
    actionRegistry.registerWorkbenchAction(new actions_1.SyncActionDescriptor(terminalActions_1.ScrollUpTerminalAction, terminalActions_1.ScrollUpTerminalAction.ID, terminalActions_1.ScrollUpTerminalAction.LABEL, {
        primary: 2048 /* CtrlCmd */ | 16 /* UpArrow */,
        linux: { primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 16 /* UpArrow */ },
    }, terminal_1.KEYBINDING_CONTEXT_TERMINAL_FOCUS), 'Terminal: Scroll Up (Line)', category);
    actionRegistry.registerWorkbenchAction(new actions_1.SyncActionDescriptor(terminalActions_1.ScrollUpPageTerminalAction, terminalActions_1.ScrollUpPageTerminalAction.ID, terminalActions_1.ScrollUpPageTerminalAction.LABEL, {
        primary: 1024 /* Shift */ | 11 /* PageUp */,
        mac: { primary: 11 /* PageUp */ }
    }, terminal_1.KEYBINDING_CONTEXT_TERMINAL_FOCUS), 'Terminal: Scroll Up (Page)', category);
    actionRegistry.registerWorkbenchAction(new actions_1.SyncActionDescriptor(terminalActions_1.ScrollToTopTerminalAction, terminalActions_1.ScrollToTopTerminalAction.ID, terminalActions_1.ScrollToTopTerminalAction.LABEL, {
        primary: 2048 /* CtrlCmd */ | 14 /* Home */,
        linux: { primary: 1024 /* Shift */ | 14 /* Home */ }
    }, terminal_1.KEYBINDING_CONTEXT_TERMINAL_FOCUS), 'Terminal: Scroll to Top', category);
    actionRegistry.registerWorkbenchAction(new actions_1.SyncActionDescriptor(terminalActions_1.ClearTerminalAction, terminalActions_1.ClearTerminalAction.ID, terminalActions_1.ClearTerminalAction.LABEL, {
        primary: 2048 /* CtrlCmd */ | 41 /* KEY_K */,
        linux: { primary: null }
    }, terminal_1.KEYBINDING_CONTEXT_TERMINAL_FOCUS, keybindingsRegistry_1.KeybindingsRegistry.WEIGHT.workbenchContrib(1)), 'Terminal: Clear', category);
    if (platform.isWindows) {
        actionRegistry.registerWorkbenchAction(new actions_1.SyncActionDescriptor(terminalActions_1.SelectDefaultShellWindowsTerminalAction, terminalActions_1.SelectDefaultShellWindowsTerminalAction.ID, terminalActions_1.SelectDefaultShellWindowsTerminalAction.LABEL), 'Terminal: Select Default Shell', category);
    }
    actionRegistry.registerWorkbenchAction(new actions_1.SyncActionDescriptor(terminalActions_1.AllowWorkspaceShellTerminalCommand, terminalActions_1.AllowWorkspaceShellTerminalCommand.ID, terminalActions_1.AllowWorkspaceShellTerminalCommand.LABEL), 'Terminal: Allow Workspace Shell Configuration', category);
    actionRegistry.registerWorkbenchAction(new actions_1.SyncActionDescriptor(terminalActions_1.DisallowWorkspaceShellTerminalCommand, terminalActions_1.DisallowWorkspaceShellTerminalCommand.ID, terminalActions_1.DisallowWorkspaceShellTerminalCommand.LABEL), 'Terminal: Disallow Workspace Shell Configuration', category);
    actionRegistry.registerWorkbenchAction(new actions_1.SyncActionDescriptor(terminalActions_1.RenameTerminalAction, terminalActions_1.RenameTerminalAction.ID, terminalActions_1.RenameTerminalAction.LABEL), 'Terminal: Rename', category);
    actionRegistry.registerWorkbenchAction(new actions_1.SyncActionDescriptor(terminalActions_1.FocusTerminalFindWidgetAction, terminalActions_1.FocusTerminalFindWidgetAction.ID, terminalActions_1.FocusTerminalFindWidgetAction.LABEL, {
        primary: 2048 /* CtrlCmd */ | 36 /* KEY_F */
    }, terminal_1.KEYBINDING_CONTEXT_TERMINAL_FOCUS), 'Terminal: Focus Find Widget', category);
    actionRegistry.registerWorkbenchAction(new actions_1.SyncActionDescriptor(terminalActions_1.HideTerminalFindWidgetAction, terminalActions_1.HideTerminalFindWidgetAction.ID, terminalActions_1.HideTerminalFindWidgetAction.LABEL, {
        primary: 9 /* Escape */,
        secondary: [4 /* Shift */ | 9 /* Escape */]
    }, contextkey_1.ContextKeyExpr.and(terminal_1.KEYBINDING_CONTEXT_TERMINAL_FOCUS, terminal_1.KEYBINDING_CONTEXT_TERMINAL_FIND_WIDGET_VISIBLE)), 'Terminal: Hide Find Widget', category);
    actionRegistry.registerWorkbenchAction(new actions_1.SyncActionDescriptor(terminalActions_1.ShowNextFindTermTerminalFindWidgetAction, terminalActions_1.ShowNextFindTermTerminalFindWidgetAction.ID, terminalActions_1.ShowNextFindTermTerminalFindWidgetAction.LABEL, {
        primary: 512 /* Alt */ | 18 /* DownArrow */
    }, contextkey_1.ContextKeyExpr.and(terminal_1.KEYBINDING_CONTEXT_TERMINAL_FIND_WIDGET_INPUT_FOCUSED, terminal_1.KEYBINDING_CONTEXT_TERMINAL_FIND_WIDGET_VISIBLE)), 'Terminal: Find History Show Next', category);
    actionRegistry.registerWorkbenchAction(new actions_1.SyncActionDescriptor(terminalActions_1.ShowPreviousFindTermTerminalFindWidgetAction, terminalActions_1.ShowPreviousFindTermTerminalFindWidgetAction.ID, terminalActions_1.ShowPreviousFindTermTerminalFindWidgetAction.LABEL, {
        primary: 512 /* Alt */ | 16 /* UpArrow */
    }, contextkey_1.ContextKeyExpr.and(terminal_1.KEYBINDING_CONTEXT_TERMINAL_FIND_WIDGET_INPUT_FOCUSED, terminal_1.KEYBINDING_CONTEXT_TERMINAL_FIND_WIDGET_VISIBLE)), 'Terminal: Find History Show Previous', category);
    actionRegistry.registerWorkbenchAction(new actions_1.SyncActionDescriptor(terminalActions_1.DeleteWordLeftTerminalAction, terminalActions_1.DeleteWordLeftTerminalAction.ID, terminalActions_1.DeleteWordLeftTerminalAction.LABEL, {
        primary: 2048 /* CtrlCmd */ | 1 /* Backspace */,
        mac: { primary: 512 /* Alt */ | 1 /* Backspace */ }
    }, terminal_1.KEYBINDING_CONTEXT_TERMINAL_FOCUS), 'Terminal: Delete Word Before Cursor', category);
    actionRegistry.registerWorkbenchAction(new actions_1.SyncActionDescriptor(terminalActions_1.DeleteWordRightTerminalAction, terminalActions_1.DeleteWordRightTerminalAction.ID, terminalActions_1.DeleteWordRightTerminalAction.LABEL, {
        primary: 2048 /* CtrlCmd */ | 20 /* Delete */,
        mac: { primary: 512 /* Alt */ | 20 /* Delete */ }
    }, terminal_1.KEYBINDING_CONTEXT_TERMINAL_FOCUS), 'Terminal: Delete Word After Cursor', category);
    terminalColorRegistry_1.registerColors();
});
//# sourceMappingURL=terminal.contribution.js.map