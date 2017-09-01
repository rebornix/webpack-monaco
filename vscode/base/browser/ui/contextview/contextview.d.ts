import 'vs/css!./contextview';
import { IDisposable } from 'vs/base/common/lifecycle';
import { EventEmitter } from 'vs/base/common/eventEmitter';
export interface IAnchor {
    x: number;
    y: number;
    width?: number;
    height?: number;
}
export declare enum AnchorAlignment {
    LEFT = 0,
    RIGHT = 1,
}
export declare enum AnchorPosition {
    BELOW = 0,
    ABOVE = 1,
}
export interface IDelegate {
    getAnchor(): HTMLElement | IAnchor;
    render(container: HTMLElement): IDisposable;
    layout?(): void;
    anchorAlignment?: AnchorAlignment;
    anchorPosition?: AnchorPosition;
    canRelayout?: boolean;
    onDOMEvent?(e: Event, activeElement: HTMLElement): void;
    onHide?(data?: any): void;
}
export interface IContextViewProvider {
    showContextView(delegate: IDelegate): void;
    hideContextView(): void;
    layout(): void;
}
export interface IPosition {
    top: number;
    left: number;
}
export interface ISize {
    width: number;
    height: number;
}
export interface IView extends IPosition, ISize {
}
export declare class ContextView extends EventEmitter {
    private static BUBBLE_UP_EVENTS;
    private static BUBBLE_DOWN_EVENTS;
    private $container;
    private $view;
    private delegate;
    private toDispose;
    private toDisposeOnClean;
    constructor(container: HTMLElement);
    setContainer(container: HTMLElement): void;
    show(delegate: IDelegate): void;
    layout(): void;
    private doLayout();
    hide(data?: any): void;
    private isVisible();
    private onDOMEvent(e, element, onCapture);
    dispose(): void;
}
