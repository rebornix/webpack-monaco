import 'vs/css!./media/suggest';
import Event from 'vs/base/common/event';
import { IDisposable } from 'vs/base/common/lifecycle';
import { IDelegate } from 'vs/base/browser/ui/list/list';
import { IKeybindingService } from 'vs/platform/keybinding/common/keybinding';
import { IContextKeyService } from 'vs/platform/contextkey/common/contextkey';
import { ICodeEditor, IContentWidget, IContentWidgetPosition } from 'vs/editor/browser/editorBrowser';
import { ICompletionItem, CompletionModel } from './completionModel';
import { ITelemetryService } from 'vs/platform/telemetry/common/telemetry';
import { IThemeService } from 'vs/platform/theme/common/themeService';
import { IStorageService } from 'vs/platform/storage/common/storage';
/**
 * Suggest widget colors
 */
export declare const editorSuggestWidgetBackground: string;
export declare const editorSuggestWidgetBorder: string;
export declare const editorSuggestWidgetForeground: string;
export declare const editorSuggestWidgetSelectedBackground: string;
export declare const editorSuggestWidgetHighlightForeground: string;
export declare class SuggestWidget implements IContentWidget, IDelegate<ICompletionItem>, IDisposable {
    private editor;
    private telemetryService;
    private static ID;
    static LOADING_MESSAGE: string;
    static NO_SUGGESTIONS_MESSAGE: string;
    readonly allowEditorOverflow: boolean;
    private state;
    private isAuto;
    private loadingTimeout;
    private currentSuggestionDetails;
    private focusedItemIndex;
    private focusedItem;
    private ignoreFocusEvents;
    private completionModel;
    private element;
    private messageElement;
    private listElement;
    private details;
    private list;
    private suggestWidgetVisible;
    private suggestWidgetMultipleSuggestions;
    private suggestionSupportsAutoAccept;
    private editorBlurTimeout;
    private showTimeout;
    private toDispose;
    private onDidSelectEmitter;
    private onDidFocusEmitter;
    private onDidHideEmitter;
    private onDidShowEmitter;
    readonly onDidSelect: Event<ICompletionItem>;
    readonly onDidFocus: Event<ICompletionItem>;
    readonly onDidHide: Event<this>;
    readonly onDidShow: Event<this>;
    private readonly maxWidgetWidth;
    private readonly listWidth;
    private storageService;
    private detailsFocusBorderColor;
    private detailsBorderColor;
    private storageServiceAvailable;
    private expandSuggestionDocs;
    constructor(editor: ICodeEditor, telemetryService: ITelemetryService, contextKeyService: IContextKeyService, themeService: IThemeService, storageService: IStorageService, keybindingService: IKeybindingService);
    private onCursorSelectionChanged();
    private onEditorBlur();
    private onEditorLayoutChange();
    private onListSelection(e);
    private _getSuggestionAriaAlertLabel(item);
    private _lastAriaAlertLabel;
    private _ariaAlert(newAriaAlertLabel);
    private onThemeChange(theme);
    private onListFocus(e);
    private setState(state);
    showTriggered(auto: boolean): void;
    showSuggestions(completionModel: CompletionModel, isFrozen: boolean, isAuto: boolean): void;
    selectNextPage(): boolean;
    selectNext(): boolean;
    selectLast(): boolean;
    selectPreviousPage(): boolean;
    selectPrevious(): boolean;
    selectFirst(): boolean;
    getFocusedItem(): ICompletionItem;
    toggleDetailsFocus(): void;
    toggleDetails(): void;
    showDetails(): void;
    private show();
    private hide();
    hideWidget(): void;
    getPosition(): IContentWidgetPosition;
    getDomNode(): HTMLElement;
    getId(): string;
    private updateListHeight();
    private adjustDocsPosition();
    private expandSideOrBelow();
    private readonly maxWidgetHeight;
    private readonly unfocusedHeight;
    getHeight(element: ICompletionItem): number;
    getTemplateId(element: ICompletionItem): string;
    private expandDocsSettingFromStorage();
    private updateExpandDocsSetting(value);
    dispose(): void;
}
