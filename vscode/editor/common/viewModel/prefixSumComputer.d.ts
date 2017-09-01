export declare class PrefixSumIndexOfResult {
    _prefixSumIndexOfResultBrand: void;
    index: number;
    remainder: number;
    constructor(index: number, remainder: number);
}
export declare class PrefixSumComputer {
    /**
     * values[i] is the value at index i
     */
    private values;
    /**
     * prefixSum[i] = SUM(heights[j]), 0 <= j <= i
     */
    private prefixSum;
    /**
     * prefixSum[i], 0 <= i <= prefixSumValidIndex can be trusted
     */
    private prefixSumValidIndex;
    constructor(values: Uint32Array);
    getCount(): number;
    insertValues(insertIndex: number, insertValues: Uint32Array): boolean;
    changeValue(index: number, value: number): boolean;
    removeValues(startIndex: number, cnt: number): boolean;
    getTotalValue(): number;
    getAccumulatedValue(index: number): number;
    private _getAccumulatedValue(index);
    getIndexOf(accumulatedValue: number): PrefixSumIndexOfResult;
}
export declare class PrefixSumComputerWithCache {
    private readonly _actual;
    private _cacheAccumulatedValueStart;
    private _cache;
    constructor(values: Uint32Array);
    private _bustCache();
    getCount(): number;
    insertValues(insertIndex: number, insertValues: Uint32Array): void;
    changeValue(index: number, value: number): void;
    removeValues(startIndex: number, cnt: number): void;
    getTotalValue(): number;
    getAccumulatedValue(index: number): number;
    getIndexOf(accumulatedValue: number): PrefixSumIndexOfResult;
    /**
     * Gives a hint that a lot of requests are about to come in for these accumulated values.
     */
    warmUpCache(accumulatedValueStart: number, accumulatedValueEnd: number): void;
}
