import 'vs/css!./rulers';
import { FastDomNode } from 'vs/base/browser/fastDomNode';
import { ViewPart } from 'vs/editor/browser/view/viewPart';
import { ViewContext } from 'vs/editor/common/view/viewContext';
import { RenderingContext, RestrictedRenderingContext } from 'vs/editor/common/view/renderingContext';
import * as viewEvents from 'vs/editor/common/view/viewEvents';
export declare class Rulers extends ViewPart {
    domNode: FastDomNode<HTMLElement>;
    private _renderedRulers;
    private _rulers;
    private _height;
    private _typicalHalfwidthCharacterWidth;
    constructor(context: ViewContext);
    dispose(): void;
    onConfigurationChanged(e: viewEvents.ViewConfigurationChangedEvent): boolean;
    onScrollChanged(e: viewEvents.ViewScrollChangedEvent): boolean;
    prepareRender(ctx: RenderingContext): void;
    private _ensureRulersCount();
    render(ctx: RestrictedRenderingContext): void;
}
