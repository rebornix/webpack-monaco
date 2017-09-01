export declare class LazyPromise {
    private _onCancel;
    private _actual;
    private _actualOk;
    private _actualErr;
    private _hasValue;
    private _value;
    private _hasErr;
    private _err;
    private _isCanceled;
    constructor(onCancel: () => void);
    private _ensureActual();
    resolveOk(value: any): void;
    resolveErr(err: any): void;
    then(success: any, error: any): any;
    done(success: any, error: any): void;
    cancel(): void;
}
