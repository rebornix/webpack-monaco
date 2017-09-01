import { FileChangesEvent } from 'vs/platform/files/common/files';
import { IWorkspaceContextService } from 'vs/platform/workspace/common/workspace';
import { IConfigurationService } from 'vs/platform/configuration/common/configuration';
export declare class FileWatcher {
    private contextService;
    private configurationService;
    private onFileChanges;
    private errorLogger;
    private verboseLogging;
    private static MAX_RESTARTS;
    private service;
    private isDisposed;
    private restartCounter;
    private toDispose;
    constructor(contextService: IWorkspaceContextService, configurationService: IConfigurationService, onFileChanges: (changes: FileChangesEvent) => void, errorLogger: (msg: string) => void, verboseLogging: boolean);
    startWatching(): () => void;
    private updateRoots();
    private onRawFileEvents(events);
    private dispose();
}
