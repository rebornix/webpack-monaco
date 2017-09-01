import { ServicesAccessor, EditorCommand } from 'vs/editor/common/editorCommonExtensions';
import { Disposable } from 'vs/base/common/lifecycle';
import { ICommonCodeEditor, IEditorContribution } from 'vs/editor/common/editorCommon';
import { ICodeEditor } from 'vs/editor/browser/editorBrowser';
export declare class CursorUndoController extends Disposable implements IEditorContribution {
    private static ID;
    static get(editor: ICommonCodeEditor): CursorUndoController;
    private readonly _editor;
    private _isCursorUndo;
    private _undoStack;
    private _prevState;
    constructor(editor: ICodeEditor);
    private _readState();
    getId(): string;
    cursorUndo(): void;
}
export declare class CursorUndo extends EditorCommand {
    constructor();
    runEditorCommand(accessor: ServicesAccessor, editor: ICommonCodeEditor, args: any): void;
}
