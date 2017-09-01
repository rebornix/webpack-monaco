import 'vs/css!./viewLines';
import { FastDomNode } from 'vs/base/browser/fastDomNode';
import { Range } from 'vs/editor/common/core/range';
import { Position } from 'vs/editor/common/core/position';
import { IVisibleLinesHost } from 'vs/editor/browser/view/viewLayer';
import { ViewLine } from 'vs/editor/browser/viewParts/lines/viewLine';
import { ViewContext } from 'vs/editor/common/view/viewContext';
import { ViewportData } from 'vs/editor/common/viewLayout/viewLinesViewportData';
import { IViewLines, HorizontalRange, LineVisibleRanges } from 'vs/editor/common/view/renderingContext';
import { ViewPart } from 'vs/editor/browser/view/viewPart';
import * as viewEvents from 'vs/editor/common/view/viewEvents';
export declare class ViewLines extends ViewPart implements IVisibleLinesHost<ViewLine>, IViewLines {
    /**
     * Adds this ammount of pixels to the right of lines (no-one wants to type near the edge of the viewport)
     */
    private static HORIZONTAL_EXTRA_PX;
    private readonly _linesContent;
    private readonly _textRangeRestingSpot;
    private readonly _visibleLines;
    private readonly domNode;
    private _lineHeight;
    private _typicalHalfwidthCharacterWidth;
    private _isViewportWrapping;
    private _revealHorizontalRightPadding;
    private _canUseLayerHinting;
    private _viewLineOptions;
    private _maxLineWidth;
    private _asyncUpdateLineWidths;
    private _horizontalRevealRequest;
    private _lastRenderedData;
    constructor(context: ViewContext, linesContent: FastDomNode<HTMLElement>);
    dispose(): void;
    getDomNode(): FastDomNode<HTMLElement>;
    createVisibleLine(): ViewLine;
    onConfigurationChanged(e: viewEvents.ViewConfigurationChangedEvent): boolean;
    private _onOptionsMaybeChanged();
    onCursorStateChanged(e: viewEvents.ViewCursorStateChangedEvent): boolean;
    onDecorationsChanged(e: viewEvents.ViewDecorationsChangedEvent): boolean;
    onFlushed(e: viewEvents.ViewFlushedEvent): boolean;
    onLinesChanged(e: viewEvents.ViewLinesChangedEvent): boolean;
    onLinesDeleted(e: viewEvents.ViewLinesDeletedEvent): boolean;
    onLinesInserted(e: viewEvents.ViewLinesInsertedEvent): boolean;
    onRevealRangeRequest(e: viewEvents.ViewRevealRangeRequestEvent): boolean;
    onScrollChanged(e: viewEvents.ViewScrollChangedEvent): boolean;
    onTokensChanged(e: viewEvents.ViewTokensChangedEvent): boolean;
    onZonesChanged(e: viewEvents.ViewZonesChangedEvent): boolean;
    onThemeChanged(e: viewEvents.ViewThemeChangedEvent): boolean;
    getPositionFromDOMInfo(spanNode: HTMLElement, offset: number): Position;
    private _getViewLineDomNode(node);
    /**
     * @returns the line number of this view line dom node.
     */
    private _getLineNumberFor(domNode);
    getLineWidth(lineNumber: number): number;
    linesVisibleRangesForRange(range: Range, includeNewLines: boolean): LineVisibleRanges[];
    visibleRangesForRange2(range: Range): HorizontalRange[];
    /**
     * Updates the max line width if it is fast to compute.
     * Returns true if all lines were taken into account.
     * Returns false if some lines need to be reevaluated (in a slow fashion).
     */
    private _updateLineWidthsFast();
    private _updateLineWidthsSlow();
    private _updateLineWidths(fast);
    prepareRender(): void;
    render(): void;
    renderText(viewportData: ViewportData): void;
    private _ensureMaxLineWidth(lineWidth);
    private _computeScrollTopToRevealRange(viewport, range, verticalType);
    private _computeScrollLeftToRevealRange(lineNumber, startColumn, endColumn);
    private _computeMinimumScrolling(viewportStart, viewportEnd, boxStart, boxEnd, revealAtStart?, revealAtEnd?);
}
