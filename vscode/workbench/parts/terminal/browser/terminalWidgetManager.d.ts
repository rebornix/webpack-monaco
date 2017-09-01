import { ITerminalConfigHelper } from 'vs/workbench/parts/terminal/common/terminal';
export declare class TerminalWidgetManager {
    private _configHelper;
    private _container;
    private _xtermViewport;
    private _messageWidget;
    private _messageListeners;
    constructor(_configHelper: ITerminalConfigHelper, terminalWrapper: HTMLElement);
    private _initTerminalHeightWatcher(terminalWrapper);
    showMessage(left: number, top: number, text: string): void;
    closeMessage(): void;
    private _refreshHeight();
}
