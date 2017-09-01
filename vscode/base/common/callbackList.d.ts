import { IDisposable } from 'vs/base/common/lifecycle';
export default class CallbackList {
    private _callbacks;
    private _contexts;
    add(callback: Function, context?: any, bucket?: IDisposable[]): void;
    remove(callback: Function, context?: any): void;
    invoke(...args: any[]): any[];
    isEmpty(): boolean;
    entries(): [Function, any][];
    dispose(): void;
}
