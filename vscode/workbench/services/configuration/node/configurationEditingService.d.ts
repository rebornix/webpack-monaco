import { TPromise } from 'vs/base/common/winjs.base';
import { IWorkspaceContextService } from 'vs/platform/workspace/common/workspace';
import { IEnvironmentService } from 'vs/platform/environment/common/environment';
import { ITextFileService } from 'vs/workbench/services/textfile/common/textfiles';
import { IConfigurationService } from 'vs/platform/configuration/common/configuration';
import { IFileService } from 'vs/platform/files/common/files';
import { IConfigurationEditingService, ConfigurationTarget, IConfigurationValue, IConfigurationEditingOptions } from 'vs/workbench/services/configuration/common/configurationEditing';
import { ITextModelService } from 'vs/editor/common/services/resolverService';
import { IChoiceService, IMessageService } from 'vs/platform/message/common/message';
import { ICommandService } from 'vs/platform/commands/common/commands';
export declare class ConfigurationEditingService implements IConfigurationEditingService {
    private configurationService;
    private contextService;
    private environmentService;
    private fileService;
    private textModelResolverService;
    private textFileService;
    private choiceService;
    private messageService;
    private commandService;
    _serviceBrand: any;
    private queue;
    constructor(configurationService: IConfigurationService, contextService: IWorkspaceContextService, environmentService: IEnvironmentService, fileService: IFileService, textModelResolverService: ITextModelService, textFileService: ITextFileService, choiceService: IChoiceService, messageService: IMessageService, commandService: ICommandService);
    writeConfiguration(target: ConfigurationTarget, value: IConfigurationValue, options?: IConfigurationEditingOptions): TPromise<void>;
    private doWriteConfiguration(target, value, options);
    private writeToBuffer(model, operation, save);
    private applyEditsToBuffer(edit, model);
    private onError(error, target, value, scopes);
    private onInvalidConfigurationError(error, target);
    private onConfigurationFileDirtyError(error, target, value, scopes);
    private openSettings(target);
    private wrapError<T>(code, target, operation);
    private toErrorMessage(error, target, operation);
    private stringifyTarget(target);
    private getEdits(model, edit);
    private resolveModelReference(resource);
    private hasParseErrors(model, operation);
    private resolveAndValidate(target, operation, checkDirty, overrides);
    private getConfigurationEditOperation(target, config, overrides);
    private getConfigurationFileResource(target, relativePath, resource);
    private toResource(relativePath, root);
}
