import vscode = require('vscode');
import Event from 'vs/base/common/event';
import { ExtHostTerminalServiceShape, MainThreadTerminalServiceShape, IMainContext } from './extHost.protocol';
export declare class ExtHostTerminal implements vscode.Terminal {
    private _name;
    private _id;
    private _proxy;
    private _disposed;
    private _queuedRequests;
    private _pidPromise;
    private _pidPromiseComplete;
    constructor(proxy: MainThreadTerminalServiceShape, name?: string, shellPath?: string, shellArgs?: string[], waitOnExit?: boolean);
    readonly name: string;
    readonly processId: Thenable<number>;
    sendText(text: string, addNewLine?: boolean): void;
    show(preserveFocus: boolean): void;
    hide(): void;
    dispose(): void;
    _setProcessId(processId: number): void;
    private _queueApiRequest(callback, args);
    private _checkDisposed();
}
export declare class ExtHostTerminalService implements ExtHostTerminalServiceShape {
    private _onDidCloseTerminal;
    private _proxy;
    private _terminals;
    constructor(mainContext: IMainContext);
    createTerminal(name?: string, shellPath?: string, shellArgs?: string[]): vscode.Terminal;
    createTerminalFromOptions(options: vscode.TerminalOptions): vscode.Terminal;
    readonly onDidCloseTerminal: Event<vscode.Terminal>;
    $acceptTerminalClosed(id: number): void;
    $acceptTerminalProcessId(id: number, processId: number): void;
    private _getTerminalById(id);
    private _getTerminalIndexById(id);
}
