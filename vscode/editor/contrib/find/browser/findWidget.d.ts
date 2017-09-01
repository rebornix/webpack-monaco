import 'vs/css!./findWidget';
import { IKeyboardEvent } from 'vs/base/browser/keyboardEvent';
import { IContextViewProvider } from 'vs/base/browser/ui/contextview/contextview';
import { Widget } from 'vs/base/browser/ui/widget';
import { Sash, IHorizontalSashLayoutProvider } from 'vs/base/browser/ui/sash/sash';
import { IKeybindingService } from 'vs/platform/keybinding/common/keybinding';
import { ICodeEditor, IOverlayWidget, IOverlayWidgetPosition, IViewZone } from 'vs/editor/browser/editorBrowser';
import { FindReplaceState } from 'vs/editor/contrib/find/common/findState';
import { IContextKeyService } from 'vs/platform/contextkey/common/contextkey';
import { IThemeService } from 'vs/platform/theme/common/themeService';
export interface IFindController {
    replace(): void;
    replaceAll(): void;
}
export declare class FindWidgetViewZone implements IViewZone {
    afterLineNumber: number;
    heightInPx: number;
    suppressMouseDown: boolean;
    domNode: HTMLElement;
    constructor(afterLineNumber: number);
}
export declare class FindWidget extends Widget implements IOverlayWidget, IHorizontalSashLayoutProvider {
    private static ID;
    private _codeEditor;
    private _state;
    private _controller;
    private _contextViewProvider;
    private _keybindingService;
    private _domNode;
    private _findInput;
    private _replaceInputBox;
    private _toggleReplaceBtn;
    private _matchesCount;
    private _prevBtn;
    private _nextBtn;
    private _toggleSelectionFind;
    private _closeBtn;
    private _replaceBtn;
    private _replaceAllBtn;
    private _isVisible;
    private _isReplaceVisible;
    private _focusTracker;
    private _findInputFocused;
    private _viewZone;
    private _viewZoneId;
    private _resizeSash;
    constructor(codeEditor: ICodeEditor, controller: IFindController, state: FindReplaceState, contextViewProvider: IContextViewProvider, keybindingService: IKeybindingService, contextKeyService: IContextKeyService, themeService: IThemeService);
    getId(): string;
    getDomNode(): HTMLElement;
    getPosition(): IOverlayWidgetPosition;
    private _onStateChanged(e);
    private _updateMatchesCount();
    /**
     * If 'selection find' is ON we should not disable the button (its function is to cancel 'selection find').
     * If 'selection find' is OFF we enable the button only if there is a selection.
     */
    private _updateToggleSelectionFindButton();
    private _updateButtons();
    private _reveal(animate);
    private _hide(focusTheEditor);
    private _layoutViewZone();
    private _showViewZone(adjustScroll?);
    private _applyTheme(theme);
    focusFindInput(): void;
    focusReplaceInput(): void;
    highlightFindOptions(): void;
    private _onFindInputMouseDown(e);
    private _onFindInputKeyDown(e);
    private _onReplaceInputKeyDown(e);
    getHorizontalSashTop(sash: Sash): number;
    getHorizontalSashLeft?(sash: Sash): number;
    getHorizontalSashWidth?(sash: Sash): number;
    private _keybindingLabelFor(actionId);
    private _buildFindPart();
    private _buildReplacePart();
    private _buildDomNode();
    private _buildSash();
}
export interface ISimpleButtonOpts {
    label: string;
    className: string;
    onTrigger: () => void;
    onKeyDown: (e: IKeyboardEvent) => void;
}
export declare class SimpleButton extends Widget {
    private _opts;
    private _domNode;
    constructor(opts: ISimpleButtonOpts);
    readonly domNode: HTMLElement;
    isEnabled(): boolean;
    focus(): void;
    setEnabled(enabled: boolean): void;
    setExpanded(expanded: boolean): void;
    toggleClass(className: string, shouldHaveIt: boolean): void;
}
