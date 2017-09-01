import { TPromise } from 'vs/base/common/winjs.base';
import { IAction, ActionRunner as BaseActionRunner, IActionRunner } from 'vs/base/common/actions';
import { FileLabel } from 'vs/workbench/browser/labels';
import { ContributableActionProvider } from 'vs/workbench/browser/actions';
import { ITextFileService } from 'vs/workbench/services/textfile/common/textfiles';
import { IFileService } from 'vs/platform/files/common/files';
import { IEditableData, IFileViewletState } from 'vs/workbench/parts/files/browser/fileActions';
import { IDataSource, ITree, IAccessibilityProvider, IRenderer, ContextMenuEvent, ISorter, IFilter, IDragAndDropData, IDragOverReaction } from 'vs/base/parts/tree/browser/tree';
import { SimpleFileResourceDragAndDrop } from 'vs/base/parts/tree/browser/treeDnd';
import { DefaultController } from 'vs/base/parts/tree/browser/treeDefaults';
import { FileStat, Model } from 'vs/workbench/parts/files/common/explorerModel';
import { DragMouseEvent, IMouseEvent } from 'vs/base/browser/mouseEvent';
import { IWorkbenchEditorService } from 'vs/workbench/services/editor/common/editorService';
import { IPartService } from 'vs/workbench/services/part/common/partService';
import { IWorkspaceContextService } from 'vs/platform/workspace/common/workspace';
import { IConfigurationService } from 'vs/platform/configuration/common/configuration';
import { IContextKeyService } from 'vs/platform/contextkey/common/contextkey';
import { IContextViewService, IContextMenuService } from 'vs/platform/contextview/browser/contextView';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { IMessageService } from 'vs/platform/message/common/message';
import { IProgressService } from 'vs/platform/progress/common/progress';
import { ITelemetryService } from 'vs/platform/telemetry/common/telemetry';
import { IMenuService } from 'vs/platform/actions/common/actions';
import { IBackupFileService } from 'vs/workbench/services/backup/common/backup';
import { IThemeService } from 'vs/platform/theme/common/themeService';
import { IWindowService } from 'vs/platform/windows/common/windows';
import { IWorkspaceEditingService } from 'vs/workbench/services/workspace/common/workspaceEditing';
import { IEnvironmentService } from 'vs/platform/environment/common/environment';
export declare class FileDataSource implements IDataSource {
    private progressService;
    private messageService;
    private fileService;
    private partService;
    private contextService;
    constructor(progressService: IProgressService, messageService: IMessageService, fileService: IFileService, partService: IPartService, contextService: IWorkspaceContextService);
    getId(tree: ITree, stat: FileStat | Model): string;
    hasChildren(tree: ITree, stat: FileStat | Model): boolean;
    getChildren(tree: ITree, stat: FileStat | Model): TPromise<FileStat[]>;
    getParent(tree: ITree, stat: FileStat | Model): TPromise<FileStat>;
}
export declare class FileActionProvider extends ContributableActionProvider {
    private state;
    constructor(state: any);
    hasActions(tree: ITree, stat: FileStat): boolean;
    getActions(tree: ITree, stat: FileStat): TPromise<IAction[]>;
    hasSecondaryActions(tree: ITree, stat: FileStat | Model): boolean;
    getSecondaryActions(tree: ITree, stat: FileStat | Model): TPromise<IAction[]>;
    runAction(tree: ITree, stat: FileStat, action: IAction, context?: any): TPromise<any>;
    runAction(tree: ITree, stat: FileStat, actionID: string, context?: any): TPromise<any>;
}
export declare class FileViewletState implements IFileViewletState {
    private _actionProvider;
    private editableStats;
    constructor();
    readonly actionProvider: FileActionProvider;
    getEditableData(stat: FileStat): IEditableData;
    setEditable(stat: FileStat, editableData: IEditableData): void;
    clearEditable(stat: FileStat): void;
}
export declare class ActionRunner extends BaseActionRunner implements IActionRunner {
    private viewletState;
    constructor(state: FileViewletState);
    run(action: IAction, context?: any): TPromise<any>;
}
export interface IFileTemplateData {
    label: FileLabel;
    container: HTMLElement;
}
export declare class FileRenderer implements IRenderer {
    private contextViewService;
    private instantiationService;
    private themeService;
    private static ITEM_HEIGHT;
    private static FILE_TEMPLATE_ID;
    private state;
    constructor(state: FileViewletState, contextViewService: IContextViewService, instantiationService: IInstantiationService, themeService: IThemeService);
    getHeight(tree: ITree, element: any): number;
    getTemplateId(tree: ITree, element: any): string;
    disposeTemplate(tree: ITree, templateId: string, templateData: IFileTemplateData): void;
    renderTemplate(tree: ITree, templateId: string, container: HTMLElement): IFileTemplateData;
    renderElement(tree: ITree, stat: FileStat, templateId: string, templateData: IFileTemplateData): void;
    private renderInputBox(container, tree, stat, editableData);
}
export declare class FileAccessibilityProvider implements IAccessibilityProvider {
    getAriaLabel(tree: ITree, stat: FileStat): string;
}
export declare class FileController extends DefaultController {
    private editorService;
    private contextMenuService;
    private instantiationService;
    private telemetryService;
    private contextService;
    private state;
    private contributedContextMenu;
    constructor(state: FileViewletState, editorService: IWorkbenchEditorService, contextMenuService: IContextMenuService, instantiationService: IInstantiationService, telemetryService: ITelemetryService, contextService: IWorkspaceContextService, menuService: IMenuService, contextKeyService: IContextKeyService);
    onLeftClick(tree: ITree, stat: FileStat | Model, event: IMouseEvent, origin?: string): boolean;
    onContextMenu(tree: ITree, stat: FileStat | Model, event: ContextMenuEvent): boolean;
    openEditor(stat: FileStat, options: {
        preserveFocus: boolean;
        sideBySide: boolean;
        pinned: boolean;
    }): void;
}
export declare class FileSorter implements ISorter {
    private configurationService;
    private toDispose;
    private sortOrder;
    constructor(configurationService: IConfigurationService);
    private registerListeners();
    private onConfigurationUpdated(configuration);
    compare(tree: ITree, statA: FileStat, statB: FileStat): number;
}
export declare class FileFilter implements IFilter {
    private contextService;
    private configurationService;
    private static MAX_SIBLINGS_FILTER_THRESHOLD;
    private hiddenExpressionPerRoot;
    constructor(contextService: IWorkspaceContextService, configurationService: IConfigurationService);
    updateConfiguration(): boolean;
    isVisible(tree: ITree, stat: FileStat): boolean;
    private doIsVisible(stat);
}
export declare class FileDragAndDrop extends SimpleFileResourceDragAndDrop {
    private messageService;
    private contextService;
    private progressService;
    private fileService;
    private configurationService;
    private instantiationService;
    private textFileService;
    private backupFileService;
    private windowService;
    private workspaceEditingService;
    private environmentService;
    private toDispose;
    private dropEnabled;
    constructor(messageService: IMessageService, contextService: IWorkspaceContextService, progressService: IProgressService, fileService: IFileService, configurationService: IConfigurationService, instantiationService: IInstantiationService, textFileService: ITextFileService, backupFileService: IBackupFileService, windowService: IWindowService, workspaceEditingService: IWorkspaceEditingService, environmentService: IEnvironmentService);
    private statToResource(stat);
    private registerListeners();
    private onConfigurationUpdated(config);
    onDragStart(tree: ITree, data: IDragAndDropData, originalEvent: DragMouseEvent): void;
    onDragOver(tree: ITree, data: IDragAndDropData, target: FileStat | Model, originalEvent: DragMouseEvent): IDragOverReaction;
    drop(tree: ITree, data: IDragAndDropData, target: FileStat | Model, originalEvent: DragMouseEvent): void;
    private handleExternalDrop(tree, data, target, originalEvent);
    private handleExplorerDrop(tree, data, target, originalEvent);
}
