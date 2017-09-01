import { TPromise } from 'vs/base/common/winjs.base';
import { IWatcherRequest, IWatcherService } from './watcher';
export declare class ChokidarWatcherService implements IWatcherService {
    private static FS_EVENT_DELAY;
    private static EVENT_SPAM_WARNING_THRESHOLD;
    private spamCheckStartTime;
    private spamWarningLogged;
    watch(request: IWatcherRequest): TPromise<void>;
}
