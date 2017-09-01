import { IPath } from 'vs/platform/windows/common/windows';
import CommonEvent from 'vs/base/common/event';
import { IWorkspaceIdentifier, ISingleFolderWorkspaceIdentifier } from 'vs/platform/workspaces/common/workspaces';
export declare const IHistoryMainService: {
    (...args: any[]): void;
    type: IHistoryMainService;
};
export interface IRecentlyOpened {
    workspaces: (IWorkspaceIdentifier | ISingleFolderWorkspaceIdentifier)[];
    files: string[];
}
export interface IHistoryMainService {
    _serviceBrand: any;
    onRecentlyOpenedChange: CommonEvent<void>;
    addRecentlyOpened(workspaces: (IWorkspaceIdentifier | ISingleFolderWorkspaceIdentifier)[], files: string[]): void;
    getRecentlyOpened(currentWorkspace?: IWorkspaceIdentifier | ISingleFolderWorkspaceIdentifier, currentFiles?: IPath[]): IRecentlyOpened;
    removeFromRecentlyOpened(paths: string[]): void;
    clearRecentlyOpened(): void;
    updateWindowsJumpList(): void;
}
