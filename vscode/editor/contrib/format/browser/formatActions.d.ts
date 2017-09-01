import { TPromise } from 'vs/base/common/winjs.base';
import * as editorCommon from 'vs/editor/common/editorCommon';
import { ServicesAccessor, EditorAction } from 'vs/editor/common/editorCommonExtensions';
export declare abstract class AbstractFormatAction extends EditorAction {
    run(accessor: ServicesAccessor, editor: editorCommon.ICommonCodeEditor): TPromise<void>;
    protected abstract _getFormattingEdits(editor: editorCommon.ICommonCodeEditor): TPromise<editorCommon.ISingleEditOperation[]>;
}
export declare class FormatDocumentAction extends AbstractFormatAction {
    constructor();
    protected _getFormattingEdits(editor: editorCommon.ICommonCodeEditor): TPromise<editorCommon.ISingleEditOperation[]>;
}
export declare class FormatSelectionAction extends AbstractFormatAction {
    constructor();
    protected _getFormattingEdits(editor: editorCommon.ICommonCodeEditor): TPromise<editorCommon.ISingleEditOperation[]>;
}
