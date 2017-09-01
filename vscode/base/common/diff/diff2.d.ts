export interface ISequence {
    getLength(): number;
    getElementHash(index: number): string;
}
export interface IDiffChange {
    /**
     * The position of the first element in the original sequence which
     * this change affects.
     */
    originalStart: number;
    /**
     * The number of elements from the original sequence which were
     * affected.
     */
    originalLength: number;
    /**
     * The position of the first element in the modified sequence which
     * this change affects.
     */
    modifiedStart: number;
    /**
     * The number of elements from the modified sequence which were
     * affected (added).
     */
    modifiedLength: number;
}
export interface IContinueProcessingPredicate {
    (furthestOriginalIndex: number, originalSequence: ISequence, matchLengthOfLongest: number): boolean;
}
export interface IHashFunction {
    (sequence: ISequence, index: number): string;
}
/**
 * An implementation of the difference algorithm described by Hirschberg
 */
export declare class LcsDiff2 {
    private x;
    private y;
    private ids_for_x;
    private ids_for_y;
    private hashFunc;
    private resultX;
    private resultY;
    private forwardPrev;
    private forwardCurr;
    private backwardPrev;
    private backwardCurr;
    constructor(originalSequence: ISequence, newSequence: ISequence, continueProcessingPredicate: IContinueProcessingPredicate, hashFunc: IHashFunction);
    private ComputeUniqueIdentifiers();
    private ElementsAreEqual(xIndex, yIndex);
    ComputeDiff(): IDiffChange[];
    private forward(xStart, xStop, yStart, yStop);
    private backward(xStart, xStop, yStart, yStop);
    private findCut(xStart, xStop, yStart, yStop, middle);
    private execute(xStart, xStop, yStart, yStop);
}
