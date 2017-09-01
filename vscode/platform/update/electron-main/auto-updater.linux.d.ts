import { EventEmitter } from 'events';
import { IRequestService } from 'vs/platform/request/node/request';
import { IAutoUpdater } from 'vs/platform/update/common/update';
export declare class LinuxAutoUpdaterImpl extends EventEmitter implements IAutoUpdater {
    private requestService;
    private url;
    private currentRequest;
    constructor(requestService: IRequestService);
    setFeedURL(url: string): void;
    checkForUpdates(): void;
    quitAndInstall(): void;
}
