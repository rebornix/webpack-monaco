import { FastDomNode } from 'vs/base/browser/fastDomNode';
import { Position } from 'vs/editor/common/core/position';
import { ViewContext } from 'vs/editor/common/view/viewContext';
import { RenderingContext, RestrictedRenderingContext } from 'vs/editor/common/view/renderingContext';
import * as viewEvents from 'vs/editor/common/view/viewEvents';
export interface IViewCursorRenderData {
    domNode: HTMLElement;
    position: Position;
    contentLeft: number;
    width: number;
    height: number;
}
export declare class ViewCursor {
    private readonly _context;
    private readonly _isSecondary;
    private readonly _domNode;
    private _cursorStyle;
    private _lineHeight;
    private _typicalHalfwidthCharacterWidth;
    private _isVisible;
    private _position;
    private _isInEditableRange;
    private _lastRenderedContent;
    private _renderData;
    constructor(context: ViewContext, isSecondary: boolean);
    getDomNode(): FastDomNode<HTMLElement>;
    getIsInEditableRange(): boolean;
    getPosition(): Position;
    show(): void;
    hide(): void;
    onConfigurationChanged(e: viewEvents.ViewConfigurationChangedEvent): boolean;
    onCursorPositionChanged(position: Position, isInEditableRange: boolean): boolean;
    private _prepareRender(ctx);
    prepareRender(ctx: RenderingContext): void;
    render(ctx: RestrictedRenderingContext): IViewCursorRenderData;
    private updatePosition(newPosition);
}
