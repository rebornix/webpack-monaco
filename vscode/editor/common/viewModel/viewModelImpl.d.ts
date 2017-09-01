import { Position, IPosition } from 'vs/editor/common/core/position';
import { Range } from 'vs/editor/common/core/range';
import * as editorCommon from 'vs/editor/common/editorCommon';
import { MinimapLinesRenderingData, ViewLineRenderingData, ViewModelDecoration, IViewModel, ICoordinatesConverter } from 'vs/editor/common/viewModel/viewModel';
import * as viewEvents from 'vs/editor/common/view/viewEvents';
import { ViewLayout } from 'vs/editor/common/viewLayout/viewLayout';
import { IDisposable } from 'vs/base/common/lifecycle';
export declare class ViewModel extends viewEvents.ViewEventEmitter implements IViewModel {
    private readonly editorId;
    private readonly configuration;
    private readonly model;
    private readonly lines;
    readonly coordinatesConverter: ICoordinatesConverter;
    readonly viewLayout: ViewLayout;
    private readonly decorations;
    private _isDisposing;
    private _centeredViewLine;
    constructor(editorId: number, configuration: editorCommon.IConfiguration, model: editorCommon.IModel, scheduleAtNextAnimationFrame: (callback: () => void) => IDisposable);
    dispose(): void;
    private _onConfigurationChanged(eventsCollector, e);
    private _onModelEvents(eventsCollector, events);
    setHiddenAreas(ranges: Range[]): void;
    getCenteredRangeInViewport(): Range;
    getCompletelyVisibleViewRange(): Range;
    getCompletelyVisibleViewRangeAtScrollTop(scrollTop: number): Range;
    getTabSize(): number;
    getLineCount(): number;
    /**
     * Gives a hint that a lot of requests are about to come in for these line numbers.
     */
    setViewport(startLineNumber: number, endLineNumber: number, centeredLineNumber: number): void;
    getLineIndentGuide(lineNumber: number): number;
    getLineContent(lineNumber: number): string;
    getLineMinColumn(lineNumber: number): number;
    getLineMaxColumn(lineNumber: number): number;
    getLineFirstNonWhitespaceColumn(lineNumber: number): number;
    getLineLastNonWhitespaceColumn(lineNumber: number): number;
    getDecorationsInViewport(visibleRange: Range): ViewModelDecoration[];
    getViewLineRenderingData(visibleRange: Range, lineNumber: number): ViewLineRenderingData;
    getMinimapLinesRenderingData(startLineNumber: number, endLineNumber: number, needed: boolean[]): MinimapLinesRenderingData;
    getAllOverviewRulerDecorations(): ViewModelDecoration[];
    getValueInRange(range: Range, eol: editorCommon.EndOfLinePreference): string;
    getModelLineMaxColumn(modelLineNumber: number): number;
    validateModelPosition(position: IPosition): Position;
    deduceModelPositionRelativeToViewPosition(viewAnchorPosition: Position, deltaOffset: number, lineFeedCnt: number): Position;
    getPlainTextToCopy(ranges: Range[], emptySelectionClipboard: boolean): string;
    getHTMLToCopy(viewRanges: Range[], emptySelectionClipboard: boolean): string;
    private _getHTMLToCopy(modelRange, colorMap);
    private _getColorMap();
}
