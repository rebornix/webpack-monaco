import * as platform from 'vs/base/common/platform';
import { IWorkbenchEditorService } from 'vs/workbench/services/editor/common/editorService';
import { IOpenerService } from 'vs/platform/opener/common/opener';
import { TerminalWidgetManager } from 'vs/workbench/parts/terminal/browser/terminalWidgetManager';
import { IConfigurationService } from 'vs/platform/configuration/common/configuration';
export declare type XtermLinkMatcherHandler = (event: MouseEvent, uri: string) => boolean | void;
export declare type XtermLinkMatcherValidationCallback = (uri: string, element: HTMLElement, callback: (isValid: boolean) => void) => void;
export declare class TerminalLinkHandler {
    private _xterm;
    private _platform;
    private _initialCwd;
    private _openerService;
    private _editorService;
    private _configurationService;
    private _hoverDisposables;
    private _mouseMoveDisposable;
    private _widgetManager;
    private _localLinkPattern;
    constructor(_xterm: any, _platform: platform.Platform, _initialCwd: string, _openerService: IOpenerService, _editorService: IWorkbenchEditorService, _configurationService: IConfigurationService);
    setWidgetManager(widgetManager: TerminalWidgetManager): void;
    registerCustomLinkHandler(regex: RegExp, handler: (uri: string) => void, matchIndex?: number, validationCallback?: XtermLinkMatcherValidationCallback): number;
    registerLocalLinkHandler(): number;
    dispose(): void;
    private _wrapLinkHandler(handler);
    protected readonly _localLinkRegex: RegExp;
    private _handleLocalLink(link);
    private _validateLocalLink(link, element, callback);
    private _validateWebLink(link, element, callback);
    private _handleHypertextLink(url);
    private _isLinkActivationModifierDown(event);
    private _getLinkHoverString();
    private _addTooltipEventListeners(element);
    protected _preprocessPath(link: string): string;
    private _resolvePath(link);
    /**
     * Appends line number and column number to link if they exists.
     * @param link link to format, will become link#line_num,col_num.
     */
    private _formatLocalLinkPath(link);
    /**
     * Returns line and column number of URl if that is present.
     *
     * @param link Url link which may contain line and column number.
     */
    extractLineColumnInfo(link: string): LineColumnInfo;
    /**
     * Returns url from link as link may contain line and column information.
     *
     * @param link url link which may contain line and column number.
     */
    extractLinkUrl(link: string): string;
}
export interface LineColumnInfo {
    lineNumber?: string;
    columnNumber?: string;
}
