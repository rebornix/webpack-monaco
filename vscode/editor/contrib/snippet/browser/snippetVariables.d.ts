import { IModel } from 'vs/editor/common/editorCommon';
import { Selection } from 'vs/editor/common/core/selection';
import { VariableResolver, Variable } from 'vs/editor/contrib/snippet/browser/snippetParser';
export declare class EditorSnippetVariableResolver implements VariableResolver {
    private readonly _model;
    private readonly _selection;
    static readonly VariableNames: Readonly<{
        'SELECTION': boolean;
        'TM_SELECTED_TEXT': boolean;
        'TM_CURRENT_LINE': boolean;
        'TM_CURRENT_WORD': boolean;
        'TM_LINE_INDEX': boolean;
        'TM_LINE_NUMBER': boolean;
        'TM_FILENAME': boolean;
        'TM_FILENAME_BASE': boolean;
        'TM_DIRECTORY': boolean;
        'TM_FILEPATH': boolean;
    }>;
    constructor(_model: IModel, _selection: Selection);
    resolve(variable: Variable): string;
}
