import { Position } from 'vs/editor/common/core/position';
import { ViewEventHandler } from 'vs/editor/common/viewModel/viewEventHandler';
import { MouseTargetFactory } from 'vs/editor/browser/controller/mouseTarget';
import * as editorBrowser from 'vs/editor/browser/editorBrowser';
import { ViewContext } from 'vs/editor/common/view/viewContext';
import { HorizontalRange } from 'vs/editor/common/view/renderingContext';
import { EditorMouseEvent } from 'vs/editor/browser/editorDom';
import { IViewCursorRenderData } from 'vs/editor/browser/viewParts/viewCursors/viewCursor';
import * as viewEvents from 'vs/editor/common/view/viewEvents';
import { ViewController } from 'vs/editor/browser/view/viewController';
export interface IPointerHandlerHelper {
    viewDomNode: HTMLElement;
    linesContentDomNode: HTMLElement;
    focusTextArea(): void;
    /**
     * Get the last rendered information of the cursors.
     */
    getLastViewCursorsRenderData(): IViewCursorRenderData[];
    shouldSuppressMouseDownOnViewZone(viewZoneId: number): boolean;
    shouldSuppressMouseDownOnWidget(widgetId: string): boolean;
    /**
     * Decode a position from a rendered dom node
     */
    getPositionFromDOMInfo(spanNode: HTMLElement, offset: number): Position;
    visibleRangeForPosition2(lineNumber: number, column: number): HorizontalRange;
    getLineWidth(lineNumber: number): number;
}
export declare class MouseHandler extends ViewEventHandler {
    static MOUSE_MOVE_MINIMUM_TIME: number;
    protected _context: ViewContext;
    protected viewController: ViewController;
    protected viewHelper: IPointerHandlerHelper;
    protected mouseTargetFactory: MouseTargetFactory;
    private _asyncFocus;
    private _mouseDownOperation;
    private lastMouseLeaveTime;
    constructor(context: ViewContext, viewController: ViewController, viewHelper: IPointerHandlerHelper);
    dispose(): void;
    onCursorStateChanged(e: viewEvents.ViewCursorStateChangedEvent): boolean;
    private _isFocused;
    onFocusChanged(e: viewEvents.ViewFocusChangedEvent): boolean;
    onScrollChanged(e: viewEvents.ViewScrollChangedEvent): boolean;
    getTargetAtClientPoint(clientX: number, clientY: number): editorBrowser.IMouseTarget;
    protected _createMouseTarget(e: EditorMouseEvent, testEventTarget: boolean): editorBrowser.IMouseTarget;
    private _getMouseColumn(e);
    protected _onContextMenu(e: EditorMouseEvent, testEventTarget: boolean): void;
    private _onMouseMove(e);
    private _onMouseLeave(e);
    _onMouseUp(e: EditorMouseEvent): void;
    _onMouseDown(e: EditorMouseEvent): void;
}
