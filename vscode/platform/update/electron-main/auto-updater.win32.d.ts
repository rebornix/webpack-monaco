import { EventEmitter } from 'events';
import { TPromise } from 'vs/base/common/winjs.base';
import { IRequestService } from 'vs/platform/request/node/request';
import { IAutoUpdater } from 'vs/platform/update/common/update';
export declare class Win32AutoUpdaterImpl extends EventEmitter implements IAutoUpdater {
    private requestService;
    private url;
    private currentRequest;
    private updatePackagePath;
    constructor(requestService: IRequestService);
    readonly cachePath: TPromise<string>;
    setFeedURL(url: string): void;
    checkForUpdates(): void;
    private getUpdatePackagePath(version);
    private cleanup(exceptVersion?);
    quitAndInstall(): void;
}
