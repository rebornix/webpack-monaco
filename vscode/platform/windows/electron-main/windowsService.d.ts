import { TPromise } from 'vs/base/common/winjs.base';
import { IDisposable } from 'vs/base/common/lifecycle';
import { IWindowsService, INativeOpenDialogOptions } from 'vs/platform/windows/common/windows';
import { IEnvironmentService } from 'vs/platform/environment/common/environment';
import Event from 'vs/base/common/event';
import { IURLService } from 'vs/platform/url/common/url';
import { ILifecycleService } from 'vs/platform/lifecycle/electron-main/lifecycleMain';
import { IWindowsMainService, ISharedProcess } from 'vs/platform/windows/electron-main/windows';
import { IHistoryMainService, IRecentlyOpened } from 'vs/platform/history/common/history';
import { IWorkspaceIdentifier } from 'vs/platform/workspaces/common/workspaces';
export declare class WindowsService implements IWindowsService, IDisposable {
    private sharedProcess;
    private windowsMainService;
    private environmentService;
    private lifecycleService;
    private historyService;
    _serviceBrand: any;
    private disposables;
    readonly onWindowOpen: Event<number>;
    readonly onWindowFocus: Event<number>;
    readonly onWindowBlur: Event<number>;
    constructor(sharedProcess: ISharedProcess, windowsMainService: IWindowsMainService, environmentService: IEnvironmentService, urlService: IURLService, lifecycleService: ILifecycleService, historyService: IHistoryMainService);
    pickFileFolderAndOpen(options: INativeOpenDialogOptions): TPromise<void>;
    pickFileAndOpen(options: INativeOpenDialogOptions): TPromise<void>;
    pickFolderAndOpen(options: INativeOpenDialogOptions): TPromise<void>;
    reloadWindow(windowId: number): TPromise<void>;
    openDevTools(windowId: number): TPromise<void>;
    toggleDevTools(windowId: number): TPromise<void>;
    closeWorkspace(windowId: number): TPromise<void>;
    openWorkspace(windowId: number): TPromise<void>;
    createAndOpenWorkspace(windowId: number, folders?: string[], path?: string): TPromise<void>;
    saveAndOpenWorkspace(windowId: number, path: string): TPromise<void>;
    toggleFullScreen(windowId: number): TPromise<void>;
    setRepresentedFilename(windowId: number, fileName: string): TPromise<void>;
    addRecentlyOpened(files: string[]): TPromise<void>;
    removeFromRecentlyOpened(paths: string[]): TPromise<void>;
    clearRecentlyOpened(): TPromise<void>;
    getRecentlyOpened(windowId: number): TPromise<IRecentlyOpened>;
    focusWindow(windowId: number): TPromise<void>;
    closeWindow(windowId: number): TPromise<void>;
    isFocused(windowId: number): TPromise<boolean>;
    isMaximized(windowId: number): TPromise<boolean>;
    maximizeWindow(windowId: number): TPromise<void>;
    unmaximizeWindow(windowId: number): TPromise<void>;
    onWindowTitleDoubleClick(windowId: number): TPromise<void>;
    setDocumentEdited(windowId: number, flag: boolean): TPromise<void>;
    openWindow(paths: string[], options?: {
        forceNewWindow?: boolean;
        forceReuseWindow?: boolean;
        forceOpenWorkspaceAsFile?: boolean;
    }): TPromise<void>;
    openNewWindow(): TPromise<void>;
    showWindow(windowId: number): TPromise<void>;
    getWindows(): TPromise<{
        id: number;
        workspace?: IWorkspaceIdentifier;
        folderPath?: string;
        title: string;
        filename?: string;
    }[]>;
    getWindowCount(): TPromise<number>;
    log(severity: string, ...messages: string[]): TPromise<void>;
    showItemInFolder(path: string): TPromise<void>;
    openExternal(url: string): TPromise<boolean>;
    startCrashReporter(config: Electron.CrashReporterStartOptions): TPromise<void>;
    quit(): TPromise<void>;
    relaunch(options: {
        addArgs?: string[];
        removeArgs?: string[];
    }): TPromise<void>;
    whenSharedProcessReady(): TPromise<void>;
    toggleSharedProcess(): TPromise<void>;
    private openFileForURI(uri);
    /**
     * This should only fire whenever an extension URL is open
     * and there are no windows to handle it.
     */
    private openExtensionForURI(uri);
    dispose(): void;
}
