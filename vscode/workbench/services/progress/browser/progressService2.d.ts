import 'vs/css!./media/progressService2';
import { IActivityBarService } from 'vs/workbench/services/activity/common/activityBarService';
import { IProgressService2, IProgressOptions, IProgress } from 'vs/platform/progress/common/progress';
import { IViewletService } from 'vs/workbench/services/viewlet/browser/viewlet';
import { TPromise } from 'vs/base/common/winjs.base';
export declare class ProgressService2 implements IProgressService2 {
    private _activityBar;
    private _viewletService;
    _serviceBrand: any;
    private _stack;
    constructor(_activityBar: IActivityBarService, _viewletService: IViewletService);
    withProgress(options: IProgressOptions, task: (progress: IProgress<{
        message?: string;
        percentage?: number;
    }>) => TPromise<any>): void;
    private _withWindowProgress(options, callback);
    private _updateWindowProgress(idx?);
    private _withViewletProgress(viewletId, task);
}
