import 'vs/css!./quickOutline';
import { TPromise } from 'vs/base/common/winjs.base';
import { ICommonCodeEditor } from 'vs/editor/common/editorCommon';
import { BaseEditorQuickOpenAction } from './editorQuickOpen';
import { ServicesAccessor } from 'vs/editor/common/editorCommonExtensions';
export declare class QuickOutlineAction extends BaseEditorQuickOpenAction {
    constructor();
    run(accessor: ServicesAccessor, editor: ICommonCodeEditor): TPromise<void>;
    private _run(editor, result);
    private toQuickOpenEntries(editor, flattened, searchValue);
    private typeToLabel(type, count);
    private sortNormal(searchValue, elementA, elementB);
    private sortScoped(searchValue, elementA, elementB);
}
