import { IDisposable } from 'vs/base/common/lifecycle';
import URI from 'vs/base/common/uri';
import Event from 'vs/base/common/event';
import * as editorCommon from 'vs/editor/common/editorCommon';
import { IWorkbenchEditorService } from 'vs/workbench/services/editor/common/editorService';
import { IRange } from 'vs/editor/common/core/range';
export interface IRangeHighlightDecoration {
    resource: URI;
    range: IRange;
    isWholeLine?: boolean;
}
export declare class RangeHighlightDecorations implements IDisposable {
    private editorService;
    private rangeHighlightDecorationId;
    private editor;
    private editorDisposables;
    private _onHighlightRemoved;
    readonly onHighlghtRemoved: Event<void>;
    constructor(editorService: IWorkbenchEditorService);
    removeHighlightRange(): void;
    highlightRange(range: IRangeHighlightDecoration, editor?: editorCommon.ICommonCodeEditor): void;
    private doHighlightRange(editor, selectionRange);
    private getEditor(resourceRange);
    private setEditor(editor);
    private disposeEditorListeners();
    private static _WHOLE_LINE_RANGE_HIGHLIGHT;
    private static _RANGE_HIGHLIGHT;
    private createRangeHighlightDecoration(isWholeLine?);
    dispose(): void;
}
