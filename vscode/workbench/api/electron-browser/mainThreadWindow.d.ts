import { TPromise } from 'vs/base/common/winjs.base';
import { IWindowService } from 'vs/platform/windows/common/windows';
import { MainThreadWindowShape, IExtHostContext } from '../node/extHost.protocol';
export declare class MainThreadWindow implements MainThreadWindowShape {
    private windowService;
    private readonly proxy;
    private disposables;
    constructor(extHostContext: IExtHostContext, windowService: IWindowService);
    $getWindowVisibility(): TPromise<boolean>;
    dispose(): void;
}
