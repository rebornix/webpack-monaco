import { INewScrollPosition, IModelDecoration, EndOfLinePreference, IViewState } from 'vs/editor/common/editorCommon';
import { ViewLineToken } from 'vs/editor/common/core/viewLineToken';
import { Position, IPosition } from 'vs/editor/common/core/position';
import { Range } from 'vs/editor/common/core/range';
import { Selection } from 'vs/editor/common/core/selection';
import { ViewEvent, IViewEventListener } from 'vs/editor/common/view/viewEvents';
import { IDisposable } from 'vs/base/common/lifecycle';
import { Scrollable, IScrollPosition } from 'vs/base/common/scrollable';
import { IPartialViewLinesViewportData } from 'vs/editor/common/viewLayout/viewLinesViewportData';
import { IEditorWhitespace } from 'vs/editor/common/viewLayout/whitespaceComputer';
export interface IViewWhitespaceViewportData {
    readonly id: number;
    readonly afterLineNumber: number;
    readonly verticalOffset: number;
    readonly height: number;
}
export declare class Viewport {
    readonly _viewportBrand: void;
    readonly top: number;
    readonly left: number;
    readonly width: number;
    readonly height: number;
    constructor(top: number, left: number, width: number, height: number);
}
export interface IViewLayout {
    readonly scrollable: Scrollable;
    onMaxLineWidthChanged(width: number): void;
    getScrollWidth(): number;
    getScrollHeight(): number;
    getCurrentScrollLeft(): number;
    getCurrentScrollTop(): number;
    getCurrentViewport(): Viewport;
    validateScrollPosition(scrollPosition: INewScrollPosition): IScrollPosition;
    setScrollPositionNow(position: INewScrollPosition): void;
    setScrollPositionSmooth(position: INewScrollPosition): void;
    deltaScrollNow(deltaScrollLeft: number, deltaScrollTop: number): void;
    getLinesViewportData(): IPartialViewLinesViewportData;
    getLinesViewportDataAtScrollTop(scrollTop: number): IPartialViewLinesViewportData;
    getWhitespaces(): IEditorWhitespace[];
    saveState(): IViewState;
    restoreState(state: IViewState): void;
    isAfterLines(verticalOffset: number): boolean;
    getLineNumberAtVerticalOffset(verticalOffset: number): number;
    getVerticalOffsetForLineNumber(lineNumber: number): number;
    getWhitespaceAtVerticalOffset(verticalOffset: number): IViewWhitespaceViewportData;
    /**
     * Reserve rendering space.
     * @return an identifier that can be later used to remove or change the whitespace.
     */
    addWhitespace(afterLineNumber: number, ordinal: number, height: number): number;
    /**
     * Change the properties of a whitespace.
     */
    changeWhitespace(id: number, newAfterLineNumber: number, newHeight: number): boolean;
    /**
     * Remove rendering space
     */
    removeWhitespace(id: number): boolean;
    /**
     * Get the layout information for whitespaces currently in the viewport
     */
    getWhitespaceViewportData(): IViewWhitespaceViewportData[];
    onHeightMaybeChanged(): void;
}
export interface ICoordinatesConverter {
    convertViewPositionToModelPosition(viewPosition: Position): Position;
    convertViewRangeToModelRange(viewRange: Range): Range;
    convertViewSelectionToModelSelection(viewSelection: Selection): Selection;
    validateViewPosition(viewPosition: Position, expectedModelPosition: Position): Position;
    validateViewRange(viewRange: Range, expectedModelRange: Range): Range;
    convertModelPositionToViewPosition(modelPosition: Position): Position;
    convertModelRangeToViewRange(modelRange: Range): Range;
    convertModelSelectionToViewSelection(modelSelection: Selection): Selection;
    modelPositionIsVisible(modelPosition: Position): boolean;
}
export interface IViewModel {
    addEventListener(listener: IViewEventListener): IDisposable;
    readonly coordinatesConverter: ICoordinatesConverter;
    readonly viewLayout: IViewLayout;
    /**
     * Gives a hint that a lot of requests are about to come in for these line numbers.
     */
    setViewport(startLineNumber: number, endLineNumber: number, centeredLineNumber: number): void;
    getDecorationsInViewport(visibleRange: Range): ViewModelDecoration[];
    getViewLineRenderingData(visibleRange: Range, lineNumber: number): ViewLineRenderingData;
    getMinimapLinesRenderingData(startLineNumber: number, endLineNumber: number, needed: boolean[]): MinimapLinesRenderingData;
    getCompletelyVisibleViewRange(): Range;
    getCompletelyVisibleViewRangeAtScrollTop(scrollTop: number): Range;
    getTabSize(): number;
    getLineCount(): number;
    getLineContent(lineNumber: number): string;
    getLineIndentGuide(lineNumber: number): number;
    getLineMinColumn(lineNumber: number): number;
    getLineMaxColumn(lineNumber: number): number;
    getLineFirstNonWhitespaceColumn(lineNumber: number): number;
    getLineLastNonWhitespaceColumn(lineNumber: number): number;
    getAllOverviewRulerDecorations(): ViewModelDecoration[];
    getValueInRange(range: Range, eol: EndOfLinePreference): string;
    getModelLineMaxColumn(modelLineNumber: number): number;
    validateModelPosition(modelPosition: IPosition): Position;
    deduceModelPositionRelativeToViewPosition(viewAnchorPosition: Position, deltaOffset: number, lineFeedCnt: number): Position;
    getPlainTextToCopy(ranges: Range[], emptySelectionClipboard: boolean): string;
    getHTMLToCopy(ranges: Range[], emptySelectionClipboard: boolean): string;
}
export declare class MinimapLinesRenderingData {
    readonly tabSize: number;
    readonly data: ViewLineData[];
    constructor(tabSize: number, data: ViewLineData[]);
}
export declare class ViewLineData {
    _viewLineDataBrand: void;
    /**
     * The content at this view line.
     */
    readonly content: string;
    /**
     * The minimum allowed column at this view line.
     */
    readonly minColumn: number;
    /**
     * The maximum allowed column at this view line.
     */
    readonly maxColumn: number;
    /**
     * The tokens at this view line.
     */
    readonly tokens: ViewLineToken[];
    constructor(content: string, minColumn: number, maxColumn: number, tokens: ViewLineToken[]);
}
export declare class ViewLineRenderingData {
    /**
     * The minimum allowed column at this view line.
     */
    readonly minColumn: number;
    /**
     * The maximum allowed column at this view line.
     */
    readonly maxColumn: number;
    /**
     * The content at this view line.
     */
    readonly content: string;
    /**
     * If set to false, it is guaranteed that `content` contains only LTR chars.
     */
    readonly mightContainRTL: boolean;
    /**
     * If set to false, it is guaranteed that `content` contains only basic ASCII chars.
     */
    readonly mightContainNonBasicASCII: boolean;
    /**
     * The tokens at this view line.
     */
    readonly tokens: ViewLineToken[];
    /**
     * Inline decorations at this view line.
     */
    readonly inlineDecorations: InlineDecoration[];
    /**
     * The tab size for this view model.
     */
    readonly tabSize: number;
    constructor(minColumn: number, maxColumn: number, content: string, mightContainRTL: boolean, mightContainNonBasicASCII: boolean, tokens: ViewLineToken[], inlineDecorations: InlineDecoration[], tabSize: number);
}
export declare class InlineDecoration {
    _inlineDecorationBrand: void;
    readonly range: Range;
    readonly inlineClassName: string;
    readonly insertsBeforeOrAfter: boolean;
    constructor(range: Range, inlineClassName: string, insertsBeforeOrAfter: boolean);
}
export declare class ViewModelDecoration {
    _viewModelDecorationBrand: void;
    range: Range;
    readonly source: IModelDecoration;
    constructor(source: IModelDecoration);
}
export declare class ViewEventsCollector {
    private _events;
    private _eventsLen;
    constructor();
    emit(event: ViewEvent): void;
    finalize(): ViewEvent[];
}
