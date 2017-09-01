import { IEditorContribution } from 'vs/editor/common/editorCommon';
export declare const ID = "editor.contrib.folding";
export interface IFoldingController extends IEditorContribution {
    foldAll(): void;
    unfoldAll(): void;
}
