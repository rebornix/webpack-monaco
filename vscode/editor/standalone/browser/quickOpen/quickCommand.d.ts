import { IContext, IHighlight, QuickOpenEntryGroup } from 'vs/base/parts/quickopen/browser/quickOpenModel';
import { Mode } from 'vs/base/parts/quickopen/common/quickOpen';
import { IEditorAction, ICommonCodeEditor, IEditor } from 'vs/editor/common/editorCommon';
import { BaseEditorQuickOpenAction } from './editorQuickOpen';
import { ServicesAccessor } from 'vs/editor/common/editorCommonExtensions';
export declare class EditorActionCommandEntry extends QuickOpenEntryGroup {
    private key;
    private action;
    private editor;
    constructor(key: string, highlights: IHighlight[], action: IEditorAction, editor: IEditor);
    getLabel(): string;
    getAriaLabel(): string;
    getGroupLabel(): string;
    run(mode: Mode, context: IContext): boolean;
}
export declare class QuickCommandAction extends BaseEditorQuickOpenAction {
    constructor();
    run(accessor: ServicesAccessor, editor: ICommonCodeEditor): void;
    private _sort(elementA, elementB);
    private _editorActionsToEntries(keybindingService, editor, searchValue);
}
