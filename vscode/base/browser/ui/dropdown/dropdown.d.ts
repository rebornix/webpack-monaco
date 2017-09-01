import 'vs/css!./dropdown';
import { Builder } from 'vs/base/browser/builder';
import { TPromise } from 'vs/base/common/winjs.base';
import { ActionRunner, IAction } from 'vs/base/common/actions';
import { IActionItem } from 'vs/base/browser/ui/actionbar/actionbar';
import { EventEmitter } from 'vs/base/common/eventEmitter';
import { IDisposable } from 'vs/base/common/lifecycle';
import { IContextViewProvider } from 'vs/base/browser/ui/contextview/contextview';
import { IMenuOptions } from 'vs/base/browser/ui/menu/menu';
import { ResolvedKeybinding } from 'vs/base/common/keyCodes';
export interface ILabelRenderer {
    (container: HTMLElement): IDisposable;
}
export interface IBaseDropdownOptions {
    label?: string;
    labelRenderer?: ILabelRenderer;
}
export declare class BaseDropdown extends ActionRunner {
    private _toDispose;
    private $el;
    private $boxContainer;
    private $label;
    private $contents;
    constructor(container: HTMLElement, options: IBaseDropdownOptions);
    readonly toDispose: IDisposable[];
    readonly element: Builder;
    readonly label: Builder;
    tooltip: string;
    show(): void;
    hide(): void;
    protected onEvent(e: Event, activeElement: HTMLElement): void;
    dispose(): void;
}
export interface IDropdownOptions extends IBaseDropdownOptions {
    contextViewProvider: IContextViewProvider;
}
export declare class Dropdown extends BaseDropdown {
    private contextViewProvider;
    constructor(container: HTMLElement, options: IDropdownOptions);
    show(): void;
    hide(): void;
    protected renderContents(container: HTMLElement): IDisposable;
}
export interface IContextMenuDelegate {
    getAnchor(): HTMLElement | {
        x: number;
        y: number;
    };
    getActions(): TPromise<IAction[]>;
    getActionItem?(action: IAction): IActionItem;
    getActionsContext?(): any;
    getKeyBinding?(action: IAction): ResolvedKeybinding;
    getMenuClassName?(): string;
    onHide?(didCancel: boolean): void;
}
export interface IContextMenuProvider {
    showContextMenu(delegate: IContextMenuDelegate): void;
}
export interface IActionProvider {
    getActions(): IAction[];
}
export interface IDropdownMenuOptions extends IBaseDropdownOptions {
    contextMenuProvider: IContextMenuProvider;
    actions?: IAction[];
    actionProvider?: IActionProvider;
    menuClassName?: string;
}
export declare class DropdownMenu extends BaseDropdown {
    private _contextMenuProvider;
    private _menuOptions;
    private _actions;
    private actionProvider;
    private menuClassName;
    constructor(container: HTMLElement, options: IDropdownMenuOptions);
    menuOptions: IMenuOptions;
    private actions;
    show(): void;
    hide(): void;
}
export declare class DropdownGroup extends EventEmitter {
    private el;
    constructor(container: HTMLElement);
    readonly element: HTMLElement;
}
