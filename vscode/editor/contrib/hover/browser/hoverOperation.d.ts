import { TPromise } from 'vs/base/common/winjs.base';
export interface IHoverComputer<Result> {
    /**
     * Overwrite the default hover time
     */
    getHoverTimeMillis?: () => number;
    /**
     * This is called after half the hover time
     */
    computeAsync?: () => TPromise<Result>;
    /**
     * This is called after all the hover time
     */
    computeSync?: () => Result;
    /**
     * This is called whenever one of the compute* methods returns a truey value
     */
    onResult: (result: Result, isFromSynchronousComputation: boolean) => void;
    /**
     * This is what will be sent as progress/complete to the computation promise
     */
    getResult: () => Result;
    getResultWithLoadingMessage: () => Result;
}
export declare class HoverOperation<Result> {
    static HOVER_TIME: number;
    private _computer;
    private _state;
    private _firstWaitScheduler;
    private _secondWaitScheduler;
    private _loadingMessageScheduler;
    private _asyncComputationPromise;
    private _asyncComputationPromiseDone;
    private _completeCallback;
    private _errorCallback;
    private _progressCallback;
    constructor(computer: IHoverComputer<Result>, success: (r: Result) => void, error: (err: any) => void, progress: (progress: any) => void);
    getComputer(): IHoverComputer<Result>;
    private _getHoverTimeMillis();
    private _triggerAsyncComputation();
    private _triggerSyncComputation();
    private _showLoadingMessage();
    private _withAsyncResult(asyncResult);
    private _onComplete(value);
    private _onError(error);
    private _onProgress(value);
    start(): void;
    cancel(): void;
}
