import { TPromise } from 'vs/base/common/winjs.base';
import URI from 'vs/base/common/uri';
import Event from 'vs/base/common/event';
import { IDisposable } from 'vs/base/common/lifecycle';
import { IEncodingSupport, ConfirmResult } from 'vs/workbench/common/editor';
import { IBaseStat, IResolveContentOptions } from 'vs/platform/files/common/files';
import { ITextEditorModel } from 'vs/editor/common/services/resolverService';
import { IRawTextSource } from 'vs/editor/common/model/textSource';
/**
 * The save error handler can be installed on the text text file editor model to install code that executes when save errors occur.
 */
export interface ISaveErrorHandler {
    /**
     * Called whenever a save fails.
     */
    onSaveError(error: Error, model: ITextFileEditorModel): void;
}
export interface ISaveParticipant {
    /**
     * Participate in a save of a model. Allows to change the model before it is being saved to disk.
     */
    participate(model: ITextFileEditorModel, env: {
        reason: SaveReason;
    }): void;
}
/**
 * States the text text file editor model can be in.
 */
export declare enum ModelState {
    SAVED = 0,
    DIRTY = 1,
    PENDING_SAVE = 2,
    /**
     * A model is in conflict mode when changes cannot be saved because the
     * underlying file has changed. Models in conflict mode are always dirty.
     */
    CONFLICT = 3,
    /**
     * A model is in orphan state when the underlying file has been deleted.
     */
    ORPHAN = 4,
    /**
     * Any error that happens during a save that is not causing the CONFLICT state.
     * Models in error mode are always diry.
     */
    ERROR = 5,
}
export declare enum StateChange {
    DIRTY = 0,
    SAVING = 1,
    SAVE_ERROR = 2,
    SAVED = 3,
    REVERTED = 4,
    ENCODING = 5,
    CONTENT_CHANGE = 6,
    ORPHANED_CHANGE = 7,
}
export declare class TextFileModelChangeEvent {
    private _resource;
    private _kind;
    constructor(model: ITextFileEditorModel, kind: StateChange);
    readonly resource: URI;
    readonly kind: StateChange;
}
export declare const TEXT_FILE_SERVICE_ID = "textFileService";
export interface ITextFileOperationResult {
    results: IResult[];
}
export interface IResult {
    source: URI;
    target?: URI;
    success?: boolean;
}
export interface IAutoSaveConfiguration {
    autoSaveDelay: number;
    autoSaveFocusChange: boolean;
    autoSaveApplicationChange: boolean;
}
export declare enum AutoSaveMode {
    OFF = 0,
    AFTER_SHORT_DELAY = 1,
    AFTER_LONG_DELAY = 2,
    ON_FOCUS_CHANGE = 3,
    ON_WINDOW_CHANGE = 4,
}
export declare enum SaveReason {
    EXPLICIT = 1,
    AUTO = 2,
    FOCUS_CHANGE = 3,
    WINDOW_CHANGE = 4,
}
export declare const ITextFileService: {
    (...args: any[]): void;
    type: ITextFileService;
};
export interface IRawTextContent extends IBaseStat {
    /**
     * The line grouped content of a text file.
     */
    value: IRawTextSource;
    /**
     * The line grouped logical hash of a text file.
     */
    valueLogicalHash: string;
    /**
     * The encoding of the content if known.
     */
    encoding: string;
}
export interface IModelLoadOrCreateOptions {
    encoding?: string;
    reload?: boolean;
}
export interface ITextFileEditorModelManager {
    onModelDisposed: Event<URI>;
    onModelContentChanged: Event<TextFileModelChangeEvent>;
    onModelEncodingChanged: Event<TextFileModelChangeEvent>;
    onModelDirty: Event<TextFileModelChangeEvent>;
    onModelSaveError: Event<TextFileModelChangeEvent>;
    onModelSaved: Event<TextFileModelChangeEvent>;
    onModelReverted: Event<TextFileModelChangeEvent>;
    onModelOrphanedChanged: Event<TextFileModelChangeEvent>;
    onModelsDirty: Event<TextFileModelChangeEvent[]>;
    onModelsSaveError: Event<TextFileModelChangeEvent[]>;
    onModelsSaved: Event<TextFileModelChangeEvent[]>;
    onModelsReverted: Event<TextFileModelChangeEvent[]>;
    get(resource: URI): ITextFileEditorModel;
    getAll(resource?: URI): ITextFileEditorModel[];
    loadOrCreate(resource: URI, options?: IModelLoadOrCreateOptions): TPromise<ITextFileEditorModel>;
    disposeModel(model: ITextFileEditorModel): void;
}
export interface ISaveOptions {
    force?: boolean;
    reason?: SaveReason;
    overwriteReadonly?: boolean;
    overwriteEncoding?: boolean;
    skipSaveParticipants?: boolean;
}
export interface ITextFileEditorModel extends ITextEditorModel, IEncodingSupport {
    onDidContentChange: Event<StateChange>;
    onDidStateChange: Event<StateChange>;
    getVersionId(): number;
    getResource(): URI;
    hasState(state: ModelState): boolean;
    getETag(): string;
    updatePreferredEncoding(encoding: string): void;
    save(options?: ISaveOptions): TPromise<void>;
    load(): TPromise<ITextFileEditorModel>;
    revert(soft?: boolean): TPromise<void>;
    getValue(): string;
    isDirty(): boolean;
    isResolved(): boolean;
    isDisposed(): boolean;
}
export interface IRevertOptions {
    /**
     *  Forces to load the contents from disk again even if the file is not dirty.
     */
    force?: boolean;
    /**
     * A soft revert will clear dirty state of a file but not attempt to load the contents from disk.
     */
    soft?: boolean;
}
export interface ITextFileService extends IDisposable {
    _serviceBrand: any;
    onAutoSaveConfigurationChange: Event<IAutoSaveConfiguration>;
    onFilesAssociationChange: Event<void>;
    /**
     * Access to the manager of text file editor models providing further methods to work with them.
     */
    models: ITextFileEditorModelManager;
    /**
     * Resolve the contents of a file identified by the resource.
     */
    resolveTextContent(resource: URI, options?: IResolveContentOptions): TPromise<IRawTextContent>;
    /**
     * A resource is dirty if it has unsaved changes or is an untitled file not yet saved.
     *
     * @param resource the resource to check for being dirty. If it is not specified, will check for
     * all dirty resources.
     */
    isDirty(resource?: URI): boolean;
    /**
     * Returns all resources that are currently dirty matching the provided resources or all dirty resources.
     *
     * @param resources the resources to check for being dirty. If it is not specified, will check for
     * all dirty resources.
     */
    getDirty(resources?: URI[]): URI[];
    /**
     * Saves the resource.
     *
     * @param resource the resource to save
     * @return true if the resource was saved.
     */
    save(resource: URI, options?: ISaveOptions): TPromise<boolean>;
    /**
     * Saves the provided resource asking the user for a file name.
     *
     * @param resource the resource to save as.
     * @return true if the file was saved.
     */
    saveAs(resource: URI, targetResource?: URI): TPromise<URI>;
    /**
     * Saves the set of resources and returns a promise with the operation result.
     *
     * @param resources can be null to save all.
     * @param includeUntitled to save all resources and optionally exclude untitled ones.
     */
    saveAll(includeUntitled?: boolean, options?: ISaveOptions): TPromise<ITextFileOperationResult>;
    saveAll(resources: URI[], options?: ISaveOptions): TPromise<ITextFileOperationResult>;
    /**
     * Reverts the provided resource.
     *
     * @param resource the resource of the file to revert.
     * @param force to force revert even when the file is not dirty
     */
    revert(resource: URI, options?: IRevertOptions): TPromise<boolean>;
    /**
     * Reverts all the provided resources and returns a promise with the operation result.
     */
    revertAll(resources?: URI[], options?: IRevertOptions): TPromise<ITextFileOperationResult>;
    /**
     * Brings up the confirm dialog to either save, don't save or cancel.
     *
     * @param resources the resources of the files to ask for confirmation or null if
     * confirming for all dirty resources.
     */
    confirmSave(resources?: URI[]): ConfirmResult;
    /**
     * Convinient fast access to the current auto save mode.
     */
    getAutoSaveMode(): AutoSaveMode;
    /**
     * Convinient fast access to the raw configured auto save settings.
     */
    getAutoSaveConfiguration(): IAutoSaveConfiguration;
    /**
     * Convinient fast access to the hot exit file setting.
     */
    isHotExitEnabled: boolean;
}
