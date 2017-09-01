import { TPromise } from 'vs/base/common/winjs.base';
import URI from 'vs/base/common/uri';
import { IIconLabelOptions } from 'vs/base/browser/ui/iconLabel/iconLabel';
import { IModeService } from 'vs/editor/common/services/modeService';
import { IModelService } from 'vs/editor/common/services/modelService';
import { IWorkbenchThemeService } from 'vs/workbench/services/themes/common/workbenchThemeService';
import { IAutoFocus } from 'vs/base/parts/quickopen/common/quickOpen';
import { QuickOpenEntry, QuickOpenModel } from 'vs/base/parts/quickopen/browser/quickOpenModel';
import { QuickOpenHandler, EditorQuickOpenEntry } from 'vs/workbench/browser/quickopen';
import { EditorInput } from 'vs/workbench/common/editor';
import { IEditorGroupService } from 'vs/workbench/services/group/common/groupService';
import { IResourceInput } from 'vs/platform/editor/common/editor';
import { IWorkbenchEditorService } from 'vs/workbench/services/editor/common/editorService';
import { IConfigurationService } from 'vs/platform/configuration/common/configuration';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { ISearchService, ISearchStats, ISearchQuery } from 'vs/platform/search/common/search';
import { IWorkspaceContextService } from 'vs/platform/workspace/common/workspace';
import { IEnvironmentService } from 'vs/platform/environment/common/environment';
import { IRange } from 'vs/editor/common/core/range';
export declare class FileQuickOpenModel extends QuickOpenModel {
    stats: ISearchStats;
    constructor(entries: QuickOpenEntry[], stats?: ISearchStats);
}
export declare class FileEntry extends EditorQuickOpenEntry {
    private resource;
    private name;
    private description;
    private icon;
    private modeService;
    private modelService;
    private configurationService;
    private range;
    constructor(resource: URI, name: string, description: string, icon: string, editorService: IWorkbenchEditorService, modeService: IModeService, modelService: IModelService, configurationService: IConfigurationService, contextService: IWorkspaceContextService);
    getLabel(): string;
    getLabelOptions(): IIconLabelOptions;
    getAriaLabel(): string;
    getDescription(): string;
    getIcon(): string;
    getResource(): URI;
    setRange(range: IRange): void;
    isFile(): boolean;
    getInput(): IResourceInput | EditorInput;
}
export interface IOpenFileOptions {
    forceUseIcons: boolean;
}
export declare class OpenFileHandler extends QuickOpenHandler {
    private editorGroupService;
    private instantiationService;
    private themeService;
    private contextService;
    private searchService;
    private environmentService;
    private options;
    private queryBuilder;
    private cacheState;
    constructor(editorGroupService: IEditorGroupService, instantiationService: IInstantiationService, themeService: IWorkbenchThemeService, contextService: IWorkspaceContextService, searchService: ISearchService, environmentService: IEnvironmentService);
    setOptions(options: IOpenFileOptions): void;
    getResults(searchValue: string, maxSortedResults?: number): TPromise<FileQuickOpenModel>;
    private doFindResults(searchValue, cacheKey?, maxSortedResults?);
    hasShortResponseTime(): boolean;
    onOpen(): void;
    private cacheQuery(cacheKey);
    readonly isCacheLoaded: boolean;
    getGroupLabel(): string;
    getAutoFocus(searchValue: string): IAutoFocus;
}
/**
 * Exported for testing.
 */
export declare class CacheState {
    private doLoad;
    private doDispose;
    private previous;
    private _cacheKey;
    private query;
    private loadingPhase;
    private promise;
    constructor(cacheQuery: (cacheKey: string) => ISearchQuery, doLoad: (query: ISearchQuery) => TPromise<any>, doDispose: (cacheKey: string) => TPromise<void>, previous: CacheState);
    readonly cacheKey: string;
    readonly isLoaded: boolean;
    readonly isUpdating: boolean;
    load(): void;
    dispose(): void;
}
