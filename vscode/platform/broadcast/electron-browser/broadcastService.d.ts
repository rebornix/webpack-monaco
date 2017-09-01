import Event from 'vs/base/common/event';
export declare const IBroadcastService: {
    (...args: any[]): void;
    type: IBroadcastService;
};
export interface IBroadcast {
    channel: string;
    payload: any;
}
export interface IBroadcastService {
    _serviceBrand: any;
    broadcast(b: IBroadcast): void;
    onBroadcast: Event<IBroadcast>;
}
export declare class BroadcastService implements IBroadcastService {
    private windowId;
    _serviceBrand: any;
    private _onBroadcast;
    constructor(windowId: number);
    private registerListeners();
    readonly onBroadcast: Event<IBroadcast>;
    broadcast(b: IBroadcast): void;
}
