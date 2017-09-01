import { IWorkspaceIdentifier } from 'vs/platform/workspaces/common/workspaces';
export interface IBackupWorkspacesFormat {
    rootWorkspaces: IWorkspaceIdentifier[];
    folderWorkspaces: string[];
    emptyWorkspaces: string[];
}
export declare const IBackupMainService: {
    (...args: any[]): void;
    type: IBackupMainService;
};
export interface IBackupMainService {
    _serviceBrand: any;
    isHotExitEnabled(): boolean;
    getWorkspaceBackups(): IWorkspaceIdentifier[];
    getFolderBackupPaths(): string[];
    getEmptyWindowBackupPaths(): string[];
    registerWorkspaceBackupSync(workspace: IWorkspaceIdentifier, migrateFrom?: string): string;
    registerFolderBackupSync(folderPath: string): string;
    registerEmptyWindowBackupSync(backupFolder?: string): string;
}
