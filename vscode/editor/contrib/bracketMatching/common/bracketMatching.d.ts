import { Disposable } from 'vs/base/common/lifecycle';
import * as editorCommon from 'vs/editor/common/editorCommon';
export declare class BracketMatchingController extends Disposable implements editorCommon.IEditorContribution {
    private static ID;
    static get(editor: editorCommon.ICommonCodeEditor): BracketMatchingController;
    private readonly _editor;
    private _lastBracketsData;
    private _lastVersionId;
    private _decorations;
    private _updateBracketsSoon;
    private _matchBrackets;
    constructor(editor: editorCommon.ICommonCodeEditor);
    getId(): string;
    jumpToBracket(): void;
    private static _DECORATION_OPTIONS;
    private _updateBrackets();
    private _recomputeBrackets();
}
