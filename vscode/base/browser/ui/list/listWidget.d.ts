import 'vs/css!./list';
import { IDisposable } from 'vs/base/common/lifecycle';
import Event from 'vs/base/common/event';
import { IDelegate, IRenderer, IListEvent, IListContextMenuEvent } from './list';
import { IListViewOptions } from './listView';
import { Color } from 'vs/base/common/color';
export interface IIdentityProvider<T> {
    (element: T): string;
}
export interface ISpliceable<T> {
    splice(start: number, deleteCount: number, elements: T[]): void;
}
export interface IMouseControllerOptions {
    selectOnMouseDown?: boolean;
}
export interface IListOptions<T> extends IListViewOptions, IMouseControllerOptions, IListStyles {
    identityProvider?: IIdentityProvider<T>;
    ariaLabel?: string;
    mouseSupport?: boolean;
    keyboardSupport?: boolean;
}
export interface IListStyles {
    listFocusBackground?: Color;
    listFocusForeground?: Color;
    listActiveSelectionBackground?: Color;
    listActiveSelectionForeground?: Color;
    listFocusAndSelectionBackground?: Color;
    listFocusAndSelectionForeground?: Color;
    listInactiveSelectionBackground?: Color;
    listInactiveSelectionForeground?: Color;
    listInactiveFocusBackground?: Color;
    listHoverBackground?: Color;
    listHoverForeground?: Color;
    listDropBackground?: Color;
    listFocusOutline?: Color;
    listInactiveFocusOutline?: Color;
    listSelectionOutline?: Color;
    listHoverOutline?: Color;
}
export declare class List<T> implements ISpliceable<T>, IDisposable {
    private static InstanceCount;
    private idPrefix;
    private focus;
    private selection;
    private eventBufferer;
    private view;
    private spliceable;
    private disposables;
    private styleElement;
    readonly onFocusChange: Event<IListEvent<T>>;
    readonly onSelectionChange: Event<IListEvent<T>>;
    private _onContextMenu;
    readonly onContextMenu: Event<IListContextMenuEvent<T>>;
    private _onOpen;
    readonly onOpen: Event<IListEvent<T>>;
    private _onPin;
    readonly onPin: Event<IListEvent<T>>;
    readonly onDOMFocus: Event<void>;
    readonly onDOMBlur: Event<void>;
    private _onDispose;
    readonly onDispose: Event<void>;
    constructor(container: HTMLElement, delegate: IDelegate<T>, renderers: IRenderer<T, any>[], options?: IListOptions<T>);
    splice(start: number, deleteCount: number, elements?: T[]): void;
    readonly length: number;
    readonly contentHeight: number;
    scrollTop: number;
    layout(height?: number): void;
    setSelection(indexes: number[]): void;
    selectNext(n?: number, loop?: boolean): void;
    selectPrevious(n?: number, loop?: boolean): void;
    getSelection(): number[];
    getSelectedElements(): T[];
    setFocus(indexes: number[]): void;
    focusNext(n?: number, loop?: boolean): void;
    focusPrevious(n?: number, loop?: boolean): void;
    focusNextPage(): void;
    focusPreviousPage(): void;
    focusLast(): void;
    focusFirst(): void;
    getFocus(): number[];
    getFocusedElements(): T[];
    reveal(index: number, relativeTop?: number): void;
    private getElementDomId(index);
    isDOMFocused(): boolean;
    getHTMLElement(): HTMLElement;
    open(indexes: number[]): void;
    pin(indexes: number[]): void;
    style(styles: IListStyles): void;
    private toListEvent({indexes});
    private _onFocusChange();
    private _onSelectionChange();
    dispose(): void;
}
