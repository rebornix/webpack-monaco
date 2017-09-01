import { Disposable } from 'vs/base/common/lifecycle';
import { MainThreadTreeViewsShape, IExtHostContext } from '../node/extHost.protocol';
import { IMessageService } from 'vs/platform/message/common/message';
export declare class MainThreadTreeViews extends Disposable implements MainThreadTreeViewsShape {
    private messageService;
    private _proxy;
    constructor(extHostContext: IExtHostContext, messageService: IMessageService);
    $registerView(treeViewId: string): void;
    $refresh(treeViewId: string, treeItemHandles: number[]): void;
    dispose(): void;
}
