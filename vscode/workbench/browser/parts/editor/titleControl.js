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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", "vs/nls", "vs/platform/registry/common/platform", "vs/workbench/browser/actions", "vs/base/common/errors", "vs/base/browser/dom", "vs/base/common/winjs.base", "vs/workbench/browser/parts/editor/baseEditor", "vs/base/common/async", "vs/editor/common/editorCommon", "vs/base/common/arrays", "vs/workbench/common/editor", "vs/base/common/events", "vs/base/browser/ui/actionbar/actionbar", "vs/base/browser/ui/toolbar/toolbar", "vs/workbench/services/editor/common/editorService", "vs/platform/contextview/browser/contextView", "vs/workbench/services/group/common/groupService", "vs/platform/message/common/message", "vs/base/browser/mouseEvent", "vs/platform/telemetry/common/telemetry", "vs/platform/instantiation/common/instantiation", "vs/platform/quickOpen/common/quickOpen", "vs/platform/keybinding/common/keybinding", "vs/platform/contextkey/common/contextkey", "vs/workbench/browser/parts/editor/editorActions", "vs/base/common/lifecycle", "vs/platform/actions/browser/menuItemActionItem", "vs/platform/actions/common/actions", "vs/workbench/common/resources", "vs/platform/theme/common/themeService", "vs/workbench/common/theme", "vs/platform/workspaces/common/workspaces", "vs/base/common/paths", "vs/css!./media/titlecontrol"], function (require, exports, nls, platform_1, actions_1, errors, DOM, winjs_base_1, baseEditor_1, async_1, editorCommon_1, arrays, editor_1, events_1, actionbar_1, toolbar_1, editorService_1, contextView_1, groupService_1, message_1, mouseEvent_1, telemetry_1, instantiation_1, quickOpen_1, keybinding_1, contextkey_1, editorActions_1, lifecycle_1, menuItemActionItem_1, actions_2, resources_1, themeService_1, theme_1, workspaces_1, paths_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var TitleControl = (function (_super) {
        __extends(TitleControl, _super);
        function TitleControl(contextMenuService, instantiationService, editorService, editorGroupService, contextKeyService, keybindingService, telemetryService, messageService, menuService, quickOpenService, themeService) {
            var _this = _super.call(this, themeService) || this;
            _this.contextMenuService = contextMenuService;
            _this.instantiationService = instantiationService;
            _this.editorService = editorService;
            _this.editorGroupService = editorGroupService;
            _this.contextKeyService = contextKeyService;
            _this.keybindingService = keybindingService;
            _this.telemetryService = telemetryService;
            _this.messageService = messageService;
            _this.menuService = menuService;
            _this.quickOpenService = quickOpenService;
            _this.themeService = themeService;
            _this.currentPrimaryEditorActionIds = [];
            _this.currentSecondaryEditorActionIds = [];
            _this.disposeOnEditorActions = [];
            _this.stacks = editorGroupService.getStacksModel();
            _this.mapActionsToEditors = Object.create(null);
            _this.scheduler = new async_1.RunOnceScheduler(function () { return _this.onSchedule(); }, 0);
            _this.toUnbind.push(_this.scheduler);
            _this.resourceContext = instantiationService.createInstance(resources_1.ResourceContextKey);
            _this.contextMenu = _this.menuService.createMenu(actions_2.MenuId.EditorTitleContext, _this.contextKeyService);
            _this.toUnbind.push(_this.contextMenu);
            _this.initActions(_this.instantiationService);
            _this.registerListeners();
            return _this;
        }
        TitleControl.getDraggedEditor = function () {
            return TitleControl.draggedEditor;
        };
        TitleControl.prototype.setDragged = function (dragged) {
            this.dragged = dragged;
        };
        TitleControl.prototype.onEditorDragStart = function (editor) {
            TitleControl.draggedEditor = editor;
        };
        TitleControl.prototype.onEditorDragEnd = function () {
            TitleControl.draggedEditor = void 0;
        };
        TitleControl.prototype.registerListeners = function () {
            var _this = this;
            this.toUnbind.push(this.stacks.onModelChanged(function (e) { return _this.onStacksChanged(e); }));
        };
        TitleControl.prototype.onStacksChanged = function (e) {
            if (e.structural) {
                this.updateSplitActionEnablement();
            }
        };
        TitleControl.prototype.updateSplitActionEnablement = function () {
            if (!this.context) {
                return;
            }
            var groupCount = this.stacks.groups.length;
            // Split editor
            this.splitEditorAction.enabled = groupCount < 3;
        };
        TitleControl.prototype.updateStyles = function () {
            _super.prototype.updateStyles.call(this);
            this.update(true); // run an update when the theme changes to new styles
        };
        TitleControl.prototype.onSchedule = function () {
            if (this.refreshScheduled) {
                this.doRefresh();
            }
            else {
                this.doUpdate();
            }
            this.refreshScheduled = false;
        };
        TitleControl.prototype.setContext = function (group) {
            this.context = group;
        };
        TitleControl.prototype.hasContext = function () {
            return !!this.context;
        };
        TitleControl.prototype.update = function (instant) {
            if (instant) {
                this.scheduler.cancel();
                this.onSchedule();
            }
            else {
                this.scheduler.schedule();
            }
        };
        TitleControl.prototype.refresh = function (instant) {
            this.refreshScheduled = true;
            if (instant) {
                this.scheduler.cancel();
                this.onSchedule();
            }
            else {
                this.scheduler.schedule();
            }
        };
        TitleControl.prototype.create = function (parent) {
            this.parent = parent;
        };
        TitleControl.prototype.getContainer = function () {
            return this.parent;
        };
        TitleControl.prototype.doUpdate = function () {
            this.doRefresh();
        };
        TitleControl.prototype.layout = function () {
            // Subclasses can opt in to react on layout
        };
        TitleControl.prototype.allowDragging = function (element) {
            return !DOM.findParentWithClass(element, 'monaco-action-bar', 'one-editor-silo');
        };
        TitleControl.prototype.initActions = function (services) {
            this.closeEditorAction = services.createInstance(editorActions_1.CloseEditorAction, editorActions_1.CloseEditorAction.ID, nls.localize('close', "Close"));
            this.closeOtherEditorsAction = services.createInstance(editorActions_1.CloseOtherEditorsInGroupAction, editorActions_1.CloseOtherEditorsInGroupAction.ID, nls.localize('closeOthers', "Close Others"));
            this.closeRightEditorsAction = services.createInstance(editorActions_1.CloseRightEditorsInGroupAction, editorActions_1.CloseRightEditorsInGroupAction.ID, nls.localize('closeRight', "Close to the Right"));
            this.closeEditorsInGroupAction = services.createInstance(editorActions_1.CloseEditorsInGroupAction, editorActions_1.CloseEditorsInGroupAction.ID, nls.localize('closeAll', "Close All"));
            this.closeUnmodifiedEditorsInGroupAction = services.createInstance(editorActions_1.CloseUnmodifiedEditorsInGroupAction, editorActions_1.CloseUnmodifiedEditorsInGroupAction.ID, nls.localize('closeAllUnmodified', "Close Unmodified"));
            this.pinEditorAction = services.createInstance(editorActions_1.KeepEditorAction, editorActions_1.KeepEditorAction.ID, nls.localize('keepOpen', "Keep Open"));
            this.showEditorsInGroupAction = services.createInstance(editorActions_1.ShowEditorsInGroupAction, editorActions_1.ShowEditorsInGroupAction.ID, nls.localize('showOpenedEditors', "Show Opened Editors"));
            this.splitEditorAction = services.createInstance(editorActions_1.SplitEditorAction, editorActions_1.SplitEditorAction.ID, editorActions_1.SplitEditorAction.LABEL);
        };
        TitleControl.prototype.createEditorActionsToolBar = function (container) {
            var _this = this;
            this.editorActionsToolbar = new toolbar_1.ToolBar(container, this.contextMenuService, {
                actionItemProvider: function (action) { return _this.actionItemProvider(action); },
                orientation: actionbar_1.ActionsOrientation.HORIZONTAL,
                ariaLabel: nls.localize('araLabelEditorActions', "Editor actions"),
                getKeyBinding: function (action) { return _this.getKeybinding(action); }
            });
            // Action Run Handling
            this.toUnbind.push(this.editorActionsToolbar.actionRunner.addListener(events_1.EventType.RUN, function (e) {
                // Check for Error
                if (e.error && !errors.isPromiseCanceledError(e.error)) {
                    _this.messageService.show(message_1.Severity.Error, e.error);
                }
                // Log in telemetry
                if (_this.telemetryService) {
                    _this.telemetryService.publicLog('workbenchActionExecuted', { id: e.action.id, from: 'editorPart' });
                }
            }));
        };
        TitleControl.prototype.actionItemProvider = function (action) {
            if (!this.context) {
                return null;
            }
            var group = this.context;
            var position = this.stacks.positionOfGroup(group);
            var editor = this.editorService.getVisibleEditors()[position];
            var actionItem;
            // Check Active Editor
            if (editor instanceof baseEditor_1.BaseEditor) {
                actionItem = editor.getActionItem(action);
            }
            // Check Registry
            if (!actionItem) {
                var actionBarRegistry = platform_1.Registry.as(actions_1.Extensions.Actionbar);
                actionItem = actionBarRegistry.getActionItemForContext(actions_1.Scope.EDITOR, { input: editor && editor.input, editor: editor, position: position }, action);
            }
            // Check extensions
            if (!actionItem) {
                actionItem = menuItemActionItem_1.createActionItem(action, this.keybindingService, this.messageService);
            }
            return actionItem;
        };
        TitleControl.prototype.getEditorActions = function (identifier) {
            var _this = this;
            var primary = [];
            var secondary = [];
            var group = identifier.group;
            var position = this.stacks.positionOfGroup(group);
            // Update the resource context
            this.resourceContext.set(group && editor_1.toResource(group.activeEditor, { supportSideBySide: true }));
            // Editor actions require the editor control to be there, so we retrieve it via service
            var control = this.editorService.getVisibleEditors()[position];
            if (control instanceof baseEditor_1.BaseEditor && control.input && typeof control.position === 'number') {
                // Editor Control Actions
                var editorActions = this.mapActionsToEditors[control.getId()];
                if (!editorActions) {
                    editorActions = { primary: control.getActions(), secondary: control.getSecondaryActions() };
                    this.mapActionsToEditors[control.getId()] = editorActions;
                }
                primary.push.apply(primary, editorActions.primary);
                secondary.push.apply(secondary, editorActions.secondary);
                // MenuItems
                // TODO This isn't very proper but needed as we have failed to
                // use the correct context key service per editor only once. Don't
                // take this code as sample of how to work with menus
                this.disposeOnEditorActions = lifecycle_1.dispose(this.disposeOnEditorActions);
                var widget = control.getControl();
                var codeEditor = editorCommon_1.isCommonCodeEditor(widget) && widget || editorCommon_1.isCommonDiffEditor(widget) && widget.getModifiedEditor();
                var scopedContextKeyService = codeEditor && codeEditor.invokeWithinContext(function (accessor) { return accessor.get(contextkey_1.IContextKeyService); }) || this.contextKeyService;
                var titleBarMenu = this.menuService.createMenu(actions_2.MenuId.EditorTitle, scopedContextKeyService);
                this.disposeOnEditorActions.push(titleBarMenu, titleBarMenu.onDidChange(function (_) { return _this.update(); }));
                menuItemActionItem_1.fillInActions(titleBarMenu, { arg: this.resourceContext.get() }, { primary: primary, secondary: secondary });
            }
            return { primary: primary, secondary: secondary };
        };
        TitleControl.prototype.updateEditorActionsToolbar = function () {
            var group = this.context;
            if (!group) {
                return;
            }
            var editor = group && group.activeEditor;
            var isActive = this.stacks.isActive(group);
            // Update Editor Actions Toolbar
            var primaryEditorActions = [];
            var secondaryEditorActions = [];
            if (isActive) {
                var editorActions = this.getEditorActions({ group: group, editor: editor });
                primaryEditorActions = actions_1.prepareActions(editorActions.primary);
                if (isActive && editor instanceof editor_1.EditorInput && editor.supportsSplitEditor()) {
                    this.updateSplitActionEnablement();
                    primaryEditorActions.push(this.splitEditorAction);
                }
                secondaryEditorActions = actions_1.prepareActions(editorActions.secondary);
            }
            var tabOptions = this.editorGroupService.getTabOptions();
            if (tabOptions.showTabs) {
                if (secondaryEditorActions.length > 0) {
                    secondaryEditorActions.push(new actionbar_1.Separator());
                }
                secondaryEditorActions.push(this.showEditorsInGroupAction);
                secondaryEditorActions.push(new actionbar_1.Separator());
                secondaryEditorActions.push(this.closeUnmodifiedEditorsInGroupAction);
                secondaryEditorActions.push(this.closeEditorsInGroupAction);
            }
            var primaryEditorActionIds = primaryEditorActions.map(function (a) { return a.id; });
            if (!tabOptions.showTabs) {
                primaryEditorActionIds.push(this.closeEditorAction.id); // always show "Close" when tabs are disabled
            }
            var secondaryEditorActionIds = secondaryEditorActions.map(function (a) { return a.id; });
            if (!arrays.equals(primaryEditorActionIds, this.currentPrimaryEditorActionIds) ||
                !arrays.equals(secondaryEditorActionIds, this.currentSecondaryEditorActionIds) ||
                primaryEditorActions.some(function (action) { return action instanceof actions_2.ExecuteCommandAction; }) ||
                secondaryEditorActions.some(function (action) { return action instanceof actions_2.ExecuteCommandAction; }) // see also https://github.com/Microsoft/vscode/issues/16298
            ) {
                this.editorActionsToolbar.setActions(primaryEditorActions, secondaryEditorActions)();
                if (!tabOptions.showTabs) {
                    this.editorActionsToolbar.addPrimaryAction(this.closeEditorAction)();
                }
                this.currentPrimaryEditorActionIds = primaryEditorActionIds;
                this.currentSecondaryEditorActionIds = secondaryEditorActionIds;
            }
        };
        TitleControl.prototype.clearEditorActionsToolbar = function () {
            this.editorActionsToolbar.setActions([], [])();
            this.currentPrimaryEditorActionIds = [];
            this.currentSecondaryEditorActionIds = [];
        };
        TitleControl.prototype.onContextMenu = function (identifier, e, node) {
            var _this = this;
            // Update the resource context
            var currentContext = this.resourceContext.get();
            this.resourceContext.set(editor_1.toResource(identifier.editor, { supportSideBySide: true }));
            // Find target anchor
            var anchor = node;
            if (e instanceof MouseEvent) {
                var event_1 = new mouseEvent_1.StandardMouseEvent(e);
                anchor = { x: event_1.posx, y: event_1.posy };
            }
            this.contextMenuService.showContextMenu({
                getAnchor: function () { return anchor; },
                getActions: function () { return winjs_base_1.TPromise.as(_this.getContextMenuActions(identifier)); },
                getActionsContext: function () { return identifier; },
                getKeyBinding: function (action) { return _this.getKeybinding(action); },
                onHide: function (cancel) { return _this.resourceContext.set(currentContext); } // restore previous context
            });
        };
        TitleControl.prototype.getKeybinding = function (action) {
            return this.keybindingService.lookupKeybinding(action.id);
        };
        TitleControl.prototype.getKeybindingLabel = function (action) {
            var keybinding = this.getKeybinding(action);
            return keybinding ? keybinding.getLabel() : void 0;
        };
        TitleControl.prototype.getContextMenuActions = function (identifier) {
            var editor = identifier.editor, group = identifier.group;
            // Enablement
            this.closeOtherEditorsAction.enabled = group.count > 1;
            this.pinEditorAction.enabled = !group.isPinned(editor);
            this.closeRightEditorsAction.enabled = group.indexOf(editor) !== group.count - 1;
            // Actions: For all editors
            var actions = [
                this.closeEditorAction,
                this.closeOtherEditorsAction
            ];
            var tabOptions = this.editorGroupService.getTabOptions();
            if (tabOptions.showTabs) {
                actions.push(this.closeRightEditorsAction);
            }
            actions.push(this.closeUnmodifiedEditorsInGroupAction);
            actions.push(this.closeEditorsInGroupAction);
            if (tabOptions.previewEditors) {
                actions.push(new actionbar_1.Separator(), this.pinEditorAction);
            }
            // Fill in contributed actions
            menuItemActionItem_1.fillInActions(this.contextMenu, { arg: this.resourceContext.get() }, actions);
            return actions;
        };
        TitleControl.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            // Actions
            [
                this.splitEditorAction,
                this.showEditorsInGroupAction,
                this.closeEditorAction,
                this.closeRightEditorsAction,
                this.closeUnmodifiedEditorsInGroupAction,
                this.closeOtherEditorsAction,
                this.closeEditorsInGroupAction,
                this.pinEditorAction
            ].forEach(function (action) {
                action.dispose();
            });
            // Toolbar
            this.editorActionsToolbar.dispose();
        };
        TitleControl = __decorate([
            __param(0, contextView_1.IContextMenuService),
            __param(1, instantiation_1.IInstantiationService),
            __param(2, editorService_1.IWorkbenchEditorService),
            __param(3, groupService_1.IEditorGroupService),
            __param(4, contextkey_1.IContextKeyService),
            __param(5, keybinding_1.IKeybindingService),
            __param(6, telemetry_1.ITelemetryService),
            __param(7, message_1.IMessageService),
            __param(8, actions_2.IMenuService),
            __param(9, quickOpen_1.IQuickOpenService),
            __param(10, themeService_1.IThemeService)
        ], TitleControl);
        return TitleControl;
    }(theme_1.Themable));
    exports.TitleControl = TitleControl;
    /**
     * Shared function across some editor components to handle drag & drop of folders and workspace files
     * to open them in the window instead of the editor.
     */
    function handleWorkspaceExternalDrop(resources, fileService, messageService, windowsService, windowService, workspacesService) {
        // Return early if there are no external resources
        var externalResources = resources.filter(function (d) { return d.isExternal; }).map(function (d) { return d.resource; });
        if (!externalResources.length) {
            return winjs_base_1.TPromise.as(false);
        }
        var externalWorkspaceResources = {
            workspaces: [],
            folders: []
        };
        return winjs_base_1.TPromise.join(externalResources.map(function (resource) {
            // Check for Workspace
            if (paths_1.extname(resource.fsPath) === "." + workspaces_1.WORKSPACE_EXTENSION) {
                externalWorkspaceResources.workspaces.push(resource);
                return void 0;
            }
            // Check for Folder
            return fileService.resolveFile(resource).then(function (stat) {
                if (stat.isDirectory) {
                    externalWorkspaceResources.folders.push(stat.resource);
                }
            }, function (error) { return void 0; });
        })).then(function (_) {
            var workspaces = externalWorkspaceResources.workspaces, folders = externalWorkspaceResources.folders;
            // Return early if no external resource is a folder or workspace
            if (workspaces.length === 0 && folders.length === 0) {
                return false;
            }
            // Pass focus to window
            windowService.focusWindow();
            var workspacesToOpen;
            // Open in separate windows if we drop workspaces or just one folder
            if (workspaces.length > 0 || folders.length === 1) {
                workspacesToOpen = winjs_base_1.TPromise.as(workspaces.concat(folders).map(function (resources) { return resources.fsPath; }));
            }
            else if (folders.length > 1) {
                workspacesToOpen = workspacesService.createWorkspace(folders.slice().map(function (folder) { return folder.fsPath; })).then(function (workspace) { return [workspace.configPath]; });
            }
            // Open
            workspacesToOpen.then(function (workspaces) {
                windowsService.openWindow(workspaces, { forceReuseWindow: true });
            });
            return true;
        });
    }
    exports.handleWorkspaceExternalDrop = handleWorkspaceExternalDrop;
});
//# sourceMappingURL=titleControl.js.map