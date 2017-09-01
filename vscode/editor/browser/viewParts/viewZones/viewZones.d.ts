import { FastDomNode } from 'vs/base/browser/fastDomNode';
import { IViewZone } from 'vs/editor/browser/editorBrowser';
import { ViewPart } from 'vs/editor/browser/view/viewPart';
import { ViewContext } from 'vs/editor/common/view/viewContext';
import { RenderingContext, RestrictedRenderingContext } from 'vs/editor/common/view/renderingContext';
import { IViewWhitespaceViewportData } from 'vs/editor/common/viewModel/viewModel';
import * as viewEvents from 'vs/editor/common/view/viewEvents';
export interface IMyViewZone {
    whitespaceId: number;
    delegate: IViewZone;
    isVisible: boolean;
    domNode: FastDomNode<HTMLElement>;
    marginDomNode: FastDomNode<HTMLElement>;
}
export interface IMyRenderData {
    data: IViewWhitespaceViewportData[];
}
export declare class ViewZones extends ViewPart {
    private _zones;
    private _lineHeight;
    private _contentWidth;
    private _contentLeft;
    domNode: FastDomNode<HTMLElement>;
    marginDomNode: FastDomNode<HTMLElement>;
    constructor(context: ViewContext);
    dispose(): void;
    private _recomputeWhitespacesProps();
    onConfigurationChanged(e: viewEvents.ViewConfigurationChangedEvent): boolean;
    onLineMappingChanged(e: viewEvents.ViewLineMappingChangedEvent): boolean;
    onLinesDeleted(e: viewEvents.ViewLinesDeletedEvent): boolean;
    onScrollChanged(e: viewEvents.ViewScrollChangedEvent): boolean;
    onZonesChanged(e: viewEvents.ViewZonesChangedEvent): boolean;
    onLinesInserted(e: viewEvents.ViewLinesInsertedEvent): boolean;
    private _getZoneOrdinal(zone);
    private _computeWhitespaceProps(zone);
    addZone(zone: IViewZone): number;
    removeZone(id: number): boolean;
    layoutZone(id: number): boolean;
    shouldSuppressMouseDownOnViewZone(id: number): boolean;
    private _heightInPixels(zone);
    private _safeCallOnComputedHeight(zone, height);
    private _safeCallOnDomNodeTop(zone, top);
    prepareRender(ctx: RenderingContext): void;
    render(ctx: RestrictedRenderingContext): void;
}
