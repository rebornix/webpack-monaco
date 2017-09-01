import { IJSONSchema } from 'vs/base/common/jsonSchema';
import { IMessage, IExtensionDescription } from 'vs/platform/extensions/common/extensions';
export declare class ExtensionMessageCollector {
    private readonly _messageHandler;
    private readonly _extension;
    private readonly _extensionPointId;
    constructor(messageHandler: (msg: IMessage) => void, extension: IExtensionDescription, extensionPointId: string);
    private _msg(type, message);
    error(message: string): void;
    warn(message: string): void;
    info(message: string): void;
}
export interface IExtensionPointUser<T> {
    description: IExtensionDescription;
    value: T;
    collector: ExtensionMessageCollector;
}
export interface IExtensionPointHandler<T> {
    (extensions: IExtensionPointUser<T>[]): void;
}
export interface IExtensionPoint<T> {
    name: string;
    setHandler(handler: IExtensionPointHandler<T>): void;
}
export declare class ExtensionPoint<T> implements IExtensionPoint<T> {
    readonly name: string;
    private _handler;
    private _users;
    private _done;
    constructor(name: string);
    setHandler(handler: IExtensionPointHandler<T>): void;
    acceptUsers(users: IExtensionPointUser<T>[]): void;
    private _handle();
}
export declare class ExtensionsRegistryImpl {
    private _extensionPoints;
    constructor();
    registerExtensionPoint<T>(extensionPoint: string, deps: IExtensionPoint<any>[], jsonSchema: IJSONSchema): IExtensionPoint<T>;
    getExtensionPoints(): ExtensionPoint<any>[];
}
export declare const ExtensionsRegistry: ExtensionsRegistryImpl;
