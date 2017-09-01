import { TPromise } from 'vs/base/common/winjs.base';
import { IAction } from 'vs/base/common/actions';
import { DefaultController, DefaultDragAndDrop } from 'vs/base/parts/tree/browser/treeDefaults';
import { IDataSource, ITree, IAccessibilityProvider, IDragAndDropData, IDragOverReaction, ContextMenuEvent, IRenderer } from 'vs/base/parts/tree/browser/tree';
import { IKeyboardEvent } from 'vs/base/browser/keyboardEvent';
import { IMouseEvent, DragMouseEvent } from 'vs/base/browser/mouseEvent';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { ITelemetryService } from 'vs/platform/telemetry/common/telemetry';
import { IEditorGroupService } from 'vs/workbench/services/group/common/groupService';
import { IContextMenuService } from 'vs/platform/contextview/browser/contextView';
import { IKeybindingService } from 'vs/platform/keybinding/common/keybinding';
import { IEditorStacksModel } from 'vs/workbench/common/editor';
import { OpenEditor } from 'vs/workbench/parts/files/common/explorerModel';
import { ContributableActionProvider } from 'vs/workbench/browser/actions';
import { ITextFileService } from 'vs/workbench/services/textfile/common/textfiles';
import { IWorkbenchEditorService } from 'vs/workbench/services/editor/common/editorService';
import { EditorGroup } from 'vs/workbench/common/editor/editorStacksModel';
import { IUntitledEditorService } from 'vs/workbench/services/untitled/common/untitledEditorService';
export declare class DataSource implements IDataSource {
    getId(tree: ITree, element: any): string;
    hasChildren(tree: ITree, element: any): boolean;
    getChildren(tree: ITree, element: any): TPromise<any>;
    getParent(tree: ITree, element: any): TPromise<any>;
}
export declare class Renderer implements IRenderer {
    private actionProvider;
    private instantiationService;
    private keybindingService;
    static ITEM_HEIGHT: number;
    private static EDITOR_GROUP_TEMPLATE_ID;
    private static OPEN_EDITOR_TEMPLATE_ID;
    constructor(actionProvider: ActionProvider, instantiationService: IInstantiationService, keybindingService: IKeybindingService);
    getHeight(tree: ITree, element: any): number;
    getTemplateId(tree: ITree, element: any): string;
    renderTemplate(tree: ITree, templateId: string, container: HTMLElement): any;
    renderElement(tree: ITree, element: any, templateId: string, templateData: any): void;
    private renderEditorGroup(tree, editorGroup, templateData);
    private renderOpenEditor(tree, editor, templateData);
    disposeTemplate(tree: ITree, templateId: string, templateData: any): void;
}
export declare class Controller extends DefaultController {
    private actionProvider;
    private model;
    private editorService;
    private editorGroupService;
    private contextMenuService;
    private telemetryService;
    constructor(actionProvider: ActionProvider, model: IEditorStacksModel, editorService: IWorkbenchEditorService, editorGroupService: IEditorGroupService, contextMenuService: IContextMenuService, telemetryService: ITelemetryService);
    onClick(tree: ITree, element: any, event: IMouseEvent): boolean;
    protected onLeftClick(tree: ITree, element: any, event: IMouseEvent, origin?: string): boolean;
    protected onLeft(tree: ITree, event: IKeyboardEvent): boolean;
    protected onRight(tree: ITree, event: IKeyboardEvent): boolean;
    onContextMenu(tree: ITree, element: any, event: ContextMenuEvent): boolean;
    openEditor(element: OpenEditor, options: {
        preserveFocus: boolean;
        pinned: boolean;
        sideBySide: boolean;
    }): void;
}
export declare class AccessibilityProvider implements IAccessibilityProvider {
    getAriaLabel(tree: ITree, element: any): string;
}
export declare class ActionProvider extends ContributableActionProvider {
    private model;
    private instantiationService;
    private textFileService;
    private untitledEditorService;
    constructor(model: IEditorStacksModel, instantiationService: IInstantiationService, textFileService: ITextFileService, untitledEditorService: IUntitledEditorService);
    hasActions(tree: ITree, element: any): boolean;
    getActions(tree: ITree, element: any): TPromise<IAction[]>;
    getOpenEditorActions(): IAction[];
    getEditorGroupActions(): IAction[];
    hasSecondaryActions(tree: ITree, element: any): boolean;
    getSecondaryActions(tree: ITree, element: any): TPromise<IAction[]>;
}
export declare class DragAndDrop extends DefaultDragAndDrop {
    private editorService;
    private editorGroupService;
    constructor(editorService: IWorkbenchEditorService, editorGroupService: IEditorGroupService);
    getDragURI(tree: ITree, element: OpenEditor): string;
    getDragLabel(tree: ITree, elements: OpenEditor[]): string;
    onDragOver(tree: ITree, data: IDragAndDropData, target: OpenEditor | EditorGroup, originalEvent: DragMouseEvent): IDragOverReaction;
    drop(tree: ITree, data: IDragAndDropData, target: OpenEditor | EditorGroup, originalEvent: DragMouseEvent): void;
}
