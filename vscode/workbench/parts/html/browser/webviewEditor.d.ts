import { ITelemetryService } from 'vs/platform/telemetry/common/telemetry';
import { IThemeService } from 'vs/platform/theme/common/themeService';
import { BaseWebviewEditor } from 'vs/workbench/browser/parts/editor/webviewEditor';
import { IStorageService } from 'vs/platform/storage/common/storage';
import { ContextKeyExpr, IContextKey, RawContextKey, IContextKeyService } from 'vs/platform/contextkey/common/contextkey';
import WebView from './webview';
import { Builder } from 'vs/base/browser/builder';
export interface HtmlPreviewEditorViewState {
    scrollYPercentage: number;
}
/**  A context key that is set when a webview editor has focus. */
export declare const KEYBINDING_CONTEXT_WEBVIEWEDITOR_FOCUS: RawContextKey<boolean>;
/**  A context key that is set when a webview editor does not have focus. */
export declare const KEYBINDING_CONTEXT_WEBVIEWEDITOR_NOT_FOCUSED: ContextKeyExpr;
/**  A context key that is set when the find widget find input in webview editor webview is focused. */
export declare const KEYBINDING_CONTEXT_WEBVIEWEDITOR_FIND_WIDGET_INPUT_FOCUSED: RawContextKey<boolean>;
/**  A context key that is set when the find widget find input in webview editor webview is not focused. */
export declare const KEYBINDING_CONTEXT_WEBVIEWEDITOR_FIND_WIDGET_INPUT_NOT_FOCUSED: ContextKeyExpr;
/**
 * This class is only intended to be subclassed and not instantiated.
 */
export declare abstract class WebviewEditor extends BaseWebviewEditor {
    protected _webviewFocusContextKey: IContextKey<boolean>;
    protected _webview: WebView;
    protected content: HTMLElement;
    protected contextKey: IContextKey<boolean>;
    protected findInputFocusContextKey: IContextKey<boolean>;
    constructor(id: string, telemetryService: ITelemetryService, themeService: IThemeService, storageService: IStorageService, contextKeyService: IContextKeyService);
    showFind(): void;
    hideFind(): void;
    showNextFindTerm(): void;
    showPreviousFindTerm(): void;
    updateStyles(): void;
    readonly isWebviewEditor: boolean;
    protected abstract createEditor(parent: Builder): any;
}
