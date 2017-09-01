import { PPromise, TPromise } from 'vs/base/common/winjs.base';
import uri from 'vs/base/common/uri';
import * as glob from 'vs/base/common/glob';
import { IFilesConfiguration } from 'vs/platform/files/common/files';
import { IDisposable } from 'vs/base/common/lifecycle';
export declare const ID = "searchService";
export declare const ISearchService: {
    (...args: any[]): void;
    type: ISearchService;
};
/**
 * A service that enables to search for files or with in files.
 */
export interface ISearchService {
    _serviceBrand: any;
    search(query: ISearchQuery): PPromise<ISearchComplete, ISearchProgressItem>;
    extendQuery(query: ISearchQuery): void;
    clearCache(cacheKey: string): TPromise<void>;
    registerSearchResultProvider(provider: ISearchResultProvider): IDisposable;
}
export interface ISearchResultProvider {
    search(query: ISearchQuery): PPromise<ISearchComplete, ISearchProgressItem>;
}
export interface IFolderQuery {
    folder: uri;
    excludePattern?: glob.IExpression;
    includePattern?: glob.IExpression;
    fileEncoding?: string;
}
export interface ICommonQueryOptions {
    extraFileResources?: uri[];
    filePattern?: string;
    fileEncoding?: string;
    maxResults?: number;
    sortByScore?: boolean;
    cacheKey?: string;
    useRipgrep?: boolean;
    disregardIgnoreFiles?: boolean;
    disregardExcludeSettings?: boolean;
}
export interface IQueryOptions extends ICommonQueryOptions {
    excludePattern?: string;
    includePattern?: string;
}
export interface ISearchQuery extends ICommonQueryOptions {
    type: QueryType;
    excludePattern?: glob.IExpression;
    includePattern?: glob.IExpression;
    contentPattern?: IPatternInfo;
    folderQueries?: IFolderQuery[];
    usingSearchPaths?: boolean;
}
export declare enum QueryType {
    File = 1,
    Text = 2,
}
export interface IPatternInfo {
    pattern: string;
    isRegExp?: boolean;
    isWordMatch?: boolean;
    wordSeparators?: string;
    isMultiline?: boolean;
    isCaseSensitive?: boolean;
}
export interface IFileMatch {
    resource?: uri;
    lineMatches?: ILineMatch[];
}
export interface ILineMatch {
    preview: string;
    lineNumber: number;
    offsetAndLengths: number[][];
}
export interface IProgress {
    total?: number;
    worked?: number;
}
export interface ISearchLog {
    message?: string;
}
export interface ISearchProgressItem extends IFileMatch, IProgress, ISearchLog {
}
export interface ISearchComplete {
    limitHit?: boolean;
    results: IFileMatch[];
    stats: ISearchStats;
}
export interface ISearchStats {
    fromCache: boolean;
    resultCount: number;
    unsortedResultTime?: number;
    sortedResultTime?: number;
}
export interface ICachedSearchStats extends ISearchStats {
    cacheLookupStartTime: number;
    cacheFilterStartTime: number;
    cacheLookupResultTime: number;
    cacheEntryCount: number;
    joined?: ISearchStats;
}
export interface IUncachedSearchStats extends ISearchStats {
    traversal: string;
    errors: string[];
    fileWalkStartTime: number;
    fileWalkResultTime: number;
    directoriesWalked: number;
    filesWalked: number;
    cmdForkStartTime?: number;
    cmdForkResultTime?: number;
    cmdResultCount?: number;
}
export declare class FileMatch implements IFileMatch {
    resource: uri;
    lineMatches: LineMatch[];
    constructor(resource: uri);
}
export declare class LineMatch implements ILineMatch {
    preview: string;
    lineNumber: number;
    offsetAndLengths: number[][];
    constructor(preview: string, lineNumber: number, offsetAndLengths: number[][]);
}
export interface ISearchConfiguration extends IFilesConfiguration {
    search: {
        exclude: glob.IExpression;
        useRipgrep: boolean;
        useIgnoreFilesByDefault: boolean;
    };
    editor: {
        wordSeparators: string;
    };
}
export declare function getExcludes(configuration: ISearchConfiguration): glob.IExpression;
export declare function pathIncludedInQuery(query: ISearchQuery, fsPath: string): boolean;
