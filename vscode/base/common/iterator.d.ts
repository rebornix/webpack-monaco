export interface IIterator<T> {
    next(): T;
}
export declare class ArrayIterator<T> implements IIterator<T> {
    private items;
    protected start: number;
    protected end: number;
    protected index: number;
    constructor(items: T[], start?: number, end?: number);
    first(): T;
    next(): T;
    protected current(): T;
}
export declare class ArrayNavigator<T> extends ArrayIterator<T> implements INavigator<T> {
    constructor(items: T[], start?: number, end?: number);
    current(): T;
    previous(): T;
    first(): T;
    last(): T;
    parent(): T;
}
export declare class MappedIterator<T, R> implements IIterator<R> {
    protected iterator: IIterator<T>;
    protected fn: (item: T) => R;
    constructor(iterator: IIterator<T>, fn: (item: T) => R);
    next(): R;
}
export interface INavigator<T> extends IIterator<T> {
    current(): T;
    previous(): T;
    parent(): T;
    first(): T;
    last(): T;
    next(): T;
}
export declare class MappedNavigator<T, R> extends MappedIterator<T, R> implements INavigator<R> {
    protected navigator: INavigator<T>;
    constructor(navigator: INavigator<T>, fn: (item: T) => R);
    current(): R;
    previous(): R;
    parent(): R;
    first(): R;
    last(): R;
    next(): R;
}
