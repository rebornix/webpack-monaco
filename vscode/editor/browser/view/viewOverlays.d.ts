import { FastDomNode } from 'vs/base/browser/fastDomNode';
import { IConfiguration } from 'vs/editor/common/editorCommon';
import { IVisibleLine, IVisibleLinesHost } from 'vs/editor/browser/view/viewLayer';
import { DynamicViewOverlay } from 'vs/editor/browser/view/dynamicViewOverlay';
import { ViewContext } from 'vs/editor/common/view/viewContext';
import { RenderingContext, RestrictedRenderingContext } from 'vs/editor/common/view/renderingContext';
import { ViewportData } from 'vs/editor/common/viewLayout/viewLinesViewportData';
import * as viewEvents from 'vs/editor/common/view/viewEvents';
import { ViewPart } from 'vs/editor/browser/view/viewPart';
import { IStringBuilder } from 'vs/editor/common/core/stringBuilder';
export declare class ViewOverlays extends ViewPart implements IVisibleLinesHost<ViewOverlayLine> {
    private readonly _visibleLines;
    protected readonly domNode: FastDomNode<HTMLElement>;
    private _dynamicOverlays;
    private _isFocused;
    constructor(context: ViewContext);
    shouldRender(): boolean;
    dispose(): void;
    getDomNode(): FastDomNode<HTMLElement>;
    createVisibleLine(): ViewOverlayLine;
    addDynamicOverlay(overlay: DynamicViewOverlay): void;
    onConfigurationChanged(e: viewEvents.ViewConfigurationChangedEvent): boolean;
    onFlushed(e: viewEvents.ViewFlushedEvent): boolean;
    onFocusChanged(e: viewEvents.ViewFocusChangedEvent): boolean;
    onLinesChanged(e: viewEvents.ViewLinesChangedEvent): boolean;
    onLinesDeleted(e: viewEvents.ViewLinesDeletedEvent): boolean;
    onLinesInserted(e: viewEvents.ViewLinesInsertedEvent): boolean;
    onScrollChanged(e: viewEvents.ViewScrollChangedEvent): boolean;
    onTokensChanged(e: viewEvents.ViewTokensChangedEvent): boolean;
    onZonesChanged(e: viewEvents.ViewZonesChangedEvent): boolean;
    prepareRender(ctx: RenderingContext): void;
    render(ctx: RestrictedRenderingContext): void;
    _viewOverlaysRender(ctx: RestrictedRenderingContext): void;
}
export declare class ViewOverlayLine implements IVisibleLine {
    private _configuration;
    private _dynamicOverlays;
    private _domNode;
    private _renderedContent;
    private _lineHeight;
    constructor(configuration: IConfiguration, dynamicOverlays: DynamicViewOverlay[]);
    getDomNode(): HTMLElement;
    setDomNode(domNode: HTMLElement): void;
    onContentChanged(): void;
    onTokensChanged(): void;
    onConfigurationChanged(e: viewEvents.ViewConfigurationChangedEvent): void;
    renderLine(lineNumber: number, deltaTop: number, viewportData: ViewportData, sb: IStringBuilder): boolean;
    layoutLine(lineNumber: number, deltaTop: number): void;
}
export declare class ContentViewOverlays extends ViewOverlays {
    private _contentWidth;
    constructor(context: ViewContext);
    onConfigurationChanged(e: viewEvents.ViewConfigurationChangedEvent): boolean;
    onScrollChanged(e: viewEvents.ViewScrollChangedEvent): boolean;
    _viewOverlaysRender(ctx: RestrictedRenderingContext): void;
}
export declare class MarginViewOverlays extends ViewOverlays {
    private _contentLeft;
    constructor(context: ViewContext);
    onConfigurationChanged(e: viewEvents.ViewConfigurationChangedEvent): boolean;
    onScrollChanged(e: viewEvents.ViewScrollChangedEvent): boolean;
    _viewOverlaysRender(ctx: RestrictedRenderingContext): void;
}
