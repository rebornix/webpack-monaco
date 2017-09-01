export interface IItem {
    size: number;
}
export interface IRange {
    start: number;
    end: number;
}
export interface IRangedGroup {
    range: IRange;
    size: number;
}
/**
 * Returns the intersection between two ranges as a range itself.
 * Returns `null` if the intersection is empty.
 */
export declare function intersect(one: IRange, other: IRange): IRange;
export declare function isEmpty(range: IRange): boolean;
export declare function relativeComplement(one: IRange, other: IRange): IRange[];
export declare function each(range: IRange, fn: (index: number) => void): void;
/**
 * Returns the intersection between a ranged group and a range.
 * Returns `[]` if the intersection is empty.
 */
export declare function groupIntersect(range: IRange, groups: IRangedGroup[]): IRangedGroup[];
/**
 * Consolidates a collection of ranged groups.
 *
 * Consolidation is the process of merging consecutive ranged groups
 * that share the same `size`.
 */
export declare function consolidate(groups: IRangedGroup[]): IRangedGroup[];
export declare class RangeMap {
    private groups;
    private _size;
    splice(index: number, deleteCount: number, ...items: IItem[]): void;
    /**
     * Returns the number of items in the range map.
     */
    readonly count: number;
    /**
     * Returns the sum of the sizes of all items in the range map.
     */
    readonly size: number;
    /**
     * Returns the index of the item at the given position.
     */
    indexAt(position: number): number;
    /**
     * Returns the index of the item right after the item at the
     * index of the given position.
     */
    indexAfter(position: number): number;
    /**
     * Returns the start position of the item at the given index.
     */
    positionAt(index: number): number;
    dispose(): void;
}
