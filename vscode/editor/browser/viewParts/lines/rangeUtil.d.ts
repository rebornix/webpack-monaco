import { HorizontalRange } from 'vs/editor/common/view/renderingContext';
export declare class RangeUtil {
    /**
     * Reusing the same range here
     * because IE is buggy and constantly freezes when using a large number
     * of ranges and calling .detach on them
     */
    private static _handyReadyRange;
    private static _createRange();
    private static _detachRange(range, endNode);
    private static _readClientRects(startElement, startOffset, endElement, endOffset, endNode);
    private static _mergeAdjacentRanges(ranges);
    private static _createHorizontalRangesFromClientRects(clientRects, clientRectDeltaLeft);
    static readHorizontalRanges(domNode: HTMLElement, startChildIndex: number, startOffset: number, endChildIndex: number, endOffset: number, clientRectDeltaLeft: number, endNode: HTMLElement): HorizontalRange[];
}
