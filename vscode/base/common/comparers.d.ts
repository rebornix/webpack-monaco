export declare function setFileNameComparer(collator: Intl.Collator): void;
export declare function compareFileNames(one: string, other: string): number;
export declare function noIntlCompareFileNames(one: string, other: string): number;
export declare function compareFileExtensions(one: string, other: string): number;
export declare function comparePaths(one: string, other: string): number;
export declare function compareAnything(one: string, other: string, lookFor: string): number;
export declare function compareByPrefix(one: string, other: string, lookFor: string): number;
export interface IScorableResourceAccessor<T> {
    getLabel(t: T): string;
    getResourcePath(t: T): string;
}
export declare function compareByScore<T>(elementA: T, elementB: T, accessor: IScorableResourceAccessor<T>, lookFor: string, lookForNormalizedLower: string, scorerCache?: {
    [key: string]: number;
}): number;
