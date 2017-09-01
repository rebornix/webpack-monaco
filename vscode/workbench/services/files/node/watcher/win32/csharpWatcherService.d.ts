import { IRawFileChange } from 'vs/workbench/services/files/node/watcher/common';
export declare class OutOfProcessWin32FolderWatcher {
    private watchedFolder;
    private ignored;
    private eventCallback;
    private errorCallback;
    private verboseLogging;
    private static MAX_RESTARTS;
    private static changeTypeMap;
    private handle;
    private restartCounter;
    constructor(watchedFolder: string, ignored: string[], eventCallback: (events: IRawFileChange[]) => void, errorCallback: (error: string) => void, verboseLogging: boolean);
    private startWatcher();
    private onError(error);
    private onExit(code, signal);
    dispose(): void;
}
