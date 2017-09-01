import { Progress, ProgressOptions, CancellationToken } from 'vscode';
import { MainThreadProgressShape } from './extHost.protocol';
import { IExtensionDescription } from 'vs/platform/extensions/common/extensions';
import { IProgressStep } from 'vs/platform/progress/common/progress';
export declare class ExtHostProgress {
    private _proxy;
    private _handles;
    constructor(proxy: MainThreadProgressShape);
    withProgress<R>(extension: IExtensionDescription, options: ProgressOptions, task: (progress: Progress<IProgressStep>, token: CancellationToken) => Thenable<R>): Thenable<R>;
    private _withProgress<R>(handle, task);
}
