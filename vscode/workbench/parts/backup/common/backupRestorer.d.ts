import { IUntitledEditorService } from 'vs/workbench/services/untitled/common/untitledEditorService';
import { IWorkbenchContribution } from 'vs/workbench/common/contributions';
import { IPartService } from 'vs/workbench/services/part/common/partService';
import { IBackupFileService } from 'vs/workbench/services/backup/common/backup';
import { IEditorGroupService } from 'vs/workbench/services/group/common/groupService';
import { IWorkbenchEditorService } from 'vs/workbench/services/editor/common/editorService';
import { ITextFileService } from 'vs/workbench/services/textfile/common/textfiles';
export declare class BackupRestorer implements IWorkbenchContribution {
    private untitledEditorService;
    private partService;
    private editorService;
    private backupFileService;
    private textFileService;
    private groupService;
    private static readonly UNTITLED_REGEX;
    constructor(untitledEditorService: IUntitledEditorService, partService: IPartService, editorService: IWorkbenchEditorService, backupFileService: IBackupFileService, textFileService: ITextFileService, groupService: IEditorGroupService);
    private restoreBackups();
    private doRestoreBackups();
    private doResolveOpenedBackups(backups);
    private doOpenEditors(resources);
    private resolveInput(resource, index, hasOpenedEditors);
    getId(): string;
}
