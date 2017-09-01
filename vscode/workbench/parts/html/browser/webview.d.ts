import URI from 'vs/base/common/uri';
import Event from 'vs/base/common/event';
import { ITheme } from 'vs/platform/theme/common/themeService';
import { IContextViewService } from 'vs/platform/contextview/browser/contextView';
import { IContextKey } from 'vs/platform/contextkey/common/contextkey';
export interface WebviewElement extends HTMLElement {
    src: string;
    preload: string;
    send(channel: string, ...args: any[]): any;
    openDevTools(): any;
    getWebContents(): any;
    findInPage(value: string, options?: WebviewElementFindInPageOptions): any;
    stopFindInPage(action: string): any;
}
export declare class StopFindInPageActions {
    static clearSelection: string;
    static keepSelection: string;
    static activateSelection: string;
}
export interface WebviewElementFindInPageOptions {
    forward?: boolean;
    findNext?: boolean;
    matchCase?: boolean;
    wordStart?: boolean;
    medialCapitalAsWordStart?: boolean;
}
export interface FoundInPageResults {
    requestId: number;
    activeMatchOrdinal: number;
    matches: number;
    selectionArea: any;
}
export interface WebviewOptions {
    allowScripts?: boolean;
    allowSvgs?: boolean;
    svgWhiteList?: string[];
}
export default class Webview {
    private parent;
    private _styleElement;
    private _contextViewService;
    private _contextKey;
    private _findInputContextKey;
    private _options;
    private static index;
    private _webview;
    private _ready;
    private _disposables;
    private _onDidClickLink;
    private _onDidScroll;
    private _onFoundInPageResults;
    private _webviewFindWidget;
    private _findStarted;
    constructor(parent: HTMLElement, _styleElement: Element, _contextViewService: IContextViewService, _contextKey: IContextKey<boolean>, _findInputContextKey: IContextKey<boolean>, _options?: WebviewOptions);
    notifyFindWidgetFocusChanged(isFocused: boolean): void;
    notifyFindWidgetInputFocusChanged(isFocused: boolean): void;
    dispose(): void;
    readonly onDidClickLink: Event<URI>;
    readonly onDidScroll: Event<{
        scrollYPercentage: number;
    }>;
    readonly onFindResults: Event<FoundInPageResults>;
    private _send(channel, ...args);
    initialScrollProgress: number;
    options: WebviewOptions;
    contents: string[];
    baseUrl: string;
    focus(): void;
    sendMessage(data: any): void;
    private onDidBlockSvg();
    style(theme: ITheme): void;
    layout(): void;
    private isAllowedSvg(uri);
    startFind(value: string, options?: WebviewElementFindInPageOptions): void;
    /**
     * Webviews expose a stateful find API.
     * Successive calls to find will move forward or backward through onFindResults
     * depending on the supplied options.
     *
     * @param {string} value The string to search for. Empty strings are ignored.
     * @param {WebviewElementFindInPageOptions} [options]
     *
     * @memberOf Webview
     */
    find(value: string, options?: WebviewElementFindInPageOptions): void;
    stopFind(keepSelection?: boolean): void;
    showFind(): void;
    hideFind(): void;
    showNextFindTerm(): void;
    showPreviousFindTerm(): void;
}
