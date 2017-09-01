import { TPromise } from 'vs/base/common/winjs.base';
/**
 * @returns whether the provided parameter is a JavaScript Array or not.
 */
export declare function isArray(array: any): array is any[];
/**
 * @returns whether the provided parameter is a JavaScript String or not.
 */
export declare function isString(str: any): str is string;
/**
 * @returns whether the provided parameter is a JavaScript Array and each element in the array is a string.
 */
export declare function isStringArray(value: any): value is string[];
/**
 *
 * @returns whether the provided parameter is of type `object` but **not**
 *	`null`, an `array`, a `regexp`, nor a `date`.
 */
export declare function isObject(obj: any): boolean;
/**
 * In **contrast** to just checking `typeof` this will return `false` for `NaN`.
 * @returns whether the provided parameter is a JavaScript Number or not.
 */
export declare function isNumber(obj: any): obj is number;
/**
 * @returns whether the provided parameter is a JavaScript Boolean or not.
 */
export declare function isBoolean(obj: any): obj is boolean;
/**
 * @returns whether the provided parameter is undefined.
 */
export declare function isUndefined(obj: any): boolean;
/**
 * @returns whether the provided parameter is undefined or null.
 */
export declare function isUndefinedOrNull(obj: any): boolean;
/**
 * @returns whether the provided parameter is an empty JavaScript Object or not.
 */
export declare function isEmptyObject(obj: any): obj is any;
/**
 * @returns whether the provided parameter is a JavaScript Function or not.
 */
export declare function isFunction(obj: any): obj is Function;
/**
 * @returns whether the provided parameters is are JavaScript Function or not.
 */
export declare function areFunctions(...objects: any[]): boolean;
export declare type TypeConstraint = string | Function;
export declare function validateConstraints(args: any[], constraints: TypeConstraint[]): void;
export declare function validateConstraint(arg: any, constraint: TypeConstraint): void;
/**
 * Creates a new object of the provided class and will call the constructor with
 * any additional argument supplied.
 */
export declare function create(ctor: Function, ...args: any[]): any;
export interface IFunction0<T> {
    (): T;
}
export interface IFunction1<A1, T> {
    (a1: A1): T;
}
export interface IFunction2<A1, A2, T> {
    (a1: A1, a2: A2): T;
}
export interface IFunction3<A1, A2, A3, T> {
    (a1: A1, a2: A2, a3: A3): T;
}
export interface IFunction4<A1, A2, A3, A4, T> {
    (a1: A1, a2: A2, a3: A3, a4: A4): T;
}
export interface IFunction5<A1, A2, A3, A4, A5, T> {
    (a1: A1, a2: A2, a3: A3, a4: A4, a5: A5): T;
}
export interface IFunction6<A1, A2, A3, A4, A5, A6, T> {
    (a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6): T;
}
export interface IFunction7<A1, A2, A3, A4, A5, A6, A7, T> {
    (a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6, a7: A7): T;
}
export interface IFunction8<A1, A2, A3, A4, A5, A6, A7, A8, T> {
    (a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6, a7: A7, a8: A8): T;
}
export interface IAction0 extends IFunction0<void> {
}
export interface IAction1<A1> extends IFunction1<A1, void> {
}
export interface IAction2<A1, A2> extends IFunction2<A1, A2, void> {
}
export interface IAction3<A1, A2, A3> extends IFunction3<A1, A2, A3, void> {
}
export interface IAction4<A1, A2, A3, A4> extends IFunction4<A1, A2, A3, A4, void> {
}
export interface IAction5<A1, A2, A3, A4, A5> extends IFunction5<A1, A2, A3, A4, A5, void> {
}
export interface IAction6<A1, A2, A3, A4, A5, A6> extends IFunction6<A1, A2, A3, A4, A5, A6, void> {
}
export interface IAction7<A1, A2, A3, A4, A5, A6, A7> extends IFunction7<A1, A2, A3, A4, A5, A6, A7, void> {
}
export interface IAction8<A1, A2, A3, A4, A5, A6, A7, A8> extends IFunction8<A1, A2, A3, A4, A5, A6, A7, A8, void> {
}
export interface IAsyncFunction0<T> extends IFunction0<TPromise<T>> {
}
export interface IAsyncFunction1<A1, T> extends IFunction1<A1, TPromise<T>> {
}
export interface IAsyncFunction2<A1, A2, T> extends IFunction2<A1, A2, TPromise<T>> {
}
export interface IAsyncFunction3<A1, A2, A3, T> extends IFunction3<A1, A2, A3, TPromise<T>> {
}
export interface IAsyncFunction4<A1, A2, A3, A4, T> extends IFunction4<A1, A2, A3, A4, TPromise<T>> {
}
export interface IAsyncFunction5<A1, A2, A3, A4, A5, T> extends IFunction5<A1, A2, A3, A4, A5, TPromise<T>> {
}
export interface IAsyncFunction6<A1, A2, A3, A4, A5, A6, T> extends IFunction6<A1, A2, A3, A4, A5, A6, TPromise<T>> {
}
export interface IAsyncFunction7<A1, A2, A3, A4, A5, A6, A7, T> extends IFunction7<A1, A2, A3, A4, A5, A6, A7, TPromise<T>> {
}
export interface IAsyncFunction8<A1, A2, A3, A4, A5, A6, A7, A8, T> extends IFunction8<A1, A2, A3, A4, A5, A6, A7, A8, TPromise<T>> {
}
