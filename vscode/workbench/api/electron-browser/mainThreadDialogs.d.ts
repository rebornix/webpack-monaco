import { TPromise } from 'vs/base/common/winjs.base';
import { MainThreadDiaglogsShape, IExtHostContext, MainThreadDialogOptions } from '../node/extHost.protocol';
import { IWindowService } from 'vs/platform/windows/common/windows';
export declare class MainThreadDialogs implements MainThreadDiaglogsShape {
    private readonly _windowService;
    constructor(context: IExtHostContext, _windowService: IWindowService);
    dispose(): void;
    $showOpenDialog(options: MainThreadDialogOptions): TPromise<string[]>;
    private static _convertOptions(options);
}
