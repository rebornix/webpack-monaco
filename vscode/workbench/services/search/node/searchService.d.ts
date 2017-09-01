import { PPromise, TPromise } from 'vs/base/common/winjs.base';
import { ISearchComplete, ISearchProgressItem, ISearchQuery, ISearchService, ISearchResultProvider } from 'vs/platform/search/common/search';
import { IUntitledEditorService } from 'vs/workbench/services/untitled/common/untitledEditorService';
import { IModelService } from 'vs/editor/common/services/modelService';
import { IWorkspaceContextService } from 'vs/platform/workspace/common/workspace';
import { IConfigurationService } from 'vs/platform/configuration/common/configuration';
import { ISerializedSearchComplete, ISerializedSearchProgressItem } from './search';
import { IEnvironmentService } from 'vs/platform/environment/common/environment';
import { IDisposable } from 'vs/base/common/lifecycle';
export declare class SearchService implements ISearchService {
    private modelService;
    private untitledEditorService;
    private contextService;
    private configurationService;
    _serviceBrand: any;
    private diskSearch;
    private readonly searchProvider;
    constructor(modelService: IModelService, untitledEditorService: IUntitledEditorService, environmentService: IEnvironmentService, contextService: IWorkspaceContextService, configurationService: IConfigurationService);
    registerSearchResultProvider(provider: ISearchResultProvider): IDisposable;
    extendQuery(query: ISearchQuery): void;
    search(query: ISearchQuery): PPromise<ISearchComplete, ISearchProgressItem>;
    private getLocalResults(query);
    private matches(resource, query);
    clearCache(cacheKey: string): TPromise<void>;
}
export declare class DiskSearch implements ISearchResultProvider {
    private raw;
    constructor(verboseLogging: boolean, timeout?: number);
    search(query: ISearchQuery): PPromise<ISearchComplete, ISearchProgressItem>;
    static collectResults(request: PPromise<ISerializedSearchComplete, ISerializedSearchProgressItem>): PPromise<ISearchComplete, ISearchProgressItem>;
    private static createFileMatch(data);
    clearCache(cacheKey: string): TPromise<void>;
}
