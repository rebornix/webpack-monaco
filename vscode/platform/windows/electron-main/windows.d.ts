import { TPromise } from 'vs/base/common/winjs.base';
import { OpenContext, IWindowConfiguration, ReadyState, INativeOpenDialogOptions } from 'vs/platform/windows/common/windows';
import { ParsedArgs } from 'vs/platform/environment/common/environment';
import Event from 'vs/base/common/event';
import { IProcessEnvironment } from 'vs/base/common/platform';
import { IWorkspaceIdentifier } from 'vs/platform/workspaces/common/workspaces';
export interface ICodeWindow {
    id: number;
    win: Electron.BrowserWindow;
    config: IWindowConfiguration;
    openedFolderPath: string;
    openedWorkspace: IWorkspaceIdentifier;
    lastFocusTime: number;
    readyState: ReadyState;
    close(): void;
    send(channel: string, ...args: any[]): void;
    sendWhenReady(channel: string, ...args: any[]): void;
    toggleFullScreen(): void;
    hasHiddenTitleBarStyle(): boolean;
    setRepresentedFilename(name: string): void;
    getRepresentedFilename(): string;
    onWindowTitleDoubleClick(): void;
}
export declare const IWindowsMainService: {
    (...args: any[]): void;
    type: IWindowsMainService;
};
export interface IWindowsCountChangedEvent {
    oldCount: number;
    newCount: number;
}
export interface IWindowsMainService {
    _serviceBrand: any;
    onWindowReady: Event<ICodeWindow>;
    onActiveWindowChanged: Event<ICodeWindow>;
    onWindowsCountChanged: Event<IWindowsCountChangedEvent>;
    onWindowClose: Event<number>;
    onWindowReload: Event<number>;
    ready(initialUserEnv: IProcessEnvironment): void;
    reload(win: ICodeWindow, cli?: ParsedArgs): void;
    openWorkspace(win?: ICodeWindow): void;
    createAndOpenWorkspace(win: ICodeWindow, folders?: string[], path?: string): void;
    saveAndOpenWorkspace(win: ICodeWindow, path: string): void;
    closeWorkspace(win: ICodeWindow): void;
    open(openConfig: IOpenConfiguration): ICodeWindow[];
    openExtensionDevelopmentHostWindow(openConfig: IOpenConfiguration): void;
    pickFileFolderAndOpen(options: INativeOpenDialogOptions): void;
    pickFolderAndOpen(options: INativeOpenDialogOptions): void;
    pickFileAndOpen(options: INativeOpenDialogOptions): void;
    focusLastActive(cli: ParsedArgs, context: OpenContext): ICodeWindow;
    getLastActiveWindow(): ICodeWindow;
    waitForWindowClose(windowId: number): TPromise<void>;
    openNewWindow(context: OpenContext): void;
    sendToFocused(channel: string, ...args: any[]): void;
    sendToAll(channel: string, payload: any, windowIdsToIgnore?: number[]): void;
    getFocusedWindow(): ICodeWindow;
    getWindowById(windowId: number): ICodeWindow;
    getWindows(): ICodeWindow[];
    getWindowCount(): number;
    quit(): void;
}
export interface IOpenConfiguration {
    context: OpenContext;
    cli: ParsedArgs;
    userEnv?: IProcessEnvironment;
    pathsToOpen?: string[];
    preferNewWindow?: boolean;
    forceNewWindow?: boolean;
    forceReuseWindow?: boolean;
    forceEmpty?: boolean;
    diffMode?: boolean;
    addMode?: boolean;
    forceOpenWorkspaceAsFile?: boolean;
    initialStartup?: boolean;
}
export interface ISharedProcess {
    whenReady(): TPromise<void>;
    toggle(): void;
}
