import 'vs/css!./media/fileactions';
import { TPromise } from 'vs/base/common/winjs.base';
import URI from 'vs/base/common/uri';
import { Action, IAction } from 'vs/base/common/actions';
import { IInputValidator } from 'vs/base/browser/ui/inputbox/inputBox';
import { ITree, IActionProvider } from 'vs/base/parts/tree/browser/tree';
import { ITextFileService } from 'vs/workbench/services/textfile/common/textfiles';
import { IFileService, IFileStat } from 'vs/platform/files/common/files';
import { IEditorIdentifier } from 'vs/workbench/common/editor';
import { FileStat } from 'vs/workbench/parts/files/common/explorerModel';
import { ExplorerView } from 'vs/workbench/parts/files/browser/views/explorerView';
import { IUntitledEditorService } from 'vs/workbench/services/untitled/common/untitledEditorService';
import { IWorkbenchEditorService } from 'vs/workbench/services/editor/common/editorService';
import { IEditorGroupService } from 'vs/workbench/services/group/common/groupService';
import { IQuickOpenService } from 'vs/platform/quickOpen/common/quickOpen';
import { IHistoryService } from 'vs/workbench/services/history/common/history';
import { IViewletService } from 'vs/workbench/services/viewlet/browser/viewlet';
import { IInstantiationService, IConstructorSignature2, ServicesAccessor } from 'vs/platform/instantiation/common/instantiation';
import { IMessageService } from 'vs/platform/message/common/message';
import { IWorkspaceContextService } from 'vs/platform/workspace/common/workspace';
import { IModel } from 'vs/editor/common/editorCommon';
import { IWindowsService, IWindowService } from 'vs/platform/windows/common/windows';
import { ITelemetryData } from 'vs/platform/telemetry/common/telemetry';
import { IEnvironmentService } from 'vs/platform/environment/common/environment';
import { ITextModelService, ITextModelContentProvider } from 'vs/editor/common/services/resolverService';
import { IModelService } from 'vs/editor/common/services/modelService';
import { IModeService } from 'vs/editor/common/services/modeService';
export interface IEditableData {
    action: IAction;
    validator: IInputValidator;
}
export interface IFileViewletState {
    actionProvider: IActionProvider;
    getEditableData(stat: IFileStat): IEditableData;
    setEditable(stat: IFileStat, editableData: IEditableData): void;
    clearEditable(stat: IFileStat): void;
}
export declare class BaseErrorReportingAction extends Action {
    private _messageService;
    constructor(id: string, label: string, _messageService: IMessageService);
    readonly messageService: IMessageService;
    protected onError(error: any): void;
    protected onErrorWithRetry(error: any, retry: () => TPromise<any>, extraAction?: Action): void;
}
export declare class BaseFileAction extends BaseErrorReportingAction {
    private _fileService;
    private _textFileService;
    private _element;
    constructor(id: string, label: string, _fileService: IFileService, _messageService: IMessageService, _textFileService: ITextFileService);
    readonly fileService: IFileService;
    readonly textFileService: ITextFileService;
    element: FileStat;
    _isEnabled(): boolean;
    _updateEnablement(): void;
}
export declare class TriggerRenameFileAction extends BaseFileAction {
    static ID: string;
    private tree;
    private renameAction;
    constructor(tree: ITree, element: FileStat, fileService: IFileService, messageService: IMessageService, textFileService: ITextFileService, instantiationService: IInstantiationService);
    validateFileName(parent: IFileStat, name: string): string;
    run(context?: any): TPromise<any>;
}
export declare abstract class BaseRenameAction extends BaseFileAction {
    constructor(id: string, label: string, element: FileStat, fileService: IFileService, messageService: IMessageService, textFileService: ITextFileService);
    run(context?: any): TPromise<any>;
    validateFileName(parent: IFileStat, name: string): string;
    abstract runAction(newName: string): TPromise<any>;
}
export declare class BaseNewAction extends BaseFileAction {
    private presetFolder;
    private tree;
    private isFile;
    private renameAction;
    constructor(id: string, label: string, tree: ITree, isFile: boolean, editableAction: BaseRenameAction, element: FileStat, fileService: IFileService, messageService: IMessageService, textFileService: ITextFileService);
    run(context?: any): TPromise<any>;
}
export declare class NewFileAction extends BaseNewAction {
    constructor(tree: ITree, element: FileStat, fileService: IFileService, messageService: IMessageService, textFileService: ITextFileService, instantiationService: IInstantiationService);
}
export declare class NewFolderAction extends BaseNewAction {
    constructor(tree: ITree, element: FileStat, fileService: IFileService, messageService: IMessageService, textFileService: ITextFileService, instantiationService: IInstantiationService);
}
export declare abstract class BaseGlobalNewAction extends Action {
    private viewletService;
    private instantiationService;
    private messageService;
    private toDispose;
    constructor(id: string, label: string, viewletService: IViewletService, instantiationService: IInstantiationService, messageService: IMessageService);
    run(): TPromise<any>;
    protected abstract getAction(): IConstructorSignature2<ITree, IFileStat, Action>;
    dispose(): void;
}
export declare class GlobalNewUntitledFileAction extends Action {
    private editorService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, editorService: IWorkbenchEditorService);
    run(): TPromise<any>;
}
export declare class GlobalNewFileAction extends BaseGlobalNewAction {
    static ID: string;
    static LABEL: string;
    protected getAction(): IConstructorSignature2<ITree, IFileStat, Action>;
}
export declare class GlobalNewFolderAction extends BaseGlobalNewAction {
    static ID: string;
    static LABEL: string;
    protected getAction(): IConstructorSignature2<ITree, IFileStat, Action>;
}
export declare abstract class BaseCreateAction extends BaseRenameAction {
    validateFileName(parent: IFileStat, name: string): string;
}
export declare class CreateFileAction extends BaseCreateAction {
    private editorService;
    static ID: string;
    static LABEL: string;
    constructor(element: FileStat, fileService: IFileService, editorService: IWorkbenchEditorService, messageService: IMessageService, textFileService: ITextFileService);
    runAction(fileName: string): TPromise<any>;
}
export declare class CreateFolderAction extends BaseCreateAction {
    static ID: string;
    static LABEL: string;
    constructor(element: FileStat, fileService: IFileService, messageService: IMessageService, textFileService: ITextFileService);
    runAction(fileName: string): TPromise<any>;
}
export declare class BaseDeleteFileAction extends BaseFileAction {
    private tree;
    private useTrash;
    private skipConfirm;
    constructor(id: string, label: string, tree: ITree, element: FileStat, useTrash: boolean, fileService: IFileService, messageService: IMessageService, textFileService: ITextFileService);
    run(context?: any): TPromise<any>;
}
export declare class MoveFileToTrashAction extends BaseDeleteFileAction {
    static ID: string;
    constructor(tree: ITree, element: FileStat, fileService: IFileService, messageService: IMessageService, textFileService: ITextFileService);
}
export declare class ImportFileAction extends BaseFileAction {
    private editorService;
    static ID: string;
    private tree;
    constructor(tree: ITree, element: FileStat, clazz: string, fileService: IFileService, editorService: IWorkbenchEditorService, messageService: IMessageService, textFileService: ITextFileService);
    getViewer(): ITree;
    run(context?: any): TPromise<any>;
}
export declare class CopyFileAction extends BaseFileAction {
    static ID: string;
    private tree;
    constructor(tree: ITree, element: FileStat, fileService: IFileService, messageService: IMessageService, textFileService: ITextFileService);
    run(): TPromise<any>;
}
export declare class PasteFileAction extends BaseFileAction {
    private instantiationService;
    static ID: string;
    private tree;
    constructor(tree: ITree, element: FileStat, fileService: IFileService, messageService: IMessageService, textFileService: ITextFileService, instantiationService: IInstantiationService);
    _isEnabled(): boolean;
    run(): TPromise<any>;
}
export declare const pasteIntoFocusedFilesExplorerViewItem: (accessor: ServicesAccessor) => void;
export declare class DuplicateFileAction extends BaseFileAction {
    private editorService;
    private tree;
    private target;
    constructor(tree: ITree, element: FileStat, target: FileStat, fileService: IFileService, editorService: IWorkbenchEditorService, messageService: IMessageService, textFileService: ITextFileService);
    run(): TPromise<any>;
    private findTarget();
    private toCopyName(name, isFolder);
}
export declare class OpenToSideAction extends Action {
    private editorService;
    static ID: string;
    static LABEL: string;
    private tree;
    private resource;
    private preserveFocus;
    constructor(tree: ITree, resource: URI, preserveFocus: boolean, editorService: IWorkbenchEditorService);
    private updateEnablement();
    run(): TPromise<any>;
}
export declare class SelectResourceForCompareAction extends Action {
    private resource;
    private tree;
    constructor(resource: URI, tree: ITree);
    run(): TPromise<any>;
}
export declare class GlobalCompareResourcesAction extends Action {
    private quickOpenService;
    private instantiationService;
    private editorService;
    private historyService;
    private contextService;
    private messageService;
    private environmentService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, quickOpenService: IQuickOpenService, instantiationService: IInstantiationService, editorService: IWorkbenchEditorService, historyService: IHistoryService, contextService: IWorkspaceContextService, messageService: IMessageService, environmentService: IEnvironmentService);
    run(): TPromise<any>;
}
export declare class CompareResourcesAction extends Action {
    private editorService;
    private tree;
    private resource;
    constructor(resource: URI, tree: ITree, editorService: IWorkbenchEditorService, contextService: IWorkspaceContextService, environmentService: IEnvironmentService);
    private static computeLabel(resource, contextService, environmentService);
    _isEnabled(): boolean;
    run(): TPromise<any>;
}
export declare class RefreshViewExplorerAction extends Action {
    constructor(explorerView: ExplorerView, clazz: string);
}
export declare abstract class BaseSaveFileAction extends BaseErrorReportingAction {
    constructor(id: string, label: string, messageService: IMessageService);
    run(context?: any): TPromise<boolean>;
    protected abstract doRun(context?: any): TPromise<boolean>;
}
export declare abstract class BaseSaveOneFileAction extends BaseSaveFileAction {
    private editorService;
    private textFileService;
    private editorGroupService;
    private untitledEditorService;
    private resource;
    constructor(id: string, label: string, editorService: IWorkbenchEditorService, textFileService: ITextFileService, editorGroupService: IEditorGroupService, untitledEditorService: IUntitledEditorService, messageService: IMessageService);
    abstract isSaveAs(): boolean;
    setResource(resource: URI): void;
    protected doRun(context: any): TPromise<boolean>;
}
export declare class SaveFileAction extends BaseSaveOneFileAction {
    static ID: string;
    static LABEL: string;
    isSaveAs(): boolean;
}
export declare class SaveFileAsAction extends BaseSaveOneFileAction {
    static ID: string;
    static LABEL: string;
    isSaveAs(): boolean;
}
export declare abstract class BaseSaveAllAction extends BaseSaveFileAction {
    protected editorService: IWorkbenchEditorService;
    private editorGroupService;
    private textFileService;
    private untitledEditorService;
    private toDispose;
    private lastIsDirty;
    constructor(id: string, label: string, editorService: IWorkbenchEditorService, editorGroupService: IEditorGroupService, textFileService: ITextFileService, untitledEditorService: IUntitledEditorService, messageService: IMessageService);
    protected abstract getSaveAllArguments(context?: any): any;
    protected abstract includeUntitled(): boolean;
    private registerListeners();
    private updateEnablement(isDirty);
    protected doRun(context: any): TPromise<boolean>;
    dispose(): void;
}
export declare class SaveAllAction extends BaseSaveAllAction {
    static ID: string;
    static LABEL: string;
    readonly class: string;
    protected getSaveAllArguments(): boolean;
    protected includeUntitled(): boolean;
}
export declare class SaveAllInGroupAction extends BaseSaveAllAction {
    static ID: string;
    static LABEL: string;
    readonly class: string;
    protected getSaveAllArguments(editorIdentifier: IEditorIdentifier): any;
    protected includeUntitled(): boolean;
}
export declare class SaveFilesAction extends BaseSaveAllAction {
    static ID: string;
    static LABEL: string;
    protected getSaveAllArguments(): boolean;
    protected includeUntitled(): boolean;
}
export declare class RevertFileAction extends Action {
    private editorService;
    private textFileService;
    static ID: string;
    static LABEL: string;
    private resource;
    constructor(id: string, label: string, editorService: IWorkbenchEditorService, textFileService: ITextFileService);
    setResource(resource: URI): void;
    run(): TPromise<any>;
}
export declare class FocusOpenEditorsView extends Action {
    private viewletService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, viewletService: IViewletService);
    run(): TPromise<any>;
}
export declare class FocusFilesExplorer extends Action {
    private viewletService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, viewletService: IViewletService);
    run(): TPromise<any>;
}
export declare class ShowActiveFileInExplorer extends Action {
    private editorService;
    private instantiationService;
    private messageService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, editorService: IWorkbenchEditorService, instantiationService: IInstantiationService, messageService: IMessageService);
    run(): TPromise<any>;
}
export declare class CollapseExplorerView extends Action {
    private viewletService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, viewletService: IViewletService);
    run(): TPromise<any>;
}
export declare class RefreshExplorerView extends Action {
    private viewletService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, viewletService: IViewletService);
    run(): TPromise<any>;
}
export declare class OpenFileAction extends Action {
    private editorService;
    private windowService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, editorService: IWorkbenchEditorService, windowService: IWindowService);
    run(event?: any, data?: ITelemetryData): TPromise<any>;
}
export declare class ShowOpenedFileInNewWindow extends Action {
    private windowsService;
    private editorService;
    private messageService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, windowsService: IWindowsService, editorService: IWorkbenchEditorService, messageService: IMessageService);
    run(): TPromise<any>;
}
export declare class RevealInOSAction extends Action {
    private resource;
    private instantiationService;
    static LABEL: string;
    constructor(resource: URI, instantiationService: IInstantiationService);
    run(): TPromise<any>;
}
export declare class GlobalRevealInOSAction extends Action {
    private editorService;
    private instantiationService;
    private messageService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, editorService: IWorkbenchEditorService, instantiationService: IInstantiationService, messageService: IMessageService);
    run(): TPromise<any>;
}
export declare class CopyPathAction extends Action {
    private resource;
    private instantiationService;
    static LABEL: string;
    constructor(resource: URI, instantiationService: IInstantiationService);
    run(): TPromise<any>;
}
export declare class GlobalCopyPathAction extends Action {
    private editorService;
    private editorGroupService;
    private messageService;
    private instantiationService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, editorService: IWorkbenchEditorService, editorGroupService: IEditorGroupService, messageService: IMessageService, instantiationService: IInstantiationService);
    run(): TPromise<any>;
}
export declare function validateFileName(parent: IFileStat, name: string, allowOverwriting?: boolean): string;
export declare function getWellFormedFileName(filename: string): string;
export declare class CompareWithSavedAction extends Action implements ITextModelContentProvider {
    private editorService;
    private textFileService;
    private fileService;
    private modeService;
    private modelService;
    static ID: string;
    static LABEL: string;
    private static SCHEME;
    private resource;
    private fileWatcher;
    constructor(id: string, label: string, editorService: IWorkbenchEditorService, textFileService: ITextFileService, fileService: IFileService, messageService: IMessageService, modeService: IModeService, modelService: IModelService, textModelService: ITextModelService);
    setResource(resource: URI): void;
    run(): TPromise<any>;
    provideTextContent(resource: URI): TPromise<IModel>;
    private resolveEditorModel(resource, createAsNeeded?);
    dispose(): void;
}
