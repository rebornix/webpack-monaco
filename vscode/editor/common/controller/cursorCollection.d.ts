import { Selection, ISelection } from 'vs/editor/common/core/selection';
import { Position } from 'vs/editor/common/core/position';
import { CursorState, CursorContext } from 'vs/editor/common/controller/cursorCommon';
export declare class CursorCollection {
    private context;
    private primaryCursor;
    private secondaryCursors;
    private lastAddedCursorIndex;
    constructor(context: CursorContext);
    dispose(): void;
    updateContext(context: CursorContext): void;
    ensureValidState(): void;
    readSelectionFromMarkers(): Selection[];
    getAll(): CursorState[];
    getViewPositions(): Position[];
    getSelections(): Selection[];
    getViewSelections(): Selection[];
    setSelections(selections: ISelection[]): void;
    getPrimaryCursor(): CursorState;
    setStates(states: CursorState[]): void;
    /**
     * Creates or disposes secondary cursors as necessary to match the number of `secondarySelections`.
     */
    private _setSecondaryStates(secondaryStates);
    killSecondaryCursors(): void;
    private _addSecondaryCursor();
    getLastAddedCursorIndex(): number;
    private _removeSecondaryCursor(removeIndex);
    private _getAll();
    normalize(): void;
}
