import { IWatcherService, IWatcherRequest } from 'vs/workbench/services/files/node/watcher/nsfw/watcher';
import { TPromise } from 'vs/base/common/winjs.base';
export declare class NsfwWatcherService implements IWatcherService {
    private static FS_EVENT_DELAY;
    private _pathWatchers;
    private _watcherPromise;
    private _progressCallback;
    private _verboseLogging;
    initialize(verboseLogging: boolean): TPromise<void>;
    private _watch(request);
    setRoots(roots: IWatcherRequest[]): TPromise<void>;
    /**
     * Normalizes a set of root paths by removing any root paths that are
     * sub-paths of other roots.
     */
    protected _normalizeRoots(roots: IWatcherRequest[]): IWatcherRequest[];
    private _isPathIgnored(absolutePath, ignored);
}
