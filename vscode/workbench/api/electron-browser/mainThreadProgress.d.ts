import { IProgressService2, IProgressOptions, IProgressStep } from 'vs/platform/progress/common/progress';
import { MainThreadProgressShape, IExtHostContext } from '../node/extHost.protocol';
export declare class MainThreadProgress implements MainThreadProgressShape {
    private _progressService;
    private _progress;
    constructor(extHostContext: IExtHostContext, progressService: IProgressService2);
    dispose(): void;
    $startProgress(handle: number, options: IProgressOptions): void;
    $progressReport(handle: number, message: IProgressStep): void;
    $progressEnd(handle: number): void;
    private _createTask(handle);
}
