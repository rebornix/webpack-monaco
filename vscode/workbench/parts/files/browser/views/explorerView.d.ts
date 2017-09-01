import { TPromise } from 'vs/base/common/winjs.base';
import { Builder } from 'vs/base/browser/builder';
import URI from 'vs/base/common/uri';
import { IAction } from 'vs/base/common/actions';
import { ITree } from 'vs/base/parts/tree/browser/tree';
import { IFileService } from 'vs/platform/files/common/files';
import { FileViewletState } from 'vs/workbench/parts/files/browser/views/explorerViewer';
import { IEditorGroupService } from 'vs/workbench/services/group/common/groupService';
import { CollapsibleView, IViewletViewOptions } from 'vs/workbench/parts/views/browser/views';
import { IListService } from 'vs/platform/list/browser/listService';
import { IWorkbenchEditorService } from 'vs/workbench/services/editor/common/editorService';
import { IPartService } from 'vs/workbench/services/part/common/partService';
import { IWorkspaceContextService } from 'vs/platform/workspace/common/workspace';
import { IConfigurationService } from 'vs/platform/configuration/common/configuration';
import { IKeybindingService } from 'vs/platform/keybinding/common/keybinding';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { IProgressService } from 'vs/platform/progress/common/progress';
import { IContextMenuService } from 'vs/platform/contextview/browser/contextView';
import { IMessageService } from 'vs/platform/message/common/message';
import { IContextKeyService } from 'vs/platform/contextkey/common/contextkey';
import { IWorkbenchThemeService } from 'vs/workbench/services/themes/common/workbenchThemeService';
import { IEnvironmentService } from 'vs/platform/environment/common/environment';
export interface IExplorerViewOptions extends IViewletViewOptions {
    viewletState: FileViewletState;
}
export declare class ExplorerView extends CollapsibleView {
    private messageService;
    private instantiationService;
    private editorGroupService;
    private contextService;
    private progressService;
    private listService;
    private editorService;
    private fileService;
    private partService;
    private configurationService;
    private themeService;
    private environmentService;
    static ID: string;
    private static EXPLORER_FILE_CHANGES_REACT_DELAY;
    private static EXPLORER_FILE_CHANGES_REFRESH_DELAY;
    private static EXPLORER_IMPORT_REFRESH_DELAY;
    private static MEMENTO_LAST_ACTIVE_FILE_RESOURCE;
    private static MEMENTO_EXPANDED_FOLDER_RESOURCES;
    readonly id: string;
    private explorerViewer;
    private filter;
    private viewletState;
    private explorerRefreshDelayer;
    private explorerImportDelayer;
    private resourceContext;
    private folderContext;
    private filesExplorerFocusedContext;
    private explorerFocusedContext;
    private fileEventsFilter;
    private shouldRefresh;
    private autoReveal;
    private sortOrder;
    private settings;
    constructor(initialSize: number, options: IExplorerViewOptions, messageService: IMessageService, contextMenuService: IContextMenuService, instantiationService: IInstantiationService, editorGroupService: IEditorGroupService, contextService: IWorkspaceContextService, progressService: IProgressService, listService: IListService, editorService: IWorkbenchEditorService, fileService: IFileService, partService: IPartService, keybindingService: IKeybindingService, contextKeyService: IContextKeyService, configurationService: IConfigurationService, themeService: IWorkbenchThemeService, environmentService: IEnvironmentService);
    private getFileEventsExcludes(root?);
    renderHeader(container: HTMLElement): void;
    name: string;
    renderBody(container: HTMLElement): void;
    getActions(): IAction[];
    create(): TPromise<void>;
    private onEditorsChanged();
    private onConfigurationUpdated(configuration, refresh?);
    focusBody(): void;
    setVisible(visible: boolean): TPromise<void>;
    private openFocusedElement(preserveFocus?);
    private getActiveFile();
    private readonly isCreated;
    private readonly model;
    createViewer(container: Builder): ITree;
    getOptimalWidth(): number;
    private onFileOperation(e);
    private onFileChanges(e);
    private shouldRefreshFromEvent(e);
    private filterFileEvents(e);
    private refreshFromEvent();
    /**
     * Refresh the contents of the explorer to get up to date data from the disk about the file structure.
     */
    refresh(): TPromise<void>;
    private doRefresh();
    /**
     * Given a stat, fills an array of path that make all folders below the stat that are resolved directories.
     */
    private getResolvedDirectories(stat, resolvedDirectories);
    /**
     * Selects and reveal the file element provided by the given resource if its found in the explorer. Will try to
     * resolve the path from the disk in case the explorer is not yet expanded to the file yet.
     */
    select(resource: URI, reveal?: boolean): TPromise<void>;
    private hasSelection(resource);
    private doSelect(fileStat, reveal);
    shutdown(): void;
    dispose(): void;
}
