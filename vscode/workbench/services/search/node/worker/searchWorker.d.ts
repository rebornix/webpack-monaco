import { TPromise } from 'vs/base/common/winjs.base';
import { ISerializedFileMatch } from '../search';
import { ILineMatch } from 'vs/platform/search/common/search';
import { ISearchWorker, ISearchWorkerSearchArgs, ISearchWorkerSearchResult } from './searchWorkerIpc';
export declare class SearchWorker implements ISearchWorker {
    private currentSearchEngine;
    initialize(): TPromise<void>;
    cancel(): TPromise<void>;
    search(args: ISearchWorkerSearchArgs): TPromise<ISearchWorkerSearchResult>;
}
export declare class SearchWorkerEngine {
    private nextSearch;
    private isCanceled;
    /**
     * Searches some number of the given paths concurrently, and starts searches in other paths when those complete.
     */
    searchBatch(args: ISearchWorkerSearchArgs): TPromise<ISearchWorkerSearchResult>;
    private _searchBatch(args, contentPattern, fileEncoding);
    cancel(): void;
    private searchInFile(absolutePath, contentPattern, fileEncoding, maxResults?);
    private readlinesAsync(filename, perLineCallback, options);
}
export declare class FileMatch implements ISerializedFileMatch {
    path: string;
    lineMatches: LineMatch[];
    constructor(path: string);
    addMatch(lineMatch: LineMatch): void;
    isEmpty(): boolean;
    serialize(): ISerializedFileMatch;
}
export declare class LineMatch implements ILineMatch {
    preview: string;
    lineNumber: number;
    offsetAndLengths: number[][];
    constructor(preview: string, lineNumber: number);
    getText(): string;
    getLineNumber(): number;
    addMatch(offset: number, length: number): void;
    serialize(): ILineMatch;
}
