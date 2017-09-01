import Event from 'vs/base/common/event';
import { TPromise } from 'vs/base/common/winjs.base';
import URI from 'vs/base/common/uri';
import { IMode } from 'vs/editor/common/modes';
import { ILifecycleService } from 'vs/platform/lifecycle/common/lifecycle';
import { IWorkspaceContextService } from 'vs/platform/workspace/common/workspace';
import { IEnvironmentService } from 'vs/platform/environment/common/environment';
import { ITextFileService, ModelState, ITextFileEditorModel, ISaveOptions, ISaveErrorHandler, ISaveParticipant, StateChange } from 'vs/workbench/services/textfile/common/textfiles';
import { EncodingMode } from 'vs/workbench/common/editor';
import { BaseTextEditorModel } from 'vs/workbench/common/editor/textEditorModel';
import { IBackupFileService } from 'vs/workbench/services/backup/common/backup';
import { IFileService, IFileStat } from 'vs/platform/files/common/files';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { IMessageService } from 'vs/platform/message/common/message';
import { IModeService } from 'vs/editor/common/services/modeService';
import { IModelService } from 'vs/editor/common/services/modelService';
import { ITelemetryService } from 'vs/platform/telemetry/common/telemetry';
/**
 * The text file editor model listens to changes to its underlying code editor model and saves these changes through the file service back to the disk.
 */
export declare class TextFileEditorModel extends BaseTextEditorModel implements ITextFileEditorModel {
    private messageService;
    private fileService;
    private lifecycleService;
    private instantiationService;
    private telemetryService;
    private textFileService;
    private backupFileService;
    private environmentService;
    private contextService;
    static ID: string;
    static DEFAULT_CONTENT_CHANGE_BUFFER_DELAY: number;
    static DEFAULT_ORPHANED_CHANGE_BUFFER_DELAY: number;
    private static saveErrorHandler;
    private static saveParticipant;
    private resource;
    private contentEncoding;
    private preferredEncoding;
    private dirty;
    private versionId;
    private bufferSavedVersionId;
    private lastResolvedDiskStat;
    private toDispose;
    private blockModelContentChange;
    private autoSaveAfterMillies;
    private autoSaveAfterMilliesEnabled;
    private autoSavePromise;
    private contentChangeEventScheduler;
    private orphanedChangeEventScheduler;
    private saveSequentializer;
    private disposed;
    private lastSaveAttemptTime;
    private createTextEditorModelPromise;
    private _onDidContentChange;
    private _onDidStateChange;
    private inConflictMode;
    private inOrphanMode;
    private inErrorMode;
    constructor(resource: URI, preferredEncoding: string, messageService: IMessageService, modeService: IModeService, modelService: IModelService, fileService: IFileService, lifecycleService: ILifecycleService, instantiationService: IInstantiationService, telemetryService: ITelemetryService, textFileService: ITextFileService, backupFileService: IBackupFileService, environmentService: IEnvironmentService, contextService: IWorkspaceContextService);
    private registerListeners();
    private onFileChanges(e);
    private setOrphaned(orphaned);
    private updateAutoSaveConfiguration(config);
    private onFilesAssociationChange();
    private updateTextEditorModelMode(modeId?);
    readonly onDidContentChange: Event<StateChange>;
    readonly onDidStateChange: Event<StateChange>;
    /**
     * The current version id of the model.
     */
    getVersionId(): number;
    /**
     * Set a save error handler to install code that executes when save errors occur.
     */
    static setSaveErrorHandler(handler: ISaveErrorHandler): void;
    /**
     * Set a save participant handler to react on models getting saved.
     */
    static setSaveParticipant(handler: ISaveParticipant): void;
    /**
     * Discards any local changes and replaces the model with the contents of the version on disk.
     *
     * @param if the parameter soft is true, will not attempt to load the contents from disk.
     */
    revert(soft?: boolean): TPromise<void>;
    load(force?: boolean): TPromise<TextFileEditorModel>;
    private loadWithBackup(force);
    private loadFromFile(force);
    private handleLoadSuccess(content);
    private handleLoadError(error);
    private loadWithContent(content, backup?);
    private doUpdateTextModel(value);
    private doCreateTextModel(resource, value, backup);
    private _installChangeContentListener();
    private doLoadBackup(backup);
    protected getOrCreateMode(modeService: IModeService, preferredModeIds: string, firstLineText?: string): TPromise<IMode>;
    private onModelContentChanged();
    private makeDirty();
    private doAutoSave(versionId);
    private cancelAutoSavePromise();
    /**
     * Saves the current versionId of this editor model if it is dirty.
     */
    save(options?: ISaveOptions): TPromise<void>;
    private doSave(versionId, options);
    private isSettingsFile();
    private doTouch();
    private setDirty(dirty);
    private updateLastResolvedDiskStat(newVersionOnDiskStat);
    private onSaveError(error);
    /**
     * Returns true if the content of this model has changes that are not yet saved back to the disk.
     */
    isDirty(): boolean;
    /**
     * Returns the time in millies when this working copy was attempted to be saved.
     */
    getLastSaveAttemptTime(): number;
    /**
     * Returns the time in millies when this working copy was last modified by the user or some other program.
     */
    getETag(): string;
    /**
     * Answers if this model is in a specific state.
     */
    hasState(state: ModelState): boolean;
    getEncoding(): string;
    setEncoding(encoding: string, mode: EncodingMode): void;
    updatePreferredEncoding(encoding: string): void;
    private isNewEncoding(encoding);
    isResolved(): boolean;
    /**
     * Returns true if the dispose() method of this model has been called.
     */
    isDisposed(): boolean;
    /**
     * Returns the full resource URI of the file this text file editor model is about.
     */
    getResource(): URI;
    /**
     * Stat accessor only used by tests.
     */
    getStat(): IFileStat;
    dispose(): void;
}
export declare class SaveSequentializer {
    private _pendingSave;
    private _nextSave;
    hasPendingSave(versionId?: number): boolean;
    readonly pendingSave: TPromise<void>;
    setPending(versionId: number, promise: TPromise<void>): TPromise<void>;
    private donePending(versionId);
    private triggerNextSave();
    setNext(run: () => TPromise<void>): TPromise<void>;
}
