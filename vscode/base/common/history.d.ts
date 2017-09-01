import { INavigator } from 'vs/base/common/iterator';
export declare class HistoryNavigator<T> implements INavigator<T> {
    private _history;
    private _limit;
    private _navigator;
    constructor(history?: T[], limit?: number);
    getHistory(): T[];
    add(t: T): void;
    addIfNotPresent(t: T): void;
    next(): T;
    previous(): T;
    current(): T;
    parent(): T;
    first(): T;
    last(): T;
    private _onChange();
    private _reduceToLimit();
    private _initialize(history);
    private readonly _elements;
}
