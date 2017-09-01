import { ITimerService, IStartupMetrics, IInitData } from 'vs/workbench/services/timer/common/timerService';
export declare class TimerService implements ITimerService {
    private isEmptyWorkbench;
    _serviceBrand: any;
    readonly start: number;
    readonly appReady: number;
    readonly windowLoad: number;
    readonly beforeLoadWorkbenchMain: number;
    readonly afterLoadWorkbenchMain: number;
    readonly isInitialStartup: boolean;
    readonly hasAccessibilitySupport: boolean;
    beforeDOMContentLoaded: number;
    afterDOMContentLoaded: number;
    beforeWorkbenchOpen: number;
    workbenchStarted: number;
    beforeExtensionLoad: number;
    afterExtensionLoad: number;
    restoreViewletDuration: number;
    restoreEditorsDuration: number;
    private _startupMetrics;
    constructor(initData: IInitData, isEmptyWorkbench: boolean);
    readonly startupMetrics: IStartupMetrics;
    _computeStartupMetrics(): void;
}
