import { IStorageService } from 'vs/platform/storage/node/storage';
import { TPromise } from 'vs/base/common/winjs.base';
import { IEnvironmentService, ParsedArgs } from 'vs/platform/environment/common/environment';
import { ILogService } from 'vs/platform/log/common/log';
import { IConfigurationService } from 'vs/platform/configuration/common/configuration';
import { MenuBarVisibility, IWindowConfiguration, ReadyState } from 'vs/platform/windows/common/windows';
import { ICodeWindow } from 'vs/platform/windows/electron-main/windows';
import { IWorkspaceIdentifier, IWorkspacesMainService } from 'vs/platform/workspaces/common/workspaces';
import { IBackupMainService } from 'vs/platform/backup/common/backup';
export interface IWindowState {
    width?: number;
    height?: number;
    x?: number;
    y?: number;
    mode?: WindowMode;
    display?: number;
}
export interface IWindowCreationOptions {
    state: IWindowState;
    extensionDevelopmentPath?: string;
    isExtensionTestHost?: boolean;
}
export declare enum WindowMode {
    Maximized = 0,
    Normal = 1,
    Minimized = 2,
    Fullscreen = 3,
}
export declare const defaultWindowState: (mode?: WindowMode) => IWindowState;
export declare class CodeWindow implements ICodeWindow {
    private logService;
    private environmentService;
    private configurationService;
    private storageService;
    private workspaceService;
    private backupService;
    static themeStorageKey: string;
    static themeBackgroundStorageKey: string;
    private static MIN_WIDTH;
    private static MIN_HEIGHT;
    private hiddenTitleBarStyle;
    private showTimeoutHandle;
    private _id;
    private _win;
    private _lastFocusTime;
    private _readyState;
    private windowState;
    private currentMenuBarVisibility;
    private toDispose;
    private representedFilename;
    private whenReadyCallbacks;
    private currentConfig;
    private pendingLoadConfig;
    constructor(config: IWindowCreationOptions, logService: ILogService, environmentService: IEnvironmentService, configurationService: IConfigurationService, storageService: IStorageService, workspaceService: IWorkspacesMainService, backupService: IBackupMainService);
    private createBrowserWindow(config);
    hasHiddenTitleBarStyle(): boolean;
    readonly isExtensionDevelopmentHost: boolean;
    readonly isExtensionTestHost: boolean;
    readonly extensionDevelopmentPath: string;
    readonly config: IWindowConfiguration;
    readonly id: number;
    readonly win: Electron.BrowserWindow;
    setRepresentedFilename(filename: string): void;
    getRepresentedFilename(): string;
    focus(): void;
    readonly lastFocusTime: number;
    readonly backupPath: string;
    readonly openedWorkspace: IWorkspaceIdentifier;
    readonly openedFolderPath: string;
    readonly openedFilePath: string;
    setReady(): void;
    ready(): TPromise<CodeWindow>;
    readonly readyState: ReadyState;
    private registerListeners();
    private onUntitledWorkspaceDeleted(workspace);
    private onConfigurationUpdated();
    private registerNavigationListenerOn(command, back, forward, acrossEditors);
    load(config: IWindowConfiguration, isReload?: boolean): void;
    reload(configuration?: IWindowConfiguration, cli?: ParsedArgs): void;
    private getUrl(windowConfiguration);
    private getBaseTheme();
    private getBackgroundColor();
    serializeWindowState(): IWindowState;
    private restoreWindowState(state?);
    private validateWindowState(state);
    getBounds(): Electron.Rectangle;
    toggleFullScreen(): void;
    private getMenuBarVisibility();
    setMenuBarVisibility(visibility: MenuBarVisibility, notify?: boolean): void;
    onWindowTitleDoubleClick(): void;
    close(): void;
    sendWhenReady(channel: string, ...args: any[]): void;
    send(channel: string, ...args: any[]): void;
    dispose(): void;
}
