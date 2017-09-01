import { IContextKey, IContext, IContextKeyServiceTarget, IContextKeyService, ContextKeyExpr } from 'vs/platform/contextkey/common/contextkey';
import { IConfigurationService } from 'vs/platform/configuration/common/configuration';
import Event, { Emitter } from 'vs/base/common/event';
export declare class Context implements IContext {
    protected _parent: Context;
    protected _value: {
        [key: string]: any;
    };
    protected _id: number;
    constructor(id: number, parent: Context);
    setValue(key: string, value: any): boolean;
    removeValue(key: string): boolean;
    getValue<T>(key: string): T;
}
export declare abstract class AbstractContextKeyService implements IContextKeyService {
    _serviceBrand: any;
    protected _onDidChangeContext: Event<string[]>;
    protected _onDidChangeContextKey: Emitter<string>;
    protected _myContextId: number;
    constructor(myContextId: number);
    abstract dispose(): void;
    createKey<T>(key: string, defaultValue: T): IContextKey<T>;
    readonly onDidChangeContext: Event<string[]>;
    createScoped(domNode: IContextKeyServiceTarget): IContextKeyService;
    contextMatchesRules(rules: ContextKeyExpr): boolean;
    getContextKeyValue<T>(key: string): T;
    setContext(key: string, value: any): void;
    removeContext(key: string): void;
    getContext(target: IContextKeyServiceTarget): IContext;
    abstract getContextValuesContainer(contextId: number): Context;
    abstract createChildContext(parentContextId?: number): number;
    abstract disposeContext(contextId: number): void;
}
export declare class ContextKeyService extends AbstractContextKeyService implements IContextKeyService {
    private _lastContextId;
    private _contexts;
    private _toDispose;
    constructor(configurationService: IConfigurationService);
    dispose(): void;
    getContextValuesContainer(contextId: number): Context;
    createChildContext(parentContextId?: number): number;
    disposeContext(contextId: number): void;
}
