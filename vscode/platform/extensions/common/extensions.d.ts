import Severity from 'vs/base/common/severity';
import { TPromise } from 'vs/base/common/winjs.base';
import { IExtensionPoint } from 'vs/platform/extensions/common/extensionsRegistry';
export interface IExtensionDescription {
    readonly id: string;
    readonly name: string;
    readonly version: string;
    readonly publisher: string;
    readonly isBuiltin: boolean;
    readonly extensionFolderPath: string;
    readonly extensionDependencies?: string[];
    readonly activationEvents?: string[];
    readonly engines: {
        vscode: string;
    };
    readonly main?: string;
    readonly contributes?: {
        [point: string]: any;
    };
    enableProposedApi?: boolean;
}
export declare const IExtensionService: {
    (...args: any[]): void;
    type: IExtensionService;
};
export interface IMessage {
    type: Severity;
    message: string;
    source: string;
    extensionId: string;
    extensionPointId: string;
}
export interface IExtensionsStatus {
    messages: IMessage[];
}
export declare class ActivationTimes {
    readonly startup: boolean;
    readonly codeLoadingTime: number;
    readonly activateCallTime: number;
    readonly activateResolvedTime: number;
    constructor(startup: boolean, codeLoadingTime: number, activateCallTime: number, activateResolvedTime: number);
}
export declare class ExtensionPointContribution<T> {
    readonly description: IExtensionDescription;
    readonly value: T;
    constructor(description: IExtensionDescription, value: T);
}
export interface IExtensionService {
    _serviceBrand: any;
    /**
     * Send an activation event and activate interested extensions.
     */
    activateByEvent(activationEvent: string): TPromise<void>;
    /**
     * Block on this signal any interactions with extensions.
     */
    onReady(): TPromise<boolean>;
    /**
     * Return all registered extensions
     */
    getExtensions(): TPromise<IExtensionDescription[]>;
    /**
     * Read all contributions to an extension point.
     */
    readExtensionPointContributions<T>(extPoint: IExtensionPoint<T>): TPromise<ExtensionPointContribution<T>[]>;
    /**
     * Get information about extensions status.
     */
    getExtensionsStatus(): {
        [id: string]: IExtensionsStatus;
    };
    /**
     * Get information about extension activation times.
     */
    getExtensionsActivationTimes(): {
        [id: string]: ActivationTimes;
    };
    /**
     * Restarts the extension host.
     */
    restartExtensionHost(): void;
}
