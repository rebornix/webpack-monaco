import { IMouseEvent, StandardMouseWheelEvent } from 'vs/base/browser/mouseEvent';
import { Widget } from 'vs/base/browser/ui/widget';
import { FastDomNode } from 'vs/base/browser/fastDomNode';
import { ScrollbarState } from 'vs/base/browser/ui/scrollbar/scrollbarState';
import { ScrollbarArrowOptions } from 'vs/base/browser/ui/scrollbar/scrollbarArrow';
import { Scrollable, ScrollbarVisibility, INewScrollPosition } from 'vs/base/common/scrollable';
export interface ISimplifiedMouseEvent {
    posx: number;
    posy: number;
}
export interface ScrollbarHost {
    onMouseWheel(mouseWheelEvent: StandardMouseWheelEvent): void;
    onDragStart(): void;
    onDragEnd(): void;
}
export interface AbstractScrollbarOptions {
    lazyRender: boolean;
    host: ScrollbarHost;
    scrollbarState: ScrollbarState;
    visibility: ScrollbarVisibility;
    extraScrollbarClassName: string;
    scrollable: Scrollable;
}
export declare abstract class AbstractScrollbar extends Widget {
    protected _host: ScrollbarHost;
    protected _scrollable: Scrollable;
    private _lazyRender;
    protected _scrollbarState: ScrollbarState;
    private _visibilityController;
    private _mouseMoveMonitor;
    domNode: FastDomNode<HTMLElement>;
    slider: FastDomNode<HTMLElement>;
    protected _shouldRender: boolean;
    constructor(opts: AbstractScrollbarOptions);
    /**
     * Creates the dom node for an arrow & adds it to the container
     */
    protected _createArrow(opts: ScrollbarArrowOptions): void;
    /**
     * Creates the slider dom node, adds it to the container & hooks up the events
     */
    protected _createSlider(top: number, left: number, width: number, height: number): void;
    protected _onElementSize(visibleSize: number): boolean;
    protected _onElementScrollSize(elementScrollSize: number): boolean;
    protected _onElementScrollPosition(elementScrollPosition: number): boolean;
    beginReveal(): void;
    beginHide(): void;
    render(): void;
    private _domNodeMouseDown(e);
    delegateMouseDown(e: IMouseEvent): void;
    delegateSliderMouseDown(e: ISimplifiedMouseEvent, onDragFinished: () => void): void;
    private _onMouseDown(e);
    private _sliderMouseDown(e, onDragFinished);
    private _setDesiredScrollPositionNow(_desiredScrollPosition);
    protected abstract _renderDomNode(largeSize: number, smallSize: number): void;
    protected abstract _updateSlider(sliderSize: number, sliderPosition: number): void;
    protected abstract _mouseDownRelativePosition(offsetX: number, offsetY: number): number;
    protected abstract _sliderMousePosition(e: ISimplifiedMouseEvent): number;
    protected abstract _sliderOrthogonalMousePosition(e: ISimplifiedMouseEvent): number;
    abstract writeScrollPosition(target: INewScrollPosition, scrollPosition: number): void;
}
