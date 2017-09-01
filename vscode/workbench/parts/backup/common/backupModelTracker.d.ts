import { IBackupFileService } from 'vs/workbench/services/backup/common/backup';
import { ITextFileService } from 'vs/workbench/services/textfile/common/textfiles';
import { IUntitledEditorService } from 'vs/workbench/services/untitled/common/untitledEditorService';
import { IWorkbenchContribution } from 'vs/workbench/common/contributions';
import { IConfigurationService } from 'vs/platform/configuration/common/configuration';
export declare class BackupModelTracker implements IWorkbenchContribution {
    private backupFileService;
    private textFileService;
    private untitledEditorService;
    private configurationService;
    _serviceBrand: any;
    private configuredAutoSaveAfterDelay;
    private toDispose;
    constructor(backupFileService: IBackupFileService, textFileService: ITextFileService, untitledEditorService: IUntitledEditorService, configurationService: IConfigurationService);
    private registerListeners();
    private onConfigurationChange(configuration);
    private onTextFileModelChanged(event);
    private onUntitledModelChanged(resource);
    private discardBackup(resource);
    dispose(): void;
    getId(): string;
}
