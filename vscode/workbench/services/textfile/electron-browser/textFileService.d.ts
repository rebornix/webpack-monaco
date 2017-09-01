import { TPromise } from 'vs/base/common/winjs.base';
import URI from 'vs/base/common/uri';
import { ConfirmResult } from 'vs/workbench/common/editor';
import { TextFileService as AbstractTextFileService } from 'vs/workbench/services/textfile/common/textFileService';
import { IRawTextContent } from 'vs/workbench/services/textfile/common/textfiles';
import { IUntitledEditorService } from 'vs/workbench/services/untitled/common/untitledEditorService';
import { IFileService, IResolveContentOptions } from 'vs/platform/files/common/files';
import { IWorkspaceContextService } from 'vs/platform/workspace/common/workspace';
import { ILifecycleService } from 'vs/platform/lifecycle/common/lifecycle';
import { ITelemetryService } from 'vs/platform/telemetry/common/telemetry';
import { IConfigurationService } from 'vs/platform/configuration/common/configuration';
import { IModeService } from 'vs/editor/common/services/modeService';
import { IEnvironmentService } from 'vs/platform/environment/common/environment';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { IMessageService } from 'vs/platform/message/common/message';
import { IBackupFileService } from 'vs/workbench/services/backup/common/backup';
import { IWindowsService, IWindowService } from 'vs/platform/windows/common/windows';
import { IHistoryService } from 'vs/workbench/services/history/common/history';
export declare class TextFileService extends AbstractTextFileService {
    private modeService;
    private windowService;
    private static MAX_CONFIRM_FILES;
    constructor(contextService: IWorkspaceContextService, fileService: IFileService, untitledEditorService: IUntitledEditorService, lifecycleService: ILifecycleService, instantiationService: IInstantiationService, telemetryService: ITelemetryService, configurationService: IConfigurationService, modeService: IModeService, windowService: IWindowService, environmentService: IEnvironmentService, messageService: IMessageService, backupFileService: IBackupFileService, windowsService: IWindowsService, historyService: IHistoryService);
    resolveTextContent(resource: URI, options?: IResolveContentOptions): TPromise<IRawTextContent>;
    confirmSave(resources?: URI[]): ConfirmResult;
    promptForPath(defaultPath?: string): string;
    private getSaveDialogOptions(defaultPath?);
}
