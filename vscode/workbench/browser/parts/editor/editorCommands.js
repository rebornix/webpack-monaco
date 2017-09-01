/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "vs/nls", "vs/base/common/types", "vs/platform/keybinding/common/keybindingsRegistry", "vs/workbench/services/group/common/groupService", "vs/workbench/common/editor", "vs/workbench/services/editor/common/editorService", "vs/platform/editor/common/editor", "vs/editor/common/editorContextKeys", "vs/workbench/browser/parts/editor/textDiffEditor", "vs/platform/commands/common/commands", "vs/platform/message/common/message", "vs/base/common/actions"], function (require, exports, nls, types, keybindingsRegistry_1, groupService_1, editor_1, editorService_1, editor_2, editorContextKeys_1, textDiffEditor_1, commands_1, message_1, actions_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function setup() {
        registerActiveEditorMoveCommand();
        registerDiffEditorCommands();
        registerOpenEditorAtIndexCommands();
        handleCommandDeprecations();
    }
    exports.setup = setup;
    var isActiveEditorMoveArg = function (arg) {
        if (!types.isObject(arg)) {
            return false;
        }
        var activeEditorMoveArg = arg;
        if (!types.isString(activeEditorMoveArg.to)) {
            return false;
        }
        if (!types.isUndefined(activeEditorMoveArg.by) && !types.isString(activeEditorMoveArg.by)) {
            return false;
        }
        if (!types.isUndefined(activeEditorMoveArg.value) && !types.isNumber(activeEditorMoveArg.value)) {
            return false;
        }
        return true;
    };
    function registerActiveEditorMoveCommand() {
        keybindingsRegistry_1.KeybindingsRegistry.registerCommandAndKeybindingRule({
            id: editor_1.EditorCommands.MoveActiveEditor,
            weight: keybindingsRegistry_1.KeybindingsRegistry.WEIGHT.workbenchContrib(),
            when: editorContextKeys_1.EditorContextKeys.textFocus,
            primary: null,
            handler: function (accessor, args) { return moveActiveEditor(args, accessor); },
            description: {
                description: nls.localize('editorCommand.activeEditorMove.description', "Move the active editor by tabs or groups"),
                args: [
                    {
                        name: nls.localize('editorCommand.activeEditorMove.arg.name', "Active editor move argument"),
                        description: nls.localize('editorCommand.activeEditorMove.arg.description', "Argument Properties:\n\t\t\t\t\t\t* 'to': String value providing where to move.\n\t\t\t\t\t\t* 'by': String value providing the unit for move. By tab or by group.\n\t\t\t\t\t\t* 'value': Number value providing how many positions or an absolute position to move.\n\t\t\t\t\t"),
                        constraint: isActiveEditorMoveArg
                    }
                ]
            }
        });
    }
    function moveActiveEditor(args, accessor) {
        if (args === void 0) { args = {}; }
        var showTabs = accessor.get(groupService_1.IEditorGroupService).getTabOptions().showTabs;
        args.to = args.to || editor_1.ActiveEditorMovePositioning.RIGHT;
        args.by = showTabs ? args.by || editor_1.ActiveEditorMovePositioningBy.TAB : editor_1.ActiveEditorMovePositioningBy.GROUP;
        args.value = types.isUndefined(args.value) ? 1 : args.value;
        var activeEditor = accessor.get(editorService_1.IWorkbenchEditorService).getActiveEditor();
        if (activeEditor) {
            switch (args.by) {
                case editor_1.ActiveEditorMovePositioningBy.TAB:
                    return moveActiveTab(args, activeEditor, accessor);
                case editor_1.ActiveEditorMovePositioningBy.GROUP:
                    return moveActiveEditorToGroup(args, activeEditor, accessor);
            }
        }
    }
    function moveActiveTab(args, activeEditor, accessor) {
        var editorGroupsService = accessor.get(groupService_1.IEditorGroupService);
        var editorGroup = editorGroupsService.getStacksModel().groupAt(activeEditor.position);
        var index = editorGroup.indexOf(activeEditor.input);
        switch (args.to) {
            case editor_1.ActiveEditorMovePositioning.FIRST:
                index = 0;
                break;
            case editor_1.ActiveEditorMovePositioning.LAST:
                index = editorGroup.count - 1;
                break;
            case editor_1.ActiveEditorMovePositioning.LEFT:
                index = index - args.value;
                break;
            case editor_1.ActiveEditorMovePositioning.RIGHT:
                index = index + args.value;
                break;
            case editor_1.ActiveEditorMovePositioning.CENTER:
                index = Math.round(editorGroup.count / 2) - 1;
                break;
            case editor_1.ActiveEditorMovePositioning.POSITION:
                index = args.value - 1;
                break;
        }
        index = index < 0 ? 0 : index >= editorGroup.count ? editorGroup.count - 1 : index;
        editorGroupsService.moveEditor(activeEditor.input, editorGroup, editorGroup, { index: index });
    }
    function moveActiveEditorToGroup(args, activeEditor, accessor) {
        var newPosition = activeEditor.position;
        switch (args.to) {
            case editor_1.ActiveEditorMovePositioning.LEFT:
                newPosition = newPosition - 1;
                break;
            case editor_1.ActiveEditorMovePositioning.RIGHT:
                newPosition = newPosition + 1;
                break;
            case editor_1.ActiveEditorMovePositioning.FIRST:
                newPosition = editor_2.Position.ONE;
                break;
            case editor_1.ActiveEditorMovePositioning.LAST:
                newPosition = editor_2.Position.THREE;
                break;
            case editor_1.ActiveEditorMovePositioning.CENTER:
                newPosition = editor_2.Position.TWO;
                break;
            case editor_1.ActiveEditorMovePositioning.POSITION:
                newPosition = args.value - 1;
                break;
        }
        newPosition = editor_2.POSITIONS.indexOf(newPosition) !== -1 ? newPosition : activeEditor.position;
        accessor.get(groupService_1.IEditorGroupService).moveEditor(activeEditor.input, activeEditor.position, newPosition);
    }
    function registerDiffEditorCommands() {
        keybindingsRegistry_1.KeybindingsRegistry.registerCommandAndKeybindingRule({
            id: 'workbench.action.compareEditor.nextChange',
            weight: keybindingsRegistry_1.KeybindingsRegistry.WEIGHT.workbenchContrib(),
            when: editor_1.TextCompareEditorVisible,
            primary: null,
            handler: function (accessor) { return navigateInDiffEditor(accessor, true); }
        });
        keybindingsRegistry_1.KeybindingsRegistry.registerCommandAndKeybindingRule({
            id: 'workbench.action.compareEditor.previousChange',
            weight: keybindingsRegistry_1.KeybindingsRegistry.WEIGHT.workbenchContrib(),
            when: editor_1.TextCompareEditorVisible,
            primary: null,
            handler: function (accessor) { return navigateInDiffEditor(accessor, false); }
        });
        function navigateInDiffEditor(accessor, next) {
            var editorService = accessor.get(editorService_1.IWorkbenchEditorService);
            var candidates = [editorService.getActiveEditor()].concat(editorService.getVisibleEditors()).filter(function (e) { return e instanceof textDiffEditor_1.TextDiffEditor; });
            if (candidates.length > 0) {
                next ? candidates[0].getDiffNavigator().next() : candidates[0].getDiffNavigator().previous();
            }
        }
        keybindingsRegistry_1.KeybindingsRegistry.registerCommandAndKeybindingRule({
            id: '_workbench.printStacksModel',
            weight: keybindingsRegistry_1.KeybindingsRegistry.WEIGHT.workbenchContrib(0),
            handler: function (accessor) {
                console.log(accessor.get(groupService_1.IEditorGroupService).getStacksModel().toString() + "\n\n");
            },
            when: undefined,
            primary: undefined
        });
        keybindingsRegistry_1.KeybindingsRegistry.registerCommandAndKeybindingRule({
            id: '_workbench.validateStacksModel',
            weight: keybindingsRegistry_1.KeybindingsRegistry.WEIGHT.workbenchContrib(0),
            handler: function (accessor) {
                accessor.get(groupService_1.IEditorGroupService).getStacksModel().validate();
            },
            when: undefined,
            primary: undefined
        });
    }
    function handleCommandDeprecations() {
        var mapDeprecatedCommands = {
            'workbench.action.files.newFile': 'explorer.newFile',
            'workbench.action.files.newFolder': 'explorer.newFolder'
        };
        Object.keys(mapDeprecatedCommands).forEach(function (deprecatedCommandId) {
            var newCommandId = mapDeprecatedCommands[deprecatedCommandId];
            keybindingsRegistry_1.KeybindingsRegistry.registerCommandAndKeybindingRule({
                id: deprecatedCommandId,
                weight: keybindingsRegistry_1.KeybindingsRegistry.WEIGHT.workbenchContrib(0),
                handler: function (accessor) {
                    var messageService = accessor.get(message_1.IMessageService);
                    var commandService = accessor.get(commands_1.ICommandService);
                    messageService.show(message_1.Severity.Warning, {
                        message: nls.localize('commandDeprecated', "Command **{0}** has been removed. You can use **{1}** instead", deprecatedCommandId, newCommandId),
                        actions: [
                            new actions_1.Action('openKeybindings', nls.localize('openKeybindings', "Configure Keyboard Shortcuts"), null, true, function () {
                                return commandService.executeCommand('workbench.action.openGlobalKeybindings');
                            }),
                            message_1.CloseAction
                        ]
                    });
                },
                when: undefined,
                primary: undefined
            });
        });
    }
    function registerOpenEditorAtIndexCommands() {
        var _loop_1 = function (i) {
            var editorIndex = i;
            var visibleIndex = i + 1;
            keybindingsRegistry_1.KeybindingsRegistry.registerCommandAndKeybindingRule({
                id: 'workbench.action.openEditorAtIndex' + visibleIndex,
                weight: keybindingsRegistry_1.KeybindingsRegistry.WEIGHT.workbenchContrib(),
                when: void 0,
                primary: 512 /* Alt */ | toKeyCode(visibleIndex),
                mac: { primary: 256 /* WinCtrl */ | toKeyCode(visibleIndex) },
                handler: function (accessor) {
                    var editorService = accessor.get(editorService_1.IWorkbenchEditorService);
                    var editorGroupService = accessor.get(groupService_1.IEditorGroupService);
                    var active = editorService.getActiveEditor();
                    if (active) {
                        var group = editorGroupService.getStacksModel().groupAt(active.position);
                        var editor = group.getEditor(editorIndex);
                        if (editor) {
                            return editorService.openEditor(editor);
                        }
                    }
                    return void 0;
                }
            });
        };
        // Keybindings to focus a specific index in the tab folder if tabs are enabled
        for (var i = 0; i < 9; i++) {
            _loop_1(i);
        }
        function toKeyCode(index) {
            switch (index) {
                case 0: return 21 /* KEY_0 */;
                case 1: return 22 /* KEY_1 */;
                case 2: return 23 /* KEY_2 */;
                case 3: return 24 /* KEY_3 */;
                case 4: return 25 /* KEY_4 */;
                case 5: return 26 /* KEY_5 */;
                case 6: return 27 /* KEY_6 */;
                case 7: return 28 /* KEY_7 */;
                case 8: return 29 /* KEY_8 */;
                case 9: return 30 /* KEY_9 */;
            }
            return void 0;
        }
    }
});
//# sourceMappingURL=editorCommands.js.map