import 'vs/css!./sash';
import { Disposable } from 'vs/base/common/lifecycle';
import { Dimension } from 'vs/base/browser/builder';
import { EventEmitter } from 'vs/base/common/eventEmitter';
import Event from 'vs/base/common/event';
export interface ISashLayoutProvider {
}
export interface IVerticalSashLayoutProvider extends ISashLayoutProvider {
    getVerticalSashLeft(sash: Sash): number;
    getVerticalSashTop?(sash: Sash): number;
    getVerticalSashHeight?(sash: Sash): number;
}
export interface IHorizontalSashLayoutProvider extends ISashLayoutProvider {
    getHorizontalSashTop(sash: Sash): number;
    getHorizontalSashLeft?(sash: Sash): number;
    getHorizontalSashWidth?(sash: Sash): number;
}
export interface ISashEvent {
    startX: number;
    currentX: number;
    startY: number;
    currentY: number;
}
export interface ISashOptions {
    baseSize?: number;
    orientation?: Orientation;
}
export declare enum Orientation {
    VERTICAL = 0,
    HORIZONTAL = 1,
}
export declare class Sash extends EventEmitter {
    private $e;
    private gesture;
    private layoutProvider;
    private isDisabled;
    private hidden;
    private orientation;
    private size;
    constructor(container: HTMLElement, layoutProvider: ISashLayoutProvider, options?: ISashOptions);
    getHTMLElement(): HTMLElement;
    setOrientation(orientation: Orientation): void;
    private getOrientation();
    private onMouseDown(e);
    private onTouchStart(event);
    layout(): void;
    show(): void;
    hide(): void;
    isHidden(): boolean;
    enable(): void;
    disable(): void;
    dispose(): void;
}
/**
 * A simple Vertical Sash that computes the position of the sash when it is moved between the given dimension.
 * Triggers onPositionChange event when the position is changed
 */
export declare class VSash extends Disposable implements IVerticalSashLayoutProvider {
    private minWidth;
    private sash;
    private ratio;
    private startPosition;
    private position;
    private dimension;
    private _onPositionChange;
    readonly onPositionChange: Event<number>;
    constructor(container: HTMLElement, minWidth: number);
    getVerticalSashTop(): number;
    getVerticalSashLeft(): number;
    getVerticalSashHeight(): number;
    setDimenesion(dimension: Dimension): void;
    private onSashDragStart();
    private onSashDrag(e);
    private compute(ratio);
    private onSashDragEnd();
    private onSashReset();
    private computeSashPosition(sashRatio?);
}
