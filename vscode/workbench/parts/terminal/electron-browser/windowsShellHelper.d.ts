import { TPromise } from 'vs/base/common/winjs.base';
import { ITerminalInstance } from 'vs/workbench/parts/terminal/common/terminal';
import { Terminal as XTermTerminal } from 'xterm';
export declare class WindowsShellHelper {
    private _rootProcessId;
    private _rootShellExecutable;
    private _terminalInstance;
    private _xterm;
    private _childProcessIdStack;
    private _onCheckShell;
    private _wmicProcess;
    private _isDisposed;
    constructor(_rootProcessId: number, _rootShellExecutable: string, _terminalInstance: ITerminalInstance, _xterm: XTermTerminal);
    private checkShell();
    private traverseTree(tree);
    dispose(): void;
    /**
     * Returns the innermost shell executable running in the terminal
     */
    getShellName(): TPromise<string>;
}
