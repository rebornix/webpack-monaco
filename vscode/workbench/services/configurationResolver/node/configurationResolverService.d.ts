import uri from 'vs/base/common/uri';
import { TPromise } from 'vs/base/common/winjs.base';
import { IStringDictionary } from 'vs/base/common/collections';
import { IConfigurationResolverService } from 'vs/workbench/services/configurationResolver/common/configurationResolver';
import { IEnvironmentService } from 'vs/platform/environment/common/environment';
import { IConfigurationService } from 'vs/platform/configuration/common/configuration';
import { ICommandService } from 'vs/platform/commands/common/commands';
import { IWorkbenchEditorService } from 'vs/workbench/services/editor/common/editorService';
export declare class ConfigurationResolverService implements IConfigurationResolverService {
    private editorService;
    private configurationService;
    private commandService;
    _serviceBrand: any;
    private _execPath;
    private _workspaceRoot;
    constructor(envVariables: {
        [key: string]: string;
    }, editorService: IWorkbenchEditorService, environmentService: IEnvironmentService, configurationService: IConfigurationService, commandService: ICommandService);
    private readonly execPath;
    private readonly cwd;
    private readonly workspaceRoot;
    private readonly workspaceRootFolderName;
    private readonly file;
    private readonly relativeFile;
    private readonly fileBasename;
    private readonly fileBasenameNoExtension;
    private readonly fileDirname;
    private readonly fileExtname;
    private readonly lineNumber;
    private getFilePath();
    resolve(root: uri, value: string): string;
    resolve(root: uri, value: string[]): string[];
    resolve(root: uri, value: IStringDictionary<string>): IStringDictionary<string>;
    resolveAny<T>(root: uri, value: T): T;
    private resolveString(root, value);
    private resolveConfigVariable(root, value, originalValue);
    private resolveLiteral(root, values);
    private resolveAnyLiteral<T>(root, values);
    private resolveArray(root, value);
    private resolveAnyArray<T>(root, value);
    /**
     * Resolve all interactive variables in configuration #6569
     */
    resolveInteractiveVariables(configuration: any, interactiveVariablesMap: {
        [key: string]: string;
    }): TPromise<any>;
}
