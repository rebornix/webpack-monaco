import * as instantiation from './instantiation';
export declare class AbstractDescriptor<T> {
    private _staticArguments;
    constructor(_staticArguments: any[]);
    appendStaticArguments(more: any[]): void;
    staticArguments(): any[];
    staticArguments(nth: number): any;
    _validate(type: T): void;
}
export declare class SyncDescriptor<T> extends AbstractDescriptor<T> {
    private _ctor;
    constructor(_ctor: any, ...staticArguments: any[]);
    readonly ctor: any;
    protected bind(...moreStaticArguments: any[]): SyncDescriptor<T>;
}
export interface CreateSyncFunc {
    <T>(ctor: instantiation.IConstructorSignature0<T>): SyncDescriptor0<T>;
    <A1, T>(ctor: instantiation.IConstructorSignature1<A1, T>): SyncDescriptor1<A1, T>;
    <A1, T>(ctor: instantiation.IConstructorSignature1<A1, T>, a1: A1): SyncDescriptor0<T>;
    <A1, A2, T>(ctor: instantiation.IConstructorSignature2<A1, A2, T>): SyncDescriptor2<A1, A2, T>;
    <A1, A2, T>(ctor: instantiation.IConstructorSignature2<A1, A2, T>, a1: A1): SyncDescriptor1<A2, T>;
    <A1, A2, T>(ctor: instantiation.IConstructorSignature2<A1, A2, T>, a1: A1, a2: A2): SyncDescriptor0<T>;
    <A1, A2, A3, T>(ctor: instantiation.IConstructorSignature3<A1, A2, A3, T>): SyncDescriptor3<A1, A2, A3, T>;
    <A1, A2, A3, T>(ctor: instantiation.IConstructorSignature3<A1, A2, A3, T>, a1: A1): SyncDescriptor2<A2, A3, T>;
    <A1, A2, A3, T>(ctor: instantiation.IConstructorSignature3<A1, A2, A3, T>, a1: A1, a2: A2): SyncDescriptor1<A3, T>;
    <A1, A2, A3, T>(ctor: instantiation.IConstructorSignature3<A1, A2, A3, T>, a1: A1, a2: A2, a3: A3): SyncDescriptor0<T>;
    <A1, A2, A3, A4, T>(ctor: instantiation.IConstructorSignature4<A1, A2, A3, A4, T>): SyncDescriptor4<A1, A2, A3, A4, T>;
    <A1, A2, A3, A4, T>(ctor: instantiation.IConstructorSignature4<A1, A2, A3, A4, T>, a1: A1): SyncDescriptor3<A2, A3, A4, T>;
    <A1, A2, A3, A4, T>(ctor: instantiation.IConstructorSignature4<A1, A2, A3, A4, T>, a1: A1, a2: A2): SyncDescriptor2<A3, A4, T>;
    <A1, A2, A3, A4, T>(ctor: instantiation.IConstructorSignature4<A1, A2, A3, A4, T>, a1: A1, a2: A2, a3: A3): SyncDescriptor1<A4, T>;
    <A1, A2, A3, A4, T>(ctor: instantiation.IConstructorSignature4<A1, A2, A3, A4, T>, a1: A1, a2: A2, a3: A3, a4: A4): SyncDescriptor0<T>;
    <A1, A2, A3, A4, A5, T>(ctor: instantiation.IConstructorSignature5<A1, A2, A3, A4, A5, T>): SyncDescriptor5<A1, A2, A3, A4, A5, T>;
    <A1, A2, A3, A4, A5, T>(ctor: instantiation.IConstructorSignature5<A1, A2, A3, A4, A5, T>, a1: A1): SyncDescriptor4<A2, A3, A4, A5, T>;
    <A1, A2, A3, A4, A5, T>(ctor: instantiation.IConstructorSignature5<A1, A2, A3, A4, A5, T>, a1: A1, a2: A2): SyncDescriptor3<A3, A4, A5, T>;
    <A1, A2, A3, A4, A5, T>(ctor: instantiation.IConstructorSignature5<A1, A2, A3, A4, A5, T>, a1: A1, a2: A2, a3: A3): SyncDescriptor2<A4, A5, T>;
    <A1, A2, A3, A4, A5, T>(ctor: instantiation.IConstructorSignature5<A1, A2, A3, A4, A5, T>, a1: A1, a2: A2, a3: A3, a4: A4): SyncDescriptor1<A5, T>;
    <A1, A2, A3, A4, A5, T>(ctor: instantiation.IConstructorSignature5<A1, A2, A3, A4, A5, T>, a1: A1, a2: A2, a3: A3, a4: A4, a5: A5): SyncDescriptor0<T>;
    <A1, A2, A3, A4, A5, A6, T>(ctor: instantiation.IConstructorSignature6<A1, A2, A3, A4, A5, A6, T>): SyncDescriptor6<A1, A2, A3, A4, A5, A6, T>;
    <A1, A2, A3, A4, A5, A6, T>(ctor: instantiation.IConstructorSignature6<A1, A2, A3, A4, A5, A6, T>, a1: A1): SyncDescriptor5<A2, A3, A4, A5, A6, T>;
    <A1, A2, A3, A4, A5, A6, T>(ctor: instantiation.IConstructorSignature6<A1, A2, A3, A4, A5, A6, T>, a1: A1, a2: A2): SyncDescriptor4<A3, A4, A5, A6, T>;
    <A1, A2, A3, A4, A5, A6, T>(ctor: instantiation.IConstructorSignature6<A1, A2, A3, A4, A5, A6, T>, a1: A1, a2: A2, a3: A3): SyncDescriptor3<A4, A5, A6, T>;
    <A1, A2, A3, A4, A5, A6, T>(ctor: instantiation.IConstructorSignature6<A1, A2, A3, A4, A5, A6, T>, a1: A1, a2: A2, a3: A3, a4: A4): SyncDescriptor2<A5, A6, T>;
    <A1, A2, A3, A4, A5, A6, T>(ctor: instantiation.IConstructorSignature6<A1, A2, A3, A4, A5, A6, T>, a1: A1, a2: A2, a3: A3, a4: A4, a5: A5): SyncDescriptor1<A6, T>;
    <A1, A2, A3, A4, A5, A6, T>(ctor: instantiation.IConstructorSignature6<A1, A2, A3, A4, A5, A6, T>, a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6): SyncDescriptor0<T>;
    <A1, A2, A3, A4, A5, A6, A7, T>(ctor: instantiation.IConstructorSignature7<A1, A2, A3, A4, A5, A6, A7, T>): SyncDescriptor7<A1, A2, A3, A4, A5, A6, A7, T>;
    <A1, A2, A3, A4, A5, A6, A7, T>(ctor: instantiation.IConstructorSignature7<A1, A2, A3, A4, A5, A6, A7, T>, a1: A1): SyncDescriptor6<A2, A3, A4, A5, A6, A7, T>;
    <A1, A2, A3, A4, A5, A6, A7, T>(ctor: instantiation.IConstructorSignature7<A1, A2, A3, A4, A5, A6, A7, T>, a1: A1, a2: A2): SyncDescriptor5<A3, A4, A5, A6, A7, T>;
    <A1, A2, A3, A4, A5, A6, A7, T>(ctor: instantiation.IConstructorSignature7<A1, A2, A3, A4, A5, A6, A7, T>, a1: A1, a2: A2, a3: A3): SyncDescriptor4<A4, A5, A6, A7, T>;
    <A1, A2, A3, A4, A5, A6, A7, T>(ctor: instantiation.IConstructorSignature7<A1, A2, A3, A4, A5, A6, A7, T>, a1: A1, a2: A2, a3: A3, a4: A4): SyncDescriptor3<A5, A6, A7, T>;
    <A1, A2, A3, A4, A5, A6, A7, T>(ctor: instantiation.IConstructorSignature7<A1, A2, A3, A4, A5, A6, A7, T>, a1: A1, a2: A2, a3: A3, a4: A4, a5: A5): SyncDescriptor2<A6, A7, T>;
    <A1, A2, A3, A4, A5, A6, A7, T>(ctor: instantiation.IConstructorSignature7<A1, A2, A3, A4, A5, A6, A7, T>, a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6): SyncDescriptor1<A7, T>;
    <A1, A2, A3, A4, A5, A6, A7, T>(ctor: instantiation.IConstructorSignature7<A1, A2, A3, A4, A5, A6, A7, T>, a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6, a7: A7): SyncDescriptor0<T>;
    <A1, A2, A3, A4, A5, A6, A7, A8, T>(ctor: instantiation.IConstructorSignature8<A1, A2, A3, A4, A5, A6, A7, A8, T>): SyncDescriptor8<A1, A2, A3, A4, A5, A6, A7, A8, T>;
    <A1, A2, A3, A4, A5, A6, A7, A8, T>(ctor: instantiation.IConstructorSignature8<A1, A2, A3, A4, A5, A6, A7, A8, T>, a1: A1): SyncDescriptor7<A2, A3, A4, A5, A6, A7, A8, T>;
    <A1, A2, A3, A4, A5, A6, A7, A8, T>(ctor: instantiation.IConstructorSignature8<A1, A2, A3, A4, A5, A6, A7, A8, T>, a1: A1, a2: A2): SyncDescriptor6<A3, A4, A5, A6, A7, A8, T>;
    <A1, A2, A3, A4, A5, A6, A7, A8, T>(ctor: instantiation.IConstructorSignature8<A1, A2, A3, A4, A5, A6, A7, A8, T>, a1: A1, a2: A2, a3: A3): SyncDescriptor5<A4, A5, A6, A7, A8, T>;
    <A1, A2, A3, A4, A5, A6, A7, A8, T>(ctor: instantiation.IConstructorSignature8<A1, A2, A3, A4, A5, A6, A7, A8, T>, a1: A1, a2: A2, a3: A3, a4: A4): SyncDescriptor4<A5, A6, A7, A8, T>;
    <A1, A2, A3, A4, A5, A6, A7, A8, T>(ctor: instantiation.IConstructorSignature8<A1, A2, A3, A4, A5, A6, A7, A8, T>, a1: A1, a2: A2, a3: A3, a4: A4, a5: A5): SyncDescriptor3<A6, A7, A8, T>;
    <A1, A2, A3, A4, A5, A6, A7, A8, T>(ctor: instantiation.IConstructorSignature8<A1, A2, A3, A4, A5, A6, A7, A8, T>, a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6): SyncDescriptor2<A7, A8, T>;
    <A1, A2, A3, A4, A5, A6, A7, A8, T>(ctor: instantiation.IConstructorSignature8<A1, A2, A3, A4, A5, A6, A7, A8, T>, a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6, a7: A7): SyncDescriptor1<A8, T>;
    <A1, A2, A3, A4, A5, A6, A7, A8, T>(ctor: instantiation.IConstructorSignature8<A1, A2, A3, A4, A5, A6, A7, A8, T>, a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6, a7: A7, a8: A8): SyncDescriptor0<T>;
}
export declare const createSyncDescriptor: CreateSyncFunc;
export interface SyncDescriptor0<T> {
    ctor: any;
    bind(): SyncDescriptor0<T>;
}
export interface SyncDescriptor1<A1, T> {
    ctor: any;
    bind(a1: A1): SyncDescriptor0<T>;
}
export interface SyncDescriptor2<A1, A2, T> {
    ctor: any;
    bind(a1: A1): SyncDescriptor1<A2, T>;
    bind(a1: A1, a2: A2): SyncDescriptor0<T>;
}
export interface SyncDescriptor3<A1, A2, A3, T> {
    ctor: any;
    bind(a1: A1): SyncDescriptor2<A2, A3, T>;
    bind(a1: A1, a2: A2): SyncDescriptor1<A3, T>;
    bind(a1: A1, a2: A2, a3: A3): SyncDescriptor0<T>;
}
export interface SyncDescriptor4<A1, A2, A3, A4, T> {
    ctor: any;
    bind(a1: A1): SyncDescriptor3<A2, A3, A4, T>;
    bind(a1: A1, a2: A2): SyncDescriptor2<A3, A4, T>;
    bind(a1: A1, a2: A2, a3: A3): SyncDescriptor1<A4, T>;
    bind(a1: A1, a2: A2, a3: A3, a4: A4): SyncDescriptor0<T>;
}
export interface SyncDescriptor5<A1, A2, A3, A4, A5, T> {
    ctor: any;
    bind(a1: A1): SyncDescriptor4<A2, A3, A4, A5, T>;
    bind(a1: A1, a2: A2): SyncDescriptor3<A3, A4, A5, T>;
    bind(a1: A1, a2: A2, a3: A3): SyncDescriptor2<A4, A5, T>;
    bind(a1: A1, a2: A2, a3: A3, a4: A4): SyncDescriptor1<A5, T>;
    bind(a1: A1, a2: A2, a3: A3, a4: A4, a5: A5): SyncDescriptor0<T>;
}
export interface SyncDescriptor6<A1, A2, A3, A4, A5, A6, T> {
    ctor: any;
    bind(a1: A1): SyncDescriptor5<A2, A3, A4, A5, A6, T>;
    bind(a1: A1, a2: A2): SyncDescriptor4<A3, A4, A5, A6, T>;
    bind(a1: A1, a2: A2, a3: A3): SyncDescriptor3<A4, A5, A6, T>;
    bind(a1: A1, a2: A2, a3: A3, a4: A4): SyncDescriptor2<A5, A6, T>;
    bind(a1: A1, a2: A2, a3: A3, a4: A4, a5: A5): SyncDescriptor1<A6, T>;
    bind(a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6): SyncDescriptor0<T>;
}
export interface SyncDescriptor7<A1, A2, A3, A4, A5, A6, A7, T> {
    ctor: any;
    bind(a1: A1): SyncDescriptor6<A2, A3, A4, A5, A6, A7, T>;
    bind(a1: A1, a2: A2): SyncDescriptor5<A3, A4, A5, A6, A7, T>;
    bind(a1: A1, a2: A2, a3: A3): SyncDescriptor4<A4, A5, A6, A7, T>;
    bind(a1: A1, a2: A2, a3: A3, a4: A4): SyncDescriptor3<A5, A6, A7, T>;
    bind(a1: A1, a2: A2, a3: A3, a4: A4, a5: A5): SyncDescriptor2<A6, A7, T>;
    bind(a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6): SyncDescriptor1<A7, T>;
    bind(a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6, a7: A7): SyncDescriptor0<T>;
}
export interface SyncDescriptor8<A1, A2, A3, A4, A5, A6, A7, A8, T> {
    ctor: any;
    bind(a1: A1): SyncDescriptor7<A2, A3, A4, A5, A6, A7, A8, T>;
    bind(a1: A1, a2: A2): SyncDescriptor6<A3, A4, A5, A6, A7, A8, T>;
    bind(a1: A1, a2: A2, a3: A3): SyncDescriptor5<A4, A5, A6, A7, A8, T>;
    bind(a1: A1, a2: A2, a3: A3, a4: A4): SyncDescriptor4<A5, A6, A7, A8, T>;
    bind(a1: A1, a2: A2, a3: A3, a4: A4, a5: A5): SyncDescriptor3<A6, A7, A8, T>;
    bind(a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6): SyncDescriptor2<A7, A8, T>;
    bind(a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6, a7: A7): SyncDescriptor1<A8, T>;
    bind(a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6, a7: A7, a8: A8): SyncDescriptor0<T>;
}
export declare class AsyncDescriptor<T> extends AbstractDescriptor<T> implements AsyncDescriptor0<T> {
    private _moduleName;
    private _ctorName;
    static create<T>(moduleName: string, ctorName: string): AsyncDescriptor<T>;
    constructor(_moduleName: string, _ctorName?: string, ...staticArguments: any[]);
    readonly moduleName: string;
    readonly ctorName: string;
    bind(...moreStaticArguments: any[]): AsyncDescriptor<T>;
}
export interface AsyncDescriptor0<T> {
    moduleName: string;
    bind(): AsyncDescriptor0<T>;
}
export interface AsyncDescriptor1<A1, T> {
    moduleName: string;
    bind(a1: A1): AsyncDescriptor0<T>;
}
export interface AsyncDescriptor2<A1, A2, T> {
    moduleName: string;
    bind(a1: A1): AsyncDescriptor1<A2, T>;
    bind(a1: A1, a2: A2): AsyncDescriptor0<T>;
}
export interface AsyncDescriptor3<A1, A2, A3, T> {
    moduleName: string;
    bind(a1: A1): AsyncDescriptor2<A2, A3, T>;
    bind(a1: A1, a2: A2): AsyncDescriptor1<A3, T>;
    bind(a1: A1, a2: A2, a3: A3): AsyncDescriptor0<T>;
}
export interface AsyncDescriptor4<A1, A2, A3, A4, T> {
    moduleName: string;
    bind(a1: A1): AsyncDescriptor3<A2, A3, A4, T>;
    bind(a1: A1, a2: A2): AsyncDescriptor2<A3, A4, T>;
    bind(a1: A1, a2: A2, a3: A3): AsyncDescriptor1<A4, T>;
    bind(a1: A1, a2: A2, a3: A3, a4: A4): AsyncDescriptor0<T>;
}
export interface AsyncDescriptor5<A1, A2, A3, A4, A5, T> {
    moduleName: string;
    bind(a1: A1): AsyncDescriptor4<A2, A3, A4, A5, T>;
    bind(a1: A1, a2: A2): AsyncDescriptor3<A3, A4, A5, T>;
    bind(a1: A1, a2: A2, a3: A3): AsyncDescriptor2<A4, A5, T>;
    bind(a1: A1, a2: A2, a3: A3, a4: A4): AsyncDescriptor1<A5, T>;
    bind(a1: A1, a2: A2, a3: A3, a4: A4, a5: A5): AsyncDescriptor0<T>;
}
export interface AsyncDescriptor6<A1, A2, A3, A4, A5, A6, T> {
    moduleName: string;
    bind(a1: A1): AsyncDescriptor5<A2, A3, A4, A5, A6, T>;
    bind(a1: A1, a2: A2): AsyncDescriptor4<A3, A4, A5, A6, T>;
    bind(a1: A1, a2: A2, a3: A3): AsyncDescriptor3<A4, A5, A6, T>;
    bind(a1: A1, a2: A2, a3: A3, a4: A4): AsyncDescriptor2<A5, A6, T>;
    bind(a1: A1, a2: A2, a3: A3, a4: A4, a5: A5): AsyncDescriptor1<A6, T>;
    bind(a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6): AsyncDescriptor0<T>;
}
export interface AsyncDescriptor7<A1, A2, A3, A4, A5, A6, A7, T> {
    moduleName: string;
    bind(a1: A1): AsyncDescriptor6<A2, A3, A4, A5, A6, A7, T>;
    bind(a1: A1, a2: A2): AsyncDescriptor5<A3, A4, A5, A6, A7, T>;
    bind(a1: A1, a2: A2, a3: A3): AsyncDescriptor4<A4, A5, A6, A7, T>;
    bind(a1: A1, a2: A2, a3: A3, a4: A4): AsyncDescriptor3<A5, A6, A7, T>;
    bind(a1: A1, a2: A2, a3: A3, a4: A4, a5: A5): AsyncDescriptor2<A6, A7, T>;
    bind(a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6): AsyncDescriptor1<A7, T>;
    bind(a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6, a7: A7): AsyncDescriptor0<T>;
}
export interface AsyncDescriptor8<A1, A2, A3, A4, A5, A6, A7, A8, T> {
    moduleName: string;
    bind(a1: A1): AsyncDescriptor7<A2, A3, A4, A5, A6, A7, A8, T>;
    bind(a1: A1, a2: A2): AsyncDescriptor6<A3, A4, A5, A6, A7, A8, T>;
    bind(a1: A1, a2: A2, a3: A3): AsyncDescriptor5<A4, A5, A6, A7, A8, T>;
    bind(a1: A1, a2: A2, a3: A3, a4: A4): AsyncDescriptor4<A5, A6, A7, A8, T>;
    bind(a1: A1, a2: A2, a3: A3, a4: A4, a5: A5): AsyncDescriptor3<A6, A7, A8, T>;
    bind(a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6): AsyncDescriptor2<A7, A8, T>;
    bind(a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6, a7: A7): AsyncDescriptor1<A8, T>;
    bind(a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6, a7: A7, a8: A8): AsyncDescriptor0<T>;
}
