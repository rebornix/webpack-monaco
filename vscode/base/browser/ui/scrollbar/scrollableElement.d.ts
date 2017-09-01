import 'vs/css!./media/scrollbars';
import { IMouseEvent } from 'vs/base/browser/mouseEvent';
import { ScrollableElementCreationOptions, ScrollableElementChangeOptions } from 'vs/base/browser/ui/scrollbar/scrollableElementOptions';
import { Scrollable, ScrollEvent, INewScrollDimensions, IScrollDimensions, INewScrollPosition, IScrollPosition } from 'vs/base/common/scrollable';
import { Widget } from 'vs/base/browser/ui/widget';
import { ISimplifiedMouseEvent } from 'vs/base/browser/ui/scrollbar/abstractScrollbar';
import Event from 'vs/base/common/event';
export interface IOverviewRulerLayoutInfo {
    parent: HTMLElement;
    insertBefore: HTMLElement;
}
export declare class MouseWheelClassifier {
    static INSTANCE: MouseWheelClassifier;
    private readonly _capacity;
    private _memory;
    private _front;
    private _rear;
    constructor();
    isPhysicalMouseWheel(): boolean;
    accept(timestamp: number, deltaX: number, deltaY: number): void;
    /**
     * A score between 0 and 1 for `item`.
     *  - a score towards 0 indicates that the source appears to be a physical mouse wheel
     *  - a score towards 1 indicates that the source appears to be a touchpad or magic mouse, etc.
     */
    private _computeScore(item);
}
export declare abstract class AbstractScrollableElement extends Widget {
    private readonly _options;
    protected readonly _scrollable: Scrollable;
    private readonly _verticalScrollbar;
    private readonly _horizontalScrollbar;
    private readonly _domNode;
    private readonly _leftShadowDomNode;
    private readonly _topShadowDomNode;
    private readonly _topLeftShadowDomNode;
    private readonly _listenOnDomNode;
    private _mouseWheelToDispose;
    private _isDragging;
    private _mouseIsOver;
    private readonly _hideTimeout;
    private _shouldRender;
    private readonly _onScroll;
    onScroll: Event<ScrollEvent>;
    protected constructor(element: HTMLElement, options: ScrollableElementCreationOptions, scrollable?: Scrollable);
    dispose(): void;
    /**
     * Get the generated 'scrollable' dom node
     */
    getDomNode(): HTMLElement;
    getOverviewRulerLayoutInfo(): IOverviewRulerLayoutInfo;
    /**
     * Delegate a mouse down event to the vertical scrollbar.
     * This is to help with clicking somewhere else and having the scrollbar react.
     */
    delegateVerticalScrollbarMouseDown(browserEvent: IMouseEvent): void;
    /**
     * Delegate a mouse down event to the vertical scrollbar (directly to the slider!).
     * This is to help with clicking somewhere else and having the scrollbar react.
     */
    delegateSliderMouseDown(e: ISimplifiedMouseEvent, onDragFinished: () => void): void;
    getScrollDimensions(): IScrollDimensions;
    setScrollDimensions(dimensions: INewScrollDimensions): void;
    /**
     * Update the class name of the scrollable element.
     */
    updateClassName(newClassName: string): void;
    /**
     * Update configuration options for the scrollbar.
     * Really this is Editor.IEditorScrollbarOptions, but base shouldn't
     * depend on Editor.
     */
    updateOptions(newOptions: ScrollableElementChangeOptions): void;
    private _setListeningToMouseWheel(shouldListen);
    private _onMouseWheel(e);
    private _onDidScroll(e);
    /**
     * Render / mutate the DOM now.
     * Should be used together with the ctor option `lazyRender`.
     */
    renderNow(): void;
    private _render();
    private _onDragStart();
    private _onDragEnd();
    private _onMouseOut(e);
    private _onMouseOver(e);
    private _reveal();
    private _hide();
    private _scheduleHide();
}
export declare class ScrollableElement extends AbstractScrollableElement {
    constructor(element: HTMLElement, options: ScrollableElementCreationOptions);
    setScrollPosition(update: INewScrollPosition): void;
    getScrollPosition(): IScrollPosition;
}
export declare class SmoothScrollableElement extends AbstractScrollableElement {
    constructor(element: HTMLElement, options: ScrollableElementCreationOptions, scrollable: Scrollable);
}
export declare class DomScrollableElement extends ScrollableElement {
    private _element;
    constructor(element: HTMLElement, options: ScrollableElementCreationOptions);
    scanDomNode(): void;
}
