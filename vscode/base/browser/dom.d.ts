import { TPromise } from 'vs/base/common/winjs.base';
import { IDisposable } from 'vs/base/common/lifecycle';
import { IKeyboardEvent } from 'vs/base/browser/keyboardEvent';
import { IMouseEvent } from 'vs/base/browser/mouseEvent';
export declare function clearNode(node: HTMLElement): void;
/**
 * Calls JSON.Stringify with a replacer to break apart any circular references.
 * This prevents JSON.stringify from throwing the exception
 *  "Uncaught TypeError: Converting circular structure to JSON"
 */
export declare function safeStringifyDOMAware(obj: any): string;
export declare function isInDOM(node: Node): boolean;
export declare const hasClass: (node: HTMLElement, className: string) => boolean;
export declare const addClass: (node: HTMLElement, className: string) => void;
export declare const removeClass: (node: HTMLElement, className: string) => void;
export declare const toggleClass: (node: HTMLElement, className: string, shouldHaveIt?: boolean) => void;
export declare function addDisposableListener(node: Element | Window | Document, type: string, handler: (event: any) => void, useCapture?: boolean): IDisposable;
export interface IAddStandardDisposableListenerSignature {
    (node: HTMLElement, type: 'click', handler: (event: IMouseEvent) => void, useCapture?: boolean): IDisposable;
    (node: HTMLElement, type: 'mousedown', handler: (event: IMouseEvent) => void, useCapture?: boolean): IDisposable;
    (node: HTMLElement, type: 'keydown', handler: (event: IKeyboardEvent) => void, useCapture?: boolean): IDisposable;
    (node: HTMLElement, type: 'keypress', handler: (event: IKeyboardEvent) => void, useCapture?: boolean): IDisposable;
    (node: HTMLElement, type: 'keyup', handler: (event: IKeyboardEvent) => void, useCapture?: boolean): IDisposable;
    (node: HTMLElement, type: string, handler: (event: any) => void, useCapture?: boolean): IDisposable;
}
export declare let addStandardDisposableListener: IAddStandardDisposableListenerSignature;
export declare function addDisposableNonBubblingMouseOutListener(node: Element, handler: (event: MouseEvent) => void): IDisposable;
/**
 * Schedule a callback to be run at the next animation frame.
 * This allows multiple parties to register callbacks that should run at the next animation frame.
 * If currently in an animation frame, `runner` will be executed immediately.
 * @return token that can be used to cancel the scheduled runner (only if `runner` was not executed immediately).
 */
export declare let runAtThisOrScheduleAtNextAnimationFrame: (runner: () => void, priority?: number) => IDisposable;
/**
 * Schedule a callback to be run at the next animation frame.
 * This allows multiple parties to register callbacks that should run at the next animation frame.
 * If currently in an animation frame, `runner` will be executed at the next animation frame.
 * @return token that can be used to cancel the scheduled runner.
 */
export declare let scheduleAtNextAnimationFrame: (runner: () => void, priority?: number) => IDisposable;
/**
 * Add a throttled listener. `handler` is fired at most every 16ms or with the next animation frame (if browser supports it).
 */
export interface IEventMerger<R> {
    (lastEvent: R, currentEvent: Event): R;
}
export declare function addDisposableThrottledListener<R>(node: any, type: string, handler: (event: R) => void, eventMerger?: IEventMerger<R>, minimumTimeMs?: number): IDisposable;
export declare function getComputedStyle(el: HTMLElement): CSSStyleDeclaration;
export declare function getTopLeftOffset(element: HTMLElement): {
    left: number;
    top: number;
};
export interface IDomNodePagePosition {
    left: number;
    top: number;
    width: number;
    height: number;
}
/**
 * Returns the position of a dom node relative to the entire page.
 */
export declare function getDomNodePagePosition(domNode: HTMLElement): IDomNodePagePosition;
export interface IStandardWindow {
    scrollX: number;
    scrollY: number;
}
export declare const StandardWindow: IStandardWindow;
export declare function getContentWidth(element: HTMLElement): number;
export declare function getTotalWidth(element: HTMLElement): number;
export declare function getTotalScrollWidth(element: HTMLElement): number;
export declare function getContentHeight(element: HTMLElement): number;
export declare function getTotalHeight(element: HTMLElement): number;
export declare function getLargestChildWidth(parent: HTMLElement, children: HTMLElement[]): number;
export declare function isAncestor(testChild: Node, testAncestor: Node): boolean;
export declare function findParentWithClass(node: HTMLElement, clazz: string, stopAtClazz?: string): HTMLElement;
export declare function createStyleSheet(container?: HTMLElement): HTMLStyleElement;
export declare function createCSSRule(selector: string, cssText: string, style?: HTMLStyleElement): void;
export declare function getCSSRule(selector: string, style?: HTMLStyleElement): any;
export declare function removeCSSRulesContainingSelector(ruleName: string, style?: any): void;
export declare function isHTMLElement(o: any): o is HTMLElement;
export declare const EventType: {
    CLICK: string;
    AUXCLICK: string;
    DBLCLICK: string;
    MOUSE_UP: string;
    MOUSE_DOWN: string;
    MOUSE_OVER: string;
    MOUSE_MOVE: string;
    MOUSE_OUT: string;
    CONTEXT_MENU: string;
    WHEEL: string;
    KEY_DOWN: string;
    KEY_PRESS: string;
    KEY_UP: string;
    LOAD: string;
    UNLOAD: string;
    ABORT: string;
    ERROR: string;
    RESIZE: string;
    SCROLL: string;
    SELECT: string;
    CHANGE: string;
    SUBMIT: string;
    RESET: string;
    FOCUS: string;
    BLUR: string;
    INPUT: string;
    STORAGE: string;
    DRAG_START: string;
    DRAG: string;
    DRAG_ENTER: string;
    DRAG_LEAVE: string;
    DRAG_OVER: string;
    DROP: string;
    DRAG_END: string;
    ANIMATION_START: string;
    ANIMATION_END: string;
    ANIMATION_ITERATION: string;
};
export interface EventLike {
    preventDefault(): void;
    stopPropagation(): void;
}
export declare const EventHelper: {
    stop: (e: EventLike, cancelBubble?: boolean) => void;
};
export interface IFocusTracker {
    addBlurListener(fn: () => void): IDisposable;
    addFocusListener(fn: () => void): IDisposable;
    dispose(): void;
}
export declare function saveParentsScrollTop(node: Element): number[];
export declare function restoreParentsScrollTop(node: Element, state: number[]): void;
export declare function trackFocus(element: HTMLElement | Window): IFocusTracker;
export declare function append<T extends Node>(parent: HTMLElement, ...children: T[]): T;
export declare function prepend<T extends Node>(parent: HTMLElement, child: T): T;
export declare function $<T extends HTMLElement>(description: string, attrs?: {
    [key: string]: any;
}, ...children: (Node | string)[]): T;
export declare function join(nodes: Node[], separator: Node | string): Node[];
export declare function show(...elements: HTMLElement[]): void;
export declare function hide(...elements: HTMLElement[]): void;
export declare function removeTabIndexAndUpdateFocus(node: HTMLElement): void;
export declare function getElementsByTagName(tag: string): HTMLElement[];
export declare function finalHandler<T extends Event>(fn: (event: T) => any): (event: T) => any;
export declare function domContentLoaded(): TPromise<any>;
/**
 * Find a value usable for a dom node size such that the likelihood that it would be
 * displayed with constant screen pixels size is as high as possible.
 *
 * e.g. We would desire for the cursors to be 2px (CSS px) wide. Under a devicePixelRatio
 * of 1.25, the cursor will be 2.5 screen pixels wide. Depending on how the dom node aligns/"snaps"
 * with the screen pixels, it will sometimes be rendered with 2 screen pixels, and sometimes with 3 screen pixels.
 */
export declare function computeScreenAwareSize(cssPx: number): number;
