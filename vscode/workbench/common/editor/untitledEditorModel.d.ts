import { TPromise } from 'vs/base/common/winjs.base';
import { IEncodingSupport } from 'vs/workbench/common/editor';
import { BaseTextEditorModel } from 'vs/workbench/common/editor/textEditorModel';
import URI from 'vs/base/common/uri';
import { IConfigurationService } from 'vs/platform/configuration/common/configuration';
import { IModeService } from 'vs/editor/common/services/modeService';
import { IModelService } from 'vs/editor/common/services/modelService';
import { IMode } from 'vs/editor/common/modes';
import Event from 'vs/base/common/event';
import { IBackupFileService } from 'vs/workbench/services/backup/common/backup';
import { ITextFileService } from 'vs/workbench/services/textfile/common/textfiles';
export declare class UntitledEditorModel extends BaseTextEditorModel implements IEncodingSupport {
    private modeId;
    private resource;
    private hasAssociatedFilePath;
    private initialValue;
    private preferredEncoding;
    private backupFileService;
    private textFileService;
    private configurationService;
    static DEFAULT_CONTENT_CHANGE_BUFFER_DELAY: number;
    private textModelChangeListener;
    private configurationChangeListener;
    private dirty;
    private _onDidChangeContent;
    private _onDidChangeDirty;
    private _onDidChangeEncoding;
    private versionId;
    private contentChangeEventScheduler;
    private configuredEncoding;
    constructor(modeId: string, resource: URI, hasAssociatedFilePath: boolean, initialValue: string, preferredEncoding: string, modeService: IModeService, modelService: IModelService, backupFileService: IBackupFileService, textFileService: ITextFileService, configurationService: IConfigurationService);
    readonly onDidChangeContent: Event<void>;
    readonly onDidChangeDirty: Event<void>;
    readonly onDidChangeEncoding: Event<void>;
    protected getOrCreateMode(modeService: IModeService, modeId: string, firstLineText?: string): TPromise<IMode>;
    private registerListeners();
    private onConfigurationChange(configuration);
    getVersionId(): number;
    getValue(): string;
    getModeId(): string;
    getEncoding(): string;
    setEncoding(encoding: string): void;
    isDirty(): boolean;
    private setDirty(dirty);
    getResource(): URI;
    revert(): void;
    load(): TPromise<UntitledEditorModel>;
    private doLoad(content);
    private onModelContentChanged();
    dispose(): void;
}
