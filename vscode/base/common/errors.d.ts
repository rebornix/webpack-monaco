import { IAction } from 'vs/base/common/actions';
import Severity from 'vs/base/common/severity';
import { TPromise } from 'vs/base/common/winjs.base';
export interface ErrorListenerCallback {
    (error: any): void;
}
export interface ErrorListenerUnbind {
    (): void;
}
export declare class ErrorHandler {
    private unexpectedErrorHandler;
    private listeners;
    constructor();
    addListener(listener: ErrorListenerCallback): ErrorListenerUnbind;
    private emit(e);
    private _removeListener(listener);
    setUnexpectedErrorHandler(newUnexpectedErrorHandler: (e: any) => void): void;
    getUnexpectedErrorHandler(): (e: any) => void;
    onUnexpectedError(e: any): void;
    onUnexpectedExternalError(e: any): void;
}
export declare const errorHandler: ErrorHandler;
export declare function setUnexpectedErrorHandler(newUnexpectedErrorHandler: (e: any) => void): void;
export declare function onUnexpectedError(e: any): undefined;
export declare function onUnexpectedExternalError(e: any): undefined;
export declare function onUnexpectedPromiseError<T>(promise: TPromise<T>): TPromise<T | void>;
export interface SerializedError {
    readonly $isError: true;
    readonly name: string;
    readonly message: string;
    readonly stack: string;
}
export declare function transformErrorForSerialization(error: Error): SerializedError;
export declare function transformErrorForSerialization(error: any): any;
export interface V8CallSite {
    getThis(): any;
    getTypeName(): string;
    getFunction(): string;
    getFunctionName(): string;
    getMethodName(): string;
    getFileName(): string;
    getLineNumber(): number;
    getColumnNumber(): number;
    getEvalOrigin(): string;
    isToplevel(): boolean;
    isEval(): boolean;
    isNative(): boolean;
    isConstructor(): boolean;
    toString(): string;
}
/**
 * Checks if the given error is a promise in canceled state
 */
export declare function isPromiseCanceledError(error: any): boolean;
/**
 * Returns an error that signals cancellation.
 */
export declare function canceled(): Error;
/**
 * Returns an error that signals something is not implemented.
 */
export declare function notImplemented(): Error;
export declare function illegalArgument(name?: string): Error;
export declare function illegalState(name?: string): Error;
export declare function readonly(name?: string): Error;
export declare function disposed(what: string): Error;
export interface IErrorOptions {
    severity?: Severity;
    actions?: IAction[];
}
export declare function create(message: string, options?: IErrorOptions): Error;
export declare function getErrorMessage(err: any): string;
