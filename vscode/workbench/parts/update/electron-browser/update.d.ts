import { TPromise } from 'vs/base/common/winjs.base';
import { IAction, Action } from 'vs/base/common/actions';
import { IMessageService } from 'vs/platform/message/common/message';
import { IWorkbenchEditorService } from 'vs/workbench/services/editor/common/editorService';
import { IActivityBarService } from 'vs/workbench/services/activity/common/activityBarService';
import { IInstantiationService, ServicesAccessor } from 'vs/platform/instantiation/common/instantiation';
import { IGlobalActivity } from 'vs/workbench/browser/activity';
import { IOpenerService } from 'vs/platform/opener/common/opener';
import { ICommandService } from 'vs/platform/commands/common/commands';
import { IWorkbenchContribution } from 'vs/workbench/common/contributions';
import { IStorageService } from 'vs/platform/storage/common/storage';
import { IUpdateService } from 'vs/platform/update/common/update';
export declare function loadReleaseNotes(accessor: ServicesAccessor, version: string): TPromise<string>;
export declare class OpenLatestReleaseNotesInBrowserAction extends Action {
    private openerService;
    constructor(openerService: IOpenerService);
    run(): TPromise<any>;
}
export declare abstract class AbstractShowReleaseNotesAction extends Action {
    private returnValue;
    private version;
    private editorService;
    private instantiationService;
    constructor(id: string, label: string, returnValue: boolean, version: string, editorService: IWorkbenchEditorService, instantiationService: IInstantiationService);
    run(): TPromise<boolean>;
}
export declare class ShowReleaseNotesAction extends AbstractShowReleaseNotesAction {
    constructor(returnValue: boolean, version: string, editorService: IWorkbenchEditorService, instantiationService: IInstantiationService);
}
export declare class ShowCurrentReleaseNotesAction extends AbstractShowReleaseNotesAction {
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, editorService: IWorkbenchEditorService, instantiationService: IInstantiationService);
}
export declare class DownloadAction extends Action {
    private url;
    private updateService;
    constructor(url: string, updateService: IUpdateService);
    run(): TPromise<void>;
}
export declare class ProductContribution implements IWorkbenchContribution {
    private static KEY;
    getId(): string;
    constructor(storageService: IStorageService, instantiationService: IInstantiationService, messageService: IMessageService, editorService: IWorkbenchEditorService);
}
export declare class Win3264BitContribution implements IWorkbenchContribution {
    private static KEY;
    private static URL;
    private static INSIDER_URL;
    getId(): string;
    constructor(storageService: IStorageService, instantiationService: IInstantiationService, messageService: IMessageService, editorService: IWorkbenchEditorService);
}
export declare class UpdateContribution implements IGlobalActivity {
    private storageService;
    private commandService;
    private instantiationService;
    private messageService;
    private updateService;
    private activityBarService;
    private static readonly showCommandsId;
    private static readonly openSettingsId;
    private static readonly openKeybindingsId;
    private static readonly selectColorThemeId;
    private static readonly selectIconThemeId;
    readonly id: string;
    readonly name: string;
    readonly cssClass: string;
    private disposables;
    constructor(storageService: IStorageService, commandService: ICommandService, instantiationService: IInstantiationService, messageService: IMessageService, updateService: IUpdateService, editorService: IWorkbenchEditorService, activityBarService: IActivityBarService);
    private onUpdateAvailable(version);
    private showUpdateNotification(version);
    private onUpdateNotAvailable(explicit);
    private onError(err);
    getActions(): IAction[];
    private getUpdateAction();
    dispose(): void;
}
