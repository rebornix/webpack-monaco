import { ICommonCodeEditor } from 'vs/editor/common/editorCommon';
import { ServicesAccessor, EditorAction } from 'vs/editor/common/editorCommonExtensions';
export declare class ToggleRenderControlCharacterAction extends EditorAction {
    constructor();
    run(accessor: ServicesAccessor, editor: ICommonCodeEditor): void;
}
