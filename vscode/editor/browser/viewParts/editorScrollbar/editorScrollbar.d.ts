import { IOverviewRulerLayoutInfo } from 'vs/base/browser/ui/scrollbar/scrollableElement';
import { ViewPart } from 'vs/editor/browser/view/viewPart';
import { ViewContext } from 'vs/editor/common/view/viewContext';
import * as viewEvents from 'vs/editor/common/view/viewEvents';
import { RenderingContext, RestrictedRenderingContext } from 'vs/editor/common/view/renderingContext';
import { FastDomNode } from 'vs/base/browser/fastDomNode';
import { IMouseEvent } from 'vs/base/browser/mouseEvent';
import { ISimplifiedMouseEvent } from 'vs/base/browser/ui/scrollbar/abstractScrollbar';
export declare class EditorScrollbar extends ViewPart {
    private scrollbar;
    private scrollbarDomNode;
    constructor(context: ViewContext, linesContent: FastDomNode<HTMLElement>, viewDomNode: FastDomNode<HTMLElement>, overflowGuardDomNode: FastDomNode<HTMLElement>);
    dispose(): void;
    private _setLayout();
    getOverviewRulerLayoutInfo(): IOverviewRulerLayoutInfo;
    getDomNode(): FastDomNode<HTMLElement>;
    delegateVerticalScrollbarMouseDown(browserEvent: IMouseEvent): void;
    delegateSliderMouseDown(e: ISimplifiedMouseEvent, onDragFinished: () => void): void;
    onConfigurationChanged(e: viewEvents.ViewConfigurationChangedEvent): boolean;
    onScrollChanged(e: viewEvents.ViewScrollChangedEvent): boolean;
    onThemeChanged(e: viewEvents.ViewThemeChangedEvent): boolean;
    prepareRender(ctx: RenderingContext): void;
    render(ctx: RestrictedRenderingContext): void;
}
