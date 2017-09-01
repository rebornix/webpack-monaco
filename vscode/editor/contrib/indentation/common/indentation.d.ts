import { TPromise } from 'vs/base/common/winjs.base';
import { ICommonCodeEditor, IEditorContribution, IIdentifiedSingleEditOperation, ICommand, ICursorStateComputerData, IEditOperationBuilder, ITokenizedModel } from 'vs/editor/common/editorCommon';
import { ServicesAccessor, IActionOptions, EditorAction } from 'vs/editor/common/editorCommonExtensions';
import { Selection } from 'vs/editor/common/core/selection';
import { TextEdit } from 'vs/editor/common/modes';
export declare function shiftIndent(tabSize: number, indentation: string, count?: number): string;
export declare function unshiftIndent(tabSize: number, indentation: string, count?: number): string;
export declare function getReindentEditOperations(model: ITokenizedModel, startLineNumber: number, endLineNumber: number, inheritedIndent?: string): IIdentifiedSingleEditOperation[];
export declare class IndentationToSpacesAction extends EditorAction {
    static ID: string;
    constructor();
    run(accessor: ServicesAccessor, editor: ICommonCodeEditor): void;
}
export declare class IndentationToTabsAction extends EditorAction {
    static ID: string;
    constructor();
    run(accessor: ServicesAccessor, editor: ICommonCodeEditor): void;
}
export declare class ChangeIndentationSizeAction extends EditorAction {
    private insertSpaces;
    constructor(insertSpaces: boolean, opts: IActionOptions);
    run(accessor: ServicesAccessor, editor: ICommonCodeEditor): TPromise<void>;
}
export declare class IndentUsingTabs extends ChangeIndentationSizeAction {
    static ID: string;
    constructor();
}
export declare class IndentUsingSpaces extends ChangeIndentationSizeAction {
    static ID: string;
    constructor();
}
export declare class DetectIndentation extends EditorAction {
    static ID: string;
    constructor();
    run(accessor: ServicesAccessor, editor: ICommonCodeEditor): void;
}
export declare class ReindentLinesAction extends EditorAction {
    constructor();
    run(accessor: ServicesAccessor, editor: ICommonCodeEditor): void;
}
export declare class AutoIndentOnPasteCommand implements ICommand {
    private _edits;
    private _newEol;
    private _initialSelection;
    private _selectionId;
    constructor(edits: TextEdit[], initialSelection: Selection);
    getEditOperations(model: ITokenizedModel, builder: IEditOperationBuilder): void;
    computeCursorState(model: ITokenizedModel, helper: ICursorStateComputerData): Selection;
}
export declare class AutoIndentOnPaste implements IEditorContribution {
    private static ID;
    private editor;
    private callOnDispose;
    private callOnModel;
    constructor(editor: ICommonCodeEditor);
    private update();
    private trigger(range);
    private shouldIgnoreLine(model, lineNumber);
    getId(): string;
    dispose(): void;
}
export declare class IndentationToSpacesCommand implements ICommand {
    private selection;
    private tabSize;
    private selectionId;
    constructor(selection: Selection, tabSize: number);
    getEditOperations(model: ITokenizedModel, builder: IEditOperationBuilder): void;
    computeCursorState(model: ITokenizedModel, helper: ICursorStateComputerData): Selection;
}
export declare class IndentationToTabsCommand implements ICommand {
    private selection;
    private tabSize;
    private selectionId;
    constructor(selection: Selection, tabSize: number);
    getEditOperations(model: ITokenizedModel, builder: IEditOperationBuilder): void;
    computeCursorState(model: ITokenizedModel, helper: ICursorStateComputerData): Selection;
}
