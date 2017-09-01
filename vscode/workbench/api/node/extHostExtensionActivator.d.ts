import { IDisposable } from 'vs/base/common/lifecycle';
import Severity from 'vs/base/common/severity';
import { TPromise } from 'vs/base/common/winjs.base';
import { ExtensionDescriptionRegistry } from 'vs/workbench/services/extensions/node/extensionDescriptionRegistry';
import { IExtensionDescription } from 'vs/platform/extensions/common/extensions';
export interface IExtensionMemento {
    get<T>(key: string, defaultValue: T): T;
    update(key: string, value: any): Thenable<boolean>;
}
export interface IExtensionContext {
    subscriptions: IDisposable[];
    workspaceState: IExtensionMemento;
    globalState: IExtensionMemento;
    extensionPath: string;
    storagePath: string;
    asAbsolutePath(relativePath: string): string;
}
/**
 * Represents the source code (module) of an extension.
 */
export interface IExtensionModule {
    activate(ctx: IExtensionContext): TPromise<IExtensionAPI>;
    deactivate(): void;
}
/**
 * Represents the API of an extension (return value of `activate`).
 */
export interface IExtensionAPI {
}
export declare class ExtensionActivationTimes {
    static NONE: ExtensionActivationTimes;
    readonly startup: boolean;
    readonly codeLoadingTime: number;
    readonly activateCallTime: number;
    readonly activateResolvedTime: number;
    constructor(startup: boolean, codeLoadingTime: number, activateCallTime: number, activateResolvedTime: number);
}
export declare class ExtensionActivationTimesBuilder {
    private readonly _startup;
    private _codeLoadingStart;
    private _codeLoadingStop;
    private _activateCallStart;
    private _activateCallStop;
    private _activateResolveStart;
    private _activateResolveStop;
    constructor(startup: boolean);
    private _delta(start, stop);
    build(): ExtensionActivationTimes;
    codeLoadingStart(): void;
    codeLoadingStop(): void;
    activateCallStart(): void;
    activateCallStop(): void;
    activateResolveStart(): void;
    activateResolveStop(): void;
}
export declare class ActivatedExtension {
    readonly activationFailed: boolean;
    readonly activationTimes: ExtensionActivationTimes;
    readonly module: IExtensionModule;
    readonly exports: IExtensionAPI;
    readonly subscriptions: IDisposable[];
    constructor(activationFailed: boolean, activationTimes: ExtensionActivationTimes, module: IExtensionModule, exports: IExtensionAPI, subscriptions: IDisposable[]);
}
export declare class EmptyExtension extends ActivatedExtension {
    constructor(activationTimes: ExtensionActivationTimes);
}
export declare class FailedExtension extends ActivatedExtension {
    constructor(activationTimes: ExtensionActivationTimes);
}
export interface IExtensionsActivatorHost {
    showMessage(severity: Severity, message: string): void;
    actualActivateExtension(extensionDescription: IExtensionDescription, startup: boolean): TPromise<ActivatedExtension>;
}
export declare class ExtensionsActivator {
    private readonly _registry;
    private readonly _host;
    private readonly _activatingExtensions;
    private readonly _activatedExtensions;
    /**
     * A map of already activated events to speed things up if the same activation event is triggered multiple times.
     */
    private readonly _alreadyActivatedEvents;
    constructor(registry: ExtensionDescriptionRegistry, host: IExtensionsActivatorHost);
    isActivated(extensionId: string): boolean;
    getActivatedExtension(extensionId: string): ActivatedExtension;
    activateByEvent(activationEvent: string, startup: boolean): TPromise<void>;
    activateById(extensionId: string, startup: boolean): TPromise<void>;
    /**
     * Handle semantics related to dependencies for `currentExtension`.
     * semantics: `redExtensions` must wait for `greenExtensions`.
     */
    private _handleActivateRequest(currentExtension, greenExtensions, redExtensions);
    private _activateExtensions(extensionDescriptions, startup, recursionLevel);
    private _activateExtension(extensionDescription, startup);
}
