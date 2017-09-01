import { TPromise } from 'vs/base/common/winjs.base';
/**
 * A Pager is a stateless abstraction over a paged collection.
 */
export interface IPager<T> {
    firstPage: T[];
    total: number;
    pageSize: number;
    getPage(pageIndex: number): TPromise<T[]>;
}
/**
 * A PagedModel is a stateful model over an abstracted paged collection.
 */
export interface IPagedModel<T> {
    length: number;
    isResolved(index: number): boolean;
    get(index: number): T;
    resolve(index: number): TPromise<T>;
}
export declare function singlePagePager<T>(elements: T[]): IPager<T>;
export declare class PagedModel<T> implements IPagedModel<T> {
    private arg;
    private pageTimeout;
    private pager;
    private pages;
    readonly length: number;
    constructor(arg: IPager<T> | T[], pageTimeout?: number);
    isResolved(index: number): boolean;
    get(index: number): T;
    resolve(index: number): TPromise<T>;
}
/**
 * Similar to array.map, `mapPager` lets you map the elements of an
 * abstract paged collection to another type.
 */
export declare function mapPager<T, R>(pager: IPager<T>, fn: (t: T) => R): IPager<R>;
/**
 * Merges two pagers.
 */
export declare function mergePagers<T>(one: IPager<T>, other: IPager<T>): IPager<T>;
