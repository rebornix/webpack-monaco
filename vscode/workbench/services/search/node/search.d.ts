import { PPromise, TPromise } from 'vs/base/common/winjs.base';
import { IExpression } from 'vs/base/common/glob';
import { IProgress, ILineMatch, IPatternInfo, ISearchStats, ISearchLog } from 'vs/platform/search/common/search';
export interface IFolderSearch {
    folder: string;
    excludePattern?: IExpression;
    includePattern?: IExpression;
    fileEncoding?: string;
}
export interface IRawSearch {
    folderQueries: IFolderSearch[];
    extraFiles?: string[];
    filePattern?: string;
    excludePattern?: IExpression;
    includePattern?: IExpression;
    contentPattern?: IPatternInfo;
    maxResults?: number;
    sortByScore?: boolean;
    cacheKey?: string;
    maxFilesize?: number;
    useRipgrep?: boolean;
    disregardIgnoreFiles?: boolean;
}
export interface IRawSearchService {
    fileSearch(search: IRawSearch): PPromise<ISerializedSearchComplete, ISerializedSearchProgressItem>;
    textSearch(search: IRawSearch): PPromise<ISerializedSearchComplete, ISerializedSearchProgressItem>;
    clearCache(cacheKey: string): TPromise<void>;
}
export interface IRawFileMatch {
    base?: string;
    relativePath: string;
    basename: string;
    size?: number;
}
export interface ISearchEngine<T> {
    search: (onResult: (matches: T) => void, onProgress: (progress: IProgress) => void, done: (error: Error, complete: ISerializedSearchComplete) => void) => void;
    cancel: () => void;
}
export interface ISerializedSearchComplete {
    limitHit: boolean;
    stats: ISearchStats;
}
export interface ISerializedFileMatch {
    path: string;
    lineMatches?: ILineMatch[];
    numMatches?: number;
}
export declare type ISerializedSearchProgressItem = ISerializedFileMatch | ISerializedFileMatch[] | IProgress | ISearchLog;
export declare type IFileSearchProgressItem = IRawFileMatch | IRawFileMatch[] | IProgress;
