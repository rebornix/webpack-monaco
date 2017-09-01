import lifecycle = require('vs/base/common/lifecycle');
import { TPromise } from 'vs/base/common/winjs.base';
import { ProgressBar } from 'vs/base/browser/ui/progressbar/progressbar';
import { IViewletService } from 'vs/workbench/services/viewlet/browser/viewlet';
import { IPanelService } from 'vs/workbench/services/panel/common/panelService';
import { IProgressService, IProgressRunner } from 'vs/platform/progress/common/progress';
export declare abstract class ScopedService {
    private viewletService;
    private panelService;
    private scopeId;
    protected toDispose: lifecycle.IDisposable[];
    constructor(viewletService: IViewletService, panelService: IPanelService, scopeId: string);
    registerListeners(): void;
    private onScopeClosed(scopeId);
    private onScopeOpened(scopeId);
    abstract onScopeActivated(): void;
    abstract onScopeDeactivated(): void;
}
export declare class WorkbenchProgressService extends ScopedService implements IProgressService {
    _serviceBrand: any;
    private isActive;
    private progressbar;
    private progressState;
    constructor(progressbar: ProgressBar, scopeId: string, isActive: boolean, viewletService: IViewletService, panelService: IPanelService);
    onScopeDeactivated(): void;
    onScopeActivated(): void;
    private clearProgressState();
    show(infinite: boolean, delay?: number): IProgressRunner;
    show(total: number, delay?: number): IProgressRunner;
    showWhile(promise: TPromise<any>, delay?: number): TPromise<void>;
    private doShowWhile(delay?);
    dispose(): void;
}
