import URI from 'vs/base/common/uri';
export interface Key {
    toString(): string;
}
export interface Entry<K, T> {
    key: K;
    value: T;
}
export declare function values<K, V>(map: Map<K, V>): V[];
export declare function keys<K, V>(map: Map<K, V>): K[];
export declare function getOrSet<K, V>(map: Map<K, V>, key: K, value: V): V;
export interface ISerializedBoundedLinkedMap<T> {
    entries: {
        key: string;
        value: T;
    }[];
}
/**
 * A simple Map<T> that optionally allows to set a limit of entries to store. Once the limit is hit,
 * the cache will remove the entry that was last recently added. Or, if a ratio is provided below 1,
 * all elements will be removed until the ratio is full filled (e.g. 0.75 to remove 25% of old elements).
 */
export declare class BoundedMap<T> {
    private limit;
    private map;
    private head;
    private tail;
    private ratio;
    constructor(limit?: number, ratio?: number, value?: ISerializedBoundedLinkedMap<T>);
    setLimit(limit: number): void;
    serialize(): ISerializedBoundedLinkedMap<T>;
    readonly size: number;
    set(key: string, value: T): boolean;
    get(key: string): T;
    getOrSet(k: string, t: T): T;
    delete(key: string): T;
    has(key: string): boolean;
    clear(): void;
    private push(entry);
    private trim();
}
/**
 * A trie map that allows for fast look up when keys are substrings
 * to the actual search keys (dir/subdir-problem).
 */
export declare class TrieMap<E> {
    static PathSplitter: (s: string) => string[];
    private readonly _splitter;
    private _root;
    constructor(splitter?: (s: string) => string[]);
    insert(path: string, element: E): void;
    lookUp(path: string): E;
    findSubstr(path: string): E;
    findSuperstr(path: string): TrieMap<E>;
}
export declare class ResourceMap<T> {
    private ignoreCase;
    protected map: Map<string, T>;
    constructor(ignoreCase?: boolean);
    set(resource: URI, value: T): void;
    get(resource: URI): T;
    has(resource: URI): boolean;
    readonly size: number;
    clear(): void;
    delete(resource: URI): boolean;
    forEach(clb: (value: T) => void): void;
    values(): T[];
    private toKey(resource);
}
export declare class StrictResourceMap<T> extends ResourceMap<T> {
    constructor();
    keys(): URI[];
}
export declare namespace Touch {
    const None: 0;
    const First: 1;
    const Last: 2;
}
export declare type Touch = 0 | 1 | 2;
export declare class LinkedMap<K, V> {
    private _map;
    private _head;
    private _tail;
    private _size;
    constructor();
    clear(): void;
    isEmpty(): boolean;
    readonly size: number;
    has(key: K): boolean;
    get(key: K): V | undefined;
    set(key: K, value: V, touch?: Touch): void;
    delete(key: K): boolean;
    remove(key: K): V | undefined;
    shift(): V | undefined;
    forEach(callbackfn: (value: V, key: K, map: LinkedMap<K, V>) => void, thisArg?: any): void;
    forEachReverse(callbackfn: (value: V, key: K, map: LinkedMap<K, V>) => void, thisArg?: any): void;
    values(): V[];
    keys(): K[];
    private addItemFirst(item);
    private addItemLast(item);
    private removeItem(item);
    private touch(item, touch);
}
