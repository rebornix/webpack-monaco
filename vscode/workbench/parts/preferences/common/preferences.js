/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "vs/nls", "vs/base/common/paths", "vs/platform/instantiation/common/instantiation", "vs/platform/contextkey/common/contextkey", "vs/workbench/services/configuration/common/configurationEditing"], function (require, exports, nls_1, paths, instantiation_1, contextkey_1, configurationEditing_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.IPreferencesService = instantiation_1.createDecorator('preferencesService');
    function getSettingsTargetName(target, resource, workspaceContextService) {
        switch (target) {
            case configurationEditing_1.ConfigurationTarget.USER:
                return nls_1.localize('userSettingsTarget', "User Settings");
            case configurationEditing_1.ConfigurationTarget.WORKSPACE:
                return nls_1.localize('workspaceSettingsTarget', "Workspace Settings");
            case configurationEditing_1.ConfigurationTarget.FOLDER:
                var root = workspaceContextService.getRoot(resource);
                return root ? paths.basename(root.fsPath) : '';
        }
    }
    exports.getSettingsTargetName = getSettingsTargetName;
    exports.CONTEXT_SETTINGS_EDITOR = new contextkey_1.RawContextKey('inSettingsEditor', false);
    exports.CONTEXT_SETTINGS_SEARCH_FOCUS = new contextkey_1.RawContextKey('inSettingsSearch', false);
    exports.CONTEXT_KEYBINDINGS_EDITOR = new contextkey_1.RawContextKey('inKeybindings', false);
    exports.CONTEXT_KEYBINDINGS_SEARCH_FOCUS = new contextkey_1.RawContextKey('inKeybindingsSearch', false);
    exports.CONTEXT_KEYBINDING_FOCUS = new contextkey_1.RawContextKey('keybindingFocus', false);
    exports.SETTINGS_EDITOR_COMMAND_SEARCH = 'settings.action.search';
    exports.SETTINGS_EDITOR_COMMAND_FOCUS_FILE = 'settings.action.focusSettingsFile';
    exports.KEYBINDINGS_EDITOR_COMMAND_SEARCH = 'keybindings.editor.searchKeybindings';
    exports.KEYBINDINGS_EDITOR_COMMAND_DEFINE = 'keybindings.editor.defineKeybinding';
    exports.KEYBINDINGS_EDITOR_COMMAND_REMOVE = 'keybindings.editor.removeKeybinding';
    exports.KEYBINDINGS_EDITOR_COMMAND_RESET = 'keybindings.editor.resetKeybinding';
    exports.KEYBINDINGS_EDITOR_COMMAND_COPY = 'keybindings.editor.copyKeybindingEntry';
    exports.KEYBINDINGS_EDITOR_COMMAND_SHOW_CONFLICTS = 'keybindings.editor.showConflicts';
    exports.KEYBINDINGS_EDITOR_COMMAND_FOCUS_KEYBINDINGS = 'keybindings.editor.focusKeybindings';
});
//# sourceMappingURL=preferences.js.map