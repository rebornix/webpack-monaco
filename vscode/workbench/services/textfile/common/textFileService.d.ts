import { TPromise } from 'vs/base/common/winjs.base';
import URI from 'vs/base/common/uri';
import Event from 'vs/base/common/event';
import { IWindowsService } from 'vs/platform/windows/common/windows';
import { IBackupFileService } from 'vs/workbench/services/backup/common/backup';
import { IRevertOptions, ITextFileOperationResult, ITextFileService, IRawTextContent, IAutoSaveConfiguration, AutoSaveMode, ITextFileEditorModelManager, ISaveOptions } from 'vs/workbench/services/textfile/common/textfiles';
import { ConfirmResult } from 'vs/workbench/common/editor';
import { ILifecycleService } from 'vs/platform/lifecycle/common/lifecycle';
import { IWorkspaceContextService } from 'vs/platform/workspace/common/workspace';
import { IFileService, IResolveContentOptions, IFilesConfiguration } from 'vs/platform/files/common/files';
import { IConfigurationService } from 'vs/platform/configuration/common/configuration';
import { ITelemetryService } from 'vs/platform/telemetry/common/telemetry';
import { IEnvironmentService } from 'vs/platform/environment/common/environment';
import { IUntitledEditorService } from 'vs/workbench/services/untitled/common/untitledEditorService';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { IMessageService } from 'vs/platform/message/common/message';
import { IHistoryService } from 'vs/workbench/services/history/common/history';
export interface IBackupResult {
    didBackup: boolean;
}
/**
 * The workbench file service implementation implements the raw file service spec and adds additional methods on top.
 *
 * It also adds diagnostics and logging around file system operations.
 */
export declare abstract class TextFileService implements ITextFileService {
    private lifecycleService;
    private contextService;
    private configurationService;
    private telemetryService;
    protected fileService: IFileService;
    private untitledEditorService;
    private instantiationService;
    private messageService;
    protected environmentService: IEnvironmentService;
    private backupFileService;
    private windowsService;
    private historyService;
    _serviceBrand: any;
    private toUnbind;
    private _models;
    private _onFilesAssociationChange;
    private currentFilesAssociationConfig;
    private _onAutoSaveConfigurationChange;
    private configuredAutoSaveDelay;
    private configuredAutoSaveOnFocusChange;
    private configuredAutoSaveOnWindowChange;
    private configuredHotExit;
    constructor(lifecycleService: ILifecycleService, contextService: IWorkspaceContextService, configurationService: IConfigurationService, telemetryService: ITelemetryService, fileService: IFileService, untitledEditorService: IUntitledEditorService, instantiationService: IInstantiationService, messageService: IMessageService, environmentService: IEnvironmentService, backupFileService: IBackupFileService, windowsService: IWindowsService, historyService: IHistoryService);
    readonly models: ITextFileEditorModelManager;
    abstract resolveTextContent(resource: URI, options?: IResolveContentOptions): TPromise<IRawTextContent>;
    abstract promptForPath(defaultPath?: string): string;
    abstract confirmSave(resources?: URI[]): ConfirmResult;
    readonly onAutoSaveConfigurationChange: Event<IAutoSaveConfiguration>;
    readonly onFilesAssociationChange: Event<void>;
    private registerListeners();
    private beforeShutdown(reason);
    private backupBeforeShutdown(dirtyToBackup, textFileEditorModelManager, reason);
    private backupAll(dirtyToBackup, textFileEditorModelManager);
    private doBackupAll(dirtyFileModels, untitledResources);
    private confirmBeforeShutdown();
    private noVeto(options);
    protected cleanupBackupsBeforeShutdown(): TPromise<void>;
    protected onConfigurationChange(configuration: IFilesConfiguration): void;
    getDirty(resources?: URI[]): URI[];
    isDirty(resource?: URI): boolean;
    save(resource: URI, options?: ISaveOptions): TPromise<boolean>;
    saveAll(includeUntitled?: boolean, options?: ISaveOptions): TPromise<ITextFileOperationResult>;
    saveAll(resources: URI[], options?: ISaveOptions): TPromise<ITextFileOperationResult>;
    private doSaveAll(fileResources, untitledResources, options?);
    private doSaveAllFiles(resources?, options?);
    private getFileModels(resources?);
    private getFileModels(resource?);
    private getDirtyFileModels(resources?);
    private getDirtyFileModels(resource?);
    saveAs(resource: URI, target?: URI): TPromise<URI>;
    private doSaveAs(resource, target?);
    private doSaveTextFileAs(sourceModel, resource, target);
    private suggestFileName(untitledResource);
    revert(resource: URI, options?: IRevertOptions): TPromise<boolean>;
    revertAll(resources?: URI[], options?: IRevertOptions): TPromise<ITextFileOperationResult>;
    private doRevertAllFiles(resources?, options?);
    getAutoSaveMode(): AutoSaveMode;
    getAutoSaveConfiguration(): IAutoSaveConfiguration;
    readonly isHotExitEnabled: boolean;
    dispose(): void;
}
