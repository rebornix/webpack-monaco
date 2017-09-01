import { TPromise } from 'vs/base/common/winjs.base';
import { IChannel } from 'vs/base/parts/ipc/common/ipc';
import { IURLService } from './url';
import Event from 'vs/base/common/event';
import { IWindowsService } from 'vs/platform/windows/common/windows';
import URI from 'vs/base/common/uri';
export interface IURLChannel extends IChannel {
    call(command: 'event:onOpenURL'): TPromise<void>;
    call(command: string, arg?: any): TPromise<any>;
}
export declare class URLChannel implements IURLChannel {
    private service;
    private focusedWindowId;
    constructor(service: IURLService, windowsService: IWindowsService);
    call(command: string, arg?: any): TPromise<any>;
    /**
     * We only want the focused window to get pinged with the onOpenUrl event.
     * The idea here is to filter the onOpenUrl event with the knowledge of which
     * was the last window to be focused. When first listening to the event,
     * each client sends its window ID via the arguments to `call(...)`.
     * When the event fires, the server has enough knowledge to filter the event
     * and fire it only to the focused window.
     */
    private isWindowFocused(windowID);
}
export declare class URLChannelClient implements IURLService {
    private channel;
    private windowID;
    _serviceBrand: any;
    constructor(channel: IChannel, windowID: number);
    private _onOpenURL;
    readonly onOpenURL: Event<URI>;
    open(url: string): void;
}
