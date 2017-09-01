export declare const empty: IDisposable;
export interface IDisposable {
    dispose(): void;
}
export declare function dispose<T extends IDisposable>(disposable: T): T;
export declare function dispose<T extends IDisposable>(...disposables: T[]): T[];
export declare function dispose<T extends IDisposable>(disposables: T[]): T[];
export declare function combinedDisposable(disposables: IDisposable[]): IDisposable;
export declare function toDisposable(...fns: (() => void)[]): IDisposable;
export declare abstract class Disposable implements IDisposable {
    private _toDispose;
    constructor();
    dispose(): void;
    protected _register<T extends IDisposable>(t: T): T;
}
export declare class OneDisposable implements IDisposable {
    private _value;
    value: IDisposable;
    dispose(): void;
}
export interface IReference<T> extends IDisposable {
    readonly object: T;
}
export declare abstract class ReferenceCollection<T> {
    private references;
    constructor();
    acquire(key: string): IReference<T>;
    protected abstract createReferencedObject(key: string): T;
    protected abstract destroyReferencedObject(object: T): void;
}
export declare class ImmortalReference<T> implements IReference<T> {
    object: T;
    constructor(object: T);
    dispose(): void;
}
