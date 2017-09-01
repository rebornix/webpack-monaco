import * as editorCommon from 'vs/editor/common/editorCommon';
import { ICodeEditor } from 'vs/editor/browser/editorBrowser';
import { IFoldingController } from 'vs/editor/contrib/folding/common/folding';
export declare class FoldingController implements IFoldingController {
    static MAX_FOLDING_REGIONS: number;
    static get(editor: editorCommon.ICommonCodeEditor): FoldingController;
    private editor;
    private _isEnabled;
    private _showFoldingControls;
    private globalToDispose;
    private computeToken;
    private cursorChangedScheduler;
    private contentChangedScheduler;
    private localToDispose;
    private decorations;
    constructor(editor: ICodeEditor);
    getId(): string;
    dispose(): void;
    private updateHideFoldIconClass();
    /**
     * Store view state.
     */
    saveViewState(): any;
    /**
     * Restore view state.
     */
    restoreViewState(state: any): void;
    private cleanState();
    private applyRegions(regions);
    private onModelChanged();
    private computeAndApplyCollapsibleRegions();
    private disposeDecorations();
    private revealCursor();
    private mouseDownInfo;
    private onEditorMouseDown(e);
    private onEditorMouseUp(e);
    private updateHiddenAreas(focusLine?);
    unfold(levels: number): void;
    fold(levels: number, up: boolean): void;
    foldUnfoldRecursively(isFold: boolean): void;
    foldAll(): void;
    unfoldAll(): void;
    private changeAll(collapse);
    foldLevel(foldLevel: number, selectedLineNumbers: number[]): void;
}
