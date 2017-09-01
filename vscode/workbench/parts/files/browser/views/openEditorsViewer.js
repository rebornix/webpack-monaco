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
define(["require", "exports", "vs/nls", "vs/base/common/errors", "vs/base/common/winjs.base", "vs/workbench/browser/labels", "vs/base/parts/tree/browser/treeDefaults", "vs/base/parts/tree/browser/tree", "vs/base/parts/tree/browser/treeDnd", "vs/base/browser/ui/actionbar/actionbar", "vs/base/browser/dom", "vs/platform/editor/common/editor", "vs/platform/instantiation/common/instantiation", "vs/platform/telemetry/common/telemetry", "vs/workbench/services/group/common/groupService", "vs/platform/contextview/browser/contextView", "vs/platform/keybinding/common/keybinding", "vs/workbench/parts/files/common/explorerModel", "vs/workbench/browser/actions", "vs/workbench/parts/files/common/files", "vs/workbench/services/textfile/common/textfiles", "vs/workbench/services/editor/common/editorService", "vs/workbench/common/editor/editorStacksModel", "vs/workbench/parts/files/browser/fileActions", "vs/workbench/services/untitled/common/untitledEditorService", "vs/workbench/browser/parts/editor/editorActions"], function (require, exports, nls, errors, winjs_base_1, labels_1, treeDefaults_1, tree_1, treeDnd_1, actionbar_1, dom, editor_1, instantiation_1, telemetry_1, groupService_1, contextView_1, keybinding_1, explorerModel_1, actions_1, files_1, textfiles_1, editorService_1, editorStacksModel_1, fileActions_1, untitledEditorService_1, editorActions_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var $ = dom.$;
    var DataSource = (function () {
        function DataSource() {
        }
        DataSource.prototype.getId = function (tree, element) {
            if (element instanceof editorStacksModel_1.EditorStacksModel) {
                return 'root';
            }
            if (element instanceof editorStacksModel_1.EditorGroup) {
                return element.id.toString();
            }
            return element.getId();
        };
        DataSource.prototype.hasChildren = function (tree, element) {
            return element instanceof editorStacksModel_1.EditorStacksModel || element instanceof editorStacksModel_1.EditorGroup;
        };
        DataSource.prototype.getChildren = function (tree, element) {
            if (element instanceof editorStacksModel_1.EditorStacksModel) {
                return winjs_base_1.TPromise.as(element.groups);
            }
            var editorGroup = element;
            return winjs_base_1.TPromise.as(editorGroup.getEditors().map(function (ei) { return new explorerModel_1.OpenEditor(ei, editorGroup); }));
        };
        DataSource.prototype.getParent = function (tree, element) {
            return winjs_base_1.TPromise.as(null);
        };
        return DataSource;
    }());
    exports.DataSource = DataSource;
    var Renderer = (function () {
        function Renderer(actionProvider, instantiationService, keybindingService) {
            this.actionProvider = actionProvider;
            this.instantiationService = instantiationService;
            this.keybindingService = keybindingService;
            // noop
        }
        Renderer.prototype.getHeight = function (tree, element) {
            return Renderer.ITEM_HEIGHT;
        };
        Renderer.prototype.getTemplateId = function (tree, element) {
            if (element instanceof editorStacksModel_1.EditorGroup) {
                return Renderer.EDITOR_GROUP_TEMPLATE_ID;
            }
            return Renderer.OPEN_EDITOR_TEMPLATE_ID;
        };
        Renderer.prototype.renderTemplate = function (tree, templateId, container) {
            var _this = this;
            if (templateId === Renderer.EDITOR_GROUP_TEMPLATE_ID) {
                var editorGroupTemplate_1 = Object.create(null);
                editorGroupTemplate_1.root = dom.append(container, $('.editor-group'));
                editorGroupTemplate_1.name = dom.append(editorGroupTemplate_1.root, $('span.name'));
                editorGroupTemplate_1.actionBar = new actionbar_1.ActionBar(container);
                var editorGroupActions = this.actionProvider.getEditorGroupActions();
                editorGroupActions.forEach(function (a) {
                    var key = _this.keybindingService.lookupKeybinding(a.id);
                    editorGroupTemplate_1.actionBar.push(a, { icon: true, label: false, keybinding: key ? key.getLabel() : void 0 });
                });
                return editorGroupTemplate_1;
            }
            var editorTemplate = Object.create(null);
            editorTemplate.container = container;
            editorTemplate.actionBar = new actionbar_1.ActionBar(container);
            var openEditorActions = this.actionProvider.getOpenEditorActions();
            openEditorActions.forEach(function (a) {
                var key = _this.keybindingService.lookupKeybinding(a.id);
                editorTemplate.actionBar.push(a, { icon: true, label: false, keybinding: key ? key.getLabel() : void 0 });
            });
            editorTemplate.root = this.instantiationService.createInstance(labels_1.EditorLabel, container, void 0);
            return editorTemplate;
        };
        Renderer.prototype.renderElement = function (tree, element, templateId, templateData) {
            if (templateId === Renderer.EDITOR_GROUP_TEMPLATE_ID) {
                this.renderEditorGroup(tree, element, templateData);
            }
            else {
                this.renderOpenEditor(tree, element, templateData);
            }
        };
        Renderer.prototype.renderEditorGroup = function (tree, editorGroup, templateData) {
            templateData.name.textContent = editorGroup.label;
            templateData.actionBar.context = { group: editorGroup };
        };
        Renderer.prototype.renderOpenEditor = function (tree, editor, templateData) {
            editor.isDirty() ? dom.addClass(templateData.container, 'dirty') : dom.removeClass(templateData.container, 'dirty');
            templateData.root.setEditor(editor.editorInput, { italic: editor.isPreview(), extraClasses: ['open-editor'] });
            templateData.actionBar.context = { group: editor.editorGroup, editor: editor.editorInput };
        };
        Renderer.prototype.disposeTemplate = function (tree, templateId, templateData) {
            if (templateId === Renderer.OPEN_EDITOR_TEMPLATE_ID) {
                templateData.actionBar.dispose();
                templateData.root.dispose();
            }
            if (templateId === Renderer.EDITOR_GROUP_TEMPLATE_ID) {
                templateData.actionBar.dispose();
            }
        };
        Renderer.ITEM_HEIGHT = 22;
        Renderer.EDITOR_GROUP_TEMPLATE_ID = 'editorgroup';
        Renderer.OPEN_EDITOR_TEMPLATE_ID = 'openeditor';
        Renderer = __decorate([
            __param(1, instantiation_1.IInstantiationService),
            __param(2, keybinding_1.IKeybindingService)
        ], Renderer);
        return Renderer;
    }());
    exports.Renderer = Renderer;
    var Controller = (function (_super) {
        __extends(Controller, _super);
        function Controller(actionProvider, model, editorService, editorGroupService, contextMenuService, telemetryService) {
            var _this = _super.call(this, { clickBehavior: treeDefaults_1.ClickBehavior.ON_MOUSE_DOWN, keyboardSupport: false }) || this;
            _this.actionProvider = actionProvider;
            _this.model = model;
            _this.editorService = editorService;
            _this.editorGroupService = editorGroupService;
            _this.contextMenuService = contextMenuService;
            _this.telemetryService = telemetryService;
            return _this;
        }
        Controller.prototype.onClick = function (tree, element, event) {
            // Close opened editor on middle mouse click
            if (element instanceof explorerModel_1.OpenEditor && event.browserEvent && event.browserEvent.button === 1 /* Middle Button */) {
                var position = this.model.positionOfGroup(element.editorGroup);
                this.editorService.closeEditor(position, element.editorInput).done(null, errors.onUnexpectedError);
                return true;
            }
            return _super.prototype.onClick.call(this, tree, element, event);
        };
        Controller.prototype.onLeftClick = function (tree, element, event, origin) {
            if (origin === void 0) { origin = 'mouse'; }
            var payload = { origin: origin };
            var isDoubleClick = (origin === 'mouse' && event.detail === 2);
            // Cancel Event
            var isMouseDown = event && event.browserEvent && event.browserEvent.type === 'mousedown';
            if (!isMouseDown) {
                event.preventDefault(); // we cannot preventDefault onMouseDown because this would break DND otherwise
            }
            event.stopPropagation();
            // Status group should never get selected nor expanded/collapsed
            if (!(element instanceof explorerModel_1.OpenEditor)) {
                return true;
            }
            // Set DOM focus
            tree.DOMFocus();
            // Allow to unselect
            if (event.shiftKey) {
                var selection = tree.getSelection();
                if (selection && selection.length > 0 && selection[0] === element) {
                    tree.clearSelection(payload);
                }
            }
            else {
                tree.setFocus(element, payload);
                if (isDoubleClick) {
                    event.preventDefault(); // focus moves to editor, we need to prevent default
                }
                tree.setSelection([element], payload);
                this.openEditor(element, { preserveFocus: !isDoubleClick, pinned: isDoubleClick, sideBySide: event.ctrlKey || event.metaKey });
            }
            return true;
        };
        // Do not allow left / right to expand and collapse groups #7848
        Controller.prototype.onLeft = function (tree, event) {
            return true;
        };
        Controller.prototype.onRight = function (tree, event) {
            return true;
        };
        Controller.prototype.onContextMenu = function (tree, element, event) {
            var _this = this;
            if (event.target && event.target.tagName && event.target.tagName.toLowerCase() === 'input') {
                return false;
            }
            // Check if clicked on some element
            if (element === tree.getInput()) {
                return false;
            }
            event.preventDefault();
            event.stopPropagation();
            tree.setFocus(element);
            var group = element instanceof editorStacksModel_1.EditorGroup ? element : element.editorGroup;
            var editor = element instanceof explorerModel_1.OpenEditor ? element.editorInput : undefined;
            var anchor = { x: event.posx + 1, y: event.posy };
            this.contextMenuService.showContextMenu({
                getAnchor: function () { return anchor; },
                getActions: function () { return _this.actionProvider.getSecondaryActions(tree, element); },
                onHide: function (wasCancelled) {
                    if (wasCancelled) {
                        tree.DOMFocus();
                    }
                },
                getActionsContext: function () { return ({ group: group, editor: editor }); }
            });
            return true;
        };
        Controller.prototype.openEditor = function (element, options) {
            var _this = this;
            if (element) {
                this.telemetryService.publicLog('workbenchActionExecuted', { id: 'workbench.files.openFile', from: 'openEditors' });
                var position_1 = this.model.positionOfGroup(element.editorGroup);
                if (options.sideBySide && position_1 !== editor_1.Position.THREE) {
                    position_1++;
                }
                this.editorGroupService.activateGroup(this.model.groupAt(position_1));
                this.editorService.openEditor(element.editorInput, options, position_1)
                    .done(function () { return _this.editorGroupService.activateGroup(_this.model.groupAt(position_1)); }, errors.onUnexpectedError);
            }
        };
        Controller = __decorate([
            __param(2, editorService_1.IWorkbenchEditorService),
            __param(3, groupService_1.IEditorGroupService),
            __param(4, contextView_1.IContextMenuService),
            __param(5, telemetry_1.ITelemetryService)
        ], Controller);
        return Controller;
    }(treeDefaults_1.DefaultController));
    exports.Controller = Controller;
    var AccessibilityProvider = (function () {
        function AccessibilityProvider() {
        }
        AccessibilityProvider.prototype.getAriaLabel = function (tree, element) {
            if (element instanceof editorStacksModel_1.EditorGroup) {
                return nls.localize('editorGroupAriaLabel', "{0}, Editor Group", element.label);
            }
            return nls.localize('openEditorAriaLabel', "{0}, Open Editor", element.editorInput.getName());
        };
        return AccessibilityProvider;
    }());
    exports.AccessibilityProvider = AccessibilityProvider;
    var ActionProvider = (function (_super) {
        __extends(ActionProvider, _super);
        function ActionProvider(model, instantiationService, textFileService, untitledEditorService) {
            var _this = _super.call(this) || this;
            _this.model = model;
            _this.instantiationService = instantiationService;
            _this.textFileService = textFileService;
            _this.untitledEditorService = untitledEditorService;
            return _this;
        }
        ActionProvider.prototype.hasActions = function (tree, element) {
            var multipleGroups = this.model.groups.length > 1;
            return element instanceof explorerModel_1.OpenEditor || (element instanceof editorStacksModel_1.EditorGroup && multipleGroups);
        };
        ActionProvider.prototype.getActions = function (tree, element) {
            if (element instanceof explorerModel_1.OpenEditor) {
                return winjs_base_1.TPromise.as(this.getOpenEditorActions());
            }
            if (element instanceof editorStacksModel_1.EditorGroup) {
                return winjs_base_1.TPromise.as(this.getEditorGroupActions());
            }
            return winjs_base_1.TPromise.as([]);
        };
        ActionProvider.prototype.getOpenEditorActions = function () {
            return [this.instantiationService.createInstance(editorActions_1.CloseEditorAction, editorActions_1.CloseEditorAction.ID, editorActions_1.CloseEditorAction.LABEL)];
        };
        ActionProvider.prototype.getEditorGroupActions = function () {
            var saveAllAction = this.instantiationService.createInstance(fileActions_1.SaveAllInGroupAction, fileActions_1.SaveAllInGroupAction.ID, fileActions_1.SaveAllInGroupAction.LABEL);
            return [
                saveAllAction,
                this.instantiationService.createInstance(editorActions_1.CloseUnmodifiedEditorsInGroupAction, editorActions_1.CloseUnmodifiedEditorsInGroupAction.ID, editorActions_1.CloseUnmodifiedEditorsInGroupAction.LABEL),
                this.instantiationService.createInstance(editorActions_1.CloseEditorsInGroupAction, editorActions_1.CloseEditorsInGroupAction.ID, editorActions_1.CloseEditorsInGroupAction.LABEL)
            ];
        };
        ActionProvider.prototype.hasSecondaryActions = function (tree, element) {
            return element instanceof explorerModel_1.OpenEditor || element instanceof editorStacksModel_1.EditorGroup;
        };
        ActionProvider.prototype.getSecondaryActions = function (tree, element) {
            var _this = this;
            return _super.prototype.getSecondaryActions.call(this, tree, element).then(function (result) {
                var autoSaveEnabled = _this.textFileService.getAutoSaveMode() === textfiles_1.AutoSaveMode.AFTER_SHORT_DELAY;
                if (element instanceof editorStacksModel_1.EditorGroup) {
                    if (!autoSaveEnabled) {
                        result.push(_this.instantiationService.createInstance(fileActions_1.SaveAllInGroupAction, fileActions_1.SaveAllInGroupAction.ID, nls.localize('saveAll', "Save All")));
                        result.push(new actionbar_1.Separator());
                    }
                    result.push(_this.instantiationService.createInstance(editorActions_1.CloseUnmodifiedEditorsInGroupAction, editorActions_1.CloseUnmodifiedEditorsInGroupAction.ID, nls.localize('closeAllUnmodified', "Close Unmodified")));
                    result.push(_this.instantiationService.createInstance(editorActions_1.CloseEditorsInGroupAction, editorActions_1.CloseEditorsInGroupAction.ID, nls.localize('closeAll', "Close All")));
                }
                else {
                    var openEditor = element;
                    var resource = openEditor.getResource();
                    if (resource) {
                        // Open to side
                        result.unshift(_this.instantiationService.createInstance(fileActions_1.OpenToSideAction, tree, resource, false));
                        if (!openEditor.isUntitled()) {
                            // Files: Save / Revert
                            if (!autoSaveEnabled) {
                                result.push(new actionbar_1.Separator());
                                var saveAction = _this.instantiationService.createInstance(fileActions_1.SaveFileAction, fileActions_1.SaveFileAction.ID, fileActions_1.SaveFileAction.LABEL);
                                saveAction.setResource(resource);
                                saveAction.enabled = openEditor.isDirty();
                                result.push(saveAction);
                                var revertAction = _this.instantiationService.createInstance(fileActions_1.RevertFileAction, fileActions_1.RevertFileAction.ID, fileActions_1.RevertFileAction.LABEL);
                                revertAction.setResource(resource);
                                revertAction.enabled = openEditor.isDirty();
                                result.push(revertAction);
                            }
                        }
                        // Untitled: Save / Save As
                        if (openEditor.isUntitled()) {
                            result.push(new actionbar_1.Separator());
                            if (_this.untitledEditorService.hasAssociatedFilePath(resource)) {
                                var saveUntitledAction = _this.instantiationService.createInstance(fileActions_1.SaveFileAction, fileActions_1.SaveFileAction.ID, fileActions_1.SaveFileAction.LABEL);
                                saveUntitledAction.setResource(resource);
                                result.push(saveUntitledAction);
                            }
                            var saveAsAction = _this.instantiationService.createInstance(fileActions_1.SaveFileAsAction, fileActions_1.SaveFileAsAction.ID, fileActions_1.SaveFileAsAction.LABEL);
                            saveAsAction.setResource(resource);
                            result.push(saveAsAction);
                        }
                        // Compare Actions
                        result.push(new actionbar_1.Separator());
                        if (!openEditor.isUntitled()) {
                            var compareWithSavedAction = _this.instantiationService.createInstance(fileActions_1.CompareWithSavedAction, fileActions_1.CompareWithSavedAction.ID, nls.localize('compareWithSaved', "Compare with Saved"));
                            compareWithSavedAction.setResource(resource);
                            compareWithSavedAction.enabled = openEditor.isDirty();
                            result.push(compareWithSavedAction);
                        }
                        var runCompareAction = _this.instantiationService.createInstance(fileActions_1.CompareResourcesAction, resource, tree);
                        if (runCompareAction._isEnabled()) {
                            result.push(runCompareAction);
                        }
                        result.push(_this.instantiationService.createInstance(fileActions_1.SelectResourceForCompareAction, resource, tree));
                        result.push(new actionbar_1.Separator());
                    }
                    result.push(_this.instantiationService.createInstance(editorActions_1.CloseEditorAction, editorActions_1.CloseEditorAction.ID, nls.localize('close', "Close")));
                    var closeOtherEditorsInGroupAction = _this.instantiationService.createInstance(editorActions_1.CloseOtherEditorsInGroupAction, editorActions_1.CloseOtherEditorsInGroupAction.ID, nls.localize('closeOthers', "Close Others"));
                    closeOtherEditorsInGroupAction.enabled = openEditor.editorGroup.count > 1;
                    result.push(closeOtherEditorsInGroupAction);
                    result.push(_this.instantiationService.createInstance(editorActions_1.CloseUnmodifiedEditorsInGroupAction, editorActions_1.CloseUnmodifiedEditorsInGroupAction.ID, nls.localize('closeAllUnmodified', "Close Unmodified")));
                    result.push(_this.instantiationService.createInstance(editorActions_1.CloseEditorsInGroupAction, editorActions_1.CloseEditorsInGroupAction.ID, nls.localize('closeAll', "Close All")));
                }
                return result;
            });
        };
        ActionProvider = __decorate([
            __param(1, instantiation_1.IInstantiationService),
            __param(2, textfiles_1.ITextFileService),
            __param(3, untitledEditorService_1.IUntitledEditorService)
        ], ActionProvider);
        return ActionProvider;
    }(actions_1.ContributableActionProvider));
    exports.ActionProvider = ActionProvider;
    var DragAndDrop = (function (_super) {
        __extends(DragAndDrop, _super);
        function DragAndDrop(editorService, editorGroupService) {
            var _this = _super.call(this) || this;
            _this.editorService = editorService;
            _this.editorGroupService = editorGroupService;
            return _this;
        }
        DragAndDrop.prototype.getDragURI = function (tree, element) {
            if (!(element instanceof explorerModel_1.OpenEditor)) {
                return null;
            }
            var resource = element.getResource();
            // Some open editors do not have a resource so use the name as drag identifier instead #7021
            return resource ? resource.toString() : element.editorInput.getName();
        };
        DragAndDrop.prototype.getDragLabel = function (tree, elements) {
            if (elements.length > 1) {
                return String(elements.length);
            }
            return elements[0].editorInput.getName();
        };
        DragAndDrop.prototype.onDragOver = function (tree, data, target, originalEvent) {
            if (!(target instanceof explorerModel_1.OpenEditor) && !(target instanceof editorStacksModel_1.EditorGroup)) {
                return tree_1.DRAG_OVER_REJECT;
            }
            if (data instanceof treeDnd_1.ExternalElementsDragAndDropData) {
                var resource = files_1.explorerItemToFileResource(data.getData()[0]);
                if (!resource) {
                    return tree_1.DRAG_OVER_REJECT;
                }
                return resource.isDirectory ? tree_1.DRAG_OVER_REJECT : tree_1.DRAG_OVER_ACCEPT;
            }
            if (data instanceof treeDnd_1.DesktopDragAndDropData) {
                return tree_1.DRAG_OVER_REJECT;
            }
            if (!(data instanceof treeDnd_1.ElementsDragAndDropData)) {
                return tree_1.DRAG_OVER_REJECT;
            }
            return tree_1.DRAG_OVER_ACCEPT;
        };
        DragAndDrop.prototype.drop = function (tree, data, target, originalEvent) {
            var draggedElement;
            var model = this.editorGroupService.getStacksModel();
            var positionOfTargetGroup = model.positionOfGroup(target instanceof editorStacksModel_1.EditorGroup ? target : target.editorGroup);
            var index = target instanceof explorerModel_1.OpenEditor ? target.editorGroup.indexOf(target.editorInput) : undefined;
            // Support drop from explorer viewer
            if (data instanceof treeDnd_1.ExternalElementsDragAndDropData) {
                var resource = files_1.explorerItemToFileResource(data.getData()[0]);
                resource.options = { index: index, pinned: true };
                this.editorService.openEditor(resource, positionOfTargetGroup).done(null, errors.onUnexpectedError);
            }
            else {
                var source = data.getData();
                if (Array.isArray(source)) {
                    draggedElement = source[0];
                }
            }
            if (draggedElement) {
                if (draggedElement instanceof explorerModel_1.OpenEditor) {
                    this.editorGroupService.moveEditor(draggedElement.editorInput, model.positionOfGroup(draggedElement.editorGroup), positionOfTargetGroup, { index: index });
                }
                else {
                    this.editorGroupService.moveGroup(model.positionOfGroup(draggedElement), positionOfTargetGroup);
                }
            }
        };
        DragAndDrop = __decorate([
            __param(0, editorService_1.IWorkbenchEditorService),
            __param(1, groupService_1.IEditorGroupService)
        ], DragAndDrop);
        return DragAndDrop;
    }(treeDefaults_1.DefaultDragAndDrop));
    exports.DragAndDrop = DragAndDrop;
});
//# sourceMappingURL=openEditorsViewer.js.map