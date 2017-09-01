import { ViewEventHandler } from 'vs/editor/common/viewModel/viewEventHandler';
import { ViewContext } from 'vs/editor/common/view/viewContext';
import { RenderingContext, RestrictedRenderingContext } from 'vs/editor/common/view/renderingContext';
import { FastDomNode } from 'vs/base/browser/fastDomNode';
export declare abstract class ViewPart extends ViewEventHandler {
    _context: ViewContext;
    constructor(context: ViewContext);
    dispose(): void;
    abstract prepareRender(ctx: RenderingContext): void;
    abstract render(ctx: RestrictedRenderingContext): void;
}
export declare const enum PartFingerprint {
    None = 0,
    ContentWidgets = 1,
    OverflowingContentWidgets = 2,
    OverflowGuard = 3,
    OverlayWidgets = 4,
    ScrollableElement = 5,
    TextArea = 6,
    ViewLines = 7,
    Minimap = 8,
}
export declare class PartFingerprints {
    static write(target: Element | FastDomNode<HTMLElement>, partId: PartFingerprint): void;
    static read(target: Element): PartFingerprint;
    static collect(child: Element, stopAt: Element): Uint8Array;
}
