import { TPromise } from 'vs/base/common/winjs.base';
import { IDisposable } from 'vs/base/common/lifecycle';
import { ISearchConfiguration } from 'vs/platform/search/common/search';
import glob = require('vs/base/common/glob');
import { SymbolInformation } from 'vs/editor/common/modes';
import { IEditorGroupService } from 'vs/workbench/services/group/common/groupService';
import { IWorkspaceContextService } from 'vs/platform/workspace/common/workspace';
import URI from 'vs/base/common/uri';
export interface IWorkspaceSymbolProvider {
    provideWorkspaceSymbols(search: string): TPromise<SymbolInformation[]>;
    resolveWorkspaceSymbol?: (item: SymbolInformation) => TPromise<SymbolInformation>;
}
export declare namespace WorkspaceSymbolProviderRegistry {
    function register(support: IWorkspaceSymbolProvider): IDisposable;
    function all(): IWorkspaceSymbolProvider[];
}
export declare function getWorkspaceSymbols(query: string): TPromise<[IWorkspaceSymbolProvider, SymbolInformation[]][]>;
export interface IWorkbenchSearchConfiguration extends ISearchConfiguration {
    search: {
        quickOpen: {
            includeSymbols: boolean;
        };
        exclude: glob.IExpression;
        useRipgrep: boolean;
        useIgnoreFilesByDefault: boolean;
    };
}
/**
 * Helper to return all opened editors with resources not belonging to the currently opened workspace.
 */
export declare function getOutOfWorkspaceEditorResources(editorGroupService: IEditorGroupService, contextService: IWorkspaceContextService): URI[];
