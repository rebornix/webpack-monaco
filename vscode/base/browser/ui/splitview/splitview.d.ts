import 'vs/css!./splitview';
import lifecycle = require('vs/base/common/lifecycle');
import ee = require('vs/base/common/eventEmitter');
import sash = require('vs/base/browser/ui/sash/sash');
import Event from 'vs/base/common/event';
import { Color } from 'vs/base/common/color';
export declare enum Orientation {
    VERTICAL = 0,
    HORIZONTAL = 1,
}
export declare enum ViewSizing {
    Flexible = 0,
    Fixed = 1,
}
export interface IOptions {
    orientation?: Orientation;
    canChangeOrderByDragAndDrop?: boolean;
}
export interface ISashEvent {
    start: number;
    current: number;
}
export interface IViewOptions {
    sizing?: ViewSizing;
    fixedSize?: number;
    minimumSize?: number;
}
export interface IView extends ee.IEventEmitter {
    readonly initialSize: number;
    size: number;
    sizing: ViewSizing;
    fixedSize: number;
    minimumSize: number;
    maximumSize: number;
    draggableElement?: HTMLElement;
    draggableLabel?: string;
    render(container: HTMLElement, orientation: Orientation): void;
    layout(size: number, orientation: Orientation): void;
    focus(): void;
}
export declare abstract class View extends ee.EventEmitter implements IView {
    initialSize: number;
    size: number;
    protected _sizing: ViewSizing;
    protected _fixedSize: number;
    protected _minimumSize: number;
    constructor(initialSize: number, opts: IViewOptions);
    readonly sizing: ViewSizing;
    readonly fixedSize: number;
    readonly minimumSize: number;
    readonly maximumSize: number;
    protected setFlexible(size?: number): void;
    protected setFixed(size?: number): void;
    abstract render(container: HTMLElement, orientation: Orientation): void;
    abstract focus(): void;
    abstract layout(size: number, orientation: Orientation): void;
}
export interface IHeaderViewOptions extends IHeaderViewStyles, IViewOptions {
    headerSize?: number;
}
export interface IHeaderViewStyles {
    headerForeground?: Color;
    headerBackground?: Color;
    headerHighContrastBorder?: Color;
}
export declare abstract class HeaderView extends View {
    private _headerSize;
    private _showHeader;
    protected header: HTMLElement;
    protected body: HTMLElement;
    private headerForeground;
    private headerBackground;
    private headerHighContrastBorder;
    constructor(initialSize: number, opts: IHeaderViewOptions);
    style(styles: IHeaderViewStyles): void;
    protected readonly headerSize: number;
    protected applyStyles(): void;
    readonly draggableElement: HTMLElement;
    render(container: HTMLElement, orientation: Orientation): void;
    showHeader(): boolean;
    hideHeader(): boolean;
    layout(size: number, orientation: Orientation): void;
    private layoutBodyContainer(orientation);
    dispose(): void;
    protected abstract renderHeader(container: HTMLElement): void;
    protected abstract renderBody(container: HTMLElement): void;
    protected abstract layoutBody(size: number): void;
}
export interface ICollapsibleViewOptions {
    sizing: ViewSizing;
    ariaHeaderLabel: string;
    bodySize?: number;
    initialState?: CollapsibleState;
}
export declare enum CollapsibleState {
    EXPANDED = 0,
    COLLAPSED = 1,
}
export declare abstract class AbstractCollapsibleView extends HeaderView {
    protected state: CollapsibleState;
    private ariaHeaderLabel;
    private headerClickListener;
    private headerKeyListener;
    private focusTracker;
    private _bodySize;
    private _previousSize;
    private readonly viewSizing;
    constructor(initialSize: number | undefined, opts: ICollapsibleViewOptions);
    readonly previousSize: number;
    setBodySize(bodySize: number): void;
    private updateSize();
    render(container: HTMLElement, orientation: Orientation): void;
    focus(): void;
    layout(size: number, orientation: Orientation): void;
    isExpanded(): boolean;
    expand(): void;
    collapse(): void;
    toggleExpansion(): void;
    private layoutHeader();
    protected changeState(state: CollapsibleState): void;
    showHeader(): boolean;
    hideHeader(): boolean;
    dispose(): void;
}
export interface SplitViewStyles {
    dropBackground?: Color;
}
export declare class SplitView extends lifecycle.Disposable implements sash.IHorizontalSashLayoutProvider, sash.IVerticalSashLayoutProvider {
    private orientation;
    private canDragAndDrop;
    private el;
    private size;
    private viewElements;
    private views;
    private viewChangeListeners;
    private viewFocusPreviousListeners;
    private viewFocusNextListeners;
    private viewFocusListeners;
    private viewDnDListeners;
    private sashOrientation;
    private sashes;
    private sashesListeners;
    private measureContainerSize;
    private layoutViewElement;
    private eventWrapper;
    private animationTimeout;
    private state;
    private draggedView;
    private dropBackground;
    private _onFocus;
    readonly onFocus: Event<IView>;
    private _onDidOrderChange;
    readonly onDidOrderChange: Event<void>;
    constructor(container: HTMLElement, options?: IOptions);
    getViews<T extends IView>(): T[];
    addView(view: IView, initialWeight?: number, index?: number): void;
    removeView(view: IView): void;
    layout(size?: number): void;
    style(styles: SplitViewStyles): void;
    private createDnDListeners(view, viewElement);
    private updateFromDragging(view, viewElement, isDragging);
    private move(fromIndex, toIndex);
    private onSashStart(sash, event);
    private onSashChange(sash, event);
    private expandCollapse(collapse, collapses, expands, collapseIndexes, expandIndexes);
    private initialLayout();
    private getLastFlexibleViewIndex(exceptIndex?);
    private layoutViews();
    private onViewChange(view, size);
    private setupAnimation();
    private clearAnimation();
    private readonly voidView;
    private areAllViewsFixed();
    getVerticalSashLeft(sash: sash.Sash): number;
    getHorizontalSashTop(sash: sash.Sash): number;
    private getSashPosition(sash);
    dispose(): void;
}
