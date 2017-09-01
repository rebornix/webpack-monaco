import URI from 'vs/base/common/uri';
import Event from 'vs/base/common/event';
import { WorkspaceConfiguration } from 'vscode';
import { ExtHostWorkspace } from 'vs/workbench/api/node/extHostWorkspace';
import { ExtHostConfigurationShape, MainThreadConfigurationShape } from './extHost.protocol';
import { IConfigurationData } from 'vs/platform/configuration/common/configuration';
export declare class ExtHostConfiguration implements ExtHostConfigurationShape {
    private readonly _onDidChangeConfiguration;
    private readonly _proxy;
    private readonly _extHostWorkspace;
    private _configuration;
    constructor(proxy: MainThreadConfigurationShape, extHostWorkspace: ExtHostWorkspace, data: IConfigurationData<any>);
    readonly onDidChangeConfiguration: Event<void>;
    $acceptConfigurationChanged(data: IConfigurationData<any>): void;
    getConfiguration(section?: string, resource?: URI): WorkspaceConfiguration;
}
