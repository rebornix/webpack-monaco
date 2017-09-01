import { IDisposable } from 'vs/base/common/lifecycle';
import * as editorCommon from 'vs/editor/common/editorCommon';
import { Position } from 'vs/editor/common/core/position';
import { Range } from 'vs/editor/common/core/range';
export declare class FindDecorations implements IDisposable {
    private _editor;
    private _decorations;
    private _findScopeDecorationId;
    private _rangeHighlightDecorationId;
    private _highlightedDecorationId;
    private _startPosition;
    constructor(editor: editorCommon.ICommonCodeEditor);
    dispose(): void;
    reset(): void;
    getCount(): number;
    getFindScope(): Range;
    getStartPosition(): Position;
    setStartPosition(newStartPosition: Position): void;
    getCurrentMatchesPosition(desiredRange: Range): number;
    setCurrentFindMatch(nextMatch: Range): number;
    set(matches: Range[], findScope: Range): void;
    private _allDecorations();
    private static createFindMatchDecorationOptions(isCurrent);
    private static _CURRENT_FIND_MATCH_DECORATION;
    private static _FIND_MATCH_DECORATION;
    private static _RANGE_HIGHLIGHT_DECORATION;
    private static _FIND_SCOPE_DECORATION;
}
