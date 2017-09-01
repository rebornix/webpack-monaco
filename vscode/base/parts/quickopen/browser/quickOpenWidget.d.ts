import 'vs/css!./quickopen';
import { IQuickNavigateConfiguration, IAutoFocus, IModel } from 'vs/base/parts/quickopen/common/quickOpen';
import { IModelProvider } from 'vs/base/parts/quickopen/browser/quickOpenViewer';
import { Dimension, Builder } from 'vs/base/browser/builder';
import { ITree, ContextMenuEvent, IActionProvider, ITreeStyles } from 'vs/base/parts/tree/browser/tree';
import { InputBox, IInputBoxStyles, IRange } from 'vs/base/browser/ui/inputbox/inputBox';
import Severity from 'vs/base/common/severity';
import { ProgressBar } from 'vs/base/browser/ui/progressbar/progressbar';
import { DefaultController } from 'vs/base/parts/tree/browser/treeDefaults';
import { Color } from 'vs/base/common/color';
export interface IQuickOpenCallbacks {
    onOk: () => void;
    onCancel: () => void;
    onType: (value: string) => void;
    onShow?: () => void;
    onHide?: (reason: HideReason) => void;
    onFocusLost?: () => boolean;
}
export interface IQuickOpenOptions extends IQuickOpenStyles {
    minItemsToShow?: number;
    maxItemsToShow?: number;
    inputPlaceHolder: string;
    inputAriaLabel?: string;
    actionProvider?: IActionProvider;
    keyboardSupport?: boolean;
}
export interface IQuickOpenStyles extends IInputBoxStyles, ITreeStyles {
    background?: Color;
    foreground?: Color;
    borderColor?: Color;
    pickerGroupForeground?: Color;
    pickerGroupBorder?: Color;
    widgetShadow?: Color;
    progressBarBackground?: Color;
}
export interface IShowOptions {
    quickNavigateConfiguration?: IQuickNavigateConfiguration;
    autoFocus?: IAutoFocus;
    inputSelection?: IRange;
}
export interface IQuickOpenUsageLogger {
    publicLog(eventName: string, data?: any): void;
}
export declare class QuickOpenController extends DefaultController {
    onContextMenu(tree: ITree, element: any, event: ContextMenuEvent): boolean;
}
export declare enum HideReason {
    ELEMENT_SELECTED = 0,
    FOCUS_LOST = 1,
    CANCELED = 2,
}
export declare class QuickOpenWidget implements IModelProvider {
    private static MAX_WIDTH;
    private static MAX_ITEMS_HEIGHT;
    private isDisposed;
    private options;
    private builder;
    private tree;
    private inputBox;
    private inputContainer;
    private helpText;
    private treeContainer;
    private progressBar;
    private visible;
    private isLoosingFocus;
    private callbacks;
    private toUnbind;
    private quickNavigateConfiguration;
    private container;
    private treeElement;
    private inputElement;
    private usageLogger;
    private layoutDimensions;
    private model;
    private inputChangingTimeoutHandle;
    private styles;
    private renderer;
    constructor(container: HTMLElement, callbacks: IQuickOpenCallbacks, options: IQuickOpenOptions, usageLogger?: IQuickOpenUsageLogger);
    getElement(): Builder;
    getModel(): IModel<any>;
    setCallbacks(callbacks: IQuickOpenCallbacks): void;
    create(): HTMLElement;
    style(styles: IQuickOpenStyles): void;
    protected applyStyles(): void;
    private shouldOpenInBackground(e);
    private onType();
    navigate(next: boolean, quickNavigate?: IQuickNavigateConfiguration): void;
    private navigateInTree(keyCode, isShift?);
    private elementFocused(value, event?);
    private elementSelected(value, event?, preferredMode?);
    private extractKeyMods(event);
    show(prefix: string, options?: IShowOptions): void;
    show(input: IModel<any>, options?: IShowOptions): void;
    private doShowWithPrefix(prefix);
    private doShowWithInput(input, autoFocus);
    private setInputAndLayout(input, autoFocus);
    private isElementVisible<T>(input, e);
    private autoFocus(input, autoFocus?);
    refresh(input?: IModel<any>, autoFocus?: IAutoFocus): void;
    private getHeight(input);
    hide(reason?: HideReason): void;
    getQuickNavigateConfiguration(): IQuickNavigateConfiguration;
    setPlaceHolder(placeHolder: string): void;
    setValue(value: string, selection?: [number, number]): void;
    setPassword(isPassword: boolean): void;
    setInput(input: IModel<any>, autoFocus: IAutoFocus, ariaLabel?: string): void;
    private onInputChanging();
    getInput(): IModel<any>;
    getTree(): ITree;
    showInputDecoration(decoration: Severity): void;
    clearInputDecoration(): void;
    focus(): void;
    accept(): void;
    getProgressBar(): ProgressBar;
    getInputBox(): InputBox;
    setExtraClass(clazz: string): void;
    isVisible(): boolean;
    layout(dimension: Dimension): void;
    private gainingFocus();
    private loosingFocus(e);
    dispose(): void;
}
