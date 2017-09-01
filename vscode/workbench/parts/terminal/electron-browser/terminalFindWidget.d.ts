import { SimpleFindWidget } from 'vs/editor/contrib/find/browser/simpleFindWidget';
import { IContextViewService } from 'vs/platform/contextview/browser/contextView';
import { ITerminalService } from 'vs/workbench/parts/terminal/common/terminal';
import { IContextKeyService, IContextKey } from 'vs/platform/contextkey/common/contextkey';
export declare class TerminalFindWidget extends SimpleFindWidget {
    private _contextKeyService;
    private _terminalService;
    protected _findInputFocused: IContextKey<boolean>;
    constructor(_contextViewService: IContextViewService, _contextKeyService: IContextKeyService, _terminalService: ITerminalService);
    find(previous: any): void;
    hide(): void;
    protected onInputChanged(): void;
    protected onFocusTrackerFocus(): void;
    protected onFocusTrackerBlur(): void;
    protected onFindInputFocusTrackerFocus(): void;
    protected onFindInputFocusTrackerBlur(): void;
}
