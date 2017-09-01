import { Disposable } from 'vs/base/common/lifecycle';
import { IEditorContribution } from 'vs/editor/common/editorCommon';
import { ICodeEditor } from 'vs/editor/browser/editorBrowser';
/**
 * Prevents the top-level menu from showing up when doing Alt + Click in the editor
 */
export declare class MenuPreventer extends Disposable implements IEditorContribution {
    private static ID;
    private _editor;
    private _altListeningMouse;
    private _altMouseTriggered;
    constructor(editor: ICodeEditor);
    getId(): string;
}
