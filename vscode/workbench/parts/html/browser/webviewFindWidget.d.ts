import { SimpleFindWidget } from 'vs/editor/contrib/find/browser/simpleFindWidget';
import { IContextViewService } from 'vs/platform/contextview/browser/contextView';
import Webview from './webview';
export declare class WebviewFindWidget extends SimpleFindWidget {
    private webview;
    constructor(_contextViewService: IContextViewService, webview: Webview);
    find(previous: any): void;
    hide(): void;
    onInputChanged(): void;
    protected onFocusTrackerFocus(): void;
    protected onFocusTrackerBlur(): void;
    protected onFindInputFocusTrackerFocus(): void;
    protected onFindInputFocusTrackerBlur(): void;
}
