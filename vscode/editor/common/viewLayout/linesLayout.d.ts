import { IEditorWhitespace } from 'vs/editor/common/viewLayout/whitespaceComputer';
import { IPartialViewLinesViewportData } from 'vs/editor/common/viewLayout/viewLinesViewportData';
import { IViewWhitespaceViewportData } from 'vs/editor/common/viewModel/viewModel';
/**
 * Layouting of objects that take vertical space (by having a height) and push down other objects.
 *
 * These objects are basically either text (lines) or spaces between those lines (whitespaces).
 * This provides commodity operations for working with lines that contain whitespace that pushes lines lower (vertically).
 * This is written with no knowledge of an editor in mind.
 */
export declare class LinesLayout {
    /**
     * Keep track of the total number of lines.
     * This is useful for doing binary searches or for doing hit-testing.
     */
    private _lineCount;
    /**
     * The height of a line in pixels.
     */
    private _lineHeight;
    /**
     * Contains whitespace information in pixels
     */
    private _whitespaces;
    constructor(lineCount: number, lineHeight: number);
    /**
     * Change the height of a line in pixels.
     */
    setLineHeight(lineHeight: number): void;
    /**
     * Set the number of lines.
     *
     * @param lineCount New number of lines.
     */
    onFlushed(lineCount: number): void;
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
    /**
     * Change properties associated with a certain whitespace.
     */
    changeWhitespace(id: number, newAfterLineNumber: number, newHeight: number): boolean;
    /**
     * Remove an existing whitespace.
     *
     * @param id The whitespace to remove
     * @return Returns true if the whitespace is found and it is removed.
     */
    removeWhitespace(id: number): boolean;
    /**
     * Notify the layouter that lines have been deleted (a continuous zone of lines).
     *
     * @param fromLineNumber The line number at which the deletion started, inclusive
     * @param toLineNumber The line number at which the deletion ended, inclusive
     */
    onLinesDeleted(fromLineNumber: number, toLineNumber: number): void;
    /**
     * Notify the layouter that lines have been inserted (a continuous zone of lines).
     *
     * @param fromLineNumber The line number at which the insertion started, inclusive
     * @param toLineNumber The line number at which the insertion ended, inclusive.
     */
    onLinesInserted(fromLineNumber: number, toLineNumber: number): void;
    /**
     * Get the sum of heights for all objects.
     *
     * @return The sum of heights for all objects.
     */
    getLinesTotalHeight(): number;
    /**
     * Get the vertical offset (the sum of heights for all objects above) a certain line number.
     *
     * @param lineNumber The line number
     * @return The sum of heights for all objects above `lineNumber`.
     */
    getVerticalOffsetForLineNumber(lineNumber: number): number;
    /**
     * Returns the accumulated height of whitespaces before the given line number.
     *
     * @param lineNumber The line number
     */
    getWhitespaceAccumulatedHeightBeforeLineNumber(lineNumber: number): number;
    /**
     * Returns if there is any whitespace in the document.
     */
    hasWhitespace(): boolean;
    /**
     * Check if `verticalOffset` is below all lines.
     */
    isAfterLines(verticalOffset: number): boolean;
    /**
     * Find the first line number that is at or after vertical offset `verticalOffset`.
     * i.e. if getVerticalOffsetForLine(line) is x and getVerticalOffsetForLine(line + 1) is y, then
     * getLineNumberAtOrAfterVerticalOffset(i) = line, x <= i < y.
     *
     * @param verticalOffset The vertical offset to search at.
     * @return The line number at or after vertical offset `verticalOffset`.
     */
    getLineNumberAtOrAfterVerticalOffset(verticalOffset: number): number;
    /**
     * Get all the lines and their relative vertical offsets that are positioned between `verticalOffset1` and `verticalOffset2`.
     *
     * @param verticalOffset1 The beginning of the viewport.
     * @param verticalOffset2 The end of the viewport.
     * @return A structure describing the lines positioned between `verticalOffset1` and `verticalOffset2`.
     */
    getLinesViewportData(verticalOffset1: number, verticalOffset2: number): IPartialViewLinesViewportData;
    getVerticalOffsetForWhitespaceIndex(whitespaceIndex: number): number;
    getWhitespaceIndexAtOrAfterVerticallOffset(verticalOffset: number): number;
    /**
     * Get exactly the whitespace that is layouted at `verticalOffset`.
     *
     * @param verticalOffset The vertical offset.
     * @return Precisely the whitespace that is layouted at `verticaloffset` or null.
     */
    getWhitespaceAtVerticalOffset(verticalOffset: number): IViewWhitespaceViewportData;
    /**
     * Get a list of whitespaces that are positioned between `verticalOffset1` and `verticalOffset2`.
     *
     * @param verticalOffset1 The beginning of the viewport.
     * @param verticalOffset2 The end of the viewport.
     * @return An array with all the whitespaces in the viewport. If no whitespace is in viewport, the array is empty.
     */
    getWhitespaceViewportData(verticalOffset1: number, verticalOffset2: number): IViewWhitespaceViewportData[];
    /**
     * Get all whitespaces.
     */
    getWhitespaces(): IEditorWhitespace[];
}
