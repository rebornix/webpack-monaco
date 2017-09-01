import { ISCMService } from 'vs/workbench/services/scm/common/scm';
import { IActivityBarService } from 'vs/workbench/services/activity/common/activityBarService';
import { IWorkbenchContribution } from 'vs/workbench/common/contributions';
import { IContextKeyService } from 'vs/platform/contextkey/common/contextkey';
import { IStatusbarService } from 'vs/platform/statusbar/common/statusbar';
export declare class StatusUpdater implements IWorkbenchContribution {
    private scmService;
    private activityBarService;
    private static ID;
    private badgeDisposable;
    private disposables;
    constructor(scmService: ISCMService, activityBarService: IActivityBarService);
    private onDidAddRepository(repository);
    getId(): string;
    private render();
    dispose(): void;
}
export declare class StatusBarController implements IWorkbenchContribution {
    private scmService;
    private statusbarService;
    private static ID;
    private statusBarDisposable;
    private focusDisposable;
    private focusedRepository;
    private focusedProviderContextKey;
    private disposables;
    constructor(scmService: ISCMService, statusbarService: IStatusbarService, contextKeyService: IContextKeyService);
    getId(): string;
    private onDidAddRepository(repository);
    private onDidFocusRepository(repository);
    private render(repository);
    dispose(): void;
}
