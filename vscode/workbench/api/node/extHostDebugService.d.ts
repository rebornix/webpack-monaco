import { TPromise } from 'vs/base/common/winjs.base';
import Event from 'vs/base/common/event';
import { MainThreadDebugServiceShape, ExtHostDebugServiceShape, DebugSessionUUID, IMainContext } from 'vs/workbench/api/node/extHost.protocol';
import { ExtHostWorkspace } from 'vs/workbench/api/node/extHostWorkspace';
import * as vscode from 'vscode';
import URI from 'vs/base/common/uri';
export declare class ExtHostDebugService implements ExtHostDebugServiceShape {
    private _workspace;
    private _handleCounter;
    private _handlers;
    private _debugServiceProxy;
    private _debugSessions;
    private _onDidStartDebugSession;
    readonly onDidStartDebugSession: Event<vscode.DebugSession>;
    private _onDidTerminateDebugSession;
    readonly onDidTerminateDebugSession: Event<vscode.DebugSession>;
    private _onDidChangeActiveDebugSession;
    readonly onDidChangeActiveDebugSession: Event<vscode.DebugSession | undefined>;
    private _activeDebugSession;
    readonly activeDebugSession: ExtHostDebugSession | undefined;
    private _onDidReceiveDebugSessionCustomEvent;
    readonly onDidReceiveDebugSessionCustomEvent: Event<vscode.DebugSessionCustomEvent>;
    constructor(mainContext: IMainContext, workspace: ExtHostWorkspace);
    registerDebugConfigurationProvider(type: string, provider: vscode.DebugConfigurationProvider): vscode.Disposable;
    $provideDebugConfigurations(handle: number, folderUri: URI | undefined): TPromise<vscode.DebugConfiguration[]>;
    $resolveDebugConfiguration(handle: number, folderUri: URI | undefined, debugConfiguration: vscode.DebugConfiguration): TPromise<vscode.DebugConfiguration>;
    startDebugging(folder: vscode.WorkspaceFolder | undefined, nameOrConfig: string | vscode.DebugConfiguration): TPromise<boolean>;
    startDebugSession(folder: vscode.WorkspaceFolder | undefined, config: vscode.DebugConfiguration): TPromise<vscode.DebugSession>;
    $acceptDebugSessionStarted(id: DebugSessionUUID, type: string, name: string): void;
    $acceptDebugSessionTerminated(id: DebugSessionUUID, type: string, name: string): void;
    $acceptDebugSessionActiveChanged(id: DebugSessionUUID | undefined, type?: string, name?: string): void;
    $acceptDebugSessionCustomEvent(id: DebugSessionUUID, type: string, name: string, event: any): void;
    private getFolder(folderUri);
    private nextHandle();
}
export declare class ExtHostDebugSession implements vscode.DebugSession {
    private _debugServiceProxy;
    private _id;
    private _type;
    private _name;
    constructor(proxy: MainThreadDebugServiceShape, id: DebugSessionUUID, type: string, name: string);
    readonly id: string;
    readonly type: string;
    readonly name: string;
    customRequest(command: string, args: any): Thenable<any>;
}
