export interface Ctor<T> {
    new (): T;
}
export declare function mock<T>(): Ctor<T>;
