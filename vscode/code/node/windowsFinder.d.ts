import { OpenContext } from 'vs/platform/windows/common/windows';
import { IWorkspaceIdentifier, ISingleFolderWorkspaceIdentifier, IResolvedWorkspace } from 'vs/platform/workspaces/common/workspaces';
export interface ISimpleWindow {
    openedWorkspace?: IWorkspaceIdentifier;
    openedFolderPath?: string;
    openedFilePath?: string;
    extensionDevelopmentPath?: string;
    lastFocusTime: number;
}
export interface IBestWindowOrFolderOptions<W extends ISimpleWindow> {
    windows: W[];
    newWindow: boolean;
    reuseWindow: boolean;
    context: OpenContext;
    filePath?: string;
    userHome?: string;
    codeSettingsFolder?: string;
    workspaceResolver: (workspace: IWorkspaceIdentifier) => IResolvedWorkspace;
}
export declare function findBestWindowOrFolderForFile<W extends ISimpleWindow>({windows, newWindow, reuseWindow, context, filePath, userHome, codeSettingsFolder, workspaceResolver}: IBestWindowOrFolderOptions<W>): W | string;
export declare function getLastActiveWindow<W extends ISimpleWindow>(windows: W[]): W;
export declare function findWindowOnWorkspace<W extends ISimpleWindow>(windows: W[], workspace: (IWorkspaceIdentifier | ISingleFolderWorkspaceIdentifier)): W;
export declare function findWindowOnExtensionDevelopmentPath<W extends ISimpleWindow>(windows: W[], extensionDevelopmentPath: string): W;
export declare function findWindowOnWorkspaceOrFolderPath<W extends ISimpleWindow>(windows: W[], path: string): W;
