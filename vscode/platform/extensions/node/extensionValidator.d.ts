import { IExtensionDescription } from 'vs/platform/extensions/common/extensions';
export interface IParsedVersion {
    hasCaret: boolean;
    hasGreaterEquals: boolean;
    majorBase: number;
    majorMustEqual: boolean;
    minorBase: number;
    minorMustEqual: boolean;
    patchBase: number;
    patchMustEqual: boolean;
    preRelease: string;
}
export interface INormalizedVersion {
    majorBase: number;
    majorMustEqual: boolean;
    minorBase: number;
    minorMustEqual: boolean;
    patchBase: number;
    patchMustEqual: boolean;
    isMinimum: boolean;
}
export declare function isValidVersionStr(version: string): boolean;
export declare function parseVersion(version: string): IParsedVersion;
export declare function normalizeVersion(version: IParsedVersion): INormalizedVersion;
export declare function isValidVersion(_version: string | INormalizedVersion, _desiredVersion: string | INormalizedVersion): boolean;
export interface IReducedExtensionDescription {
    isBuiltin: boolean;
    engines: {
        vscode: string;
    };
    main?: string;
}
export declare function isValidExtensionVersion(version: string, extensionDesc: IReducedExtensionDescription, notices: string[]): boolean;
export declare function isVersionValid(currentVersion: string, requestedVersion: string, notices?: string[]): boolean;
export declare function isValidExtensionDescription(version: string, extensionFolderPath: string, extensionDescription: IExtensionDescription, notices: string[]): boolean;
