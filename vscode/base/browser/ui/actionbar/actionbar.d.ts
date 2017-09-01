import 'vs/css!./actionbar';
import lifecycle = require('vs/base/common/lifecycle');
import { TPromise } from 'vs/base/common/winjs.base';
import { Builder } from 'vs/base/browser/builder';
import { SelectBox } from 'vs/base/browser/ui/selectBox/selectBox';
import { IAction, IActionRunner, Action, IActionChangeEvent } from 'vs/base/common/actions';
import { IEventEmitter, EventEmitter } from 'vs/base/common/eventEmitter';
export interface IActionItem extends IEventEmitter {
    actionRunner: IActionRunner;
    setActionContext(context: any): void;
    render(element: HTMLElement): void;
    isEnabled(): boolean;
    focus(fromRight?: boolean): void;
    blur(): void;
    dispose(): void;
}
export interface IBaseActionItemOptions {
    draggable?: boolean;
    isMenu?: boolean;
}
export declare class BaseActionItem extends EventEmitter implements IActionItem {
    protected options: IBaseActionItemOptions;
    builder: Builder;
    _callOnDispose: lifecycle.IDisposable[];
    _context: any;
    _action: IAction;
    private gesture;
    private _actionRunner;
    constructor(context: any, action: IAction, options?: IBaseActionItemOptions);
    protected _handleActionChangeEvent(event: IActionChangeEvent): void;
    readonly callOnDispose: lifecycle.IDisposable[];
    actionRunner: IActionRunner;
    getAction(): IAction;
    isEnabled(): boolean;
    setActionContext(newContext: any): void;
    render(container: HTMLElement): void;
    onClick(event: Event): void;
    focus(): void;
    blur(): void;
    protected _updateEnabled(): void;
    protected _updateLabel(): void;
    protected _updateTooltip(): void;
    protected _updateClass(): void;
    protected _updateChecked(): void;
    dispose(): void;
}
export declare class Separator extends Action {
    static ID: string;
    constructor(label?: string, order?: number);
}
export interface IActionItemOptions extends IBaseActionItemOptions {
    icon?: boolean;
    label?: boolean;
    keybinding?: string;
}
export declare class ActionItem extends BaseActionItem {
    protected $e: Builder;
    protected options: IActionItemOptions;
    private cssClass;
    constructor(context: any, action: IAction, options?: IActionItemOptions);
    render(container: HTMLElement): void;
    focus(): void;
    _updateLabel(): void;
    _updateTooltip(): void;
    _updateClass(): void;
    _updateEnabled(): void;
    _updateChecked(): void;
    _updateRadio(): void;
}
export declare enum ActionsOrientation {
    HORIZONTAL = 1,
    VERTICAL = 2,
}
export interface IActionItemProvider {
    (action: IAction): IActionItem;
}
export interface IActionBarOptions {
    orientation?: ActionsOrientation;
    context?: any;
    actionItemProvider?: IActionItemProvider;
    actionRunner?: IActionRunner;
    ariaLabel?: string;
    animated?: boolean;
    isMenu?: boolean;
}
export interface IActionOptions extends IActionItemOptions {
    index?: number;
}
export declare class ActionBar extends EventEmitter implements IActionRunner {
    options: IActionBarOptions;
    private _actionRunner;
    private _context;
    items: IActionItem[];
    private focusedItem;
    private focusTracker;
    domNode: HTMLElement;
    private actionsList;
    private toDispose;
    constructor(container: HTMLElement | Builder, options?: IActionBarOptions);
    setAriaLabel(label: string): void;
    private updateFocusedItem();
    context: any;
    actionRunner: IActionRunner;
    getContainer(): Builder;
    push(arg: IAction | IAction[], options?: IActionOptions): void;
    pull(index: number): void;
    clear(): void;
    length(): number;
    isEmpty(): boolean;
    focus(selectFirst?: boolean): void;
    private focusNext();
    private focusPrevious();
    private updateFocus(fromRight?);
    private doTrigger(event);
    private cancel();
    run(action: IAction, context?: any): TPromise<void>;
    dispose(): void;
}
export declare class SelectActionItem extends BaseActionItem {
    protected selectBox: SelectBox;
    protected toDispose: lifecycle.IDisposable[];
    constructor(ctx: any, action: IAction, options: string[], selected: number);
    setOptions(options: string[], selected?: number): void;
    select(index: number): void;
    private registerListeners();
    protected getActionContext(option: string): string;
    focus(): void;
    blur(): void;
    render(container: HTMLElement): void;
    dispose(): void;
}
