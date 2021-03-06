import 'vs/css!./dnd';
import { KeyCode } from 'vs/base/common/keyCodes';
import { ICodeEditor } from 'vs/editor/browser/editorBrowser';
import * as editorCommon from 'vs/editor/common/editorCommon';
import { Position } from 'vs/editor/common/core/position';
export declare class DragAndDropController implements editorCommon.IEditorContribution {
    private static ID;
    private _editor;
    private _toUnhook;
    private _dragSelection;
    private _dndDecorationIds;
    private _mouseDown;
    private _modiferPressed;
    static TRIGGER_MODIFIER: string;
    static TRIGGER_KEY_VALUE: KeyCode;
    static get(editor: editorCommon.ICommonCodeEditor): DragAndDropController;
    constructor(editor: ICodeEditor);
    private onEditorKeyDown(e);
    private onEditorKeyUp(e);
    private _onEditorMouseDown(mouseEvent);
    private _onEditorMouseUp(mouseEvent);
    private _onEditorMouseDrag(mouseEvent);
    private _onEditorMouseDrop(mouseEvent);
    private static _DECORATION_OPTIONS;
    showAt(position: Position): void;
    private _removeDecoration();
    private _hitContent(target);
    private _hitMargin(target);
    getId(): string;
    dispose(): void;
}
