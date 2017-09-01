import { IEnvironmentService, ParsedArgs } from 'vs/platform/environment/common/environment';
export declare class EnvironmentService implements IEnvironmentService {
    private _args;
    private _execPath;
    _serviceBrand: any;
    readonly args: ParsedArgs;
    readonly appRoot: string;
    readonly execPath: string;
    readonly userHome: string;
    readonly userDataPath: string;
    readonly appNameLong: string;
    readonly appQuality: string;
    readonly appSettingsHome: string;
    readonly appSettingsPath: string;
    readonly appKeybindingsPath: string;
    readonly isExtensionDevelopment: boolean;
    readonly backupHome: string;
    readonly backupWorkspacesPath: string;
    readonly workspacesHome: string;
    readonly extensionsPath: string;
    readonly extensionDevelopmentPath: string;
    readonly extensionTestsPath: string;
    readonly disableExtensions: boolean;
    readonly skipGettingStarted: boolean;
    readonly debugExtensionHost: {
        port: number;
        break: boolean;
        debugId: string;
    };
    readonly isBuilt: boolean;
    readonly verbose: boolean;
    readonly wait: boolean;
    readonly logExtensionHostCommunication: boolean;
    readonly performance: boolean;
    readonly profileStartup: {
        prefix: string;
        dir: string;
    } | undefined;
    readonly mainIPCHandle: string;
    readonly sharedIPCHandle: string;
    readonly nodeCachedDataDir: string;
    readonly machineUUID: string;
    constructor(_args: ParsedArgs, _execPath: string);
}
export declare function parseExtensionHostPort(args: ParsedArgs, isBuild: boolean): {
    port: number;
    break: boolean;
    debugId: string;
};
export declare function parseUserDataDir(args: ParsedArgs, process: NodeJS.Process): string;
