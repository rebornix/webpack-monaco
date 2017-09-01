import { TPromise } from 'vs/base/common/winjs.base';
export declare const IProgressService: {
    (...args: any[]): void;
    type: IProgressService;
};
export interface IProgressService {
    _serviceBrand: any;
    /**
     * Show progress customized with the provided flags.
     */
    show(infinite: boolean, delay?: number): IProgressRunner;
    show(total: number, delay?: number): IProgressRunner;
    /**
     * Indicate progress for the duration of the provided promise. Progress will stop in
     * any case of promise completion, error or cancellation.
     */
    showWhile(promise: TPromise<any>, delay?: number): TPromise<void>;
}
export interface IProgressRunner {
    total(value: number): void;
    worked(value: number): void;
    done(): void;
}
export interface IProgress<T> {
    report(item: T): void;
}
export declare const emptyProgress: IProgress<any>;
export declare class Progress<T> implements IProgress<T> {
    private _callback;
    private _value;
    constructor(callback: (data: T) => void);
    readonly value: T;
    report(item: T): void;
}
export declare enum ProgressLocation {
    Scm = 1,
    Window = 10,
}
export interface IProgressOptions {
    location: ProgressLocation;
    title?: string;
    tooltip?: string;
}
export interface IProgressStep {
    message?: string;
    percentage?: number;
}
export declare const IProgressService2: {
    (...args: any[]): void;
    type: IProgressService2;
};
export interface IProgressService2 {
    _serviceBrand: any;
    withProgress(options: IProgressOptions, task: (progress: IProgress<IProgressStep>) => TPromise<any>): void;
}
