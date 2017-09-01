import 'vs/css!./list';
import { IDisposable } from 'vs/base/common/lifecycle';
import { IDelegate, IRenderer, IListEvent } from './list';
import { List, IListOptions } from './listWidget';
import { IPagedModel } from 'vs/base/common/paging';
import Event from 'vs/base/common/event';
export interface IPagedRenderer<TElement, TTemplateData> extends IRenderer<TElement, TTemplateData> {
    renderPlaceholder(index: number, templateData: TTemplateData): void;
}
export interface ITemplateData<T> {
    data: T;
    disposable: IDisposable;
}
export declare class PagedList<T> {
    private list;
    private _model;
    constructor(container: HTMLElement, delegate: IDelegate<number>, renderers: IPagedRenderer<T, any>[], options?: IListOptions<any>);
    readonly widget: List<number>;
    readonly onFocusChange: Event<IListEvent<T>>;
    readonly onSelectionChange: Event<IListEvent<T>>;
    readonly onPin: Event<IListEvent<T>>;
    model: IPagedModel<T>;
    readonly length: number;
    scrollTop: number;
    focusNext(n?: number, loop?: boolean): void;
    focusPrevious(n?: number, loop?: boolean): void;
    selectNext(n?: number, loop?: boolean): void;
    selectPrevious(n?: number, loop?: boolean): void;
    focusNextPage(): void;
    focusPreviousPage(): void;
    getFocus(): number[];
    setSelection(indexes: number[]): void;
    layout(height?: number): void;
    reveal(index: number, relativeTop?: number): void;
}
