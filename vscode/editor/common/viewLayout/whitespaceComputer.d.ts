export interface IEditorWhitespace {
    readonly id: number;
    readonly afterLineNumber: number;
    readonly heightInLines: number;
}
/**
 * Represent whitespaces in between lines and provide fast CRUD management methods.
 * The whitespaces are sorted ascending by `afterLineNumber`.
 */
export declare class WhitespaceComputer {
    /**
     * heights[i] is the height in pixels for whitespace at index i
     */
    private _heights;
    /**
     * afterLineNumbers[i] is the line number whitespace at index i is after
     */
    private _afterLineNumbers;
    /**
     * ordinals[i] is the orinal of the whitespace at index i
     */
    private _ordinals;
    /**
     * prefixSum[i] = SUM(heights[j]), 1 <= j <= i
     */
    private _prefixSum;
    /**
     * prefixSum[i], 1 <= i <= prefixSumValidIndex can be trusted
     */
    private _prefixSumValidIndex;
    /**
     * ids[i] is the whitespace id of whitespace at index i
     */
    private _ids;
    /**
     * index at which a whitespace is positioned (inside heights, afterLineNumbers, prefixSum members)
     */
    private _whitespaceId2Index;
    /**
     * last whitespace id issued
     */
    private _lastWhitespaceId;
    constructor();
    /**
     * Find the insertion index for a new value inside a sorted array of values.
     * If the value is already present in the sorted array, the insertion index will be after the already existing value.
     */
    static findInsertionIndex(sortedArray: number[], value: number, ordinals: number[], valueOrdinal: number): number;
    /**
     * Insert a new whitespace of a certain height after a line number.
     * The whitespace has a "sticky" characteristic.
     * Irrespective of edits above or below `afterLineNumber`, the whitespace will follow the initial line.
     *
     * @param afterLineNumber The conceptual position of this whitespace. The whitespace will follow this line as best as possible even when deleting/inserting lines above/below.
     * @param heightInPx The height of the whitespace, in pixels.
     * @return An id that can be used later to mutate or delete the whitespace
     */
    insertWhitespace(afterLineNumber: number, ordinal: number, heightInPx: number): number;
    private _insertWhitespaceAtIndex(id, insertIndex, afterLineNumber, ordinal, heightInPx);
    /**
     * Change properties associated with a certain whitespace.
     */
    changeWhitespace(id: number, newAfterLineNumber: number, newHeight: number): boolean;
    /**
     * Change the height of an existing whitespace
     *
     * @param id The whitespace to change
     * @param newHeightInPx The new height of the whitespace, in pixels
     * @return Returns true if the whitespace is found and if the new height is different than the old height
     */
    changeWhitespaceHeight(id: number, newHeightInPx: number): boolean;
    /**
     * Change the line number after which an existing whitespace flows.
     *
     * @param id The whitespace to change
     * @param newAfterLineNumber The new line number the whitespace will follow
     * @return Returns true if the whitespace is found and if the new line number is different than the old line number
     */
    changeWhitespaceAfterLineNumber(id: number, newAfterLineNumber: number): boolean;
    /**
     * Remove an existing whitespace.
     *
     * @param id The whitespace to remove
     * @return Returns true if the whitespace is found and it is removed.
     */
    removeWhitespace(id: number): boolean;
    private _removeWhitespaceAtIndex(removeIndex);
    /**
     * Notify the computer that lines have been deleted (a continuous zone of lines).
     * This gives it a chance to update `afterLineNumber` for whitespaces, giving the "sticky" characteristic.
     *
     * @param fromLineNumber The line number at which the deletion started, inclusive
     * @param toLineNumber The line number at which the deletion ended, inclusive
     */
    onLinesDeleted(fromLineNumber: number, toLineNumber: number): void;
    /**
     * Notify the computer that lines have been inserted (a continuous zone of lines).
     * This gives it a chance to update `afterLineNumber` for whitespaces, giving the "sticky" characteristic.
     *
     * @param fromLineNumber The line number at which the insertion started, inclusive
     * @param toLineNumber The line number at which the insertion ended, inclusive.
     */
    onLinesInserted(fromLineNumber: number, toLineNumber: number): void;
    /**
     * Get the sum of all the whitespaces.
     */
    getTotalHeight(): number;
    /**
     * Return the sum of the heights of the whitespaces at [0..index].
     * This includes the whitespace at `index`.
     *
     * @param index The index of the whitespace.
     * @return The sum of the heights of all whitespaces before the one at `index`, including the one at `index`.
     */
    getAccumulatedHeight(index: number): number;
    /**
     * Find all whitespaces with `afterLineNumber` < `lineNumber` and return the sum of their heights.
     *
     * @param lineNumber The line number whitespaces should be before.
     * @return The sum of the heights of the whitespaces before `lineNumber`.
     */
    getAccumulatedHeightBeforeLineNumber(lineNumber: number): number;
    private _findLastWhitespaceBeforeLineNumber(lineNumber);
    private _findFirstWhitespaceAfterLineNumber(lineNumber);
    /**
     * Find the index of the first whitespace which has `afterLineNumber` >= `lineNumber`.
     * @return The index of the first whitespace with `afterLineNumber` >= `lineNumber` or -1 if no whitespace is found.
     */
    getFirstWhitespaceIndexAfterLineNumber(lineNumber: number): number;
    /**
     * The number of whitespaces.
     */
    getCount(): number;
    /**
     * Get the `afterLineNumber` for whitespace at index `index`.
     *
     * @param index The index of the whitespace.
     * @return `afterLineNumber` of whitespace at `index`.
     */
    getAfterLineNumberForWhitespaceIndex(index: number): number;
    /**
     * Get the `id` for whitespace at index `index`.
     *
     * @param index The index of the whitespace.
     * @return `id` of whitespace at `index`.
     */
    getIdForWhitespaceIndex(index: number): number;
    /**
     * Get the `height` for whitespace at index `index`.
     *
     * @param index The index of the whitespace.
     * @return `height` of whitespace at `index`.
     */
    getHeightForWhitespaceIndex(index: number): number;
    /**
     * Get all whitespaces.
     */
    getWhitespaces(deviceLineHeight: number): IEditorWhitespace[];
}
