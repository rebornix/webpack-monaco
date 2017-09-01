import { TPromise } from 'vs/base/common/winjs.base';
import { BaseEditor } from 'vs/workbench/browser/parts/editor/baseEditor';
import { EditorInput, EditorOptions } from 'vs/workbench/common/editor';
import { IUntitledEditorService } from 'vs/workbench/services/untitled/common/untitledEditorService';
import { IWorkbenchEditorService, IResourceInputType } from 'vs/workbench/services/editor/common/editorService';
import { IEditorInput, IEditorOptions, ITextEditorOptions, Position, Direction, IEditor } from 'vs/platform/editor/common/editor';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { IWorkspaceContextService } from 'vs/platform/workspace/common/workspace';
import { IEnvironmentService } from 'vs/platform/environment/common/environment';
export interface IEditorPart {
    openEditor(input?: IEditorInput, options?: IEditorOptions | ITextEditorOptions, sideBySide?: boolean): TPromise<BaseEditor>;
    openEditor(input?: IEditorInput, options?: IEditorOptions | ITextEditorOptions, position?: Position): TPromise<BaseEditor>;
    openEditors(editors: {
        input: IEditorInput;
        position: Position;
        options?: IEditorOptions | ITextEditorOptions;
    }[]): TPromise<BaseEditor[]>;
    replaceEditors(editors: {
        toReplace: IEditorInput;
        replaceWith: IEditorInput;
        options?: IEditorOptions | ITextEditorOptions;
    }[], position?: Position): TPromise<BaseEditor[]>;
    closeEditor(position: Position, input: IEditorInput): TPromise<void>;
    closeEditors(position: Position, filter?: {
        except?: IEditorInput;
        direction?: Direction;
        unmodifiedOnly?: boolean;
    }): TPromise<void>;
    closeAllEditors(except?: Position): TPromise<void>;
    getActiveEditor(): BaseEditor;
    getVisibleEditors(): IEditor[];
    getActiveEditorInput(): IEditorInput;
}
export declare class WorkbenchEditorService implements IWorkbenchEditorService {
    private untitledEditorService;
    private workspaceContextService;
    private instantiationService;
    private environmentService;
    _serviceBrand: any;
    private static CACHE;
    private editorPart;
    private fileInputFactory;
    constructor(editorPart: IEditorPart | IWorkbenchEditorService, untitledEditorService: IUntitledEditorService, workspaceContextService: IWorkspaceContextService, instantiationService: IInstantiationService, environmentService: IEnvironmentService);
    getActiveEditor(): IEditor;
    getActiveEditorInput(): IEditorInput;
    getVisibleEditors(): IEditor[];
    isVisible(input: IEditorInput, includeSideBySide: boolean): boolean;
    openEditor(input: IEditorInput, options?: IEditorOptions, sideBySide?: boolean): TPromise<IEditor>;
    openEditor(input: IEditorInput, options?: IEditorOptions, position?: Position): TPromise<IEditor>;
    openEditor(input: IResourceInputType, position?: Position): TPromise<IEditor>;
    openEditor(input: IResourceInputType, sideBySide?: boolean): TPromise<IEditor>;
    private toOptions(options?);
    /**
     * Allow subclasses to implement their own behavior for opening editor (see below).
     */
    protected doOpenEditor(input: IEditorInput, options?: EditorOptions, sideBySide?: boolean): TPromise<IEditor>;
    protected doOpenEditor(input: IEditorInput, options?: EditorOptions, position?: Position): TPromise<IEditor>;
    openEditors(editors: {
        input: IResourceInputType;
        position: Position;
    }[]): TPromise<IEditor[]>;
    openEditors(editors: {
        input: IEditorInput;
        position: Position;
        options?: IEditorOptions;
    }[]): TPromise<IEditor[]>;
    replaceEditors(editors: {
        toReplace: IResourceInputType;
        replaceWith: IResourceInputType;
    }[], position?: Position): TPromise<IEditor[]>;
    replaceEditors(editors: {
        toReplace: IEditorInput;
        replaceWith: IEditorInput;
        options?: IEditorOptions;
    }[], position?: Position): TPromise<IEditor[]>;
    closeEditor(position: Position, input: IEditorInput): TPromise<void>;
    protected doCloseEditor(position: Position, input: IEditorInput): TPromise<void>;
    closeEditors(position: Position, filter?: {
        except?: IEditorInput;
        direction?: Direction;
        unmodifiedOnly?: boolean;
    }): TPromise<void>;
    closeAllEditors(except?: Position): TPromise<void>;
    createInput(input: IEditorInput): EditorInput;
    createInput(input: IResourceInputType): EditorInput;
    private createOrGet(resource, instantiationService, label, description, encoding?);
    private toDiffLabel(res1, res2, context, environment);
}
export interface IEditorOpenHandler {
    (input: IEditorInput, options?: EditorOptions, sideBySide?: boolean): TPromise<BaseEditor>;
    (input: IEditorInput, options?: EditorOptions, position?: Position): TPromise<BaseEditor>;
}
export interface IEditorCloseHandler {
    (position: Position, input: IEditorInput): TPromise<void>;
}
/**
 * Subclass of workbench editor service that delegates all calls to the provided editor service. Subclasses can choose to override the behavior
 * of openEditor() and closeEditor() by providing a handler.
 *
 * This gives clients a chance to override the behavior of openEditor() and closeEditor().
 */
export declare class DelegatingWorkbenchEditorService extends WorkbenchEditorService {
    private editorOpenHandler;
    private editorCloseHandler;
    constructor(untitledEditorService: IUntitledEditorService, instantiationService: IInstantiationService, workspaceContextService: IWorkspaceContextService, editorService: IWorkbenchEditorService, environmentService: IEnvironmentService);
    setEditorOpenHandler(handler: IEditorOpenHandler): void;
    setEditorCloseHandler(handler: IEditorCloseHandler): void;
    protected doOpenEditor(input: IEditorInput, options?: EditorOptions, sideBySide?: boolean): TPromise<IEditor>;
    protected doOpenEditor(input: IEditorInput, options?: EditorOptions, position?: Position): TPromise<IEditor>;
    protected doCloseEditor(position: Position, input: IEditorInput): TPromise<void>;
}
