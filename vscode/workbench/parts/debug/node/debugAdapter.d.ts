import uri from 'vs/base/common/uri';
import { TPromise } from 'vs/base/common/winjs.base';
import { IJSONSchema, IJSONSchemaSnippet } from 'vs/base/common/jsonSchema';
import { IConfig, IRawAdapter, IAdapterExecutable } from 'vs/workbench/parts/debug/common/debug';
import { IExtensionDescription } from 'vs/platform/extensions/common/extensions';
import { IConfigurationResolverService } from 'vs/workbench/services/configurationResolver/common/configurationResolver';
import { IConfigurationService } from 'vs/platform/configuration/common/configuration';
import { ICommandService } from 'vs/platform/commands/common/commands';
export declare class Adapter {
    private rawAdapter;
    extensionDescription: IExtensionDescription;
    private configurationResolverService;
    private configurationService;
    private commandService;
    constructor(rawAdapter: IRawAdapter, extensionDescription: IExtensionDescription, configurationResolverService: IConfigurationResolverService, configurationService: IConfigurationService, commandService: ICommandService);
    getAdapterExecutable(root: uri, verifyAgainstFS?: boolean): TPromise<IAdapterExecutable>;
    private verifyAdapterDetails(details, verifyAgainstFS);
    private getRuntime();
    private getProgram();
    readonly aiKey: string;
    readonly label: string;
    readonly type: string;
    readonly variables: {
        [key: string]: string;
    };
    readonly configurationSnippets: IJSONSchemaSnippet[];
    readonly languages: string[];
    readonly startSessionCommand: string;
    merge(secondRawAdapter: IRawAdapter, extensionDescription: IExtensionDescription): void;
    hasInitialConfiguration(): boolean;
    getInitialConfigurationContent(folderUri: uri, initialConfigs?: IConfig[]): TPromise<string>;
    getSchemaAttributes(): IJSONSchema[];
    private getAttributeBasedOnPlatform(key);
}
