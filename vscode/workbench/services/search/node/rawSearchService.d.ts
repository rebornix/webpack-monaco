import { PPromise, TPromise } from 'vs/base/common/winjs.base';
import { IRawSearchService, IRawSearch, IRawFileMatch, ISerializedSearchProgressItem, ISerializedSearchComplete, ISearchEngine } from './search';
export declare class SearchService implements IRawSearchService {
    private static BATCH_SIZE;
    private caches;
    private textSearchWorkerProvider;
    fileSearch(config: IRawSearch): PPromise<ISerializedSearchComplete, ISerializedSearchProgressItem>;
    textSearch(config: IRawSearch): PPromise<ISerializedSearchComplete, ISerializedSearchProgressItem>;
    ripgrepTextSearch(config: IRawSearch): PPromise<ISerializedSearchComplete, ISerializedSearchProgressItem>;
    legacyTextSearch(config: IRawSearch): PPromise<ISerializedSearchComplete, ISerializedSearchProgressItem>;
    doFileSearch(EngineClass: {
        new (config: IRawSearch): ISearchEngine<IRawFileMatch>;
    }, config: IRawSearch, batchSize?: number): PPromise<ISerializedSearchComplete, ISerializedSearchProgressItem>;
    private rawMatchToSearchItem(match);
    private doSortedSearch(engine, config);
    private getOrCreateCache(cacheKey);
    private trySortedSearchFromCache(config);
    private sortResults(config, results, scorerCache);
    private sendProgress(results, progressCb, batchSize);
    private getResultsFromCache(cache, searchValue);
    private doTextSearch(engine, batchSize);
    private doSearch(engine, batchSize?);
    clearCache(cacheKey: string): TPromise<void>;
    private preventCancellation<C, P>(promise);
}
