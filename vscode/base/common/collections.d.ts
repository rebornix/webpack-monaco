/**
 * An interface for a JavaScript object that
 * acts a dictionary. The keys are strings.
 */
export interface IStringDictionary<V> {
    [name: string]: V;
}
/**
 * An interface for a JavaScript object that
 * acts a dictionary. The keys are numbers.
 */
export interface INumberDictionary<V> {
    [idx: number]: V;
}
/**
 * Returns an array which contains all values that reside
 * in the given set.
 */
export declare function values<T>(from: IStringDictionary<T> | INumberDictionary<T>): T[];
export declare function size<T>(from: IStringDictionary<T> | INumberDictionary<T>): number;
/**
 * Iterates over each entry in the provided set. The iterator allows
 * to remove elements and will stop when the callback returns {{false}}.
 */
export declare function forEach<T>(from: IStringDictionary<T> | INumberDictionary<T>, callback: (entry: {
    key: any;
    value: T;
}, remove: Function) => any): void;
/**
 * Removes an element from the dictionary. Returns {{false}} if the property
 * does not exists.
 */
export declare function remove<T>(from: IStringDictionary<T> | INumberDictionary<T>, key: string): boolean;
/**
 * Groups the collection into a dictionary based on the provided
 * group function.
 */
export declare function groupBy<T>(data: T[], groupFn: (element: T) => string): IStringDictionary<T[]>;
