import { INavigator } from 'vs/base/common/iterator';
import Events = require('vs/base/common/eventEmitter');
import WinJS = require('vs/base/common/winjs.base');
import _ = require('./tree');
export declare class LockData extends Events.EventEmitter {
    private _item;
    constructor(item: Item);
    readonly item: Item;
    dispose(): void;
}
export declare class Lock {
    private locks;
    constructor();
    isLocked(item: Item): boolean;
    run(item: Item, fn: () => WinJS.Promise): WinJS.Promise;
    private getLock(item);
}
export declare class ItemRegistry extends Events.EventEmitter {
    private _isDisposed;
    private items;
    constructor();
    register(item: Item): void;
    deregister(item: Item): void;
    isRegistered(id: string): boolean;
    getItem(id: string): Item;
    dispose(): void;
    isDisposed(): boolean;
}
export interface IBaseItemEvent {
    item: Item;
}
export interface IItemRefreshEvent extends IBaseItemEvent {
}
export interface IItemExpandEvent extends IBaseItemEvent {
}
export interface IItemCollapseEvent extends IBaseItemEvent {
}
export interface IItemDisposeEvent extends IBaseItemEvent {
}
export interface IItemTraitEvent extends IBaseItemEvent {
    trait: string;
}
export interface IItemRevealEvent extends IBaseItemEvent {
    relativeTop: number;
}
export interface IItemChildrenRefreshEvent extends IBaseItemEvent {
    isNested: boolean;
}
export declare class Item extends Events.EventEmitter {
    private registry;
    private context;
    private element;
    private lock;
    id: string;
    private needsChildrenRefresh;
    private doesHaveChildren;
    parent: Item;
    previous: Item;
    next: Item;
    firstChild: Item;
    lastChild: Item;
    private userContent;
    private height;
    private depth;
    private visible;
    private expanded;
    private traits;
    private _isDisposed;
    constructor(id: string, registry: ItemRegistry, context: _.ITreeContext, lock: Lock, element: any);
    getElement(): any;
    hasChildren(): boolean;
    getDepth(): number;
    isVisible(): boolean;
    setVisible(value: boolean): void;
    isExpanded(): boolean;
    _setExpanded(value: boolean): void;
    reveal(relativeTop?: number): void;
    expand(): WinJS.Promise;
    collapse(recursive?: boolean): WinJS.Promise;
    addTrait(trait: string): void;
    removeTrait(trait: string): void;
    hasTrait(trait: string): boolean;
    getAllTraits(): string[];
    getHeight(): number;
    private refreshChildren(recursive, safe?, force?);
    private doRefresh(recursive, safe?);
    refresh(recursive: boolean): WinJS.Promise;
    getNavigator(): INavigator<Item>;
    intersects(other: Item): boolean;
    getHierarchy(): Item[];
    private isAncestorOf(item);
    private addChild(item, afterItem?);
    private removeChild(item);
    private forEachChild(fn);
    private mapEachChild<T>(fn);
    private sort(elements);
    _getHeight(): number;
    _isVisible(): boolean;
    isDisposed(): boolean;
    dispose(): void;
}
export declare class TreeNavigator implements INavigator<Item> {
    private start;
    private item;
    static lastDescendantOf(item: Item): Item;
    constructor(item: Item, subTreeOnly?: boolean);
    current(): Item;
    next(): Item;
    previous(): Item;
    parent(): Item;
    first(): Item;
    last(): Item;
}
export interface IBaseEvent {
    item: Item;
}
export interface IInputEvent extends IBaseEvent {
}
export interface IRefreshEvent extends IBaseEvent {
    recursive: boolean;
}
export declare class TreeModel extends Events.EventEmitter {
    private context;
    private lock;
    private input;
    private registry;
    private registryDisposable;
    private traitsToItems;
    constructor(context: _.ITreeContext);
    setInput(element: any): WinJS.Promise;
    getInput(): any;
    refresh(element?: any, recursive?: boolean): WinJS.Promise;
    expand(element: any): WinJS.Promise;
    expandAll(elements?: any[]): WinJS.Promise;
    collapse(element: any, recursive?: boolean): WinJS.Promise;
    collapseAll(elements?: any[], recursive?: boolean): WinJS.Promise;
    toggleExpansion(element: any, recursive?: boolean): WinJS.Promise;
    toggleExpansionAll(elements: any[]): WinJS.Promise;
    isExpanded(element: any): boolean;
    getExpandedElements(): any[];
    reveal(element: any, relativeTop?: number): WinJS.Promise;
    private resolveUnknownParentChain(element);
    setHighlight(element?: any, eventPayload?: any): void;
    getHighlight(includeHidden?: boolean): any;
    isHighlighted(element: any): boolean;
    select(element: any, eventPayload?: any): void;
    selectRange(fromElement: any, toElement: any, eventPayload?: any): void;
    deselectRange(fromElement: any, toElement: any, eventPayload?: any): void;
    selectAll(elements: any[], eventPayload?: any): void;
    deselect(element: any, eventPayload?: any): void;
    deselectAll(elements: any[], eventPayload?: any): void;
    setSelection(elements: any[], eventPayload?: any): void;
    toggleSelection(element: any, eventPayload?: any): void;
    isSelected(element: any): boolean;
    getSelection(includeHidden?: boolean): any[];
    selectNext(count?: number, clearSelection?: boolean, eventPayload?: any): void;
    selectPrevious(count?: number, clearSelection?: boolean, eventPayload?: any): void;
    selectParent(eventPayload?: any, clearSelection?: boolean): void;
    setFocus(element?: any, eventPayload?: any): void;
    isFocused(element: any): boolean;
    getFocus(includeHidden?: boolean): any;
    focusNext(count?: number, eventPayload?: any): void;
    focusPrevious(count?: number, eventPayload?: any): void;
    focusParent(eventPayload?: any): void;
    focusFirstChild(eventPayload?: any): void;
    focusFirst(eventPayload?: any, from?: any): void;
    focusNth(index: number, eventPayload?: any, from?: any): void;
    focusLast(eventPayload?: any, from?: any): void;
    private getParent(from?);
    getNavigator(element?: any, subTreeOnly?: boolean): INavigator<Item>;
    getItem(element?: any): Item;
    addTraits(trait: string, elements: any[]): void;
    removeTraits(trait: string, elements: any[]): void;
    hasTrait(trait: string, element: any): boolean;
    private toggleTrait(trait, element);
    private setTraits(trait, elements);
    private getElementsWithTrait(trait, includeHidden);
    dispose(): void;
}
