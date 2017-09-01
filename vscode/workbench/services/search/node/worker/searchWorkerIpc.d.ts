import { TPromise } from 'vs/base/common/winjs.base';
import { IChannel } from 'vs/base/parts/ipc/common/ipc';
import { ISerializedFileMatch } from '../search';
import { IPatternInfo } from 'vs/platform/search/common/search';
import { SearchWorker } from './searchWorker';
export interface ISearchWorkerSearchArgs {
    pattern: IPatternInfo;
    fileEncoding: string;
    absolutePaths: string[];
    maxResults?: number;
}
export interface ISearchWorkerSearchResult {
    matches: ISerializedFileMatch[];
    numMatches: number;
    limitReached: boolean;
}
export interface ISearchWorker {
    initialize(): TPromise<void>;
    search(args: ISearchWorkerSearchArgs): TPromise<ISearchWorkerSearchResult>;
    cancel(): TPromise<void>;
}
export interface ISearchWorkerChannel extends IChannel {
    call(command: 'initialize'): TPromise<void>;
    call(command: 'search', args: ISearchWorkerSearchArgs): TPromise<ISearchWorkerSearchResult>;
    call(command: 'cancel'): TPromise<void>;
    call(command: string, arg?: any): TPromise<any>;
}
export declare class SearchWorkerChannel implements ISearchWorkerChannel {
    private worker;
    constructor(worker: SearchWorker);
    call(command: string, arg?: any): TPromise<any>;
}
export declare class SearchWorkerChannelClient implements ISearchWorker {
    private channel;
    constructor(channel: ISearchWorkerChannel);
    initialize(): TPromise<void>;
    search(args: ISearchWorkerSearchArgs): TPromise<ISearchWorkerSearchResult>;
    cancel(): TPromise<void>;
}
