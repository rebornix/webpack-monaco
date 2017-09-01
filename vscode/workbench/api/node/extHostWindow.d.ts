import Event from 'vs/base/common/event';
import { IThreadService } from 'vs/workbench/services/thread/common/threadService';
import { ExtHostWindowShape } from './extHost.protocol';
import { WindowState } from 'vscode';
export declare class ExtHostWindow implements ExtHostWindowShape {
    private static InitialState;
    private _proxy;
    private _onDidChangeWindowState;
    readonly onDidChangeWindowState: Event<WindowState>;
    private _state;
    readonly state: WindowState;
    constructor(threadService: IThreadService);
    $onDidChangeWindowFocus(focused: boolean): void;
}
