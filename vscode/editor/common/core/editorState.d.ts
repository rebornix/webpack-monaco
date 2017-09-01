import { ICommonCodeEditor } from 'vs/editor/common/editorCommon';
export declare const enum CodeEditorStateFlag {
    Value = 1,
    Selection = 2,
    Position = 4,
    Scroll = 8,
}
export declare class EditorState {
    private readonly flags;
    private readonly position;
    private readonly selection;
    private readonly modelVersionId;
    private readonly scrollLeft;
    private readonly scrollTop;
    constructor(editor: ICommonCodeEditor, flags: number);
    private _equals(other);
    validate(editor: ICommonCodeEditor): boolean;
}
