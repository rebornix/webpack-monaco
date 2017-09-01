import { IDisposable } from 'vs/base/common/lifecycle';
import { IDelegate, IRenderer } from './list';
export interface IListViewOptions {
    useShadows?: boolean;
}
export declare class ListView<T> implements IDisposable {
    private delegate;
    private items;
    private itemId;
    private rangeMap;
    private cache;
    private renderers;
    private lastRenderTop;
    private lastRenderHeight;
    private _domNode;
    private gesture;
    private rowsContainer;
    private scrollableElement;
    private disposables;
    constructor(container: HTMLElement, delegate: IDelegate<T>, renderers: IRenderer<T, any>[], options?: IListViewOptions);
    readonly domNode: HTMLElement;
    splice(start: number, deleteCount: number, elements?: T[]): T[];
    readonly length: number;
    readonly renderHeight: number;
    element(index: number): T;
    domElement(index: number): HTMLElement;
    elementHeight(index: number): number;
    elementTop(index: number): number;
    indexAt(position: number): number;
    indexAfter(position: number): number;
    layout(height?: number): void;
    private render(renderTop, renderHeight);
    private insertItemInDOM(item, index);
    private removeItemFromDOM(item);
    getContentHeight(): number;
    getScrollTop(): number;
    setScrollTop(scrollTop: number): void;
    scrollTop: number;
    addListener(type: string, handler: (event: any) => void, useCapture?: boolean): IDisposable;
    private fireScopedEvent(event, handler, index);
    private onScroll(e);
    private onTouchChange(event);
    private getItemIndexFromMouseEvent(event);
    private getItemIndexFromGestureEvent(event);
    private getItemIndexFromEventTarget(target);
    private getRenderRange(renderTop, renderHeight);
    dispose(): void;
}
