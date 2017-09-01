import { FastDomNode } from 'vs/base/browser/fastDomNode';
import { ContentWidgetPositionPreference, IContentWidget } from 'vs/editor/browser/editorBrowser';
import { ViewPart } from 'vs/editor/browser/view/viewPart';
import { ViewContext } from 'vs/editor/common/view/viewContext';
import { RenderingContext, RestrictedRenderingContext } from 'vs/editor/common/view/renderingContext';
import { IPosition } from 'vs/editor/common/core/position';
import * as viewEvents from 'vs/editor/common/view/viewEvents';
export declare class ViewContentWidgets extends ViewPart {
    private _viewDomNode;
    private _widgets;
    domNode: FastDomNode<HTMLElement>;
    overflowingContentWidgetsDomNode: FastDomNode<HTMLElement>;
    constructor(context: ViewContext, viewDomNode: FastDomNode<HTMLElement>);
    dispose(): void;
    onConfigurationChanged(e: viewEvents.ViewConfigurationChangedEvent): boolean;
    onDecorationsChanged(e: viewEvents.ViewDecorationsChangedEvent): boolean;
    onFlushed(e: viewEvents.ViewFlushedEvent): boolean;
    onLinesChanged(e: viewEvents.ViewLinesChangedEvent): boolean;
    onLinesDeleted(e: viewEvents.ViewLinesDeletedEvent): boolean;
    onLinesInserted(e: viewEvents.ViewLinesInsertedEvent): boolean;
    onScrollChanged(e: viewEvents.ViewScrollChangedEvent): boolean;
    onZonesChanged(e: viewEvents.ViewZonesChangedEvent): boolean;
    addWidget(_widget: IContentWidget): void;
    setWidgetPosition(widget: IContentWidget, position: IPosition, preference: ContentWidgetPositionPreference[]): void;
    removeWidget(widget: IContentWidget): void;
    shouldSuppressMouseDownOnWidget(widgetId: string): boolean;
    prepareRender(ctx: RenderingContext): void;
    render(ctx: RestrictedRenderingContext): void;
}
