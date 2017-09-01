import Event from 'vs/base/common/event';
export declare enum ContextKeyExprType {
    Defined = 1,
    Not = 2,
    Equals = 3,
    NotEquals = 4,
    And = 5,
}
export declare abstract class ContextKeyExpr {
    static has(key: string): ContextKeyExpr;
    static equals(key: string, value: any): ContextKeyExpr;
    static notEquals(key: string, value: any): ContextKeyExpr;
    static not(key: string): ContextKeyExpr;
    static and(...expr: ContextKeyExpr[]): ContextKeyExpr;
    static deserialize(serialized: string): ContextKeyExpr;
    private static _deserializeOne(serializedOne);
    private static _deserializeValue(serializedValue);
    abstract getType(): ContextKeyExprType;
    abstract equals(other: ContextKeyExpr): boolean;
    abstract evaluate(context: IContext): boolean;
    abstract normalize(): ContextKeyExpr;
    abstract serialize(): string;
    abstract keys(): string[];
}
export declare class ContextKeyDefinedExpr implements ContextKeyExpr {
    protected key: string;
    constructor(key: string);
    getType(): ContextKeyExprType;
    cmp(other: ContextKeyDefinedExpr): number;
    equals(other: ContextKeyExpr): boolean;
    evaluate(context: IContext): boolean;
    normalize(): ContextKeyExpr;
    serialize(): string;
    keys(): string[];
}
export declare class ContextKeyEqualsExpr implements ContextKeyExpr {
    private key;
    private value;
    constructor(key: string, value: any);
    getType(): ContextKeyExprType;
    cmp(other: ContextKeyEqualsExpr): number;
    equals(other: ContextKeyExpr): boolean;
    evaluate(context: IContext): boolean;
    normalize(): ContextKeyExpr;
    serialize(): string;
    keys(): string[];
}
export declare class ContextKeyNotEqualsExpr implements ContextKeyExpr {
    private key;
    private value;
    constructor(key: string, value: any);
    getType(): ContextKeyExprType;
    cmp(other: ContextKeyNotEqualsExpr): number;
    equals(other: ContextKeyExpr): boolean;
    evaluate(context: IContext): boolean;
    normalize(): ContextKeyExpr;
    serialize(): string;
    keys(): string[];
}
export declare class ContextKeyNotExpr implements ContextKeyExpr {
    private key;
    constructor(key: string);
    getType(): ContextKeyExprType;
    cmp(other: ContextKeyNotExpr): number;
    equals(other: ContextKeyExpr): boolean;
    evaluate(context: IContext): boolean;
    normalize(): ContextKeyExpr;
    serialize(): string;
    keys(): string[];
}
export declare class ContextKeyAndExpr implements ContextKeyExpr {
    private expr;
    constructor(expr: ContextKeyExpr[]);
    getType(): ContextKeyExprType;
    equals(other: ContextKeyExpr): boolean;
    evaluate(context: IContext): boolean;
    private static _normalizeArr(arr);
    normalize(): ContextKeyExpr;
    serialize(): string;
    keys(): string[];
}
export declare class RawContextKey<T> extends ContextKeyDefinedExpr {
    private _defaultValue;
    constructor(key: string, defaultValue: T);
    bindTo(target: IContextKeyService): IContextKey<T>;
    getValue(target: IContextKeyService): T;
    toNegated(): ContextKeyExpr;
    isEqualTo(value: string): ContextKeyExpr;
}
export interface IContext {
    getValue<T>(key: string): T;
}
export interface IContextKey<T> {
    set(value: T): void;
    reset(): void;
    get(): T;
}
export interface IContextKeyServiceTarget {
    parentElement: IContextKeyServiceTarget;
    setAttribute(attr: string, value: string): void;
    removeAttribute(attr: string): void;
    hasAttribute(attr: string): boolean;
    getAttribute(attr: string): string;
}
export declare const IContextKeyService: {
    (...args: any[]): void;
    type: IContextKeyService;
};
export interface IContextKeyService {
    _serviceBrand: any;
    dispose(): void;
    onDidChangeContext: Event<string[]>;
    createKey<T>(key: string, defaultValue: T): IContextKey<T>;
    contextMatchesRules(rules: ContextKeyExpr): boolean;
    getContextKeyValue<T>(key: string): T;
    createScoped(target?: IContextKeyServiceTarget): IContextKeyService;
    getContext(target: IContextKeyServiceTarget): IContext;
}
export declare const SET_CONTEXT_COMMAND_ID = "setContext";
