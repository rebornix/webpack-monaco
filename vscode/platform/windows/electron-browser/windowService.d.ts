import Event from 'vs/base/common/event';
import { TPromise } from 'vs/base/common/winjs.base';
import { IWindowService, IWindowsService, INativeOpenDialogOptions } from 'vs/platform/windows/common/windows';
import { IRecentlyOpened } from 'vs/platform/history/common/history';
export declare class WindowService implements IWindowService {
    private windowId;
    private windowsService;
    readonly onDidChangeFocus: Event<boolean>;
    _serviceBrand: any;
    constructor(windowId: number, windowsService: IWindowsService);
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
    closeWindow(): TPromise<void>;
    toggleFullScreen(): TPromise<void>;
    setRepresentedFilename(fileName: string): TPromise<void>;
    getRecentlyOpened(): TPromise<IRecentlyOpened>;
    focusWindow(): TPromise<void>;
    isFocused(): TPromise<boolean>;
    isMaximized(): TPromise<boolean>;
    maximizeWindow(): TPromise<void>;
    unmaximizeWindow(): TPromise<void>;
    onWindowTitleDoubleClick(): TPromise<void>;
    setDocumentEdited(flag: boolean): TPromise<void>;
    showMessageBox(options: Electron.ShowMessageBoxOptions): number;
    showSaveDialog(options: Electron.SaveDialogOptions, callback?: (fileName: string) => void): string;
    showOpenDialog(options: Electron.OpenDialogOptions, callback?: (fileNames: string[]) => void): string[];
}
