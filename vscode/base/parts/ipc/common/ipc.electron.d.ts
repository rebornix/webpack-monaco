import { IMessagePassingProtocol } from 'vs/base/parts/ipc/common/ipc';
import Event from 'vs/base/common/event';
export interface Sender {
    send(channel: string, ...args: any[]): void;
}
export declare class Protocol implements IMessagePassingProtocol {
    private sender;
    private onMessageEvent;
    private listener;
    private _onMessage;
    readonly onMessage: Event<any>;
    constructor(sender: Sender, onMessageEvent: Event<any>);
    send(message: any): void;
    dispose(): void;
}
