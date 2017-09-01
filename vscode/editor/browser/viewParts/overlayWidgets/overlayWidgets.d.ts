import 'vs/css!./overlayWidgets';
import { FastDomNode } from 'vs/base/browser/fastDomNode';
import { IOverlayWidget, OverlayWidgetPositionPreference } from 'vs/editor/browser/editorBrowser';
import { ViewPart } from 'vs/editor/browser/view/viewPart';
import { ViewContext } from 'vs/editor/common/view/viewContext';
import { RenderingContext, RestrictedRenderingContext } from 'vs/editor/common/view/renderingContext';
import * as viewEvents from 'vs/editor/common/view/viewEvents';
export declare class ViewOverlayWidgets extends ViewPart {
    private _widgets;
    private _domNode;
    private _verticalScrollbarWidth;
    private _minimapWidth;
    private _horizontalScrollbarHeight;
    private _editorHeight;
    private _editorWidth;
    constructor(context: ViewContext);
    dispose(): void;
    getDomNode(): FastDomNode<HTMLElement>;
    onConfigurationChanged(e: viewEvents.ViewConfigurationChangedEvent): boolean;
    addWidget(widget: IOverlayWidget): void;
    setWidgetPosition(widget: IOverlayWidget, preference: OverlayWidgetPositionPreference): boolean;
    removeWidget(widget: IOverlayWidget): void;
    private _renderWidget(widgetData);
    prepareRender(ctx: RenderingContext): void;
    render(ctx: RestrictedRenderingContext): void;
}
