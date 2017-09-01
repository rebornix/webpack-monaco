import URI from 'vs/base/common/uri';
import { TPromise } from 'vs/base/common/winjs.base';
import { IWorkspaceContextService } from 'vs/platform/workspace/common/workspace';
import { IWorkspaceConfigurationService } from 'vs/workbench/services/configuration/common/configuration';
import { IConfigurationEditingService, ConfigurationTarget } from 'vs/workbench/services/configuration/common/configurationEditing';
import { MainThreadConfigurationShape, IExtHostContext } from '../node/extHost.protocol';
export declare class MainThreadConfiguration implements MainThreadConfigurationShape {
    private readonly _configurationEditingService;
    private readonly _workspaceContextService;
    private readonly _configurationListener;
    constructor(extHostContext: IExtHostContext, _configurationEditingService: IConfigurationEditingService, _workspaceContextService: IWorkspaceContextService, configurationService: IWorkspaceConfigurationService);
    dispose(): void;
    $updateConfigurationOption(target: ConfigurationTarget, key: string, value: any, resource: URI): TPromise<void>;
    $removeConfigurationOption(target: ConfigurationTarget, key: string, resource: URI): TPromise<void>;
    private writeConfiguration(target, key, value, resource);
    private deriveConfigurationTarget(key, resource);
}
