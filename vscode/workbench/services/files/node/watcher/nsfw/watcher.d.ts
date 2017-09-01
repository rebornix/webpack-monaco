import { TPromise } from 'vs/base/common/winjs.base';
export interface IWatcherRequest {
    basePath: string;
    ignored: string[];
}
export interface IWatcherService {
    initialize(verboseLogging: boolean): TPromise<void>;
    setRoots(roots: IWatcherRequest[]): TPromise<void>;
}
export interface IFileWatcher {
    startWatching(): () => void;
    addFolder(folder: string): void;
}
