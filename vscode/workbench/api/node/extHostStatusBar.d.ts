import { StatusBarAlignment as ExtHostStatusBarAlignment, Disposable, ThemeColor } from './extHostTypes';
import { StatusBarItem, StatusBarAlignment } from 'vscode';
import { MainThreadStatusBarShape, IMainContext } from './extHost.protocol';
export declare class ExtHostStatusBarEntry implements StatusBarItem {
    private static ID_GEN;
    private _id;
    private _alignment;
    private _priority;
    private _disposed;
    private _visible;
    private _text;
    private _tooltip;
    private _color;
    private _command;
    private _timeoutHandle;
    private _proxy;
    private _extensionId;
    constructor(proxy: MainThreadStatusBarShape, extensionId: string, alignment?: ExtHostStatusBarAlignment, priority?: number);
    readonly id: number;
    readonly alignment: StatusBarAlignment;
    readonly priority: number;
    text: string;
    tooltip: string;
    color: string | ThemeColor;
    command: string;
    show(): void;
    hide(): void;
    private update();
    dispose(): void;
}
export declare class ExtHostStatusBar {
    private _proxy;
    private _statusMessage;
    constructor(mainContext: IMainContext);
    createStatusBarEntry(extensionId: string, alignment?: ExtHostStatusBarAlignment, priority?: number): StatusBarItem;
    setStatusBarMessage(text: string, timeoutOrThenable?: number | Thenable<any>): Disposable;
}
