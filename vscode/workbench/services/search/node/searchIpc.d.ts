import { PPromise, TPromise } from 'vs/base/common/winjs.base';
import { IChannel } from 'vs/base/parts/ipc/common/ipc';
import { IRawSearchService, IRawSearch, ISerializedSearchComplete, ISerializedSearchProgressItem } from './search';
export interface ISearchChannel extends IChannel {
    call(command: 'fileSearch', search: IRawSearch): PPromise<ISerializedSearchComplete, ISerializedSearchProgressItem>;
    call(command: 'textSearch', search: IRawSearch): PPromise<ISerializedSearchComplete, ISerializedSearchProgressItem>;
    call(command: 'clearCache', cacheKey: string): TPromise<void>;
    call(command: string, arg: any): TPromise<any>;
}
export declare class SearchChannel implements ISearchChannel {
    private service;
    constructor(service: IRawSearchService);
    call(command: string, arg: any): TPromise<any>;
}
export declare class SearchChannelClient implements IRawSearchService {
    private channel;
    constructor(channel: ISearchChannel);
    fileSearch(search: IRawSearch): PPromise<ISerializedSearchComplete, ISerializedSearchProgressItem>;
    textSearch(search: IRawSearch): PPromise<ISerializedSearchComplete, ISerializedSearchProgressItem>;
    clearCache(cacheKey: string): TPromise<void>;
}
