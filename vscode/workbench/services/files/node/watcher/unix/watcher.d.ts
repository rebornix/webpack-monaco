import { TPromise } from 'vs/base/common/winjs.base';
export interface IWatcherRequest {
    basePath: string;
    ignored: string[];
    verboseLogging: boolean;
}
export interface IWatcherService {
    watch(request: IWatcherRequest): TPromise<void>;
}
