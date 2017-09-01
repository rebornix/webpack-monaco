import { SingleCursorState, CursorContext, CursorState } from 'vs/editor/common/controller/cursorCommon';
import { Selection } from 'vs/editor/common/core/selection';
export declare class OneCursor {
    modelState: SingleCursorState;
    viewState: SingleCursorState;
    private _selStartMarker;
    private _selEndMarker;
    constructor(context: CursorContext);
    dispose(context: CursorContext): void;
    asCursorState(): CursorState;
    readSelectionFromMarkers(context: CursorContext): Selection;
    ensureValidState(context: CursorContext): void;
    setState(context: CursorContext, modelState: SingleCursorState, viewState: SingleCursorState): void;
    private _setState(context, modelState, viewState);
    private _ensureMarker(context, markerId, lineNumber, column, stickToPreviousCharacter);
}
