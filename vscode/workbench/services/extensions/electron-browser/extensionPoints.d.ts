import { IExtensionDescription } from 'vs/platform/extensions/common/extensions';
import { TPromise } from 'vs/base/common/winjs.base';
export interface ILog {
    error(source: string, message: string): void;
    warn(source: string, message: string): void;
    info(source: string, message: string): void;
}
export declare class ExtensionScanner {
    /**
     * Read the extension defined in `absoluteFolderPath`
     */
    static scanExtension(version: string, log: ILog, absoluteFolderPath: string, isBuiltin: boolean): TPromise<IExtensionDescription>;
    /**
     * Scan a list of extensions defined in `absoluteFolderPath`
     */
    static scanExtensions(version: string, log: ILog, absoluteFolderPath: string, isBuiltin: boolean): TPromise<IExtensionDescription[]>;
    /**
     * Combination of scanExtension and scanExtensions: If an extension manifest is found at root, we load just this extension,
     * otherwise we assume the folder contains multiple extensions.
     */
    static scanOneOrMultipleExtensions(version: string, log: ILog, absoluteFolderPath: string, isBuiltin: boolean): TPromise<IExtensionDescription[]>;
}
