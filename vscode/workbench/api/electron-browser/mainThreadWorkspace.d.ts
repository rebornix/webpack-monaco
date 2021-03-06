import URI from 'vs/base/common/uri';
import { ISearchService } from 'vs/platform/search/common/search';
import { IWorkspaceContextService } from 'vs/platform/workspace/common/workspace';
import { IWorkbenchEditorService } from 'vs/workbench/services/editor/common/editorService';
import { ITextFileService } from 'vs/workbench/services/textfile/common/textfiles';
import { IResourceEdit } from 'vs/editor/common/services/bulkEdit';
import { TPromise } from 'vs/base/common/winjs.base';
import { MainThreadWorkspaceShape, IExtHostContext } from '../node/extHost.protocol';
import { ITextModelService } from 'vs/editor/common/services/resolverService';
import { IFileService } from 'vs/platform/files/common/files';
export declare class MainThreadWorkspace implements MainThreadWorkspaceShape {
    private readonly _searchService;
    private readonly _contextService;
    private readonly _textFileService;
    private readonly _editorService;
    private readonly _textModelResolverService;
    private readonly _fileService;
    private readonly _toDispose;
    private readonly _activeSearches;
    private readonly _proxy;
    constructor(extHostContext: IExtHostContext, _searchService: ISearchService, _contextService: IWorkspaceContextService, _textFileService: ITextFileService, _editorService: IWorkbenchEditorService, _textModelResolverService: ITextModelService, _fileService: IFileService);
    dispose(): void;
    private _onDidChangeWorkspace();
    $startSearch(include: string, exclude: string, maxResults: number, requestId: number): Thenable<URI[]>;
    $cancelSearch(requestId: number): Thenable<boolean>;
    $saveAll(includeUntitled?: boolean): Thenable<boolean>;
    $applyWorkspaceEdit(edits: IResourceEdit[]): TPromise<boolean>;
    private _idPool;
    private readonly _provider;
    private readonly _searchSessions;
    $registerFileSystemProvider(handle: number, authority: string): void;
    $unregisterFileSystemProvider(handle: number): void;
    $onFileSystemChange(handle: number, resource: URI): void;
    $updateSearchSession(session: number, data: URI): void;
    $finishSearchSession(session: number, err?: any): void;
}
