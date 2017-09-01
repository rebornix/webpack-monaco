import { Position } from 'vs/editor/common/core/position';
import { Range as EditorRange } from 'vs/editor/common/core/range';
import { MouseTargetType, IMouseTarget } from 'vs/editor/browser/editorBrowser';
import { ViewContext } from 'vs/editor/common/view/viewContext';
import { IPointerHandlerHelper } from 'vs/editor/browser/controller/mouseHandler';
import { EditorMouseEvent, PageCoordinates, EditorPagePosition } from 'vs/editor/browser/editorDom';
import { IViewCursorRenderData } from 'vs/editor/browser/viewParts/viewCursors/viewCursor';
export interface IViewZoneData {
    viewZoneId: number;
    positionBefore: Position;
    positionAfter: Position;
    position: Position;
    afterLineNumber: number;
}
export declare class MouseTarget implements IMouseTarget {
    readonly element: Element;
    readonly type: MouseTargetType;
    readonly mouseColumn: number;
    readonly position: Position;
    readonly range: EditorRange;
    readonly detail: any;
    constructor(element: Element, type: MouseTargetType, mouseColumn?: number, position?: Position, range?: EditorRange, detail?: any);
    private static _typeToString(type);
    static toString(target: IMouseTarget): string;
    toString(): string;
}
export declare class MouseTargetFactory {
    private _context;
    private _viewHelper;
    constructor(context: ViewContext, viewHelper: IPointerHandlerHelper);
    mouseTargetIsWidget(e: EditorMouseEvent): boolean;
    createMouseTarget(lastViewCursorsRenderData: IViewCursorRenderData[], editorPos: EditorPagePosition, pos: PageCoordinates, target: HTMLElement): IMouseTarget;
    private static _createMouseTarget(ctx, request, domHitTestExecuted);
    private static _hitTestContentWidget(ctx, request);
    private static _hitTestOverlayWidget(ctx, request);
    private static _hitTestViewCursor(ctx, request);
    private static _hitTestViewZone(ctx, request);
    private static _hitTestTextArea(ctx, request);
    private static _hitTestMargin(ctx, request);
    private static _hitTestViewLines(ctx, request, domHitTestExecuted);
    private static _hitTestMinimap(ctx, request);
    private static _hitTestScrollbarSlider(ctx, request);
    private static _hitTestScrollbar(ctx, request);
    getMouseColumn(editorPos: EditorPagePosition, pos: PageCoordinates): number;
    static _getMouseColumn(mouseContentHorizontalOffset: number, typicalHalfwidthCharacterWidth: number): number;
    private static createMouseTargetFromHitTestPosition(ctx, request, lineNumber, column);
    /**
     * Most probably WebKit browsers and Edge
     */
    private static _doHitTestWithCaretRangeFromPoint(ctx, request);
    private static _actualDoHitTestWithCaretRangeFromPoint(ctx, coords);
    /**
     * Most probably Gecko
     */
    private static _doHitTestWithCaretPositionFromPoint(ctx, coords);
    /**
     * Most probably IE
     */
    private static _doHitTestWithMoveToPoint(ctx, coords);
    private static _doHitTest(ctx, request);
}
