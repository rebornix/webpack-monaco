import { MainThreadOutputServiceShape, IMainContext } from './extHost.protocol';
import * as vscode from 'vscode';
export declare class ExtHostOutputChannel implements vscode.OutputChannel {
    private static _idPool;
    private _proxy;
    private _name;
    private _id;
    private _disposed;
    constructor(name: string, proxy: MainThreadOutputServiceShape);
    readonly name: string;
    dispose(): void;
    append(value: string): void;
    appendLine(value: string): void;
    clear(): void;
    show(columnOrPreserveFocus?: vscode.ViewColumn | boolean, preserveFocus?: boolean): void;
    hide(): void;
}
export declare class ExtHostOutputService {
    private _proxy;
    constructor(mainContext: IMainContext);
    createOutputChannel(name: string): vscode.OutputChannel;
}
