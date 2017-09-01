import { IProgress } from 'vs/platform/search/common/search';
import { FileWalker } from 'vs/workbench/services/search/node/fileSearch';
import { ISerializedFileMatch, ISerializedSearchComplete, IRawSearch, ISearchEngine } from './search';
import { ITextSearchWorkerProvider } from './textSearchWorkerProvider';
export declare class Engine implements ISearchEngine<ISerializedFileMatch[]> {
    private static PROGRESS_FLUSH_CHUNK_SIZE;
    private config;
    private walker;
    private walkerError;
    private isCanceled;
    private isDone;
    private totalBytes;
    private processedBytes;
    private progressed;
    private walkerIsDone;
    private limitReached;
    private numResults;
    private workerProvider;
    private workers;
    private nextWorker;
    constructor(config: IRawSearch, walker: FileWalker, workerProvider: ITextSearchWorkerProvider);
    cancel(): void;
    initializeWorkers(): void;
    search(onResult: (match: ISerializedFileMatch[]) => void, onProgress: (progress: IProgress) => void, done: (error: Error, complete: ISerializedSearchComplete) => void): void;
}
