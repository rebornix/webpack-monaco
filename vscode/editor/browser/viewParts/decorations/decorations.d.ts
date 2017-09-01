import 'vs/css!./decorations';
import { DynamicViewOverlay } from 'vs/editor/browser/view/dynamicViewOverlay';
import { ViewContext } from 'vs/editor/common/view/viewContext';
import { RenderingContext } from 'vs/editor/common/view/renderingContext';
import * as viewEvents from 'vs/editor/common/view/viewEvents';
export declare class DecorationsOverlay extends DynamicViewOverlay {
    private _context;
    private _lineHeight;
    private _typicalHalfwidthCharacterWidth;
    private _renderResult;
    constructor(context: ViewContext);
    dispose(): void;
    onConfigurationChanged(e: viewEvents.ViewConfigurationChangedEvent): boolean;
    onDecorationsChanged(e: viewEvents.ViewDecorationsChangedEvent): boolean;
    onFlushed(e: viewEvents.ViewFlushedEvent): boolean;
    onLinesChanged(e: viewEvents.ViewLinesChangedEvent): boolean;
    onLinesDeleted(e: viewEvents.ViewLinesDeletedEvent): boolean;
    onLinesInserted(e: viewEvents.ViewLinesInsertedEvent): boolean;
    onScrollChanged(e: viewEvents.ViewScrollChangedEvent): boolean;
    onZonesChanged(e: viewEvents.ViewZonesChangedEvent): boolean;
    prepareRender(ctx: RenderingContext): void;
    private _renderWholeLineDecorations(ctx, decorations, output);
    private _renderNormalDecorations(ctx, decorations, output);
    render(startLineNumber: number, lineNumber: number): string;
}
