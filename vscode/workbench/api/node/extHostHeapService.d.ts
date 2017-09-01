import { ExtHostHeapServiceShape } from './extHost.protocol';
export declare class ExtHostHeapService implements ExtHostHeapServiceShape {
    private static _idPool;
    private _data;
    keep(obj: any): number;
    delete(id: number): boolean;
    get<T>(id: number): T;
    $onGarbageCollection(ids: number[]): void;
}
