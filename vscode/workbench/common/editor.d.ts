import { TPromise } from 'vs/base/common/winjs.base';
import Event, { Emitter } from 'vs/base/common/event';
import URI from 'vs/base/common/uri';
import { IDisposable, Disposable } from 'vs/base/common/lifecycle';
import { IEditor, IModel } from 'vs/editor/common/editorCommon';
import { IEditorInput, IEditorModel, IEditorOptions, ITextEditorOptions, IBaseResourceInput, Position, Verbosity } from 'vs/platform/editor/common/editor';
import { SyncDescriptor } from 'vs/platform/instantiation/common/descriptors';
import { IInstantiationService, IConstructorSignature0 } from 'vs/platform/instantiation/common/instantiation';
import { RawContextKey } from 'vs/platform/contextkey/common/contextkey';
export declare const TextCompareEditorVisible: RawContextKey<boolean>;
export declare enum ConfirmResult {
    SAVE = 0,
    DONT_SAVE = 1,
    CANCEL = 2,
}
export interface IEditorDescriptor {
    getId(): string;
    getName(): string;
    describes(obj: any): boolean;
}
export declare const Extensions: {
    Editors: string;
};
/**
 * Text diff editor id.
 */
export declare const TEXT_DIFF_EDITOR_ID = "workbench.editors.textDiffEditor";
/**
 * Binary diff editor id.
 */
export declare const BINARY_DIFF_EDITOR_ID = "workbench.editors.binaryResourceDiffEditor";
export interface IFileInputFactory {
    createFileInput(resource: URI, encoding: string, instantiationService: IInstantiationService): IFileEditorInput;
}
export interface IEditorRegistry {
    /**
     * Registers an editor to the platform for the given input type. The second parameter also supports an
     * array of input classes to be passed in. If the more than one editor is registered for the same editor
     * input, the input itself will be asked which editor it prefers if this method is provided. Otherwise
     * the first editor in the list will be returned.
     *
     * @param editorInputDescriptor a constructor function that returns an instance of EditorInput for which the
     * registered editor should be used for.
     */
    registerEditor(descriptor: IEditorDescriptor, editorInputDescriptor: SyncDescriptor<EditorInput>): void;
    registerEditor(descriptor: IEditorDescriptor, editorInputDescriptor: SyncDescriptor<EditorInput>[]): void;
    /**
     * Returns the editor descriptor for the given input or null if none.
     */
    getEditor(input: EditorInput): IEditorDescriptor;
    /**
     * Returns the editor descriptor for the given identifier or null if none.
     */
    getEditorById(editorId: string): IEditorDescriptor;
    /**
     * Returns an array of registered editors known to the platform.
     */
    getEditors(): IEditorDescriptor[];
    /**
     * Registers the file input factory to use for file inputs.
     */
    registerFileInputFactory(factory: IFileInputFactory): void;
    /**
     * Returns the file input factory to use for file inputs.
     */
    getFileInputFactory(): IFileInputFactory;
    /**
     * Registers a editor input factory for the given editor input to the registry. An editor input factory
     * is capable of serializing and deserializing editor inputs from string data.
     *
     * @param editorInputId the identifier of the editor input
     * @param factory the editor input factory for serialization/deserialization
     */
    registerEditorInputFactory(editorInputId: string, ctor: IConstructorSignature0<IEditorInputFactory>): void;
    /**
     * Returns the editor input factory for the given editor input.
     *
     * @param editorInputId the identifier of the editor input
     */
    getEditorInputFactory(editorInputId: string): IEditorInputFactory;
    setInstantiationService(service: IInstantiationService): void;
}
export interface IEditorInputFactory {
    /**
     * Returns a string representation of the provided editor input that contains enough information
     * to deserialize back to the original editor input from the deserialize() method.
     */
    serialize(editorInput: EditorInput): string;
    /**
     * Returns an editor input from the provided serialized form of the editor input. This form matches
     * the value returned from the serialize() method.
     */
    deserialize(instantiationService: IInstantiationService, serializedEditorInput: string): EditorInput;
}
/**
 * Editor inputs are lightweight objects that can be passed to the workbench API to open inside the editor part.
 * Each editor input is mapped to an editor that is capable of opening it through the Platform facade.
 */
export declare abstract class EditorInput implements IEditorInput {
    private _onDispose;
    protected _onDidChangeDirty: Emitter<void>;
    protected _onDidChangeLabel: Emitter<void>;
    private disposed;
    constructor();
    /**
     * Fired when the dirty state of this input changes.
     */
    readonly onDidChangeDirty: Event<void>;
    /**
     * Fired when the label this input changes.
     */
    readonly onDidChangeLabel: Event<void>;
    /**
     * Fired when the model gets disposed.
     */
    readonly onDispose: Event<void>;
    /**
     * Returns the name of this input that can be shown to the user. Examples include showing the name of the input
     * above the editor area when the input is shown.
     */
    getName(): string;
    /**
     * Returns the description of this input that can be shown to the user. Examples include showing the description of
     * the input above the editor area to the side of the name of the input.
     */
    getDescription(): string;
    getTitle(verbosity?: Verbosity): string;
    /**
     * Returns the unique type identifier of this input.
     */
    abstract getTypeId(): string;
    /**
     * Returns the preferred editor for this input. A list of candidate editors is passed in that whee registered
     * for the input. This allows subclasses to decide late which editor to use for the input on a case by case basis.
     */
    getPreferredEditorId(candidates: string[]): string;
    /**
     * Returns a descriptor suitable for telemetry events or null if none is available.
     *
     * Subclasses should extend if they can contribute.
     */
    getTelemetryDescriptor(): object;
    /**
     * Returns a type of EditorModel that represents the resolved input. Subclasses should
     * override to provide a meaningful model. The optional second argument allows to specify
     * if the EditorModel should be refreshed before returning it. Depending on the implementation
     * this could mean to refresh the editor model contents with the version from disk.
     */
    abstract resolve(refresh?: boolean): TPromise<IEditorModel>;
    /**
     * An editor that is dirty will be asked to be saved once it closes.
     */
    isDirty(): boolean;
    /**
     * Subclasses should bring up a proper dialog for the user if the editor is dirty and return the result.
     */
    confirmSave(): ConfirmResult;
    /**
     * Saves the editor if it is dirty. Subclasses return a promise with a boolean indicating the success of the operation.
     */
    save(): TPromise<boolean>;
    /**
     * Reverts the editor if it is dirty. Subclasses return a promise with a boolean indicating the success of the operation.
     */
    revert(): TPromise<boolean>;
    /**
     * Called when this input is no longer opened in any editor. Subclasses can free resources as needed.
     */
    close(): void;
    /**
     * Subclasses can set this to false if it does not make sense to split the editor input.
     */
    supportsSplitEditor(): boolean;
    /**
     * Returns true if this input is identical to the otherInput.
     */
    matches(otherInput: any): boolean;
    /**
     * Called when an editor input is no longer needed. Allows to free up any resources taken by
     * resolving the editor input.
     */
    dispose(): void;
    /**
     * Returns whether this input was disposed or not.
     */
    isDisposed(): boolean;
}
export declare enum EncodingMode {
    /**
     * Instructs the encoding support to encode the current input with the provided encoding
     */
    Encode = 0,
    /**
     * Instructs the encoding support to decode the current input with the provided encoding
     */
    Decode = 1,
}
export interface IEncodingSupport {
    /**
     * Gets the encoding of the input if known.
     */
    getEncoding(): string;
    /**
     * Sets the encoding for the input for saving.
     */
    setEncoding(encoding: string, mode: EncodingMode): void;
}
/**
 * This is a tagging interface to declare an editor input being capable of dealing with files. It is only used in the editor registry
 * to register this kind of input to the platform.
 */
export interface IFileEditorInput extends IEditorInput, IEncodingSupport {
    /**
     * Gets the absolute file resource URI this input is about.
     */
    getResource(): URI;
    /**
     * Sets the preferred encodingt to use for this input.
     */
    setPreferredEncoding(encoding: string): void;
    /**
     * Forces this file input to open as binary instead of text.
     */
    setForceOpenAsBinary(): void;
}
/**
 * Side by side editor inputs that have a master and details side.
 */
export declare class SideBySideEditorInput extends EditorInput {
    private name;
    private description;
    private _details;
    private _master;
    static ID: string;
    private _toUnbind;
    constructor(name: string, description: string, _details: EditorInput, _master: EditorInput);
    readonly master: EditorInput;
    readonly details: EditorInput;
    isDirty(): boolean;
    confirmSave(): ConfirmResult;
    save(): TPromise<boolean>;
    revert(): TPromise<boolean>;
    getTelemetryDescriptor(): object;
    private registerListeners();
    readonly toUnbind: IDisposable[];
    resolve(refresh?: boolean): TPromise<EditorModel>;
    getTypeId(): string;
    getName(): string;
    getDescription(): string;
    supportsSplitEditor(): boolean;
    matches(otherInput: any): boolean;
    dispose(): void;
}
export interface ITextEditorModel extends IEditorModel {
    textEditorModel: IModel;
}
/**
 * The editor model is the heavyweight counterpart of editor input. Depending on the editor input, it
 * connects to the disk to retrieve content and may allow for saving it back or reverting it. Editor models
 * are typically cached for some while because they are expensive to construct.
 */
export declare class EditorModel extends Disposable implements IEditorModel {
    private _onDispose;
    constructor();
    /**
     * Fired when the model gets disposed.
     */
    readonly onDispose: Event<void>;
    /**
     * Causes this model to load returning a promise when loading is completed.
     */
    load(): TPromise<EditorModel>;
    /**
     * Returns whether this model was loaded or not.
     */
    isResolved(): boolean;
    /**
     * Subclasses should implement to free resources that have been claimed through loading.
     */
    dispose(): void;
}
/**
 * The editor options is the base class of options that can be passed in when opening an editor.
 */
export declare class EditorOptions implements IEditorOptions {
    /**
     * Helper to create EditorOptions inline.
     */
    static create(settings: IEditorOptions): EditorOptions;
    /**
     * Tells the editor to not receive keyboard focus when the editor is being opened. By default,
     * the editor will receive keyboard focus on open.
     */
    preserveFocus: boolean;
    /**
     * Tells the editor to replace the editor input in the editor even if it is identical to the one
     * already showing. By default, the editor will not replace the input if it is identical to the
     * one showing.
     */
    forceOpen: boolean;
    /**
     * Will reveal the editor if it is already opened and visible in any of the opened editor groups.
     */
    revealIfVisible: boolean;
    /**
     * Will reveal the editor if it is already opened (even when not visible) in any of the opened editor groups.
     */
    revealIfOpened: boolean;
    /**
     * An editor that is pinned remains in the editor stack even when another editor is being opened.
     * An editor that is not pinned will always get replaced by another editor that is not pinned.
     */
    pinned: boolean;
    /**
     * The index in the document stack where to insert the editor into when opening.
     */
    index: number;
    /**
     * An active editor that is opened will show its contents directly. Set to true to open an editor
     * in the background.
     */
    inactive: boolean;
}
/**
 * Base Text Editor Options.
 */
export declare class TextEditorOptions extends EditorOptions {
    private startLineNumber;
    private startColumn;
    private endLineNumber;
    private endColumn;
    private revealInCenterIfOutsideViewport;
    private editorViewState;
    static from(input?: IBaseResourceInput): TextEditorOptions;
    /**
     * Helper to convert options bag to real class
     */
    static create(options?: ITextEditorOptions): TextEditorOptions;
    /**
     * Returns if this options object has objects defined for the editor.
     */
    hasOptionsDefined(): boolean;
    /**
     * Tells the editor to set show the given selection when the editor is being opened.
     */
    selection(startLineNumber: number, startColumn: number, endLineNumber?: number, endColumn?: number): EditorOptions;
    /**
     * Create a TextEditorOptions inline to be used when the editor is opening.
     */
    static fromEditor(editor: IEditor, settings?: IEditorOptions): TextEditorOptions;
    /**
     * Apply the view state or selection to the given editor.
     *
     * @return if something was applied
     */
    apply(editor: IEditor): boolean;
    private applyViewState(editor);
}
export interface IStacksModelChangeEvent {
    group: IEditorGroup;
    editor?: IEditorInput;
    structural?: boolean;
}
export interface IEditorStacksModel {
    onModelChanged: Event<IStacksModelChangeEvent>;
    onWillCloseEditor: Event<IEditorCloseEvent>;
    onEditorClosed: Event<IEditorCloseEvent>;
    groups: IEditorGroup[];
    activeGroup: IEditorGroup;
    isActive(group: IEditorGroup): boolean;
    getGroup(id: GroupIdentifier): IEditorGroup;
    positionOfGroup(group: IEditorGroup): Position;
    groupAt(position: Position): IEditorGroup;
    next(jumpGroups: boolean, cycleAtEnd?: boolean): IEditorIdentifier;
    previous(jumpGroups: boolean, cycleAtStart?: boolean): IEditorIdentifier;
    isOpen(resource: URI): boolean;
    toString(): string;
}
export interface IEditorGroup {
    id: GroupIdentifier;
    label: string;
    count: number;
    activeEditor: IEditorInput;
    previewEditor: IEditorInput;
    getEditor(index: number): IEditorInput;
    getEditor(resource: URI): IEditorInput;
    indexOf(editor: IEditorInput): number;
    contains(editorOrResource: IEditorInput | URI): boolean;
    getEditors(mru?: boolean): IEditorInput[];
    isActive(editor: IEditorInput): boolean;
    isPreview(editor: IEditorInput): boolean;
    isPinned(index: number): boolean;
    isPinned(editor: IEditorInput): boolean;
}
export interface IEditorIdentifier {
    group: IEditorGroup;
    editor: IEditorInput;
}
export interface IEditorContext extends IEditorIdentifier {
    event?: any;
}
export interface IEditorCloseEvent extends IEditorIdentifier {
    pinned: boolean;
    index: number;
}
export declare type GroupIdentifier = number;
export declare const EditorOpenPositioning: {
    LEFT: string;
    RIGHT: string;
    FIRST: string;
    LAST: string;
};
export interface IWorkbenchEditorConfiguration {
    workbench: {
        editor: {
            showTabs: boolean;
            tabCloseButton: 'left' | 'right' | 'off';
            showIcons: boolean;
            enablePreview: boolean;
            enablePreviewFromQuickOpen: boolean;
            closeOnFileDelete: boolean;
            openPositioning: 'left' | 'right' | 'first' | 'last';
            revealIfOpen: boolean;
            swipeToNavigate: boolean;
        };
    };
}
export declare const ActiveEditorMovePositioning: {
    FIRST: string;
    LAST: string;
    LEFT: string;
    RIGHT: string;
    CENTER: string;
    POSITION: string;
};
export declare const ActiveEditorMovePositioningBy: {
    TAB: string;
    GROUP: string;
};
export interface ActiveEditorMoveArguments {
    to?: string;
    by?: string;
    value?: number;
}
export declare const EditorCommands: {
    MoveActiveEditor: string;
};
export interface IResourceOptions {
    supportSideBySide?: boolean;
    filter?: 'file' | 'untitled' | ['file', 'untitled'] | ['untitled', 'file'];
}
export declare function hasResource(editor: IEditorInput, options?: IResourceOptions): boolean;
export declare function toResource(editor: IEditorInput, options?: IResourceOptions): URI;
