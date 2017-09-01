import { ICommonCodeEditor } from 'vs/editor/common/editorCommon';
import { ServicesAccessor, EditorAction } from 'vs/editor/common/editorCommonExtensions';
export declare class InsertCursorAbove extends EditorAction {
    constructor();
    run(accessor: ServicesAccessor, editor: ICommonCodeEditor, args: any): void;
}
export declare class InsertCursorBelow extends EditorAction {
    constructor();
    run(accessor: ServicesAccessor, editor: ICommonCodeEditor, args: any): void;
}
