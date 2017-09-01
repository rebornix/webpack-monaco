import { ITerminalService } from 'vs/workbench/parts/terminal/common/terminal';
import { TPromise } from 'vs/base/common/winjs.base';
import { MainThreadTerminalServiceShape, IExtHostContext } from '../node/extHost.protocol';
export declare class MainThreadTerminalService implements MainThreadTerminalServiceShape {
    private terminalService;
    private _proxy;
    private _toDispose;
    constructor(extHostContext: IExtHostContext, terminalService: ITerminalService);
    dispose(): void;
    $createTerminal(name?: string, shellPath?: string, shellArgs?: string[], waitOnExit?: boolean): TPromise<number>;
    $show(terminalId: number, preserveFocus: boolean): void;
    $hide(terminalId: number): void;
    $dispose(terminalId: number): void;
    $sendText(terminalId: number, text: string, addNewLine: boolean): void;
    private _onTerminalDisposed(terminalInstance);
    private _onTerminalProcessIdReady(terminalInstance);
}
