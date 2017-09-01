import { IDisposable, Disposable } from 'vs/base/common/lifecycle';
import { StandardMouseEvent } from 'vs/base/browser/mouseEvent';
/**
 * Coordinates relative to the whole document (e.g. mouse event's pageX and pageY)
 */
export declare class PageCoordinates {
    _pageCoordinatesBrand: void;
    readonly x: number;
    readonly y: number;
    constructor(x: number, y: number);
    toClientCoordinates(): ClientCoordinates;
}
/**
 * Coordinates within the application's client area (i.e. origin is document's scroll position).
 *
 * For example, clicking in the top-left corner of the client area will
 * always result in a mouse event with a client.x value of 0, regardless
 * of whether the page is scrolled horizontally.
 */
export declare class ClientCoordinates {
    _clientCoordinatesBrand: void;
    readonly clientX: number;
    readonly clientY: number;
    constructor(clientX: number, clientY: number);
    toPageCoordinates(): PageCoordinates;
}
/**
 * The position of the editor in the page.
 */
export declare class EditorPagePosition {
    _editorPagePositionBrand: void;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    constructor(x: number, y: number, width: number, height: number);
}
export declare function createEditorPagePosition(editorViewDomNode: HTMLElement): EditorPagePosition;
export declare class EditorMouseEvent extends StandardMouseEvent {
    _editorMouseEventBrand: void;
    /**
     * Coordinates relative to the whole document.
     */
    readonly pos: PageCoordinates;
    /**
     * Editor's coordinates relative to the whole document.
     */
    readonly editorPos: EditorPagePosition;
    constructor(e: MouseEvent, editorViewDomNode: HTMLElement);
}
export interface EditorMouseEventMerger {
    (lastEvent: EditorMouseEvent, currentEvent: EditorMouseEvent): EditorMouseEvent;
}
export declare class EditorMouseEventFactory {
    private _editorViewDomNode;
    constructor(editorViewDomNode: HTMLElement);
    private _create(e);
    onContextMenu(target: HTMLElement, callback: (e: EditorMouseEvent) => void): IDisposable;
    onMouseUp(target: HTMLElement, callback: (e: EditorMouseEvent) => void): IDisposable;
    onMouseDown(target: HTMLElement, callback: (e: EditorMouseEvent) => void): IDisposable;
    onMouseLeave(target: HTMLElement, callback: (e: EditorMouseEvent) => void): IDisposable;
    onMouseMoveThrottled(target: HTMLElement, callback: (e: EditorMouseEvent) => void, merger: EditorMouseEventMerger, minimumTimeMs: number): IDisposable;
}
export declare class GlobalEditorMouseMoveMonitor extends Disposable {
    private _editorViewDomNode;
    private _globalMouseMoveMonitor;
    private _keydownListener;
    constructor(editorViewDomNode: HTMLElement);
    startMonitoring(merger: EditorMouseEventMerger, mouseMoveCallback: (e: EditorMouseEvent) => void, onStopCallback: () => void): void;
}
