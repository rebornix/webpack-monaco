import { IDisposable } from 'vs/base/common/lifecycle';
import { IAction, IActionRunner, Action } from 'vs/base/common/actions';
import { IActionItem } from 'vs/base/browser/ui/actionbar/actionbar';
import { TPromise } from 'vs/base/common/winjs.base';
import { ResolvedKeybinding } from 'vs/base/common/keyCodes';
export declare const IContextViewService: {
    (...args: any[]): void;
    type: IContextViewService;
};
export interface IContextViewService {
    _serviceBrand: any;
    showContextView(delegate: IContextViewDelegate): void;
    hideContextView(data?: any): void;
    layout(): void;
}
export interface IContextViewDelegate {
    getAnchor(): HTMLElement | {
        x: number;
        y: number;
    };
    render(container: HTMLElement): IDisposable;
    canRelayout?: boolean;
    onDOMEvent?(e: Event, activeElement: HTMLElement): void;
    onHide?(data?: any): void;
}
export declare const IContextMenuService: {
    (...args: any[]): void;
    type: IContextMenuService;
};
export interface IContextMenuService {
    _serviceBrand: any;
    showContextMenu(delegate: IContextMenuDelegate): void;
}
export interface IEvent {
    shiftKey?: boolean;
    ctrlKey?: boolean;
    altKey?: boolean;
    metaKey?: boolean;
}
export interface IContextMenuDelegate {
    getAnchor(): HTMLElement | {
        x: number;
        y: number;
    };
    getActions(): TPromise<(IAction | ContextSubMenu)[]>;
    getActionItem?(action: IAction): IActionItem;
    getActionsContext?(event?: IEvent): any;
    getKeyBinding?(action: IAction): ResolvedKeybinding;
    getMenuClassName?(): string;
    onHide?(didCancel: boolean): void;
    actionRunner?: IActionRunner;
}
export declare class ContextSubMenu extends Action {
    entries: (ContextSubMenu | IAction)[];
    constructor(label: string, entries: (ContextSubMenu | IAction)[]);
}
