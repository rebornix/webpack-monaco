import { IStorageService } from 'vs/platform/storage/node/storage';
import { ILogService } from 'vs/platform/log/common/log';
import { IPath } from 'vs/platform/windows/common/windows';
import CommonEvent from 'vs/base/common/event';
import { IWorkspaceIdentifier, IWorkspacesMainService, ISingleFolderWorkspaceIdentifier } from 'vs/platform/workspaces/common/workspaces';
import { IHistoryMainService, IRecentlyOpened } from 'vs/platform/history/common/history';
import { IEnvironmentService } from 'vs/platform/environment/common/environment';
export interface ILegacyRecentlyOpened extends IRecentlyOpened {
    folders: string[];
}
export declare class HistoryMainService implements IHistoryMainService {
    private storageService;
    private logService;
    private workspacesService;
    private environmentService;
    private static MAX_TOTAL_RECENT_ENTRIES;
    private static recentlyOpenedStorageKey;
    _serviceBrand: any;
    private _onRecentlyOpenedChange;
    onRecentlyOpenedChange: CommonEvent<void>;
    constructor(storageService: IStorageService, logService: ILogService, workspacesService: IWorkspacesMainService, environmentService: IEnvironmentService);
    private registerListeners();
    private onWorkspaceSaved(e);
    addRecentlyOpened(workspaces: (IWorkspaceIdentifier | ISingleFolderWorkspaceIdentifier)[], files: string[]): void;
    removeFromRecentlyOpened(pathsToRemove: string[]): void;
    clearRecentlyOpened(): void;
    getRecentlyOpened(currentWorkspace?: IWorkspaceIdentifier | ISingleFolderWorkspaceIdentifier, currentFiles?: IPath[]): IRecentlyOpened;
    private distinctFn(workspaceOrFile);
    private saveRecentlyOpened(recent);
    updateWindowsJumpList(): void;
}
