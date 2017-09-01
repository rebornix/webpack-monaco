import { IDisposable } from 'vs/base/common/lifecycle';
export declare class EmitterEvent {
    readonly type: string;
    readonly data: any;
    constructor(eventType?: string, data?: any);
}
export interface ListenerCallback {
    (value: any): void;
}
export interface BulkListenerCallback {
    (value: EmitterEvent[]): void;
}
export interface IBaseEventEmitter {
    addBulkListener(listener: BulkListenerCallback): IDisposable;
}
export interface IEventEmitter extends IBaseEventEmitter, IDisposable {
    addListener(eventType: string, listener: ListenerCallback): IDisposable;
    addOneTimeListener(eventType: string, listener: ListenerCallback): IDisposable;
    addEmitter(eventEmitter: IEventEmitter): IDisposable;
}
export interface IListenersMap {
    [key: string]: ListenerCallback[];
}
export declare class EventEmitter implements IEventEmitter {
    protected _listeners: IListenersMap;
    protected _bulkListeners: ListenerCallback[];
    private _collectedEvents;
    private _deferredCnt;
    private _allowedEventTypes;
    constructor(allowedEventTypes?: string[]);
    dispose(): void;
    addListener(eventType: string, listener: ListenerCallback): IDisposable;
    addOneTimeListener(eventType: string, listener: ListenerCallback): IDisposable;
    addBulkListener(listener: BulkListenerCallback): IDisposable;
    addEmitter(eventEmitter: IBaseEventEmitter): IDisposable;
    private _removeListener(eventType, listener);
    private _removeBulkListener(listener);
    protected _emitToSpecificTypeListeners(eventType: string, data: any): void;
    protected _emitToBulkListeners(events: EmitterEvent[]): void;
    protected _emitEvents(events: EmitterEvent[]): void;
    emit(eventType: string, data?: any): void;
    beginDeferredEmit(): void;
    endDeferredEmit(): void;
    deferredEmit<T>(callback: () => T): T;
    private _emitCollected();
}
/**
 * Same as EventEmitter, but guarantees events are delivered in order to each listener
 */
export declare class OrderGuaranteeEventEmitter extends EventEmitter {
    private _emitQueue;
    constructor();
    protected _emitToSpecificTypeListeners(eventType: string, data: any): void;
    protected _emitToBulkListeners(events: EmitterEvent[]): void;
    protected _emitEvents(events: EmitterEvent[]): void;
}
