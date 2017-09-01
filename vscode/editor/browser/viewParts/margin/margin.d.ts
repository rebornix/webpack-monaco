import { FastDomNode } from 'vs/base/browser/fastDomNode';
import { ViewPart } from 'vs/editor/browser/view/viewPart';
import { ViewContext } from 'vs/editor/common/view/viewContext';
import { RenderingContext, RestrictedRenderingContext } from 'vs/editor/common/view/renderingContext';
import * as viewEvents from 'vs/editor/common/view/viewEvents';
export declare class Margin extends ViewPart {
    static CLASS_NAME: string;
    private _domNode;
    private _canUseLayerHinting;
    private _contentLeft;
    private _glyphMarginLeft;
    private _glyphMarginWidth;
    private _glyphMarginBackgroundDomNode;
    constructor(context: ViewContext);
    dispose(): void;
    getDomNode(): FastDomNode<HTMLElement>;
    private _createDomNode();
    onConfigurationChanged(e: viewEvents.ViewConfigurationChangedEvent): boolean;
    onScrollChanged(e: viewEvents.ViewScrollChangedEvent): boolean;
    prepareRender(ctx: RenderingContext): void;
    render(ctx: RestrictedRenderingContext): void;
}
