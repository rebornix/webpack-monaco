/**
 * Returns the last element of an array.
 * @param array The array.
 * @param n Which element from the end (default is zero).
 */
export declare function tail<T>(array: T[], n?: number): T;
export declare function equals<T>(one: T[], other: T[], itemEquals?: (a: T, b: T) => boolean): boolean;
export declare function binarySearch<T>(array: T[], key: T, comparator: (op1: T, op2: T) => number): number;
/**
 * Takes a sorted array and a function p. The array is sorted in such a way that all elements where p(x) is false
 * are located before all elements where p(x) is true.
 * @returns the least x for which p(x) is true or array.length if no element fullfills the given function.
 */
export declare function findFirst<T>(array: T[], p: (x: T) => boolean): number;
/**
 * Like `Array#sort` but always stable. Usually runs a little slower `than Array#sort`
 * so only use this when actually needing stable sort.
 */
export declare function mergeSort<T>(data: T[], compare: (a: T, b: T) => number): T[];
export declare function groupBy<T>(data: T[], compare: (a: T, b: T) => number): T[][];
/**
 * Takes two *sorted* arrays and computes their delta (removed, added elements).
 * Finishes in `Math.min(before.length, after.length)` steps.
 * @param before
 * @param after
 * @param compare
 */
export declare function delta<T>(before: T[], after: T[], compare: (a: T, b: T) => number): {
    removed: T[];
    added: T[];
};
/**
 * Returns the top N elements from the array.
 *
 * Faster than sorting the entire array when the array is a lot larger than N.
 *
 * @param array The unsorted array.
 * @param compare A sort function for the elements.
 * @param n The number of elements to return.
 * @return The first n elemnts from array when sorted with compare.
 */
export declare function top<T>(array: T[], compare: (a: T, b: T) => number, n: number): T[];
/**
 * @returns a new array with all undefined or null values removed. The original array is not modified at all.
 */
export declare function coalesce<T>(array: T[]): T[];
/**
 * Moves the element in the array for the provided positions.
 */
export declare function move(array: any[], from: number, to: number): void;
/**
 * @returns {{false}} if the provided object is an array
 * 	and not empty.
 */
export declare function isFalsyOrEmpty(obj: any): boolean;
/**
 * Removes duplicates from the given array. The optional keyFn allows to specify
 * how elements are checked for equalness by returning a unique string for each.
 */
export declare function distinct<T>(array: T[], keyFn?: (t: T) => string): T[];
export declare function uniqueFilter<T>(keyFn: (t: T) => string): (t: T) => boolean;
export declare function firstIndex<T>(array: T[], fn: (item: T) => boolean): number;
export declare function first<T>(array: T[], fn: (item: T) => boolean, notFoundValue?: T): T;
export declare function commonPrefixLength<T>(one: T[], other: T[], equals?: (a: T, b: T) => boolean): number;
export declare function flatten<T>(arr: T[][]): T[];
export declare function range(to: number, from?: number): number[];
export declare function fill<T>(num: number, valueFn: () => T, arr?: T[]): T[];
export declare function index<T>(array: T[], indexer: (t: T) => string): {
    [key: string]: T;
};
export declare function index<T, R>(array: T[], indexer: (t: T) => string, merger?: (t: T, r: R) => R): {
    [key: string]: R;
};
/**
 * Inserts an element into an array. Returns a function which, when
 * called, will remove that element from the array.
 */
export declare function insert<T>(array: T[], element: T): () => void;
/**
 * Insert `insertArr` inside `target` at `insertIndex`.
 * Please don't touch unless you understand https://jsperf.com/inserting-an-array-within-an-array
 */
export declare function arrayInsert<T>(target: T[], insertIndex: number, insertArr: T[]): T[];
