import { TPromise } from 'vs/base/common/winjs.base';
import Event from 'vs/base/common/event';
import { ITelemetryData } from 'vs/platform/telemetry/common/telemetry';
import { IProcessEnvironment } from 'vs/base/common/platform';
import { ParsedArgs } from 'vs/platform/environment/common/environment';
import { IWorkspaceIdentifier } from 'vs/platform/workspaces/common/workspaces';
import { IRecentlyOpened } from 'vs/platform/history/common/history';
export declare const IWindowsService: {
    (...args: any[]): void;
    type: IWindowsService;
};
export interface INativeOpenDialogOptions {
    windowId?: number;
    forceNewWindow?: boolean;
    dialogOptions?: Electron.OpenDialogOptions;
    telemetryEventName?: string;
    telemetryExtraData?: ITelemetryData;
}
export interface IWindowsService {
    _serviceBrand: any;
    onWindowOpen: Event<number>;
    onWindowFocus: Event<number>;
    onWindowBlur: Event<number>;
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
    quit(): TPromise<void>;
    relaunch(options: {
        addArgs?: string[];
        removeArgs?: string[];
    }): TPromise<void>;
    whenSharedProcessReady(): TPromise<void>;
    toggleSharedProcess(): TPromise<void>;
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
}
export declare const IWindowService: {
    (...args: any[]): void;
    type: IWindowService;
};
export interface IWindowService {
    _serviceBrand: any;
    onDidChangeFocus: Event<boolean>;
    getCurrentWindowId(): number;
    pickFileFolderAndOpen(options: INativeOpenDialogOptions): TPromise<void>;
    pickFileAndOpen(options: INativeOpenDialogOptions): TPromise<void>;
    pickFolderAndOpen(options: INativeOpenDialogOptions): TPromise<void>;
    reloadWindow(): TPromise<void>;
    openDevTools(): TPromise<void>;
    toggleDevTools(): TPromise<void>;
    closeWorkspace(): TPromise<void>;
    openWorkspace(): TPromise<void>;
    createAndOpenWorkspace(folders?: string[], path?: string): TPromise<void>;
    saveAndOpenWorkspace(path: string): TPromise<void>;
    toggleFullScreen(): TPromise<void>;
    setRepresentedFilename(fileName: string): TPromise<void>;
    getRecentlyOpened(): TPromise<IRecentlyOpened>;
    focusWindow(): TPromise<void>;
    closeWindow(): TPromise<void>;
    isFocused(): TPromise<boolean>;
    setDocumentEdited(flag: boolean): TPromise<void>;
    isMaximized(): TPromise<boolean>;
    maximizeWindow(): TPromise<void>;
    unmaximizeWindow(): TPromise<void>;
    onWindowTitleDoubleClick(): TPromise<void>;
    showMessageBox(options: Electron.ShowMessageBoxOptions): number;
    showSaveDialog(options: Electron.SaveDialogOptions, callback?: (fileName: string) => void): string;
    showOpenDialog(options: Electron.OpenDialogOptions, callback?: (fileNames: string[]) => void): string[];
}
export declare type MenuBarVisibility = 'default' | 'visible' | 'toggle' | 'hidden';
export interface IWindowsConfiguration {
    window: IWindowSettings;
}
export interface IWindowSettings {
    openFilesInNewWindow: 'on' | 'off' | 'default';
    openFoldersInNewWindow: 'on' | 'off' | 'default';
    restoreWindows: 'all' | 'folders' | 'one' | 'none';
    reopenFolders: 'all' | 'one' | 'none';
    restoreFullscreen: boolean;
    zoomLevel: number;
    titleBarStyle: 'native' | 'custom';
    autoDetectHighContrast: boolean;
    menuBarVisibility: MenuBarVisibility;
    newWindowDimensions: 'default' | 'inherit' | 'maximized' | 'fullscreen';
    nativeTabs: boolean;
    enableMenuBarMnemonics: boolean;
    closeWhenEmpty: boolean;
}
export declare enum OpenContext {
    CLI = 0,
    DOCK = 1,
    MENU = 2,
    DIALOG = 3,
    DESKTOP = 4,
    API = 5,
}
export declare enum ReadyState {
    /**
     * This window has not loaded any HTML yet
     */
    NONE = 0,
    /**
     * This window is loading HTML
     */
    LOADING = 1,
    /**
     * This window is navigating to another HTML
     */
    NAVIGATING = 2,
    /**
     * This window is done loading HTML
     */
    READY = 3,
}
export interface IPath {
    filePath?: string;
    lineNumber?: number;
    columnNumber?: number;
}
export interface IOpenFileRequest {
    filesToOpen?: IPath[];
    filesToCreate?: IPath[];
    filesToDiff?: IPath[];
}
export interface IAddFoldersRequest {
    foldersToAdd: IPath[];
}
export interface IWindowConfiguration extends ParsedArgs, IOpenFileRequest {
    appRoot: string;
    execPath: string;
    isInitialStartup?: boolean;
    userEnv: IProcessEnvironment;
    nodeCachedDataDir: string;
    backupPath?: string;
    workspace?: IWorkspaceIdentifier;
    folderPath?: string;
    isISOKeyboard?: boolean;
    zoomLevel?: number;
    fullscreen?: boolean;
    highContrast?: boolean;
    baseTheme?: string;
    backgroundColor?: string;
    accessibilitySupport?: boolean;
    perfStartTime?: number;
    perfAppReady?: number;
    perfWindowLoadTime?: number;
}
