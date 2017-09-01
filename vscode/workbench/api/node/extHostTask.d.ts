import { TPromise } from 'vs/base/common/winjs.base';
import { IExtensionDescription } from 'vs/platform/extensions/common/extensions';
import * as TaskSystem from 'vs/workbench/parts/tasks/common/tasks';
import { ExtHostTaskShape, IMainContext } from 'vs/workbench/api/node/extHost.protocol';
import * as vscode from 'vscode';
export declare class ExtHostTask implements ExtHostTaskShape {
    private _proxy;
    private _handleCounter;
    private _handlers;
    constructor(mainContext: IMainContext);
    registerTaskProvider(extension: IExtensionDescription, provider: vscode.TaskProvider): vscode.Disposable;
    $provideTasks(handle: number): TPromise<TaskSystem.TaskSet>;
    private nextHandle();
}
