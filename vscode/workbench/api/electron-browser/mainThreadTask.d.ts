import { TPromise } from 'vs/base/common/winjs.base';
import { ITaskService } from 'vs/workbench/parts/tasks/common/taskService';
import { MainThreadTaskShape, IExtHostContext } from '../node/extHost.protocol';
export declare class MainThreadTask implements MainThreadTaskShape {
    private _taskService;
    private _proxy;
    private _activeHandles;
    constructor(extHostContext: IExtHostContext, _taskService: ITaskService);
    dispose(): void;
    $registerTaskProvider(handle: number): TPromise<void>;
    $unregisterTaskProvider(handle: number): TPromise<any>;
}
