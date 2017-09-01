import { ViewLineRenderingData, IViewModel, ViewModelDecoration, IViewWhitespaceViewportData } from 'vs/editor/common/viewModel/viewModel';
import { Range } from 'vs/editor/common/core/range';
import { Selection } from 'vs/editor/common/core/selection';
export interface IPartialViewLinesViewportData {
    /**
     * Value to be substracted from `scrollTop` (in order to vertical offset numbers < 1MM)
     */
    readonly bigNumbersDelta: number;
    /**
     * The first (partially) visible line number.
     */
    readonly startLineNumber: number;
    /**
     * The last (partially) visible line number.
     */
    readonly endLineNumber: number;
    /**
     * relativeVerticalOffset[i] is the `top` position for line at `i` + `startLineNumber`.
     */
    readonly relativeVerticalOffset: number[];
    /**
     * The centered line in the viewport.
     */
    readonly centeredLineNumber: number;
    /**
     * The first completely visible line number.
     */
    readonly completelyVisibleStartLineNumber: number;
    /**
     * The last completely visible line number.
     */
    readonly completelyVisibleEndLineNumber: number;
}
/**
 * Contains all data needed to render at a specific viewport.
 */
export declare class ViewportData {
    readonly selections: Selection[];
    /**
     * The line number at which to start rendering (inclusive).
     */
    readonly startLineNumber: number;
    /**
     * The line number at which to end rendering (inclusive).
     */
    readonly endLineNumber: number;
    /**
     * relativeVerticalOffset[i] is the `top` position for line at `i` + `startLineNumber`.
     */
    readonly relativeVerticalOffset: number[];
    /**
     * The viewport as a range (startLineNumber,1) -> (endLineNumber,maxColumn(endLineNumber)).
     */
    readonly visibleRange: Range;
    /**
     * Value to be substracted from `scrollTop` (in order to vertical offset numbers < 1MM)
     */
    readonly bigNumbersDelta: number;
    /**
     * Positioning information about gaps whitespace.
     */
    readonly whitespaceViewportData: IViewWhitespaceViewportData[];
    private readonly _model;
    constructor(selections: Selection[], partialData: IPartialViewLinesViewportData, whitespaceViewportData: IViewWhitespaceViewportData[], model: IViewModel);
    getViewLineRenderingData(lineNumber: number): ViewLineRenderingData;
    getDecorationsInViewport(): ViewModelDecoration[];
}
