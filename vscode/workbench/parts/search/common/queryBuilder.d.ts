import * as glob from 'vs/base/common/glob';
import uri from 'vs/base/common/uri';
import { IWorkspaceContextService } from 'vs/platform/workspace/common/workspace';
import { IPatternInfo, IQueryOptions, ISearchQuery } from 'vs/platform/search/common/search';
import { IConfigurationService } from 'vs/platform/configuration/common/configuration';
export interface ISearchPathPattern {
    searchPath: uri;
    pattern?: string;
}
export interface ISearchPathsResult {
    searchPaths?: ISearchPathPattern[];
    pattern?: glob.IExpression;
}
export declare class QueryBuilder {
    private configurationService;
    private workspaceContextService;
    constructor(configurationService: IConfigurationService, workspaceContextService: IWorkspaceContextService);
    text(contentPattern: IPatternInfo, folderResources?: uri[], options?: IQueryOptions): ISearchQuery;
    file(folderResources?: uri[], options?: IQueryOptions): ISearchQuery;
    private query(type, contentPattern, folderResources?, options?);
    /**
     * Take the includePattern as seen in the search viewlet, and split into components that look like searchPaths, and
     * glob patterns. Glob patterns are expanded from 'foo/bar' to '{foo/bar/**, **\/foo/bar}.
     *
     * Public for test.
     */
    parseSearchPaths(pattern: string): ISearchPathsResult;
    /**
     * Takes the input from the excludePattern as seen in the searchViewlet. Runs the same algorithm as parseSearchPaths,
     * but the result is a single IExpression that encapsulates all the exclude patterns.
     */
    parseExcludePattern(pattern: string): glob.IExpression | undefined;
    private mergeExcludesFromFolderQueries(folderQueries);
    private getAbsoluteIExpression(expr, root);
    private getExcludesForFolder(folderConfig, options);
    /**
     * Split search paths (./ or absolute paths in the includePatterns) into absolute paths and globs applied to those paths
     */
    private expandSearchPathPatterns(searchPaths);
    /**
     * Takes a searchPath like `./a/foo` and expands it to absolute paths for all the workspaces it matches.
     */
    private expandAbsoluteSearchPaths(searchPath);
    private getFolderQueryForSearchPath(searchPath);
    private getFolderQueryForRoot(folder, options?);
}
