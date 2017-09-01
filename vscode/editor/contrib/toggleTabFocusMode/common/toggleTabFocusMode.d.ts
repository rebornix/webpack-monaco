import { ICommonCodeEditor } from 'vs/editor/common/editorCommon';
import { ServicesAccessor, EditorAction } from 'vs/editor/common/editorCommonExtensions';
export declare class ToggleTabFocusModeAction extends EditorAction {
    static ID: string;
    constructor();
    run(accessor: ServicesAccessor, editor: ICommonCodeEditor): void;
}
