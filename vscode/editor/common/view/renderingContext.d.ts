import { IViewLayout, ViewModelDecoration } from 'vs/editor/common/viewModel/viewModel';
import { ViewportData } from 'vs/editor/common/viewLayout/viewLinesViewportData';
import { Range } from 'vs/editor/common/core/range';
import { Position } from 'vs/editor/common/core/position';
export interface IViewLines {
    linesVisibleRangesForRange(range: Range, includeNewLines: boolean): LineVisibleRanges[];
    visibleRangesForRange2(range: Range): HorizontalRange[];
}
export declare abstract class RestrictedRenderingContext {
    _restrictedRenderingContextBrand: void;
    readonly viewportData: ViewportData;
    readonly scrollWidth: number;
    readonly scrollHeight: number;
    readonly visibleRange: Range;
    readonly bigNumbersDelta: number;
    readonly scrollTop: number;
    readonly scrollLeft: number;
    readonly viewportWidth: number;
    readonly viewportHeight: number;
    private readonly _viewLayout;
    constructor(viewLayout: IViewLayout, viewportData: ViewportData);
    getScrolledTopFromAbsoluteTop(absoluteTop: number): number;
    getVerticalOffsetForLineNumber(lineNumber: number): number;
    lineIsVisible(lineNumber: number): boolean;
    getDecorationsInViewport(): ViewModelDecoration[];
}
export declare class RenderingContext extends RestrictedRenderingContext {
    _renderingContextBrand: void;
    private readonly _viewLines;
    constructor(viewLayout: IViewLayout, viewportData: ViewportData, viewLines: IViewLines);
    linesVisibleRangesForRange(range: Range, includeNewLines: boolean): LineVisibleRanges[];
    visibleRangeForPosition(position: Position): HorizontalRange;
}
export declare class LineVisibleRanges {
    _lineVisibleRangesBrand: void;
    lineNumber: number;
    ranges: HorizontalRange[];
    constructor(lineNumber: number, ranges: HorizontalRange[]);
}
export declare class HorizontalRange {
    _horizontalRangeBrand: void;
    left: number;
    width: number;
    constructor(left: number, width: number);
    toString(): string;
}
