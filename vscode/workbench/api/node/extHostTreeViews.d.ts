import * as vscode from 'vscode';
import { TPromise } from 'vs/base/common/winjs.base';
import { ExtHostTreeViewsShape, MainThreadTreeViewsShape } from './extHost.protocol';
import { ITreeItem } from 'vs/workbench/parts/views/common/views';
import { ExtHostCommands } from 'vs/workbench/api/node/extHostCommands';
export declare class ExtHostTreeViews implements ExtHostTreeViewsShape {
    private _proxy;
    private commands;
    private treeViews;
    constructor(_proxy: MainThreadTreeViewsShape, commands: ExtHostCommands);
    registerTreeDataProvider<T>(id: string, treeDataProvider: vscode.TreeDataProvider<T>): vscode.Disposable;
    $getElements(treeViewId: string): TPromise<ITreeItem[]>;
    $getChildren(treeViewId: string, treeItemHandle?: number): TPromise<ITreeItem[]>;
    private convertArgument(arg);
}
