import { FileChangesEvent } from 'vs/platform/files/common/files';
import { IWorkspaceContextService } from 'vs/platform/workspace/common/workspace';
export declare class FileWatcher {
    private contextService;
    private ignored;
    private onFileChanges;
    private errorLogger;
    private verboseLogging;
    private isDisposed;
    constructor(contextService: IWorkspaceContextService, ignored: string[], onFileChanges: (changes: FileChangesEvent) => void, errorLogger: (msg: string) => void, verboseLogging: boolean);
    startWatching(): () => void;
    private onRawFileEvents(events);
    private onError(error);
}
