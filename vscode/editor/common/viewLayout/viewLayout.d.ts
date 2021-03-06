import { Disposable, IDisposable } from 'vs/base/common/lifecycle';
import { Scrollable, ScrollEvent, IScrollPosition } from 'vs/base/common/scrollable';
import * as editorCommon from 'vs/editor/common/editorCommon';
import { IViewLayout, IViewWhitespaceViewportData, Viewport } from 'vs/editor/common/viewModel/viewModel';
import { IPartialViewLinesViewportData } from 'vs/editor/common/viewLayout/viewLinesViewportData';
import { IEditorWhitespace } from 'vs/editor/common/viewLayout/whitespaceComputer';
import Event from 'vs/base/common/event';
import { IConfigurationChangedEvent } from 'vs/editor/common/config/editorOptions';
export declare class ViewLayout extends Disposable implements IViewLayout {
    static LINES_HORIZONTAL_EXTRA_PX: number;
    private readonly _configuration;
    private readonly _linesLayout;
    readonly scrollable: Scrollable;
    readonly onDidScroll: Event<ScrollEvent>;
    constructor(configuration: editorCommon.IConfiguration, lineCount: number, scheduleAtNextAnimationFrame: (callback: () => void) => IDisposable);
    dispose(): void;
    getScrollable(): Scrollable;
    onHeightMaybeChanged(): void;
    private _configureSmoothScrollDuration();
    onConfigurationChanged(e: IConfigurationChangedEvent): void;
    onFlushed(lineCount: number): void;
    onLinesDeleted(fromLineNumber: number, toLineNumber: number): void;
    onLinesInserted(fromLineNumber: number, toLineNumber: number): void;
    private _getHorizontalScrollbarHeight(scrollDimensions);
    private _getTotalHeight();
    private _updateHeight();
    getCurrentViewport(): Viewport;
    private _computeScrollWidth(maxLineWidth, viewportWidth);
    onMaxLineWidthChanged(maxLineWidth: number): void;
    saveState(): editorCommon.IViewState;
    restoreState(state: editorCommon.IViewState): void;
    addWhitespace(afterLineNumber: number, ordinal: number, height: number): number;
    changeWhitespace(id: number, newAfterLineNumber: number, newHeight: number): boolean;
    removeWhitespace(id: number): boolean;
    getVerticalOffsetForLineNumber(lineNumber: number): number;
    isAfterLines(verticalOffset: number): boolean;
    getLineNumberAtVerticalOffset(verticalOffset: number): number;
    getWhitespaceAtVerticalOffset(verticalOffset: number): IViewWhitespaceViewportData;
    getLinesViewportData(): IPartialViewLinesViewportData;
    getLinesViewportDataAtScrollTop(scrollTop: number): IPartialViewLinesViewportData;
    getWhitespaceViewportData(): IViewWhitespaceViewportData[];
    getWhitespaces(): IEditorWhitespace[];
    getScrollWidth(): number;
    getScrollHeight(): number;
    getCurrentScrollLeft(): number;
    getCurrentScrollTop(): number;
    validateScrollPosition(scrollPosition: editorCommon.INewScrollPosition): IScrollPosition;
    setScrollPositionNow(position: editorCommon.INewScrollPosition): void;
    setScrollPositionSmooth(position: editorCommon.INewScrollPosition): void;
    deltaScrollNow(deltaScrollLeft: number, deltaScrollTop: number): void;
}
