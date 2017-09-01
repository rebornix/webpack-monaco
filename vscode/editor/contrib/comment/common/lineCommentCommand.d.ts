import { Selection } from 'vs/editor/common/core/selection';
import * as editorCommon from 'vs/editor/common/editorCommon';
export interface IInsertionPoint {
    ignore: boolean;
    commentStrOffset: number;
}
export interface ILinePreflightData {
    ignore: boolean;
    commentStr: string;
    commentStrOffset: number;
    commentStrLength: number;
}
export interface IPreflightData {
    supported: boolean;
    shouldRemoveComments: boolean;
    lines: ILinePreflightData[];
}
export interface ISimpleModel {
    getLineContent(lineNumber: number): string;
}
export declare const enum Type {
    Toggle = 0,
    ForceAdd = 1,
    ForceRemove = 2,
}
export declare class LineCommentCommand implements editorCommon.ICommand {
    private _selection;
    private _selectionId;
    private _deltaColumn;
    private _moveEndPositionDown;
    private _tabSize;
    private _type;
    constructor(selection: Selection, tabSize: number, type: Type);
    /**
     * Do an initial pass over the lines and gather info about the line comment string.
     * Returns null if any of the lines doesn't support a line comment string.
     */
    static _gatherPreflightCommentStrings(model: editorCommon.ITokenizedModel, startLineNumber: number, endLineNumber: number): ILinePreflightData[];
    /**
     * Analyze lines and decide which lines are relevant and what the toggle should do.
     * Also, build up several offsets and lengths useful in the generation of editor operations.
     */
    static _analyzeLines(type: Type, model: ISimpleModel, lines: ILinePreflightData[], startLineNumber: number): IPreflightData;
    /**
     * Analyze all lines and decide exactly what to do => not supported | insert line comments | remove line comments
     */
    static _gatherPreflightData(type: Type, model: editorCommon.ITokenizedModel, startLineNumber: number, endLineNumber: number): IPreflightData;
    /**
     * Given a successful analysis, execute either insert line comments, either remove line comments
     */
    private _executeLineComments(model, builder, data, s);
    private _attemptRemoveBlockComment(model, s, startToken, endToken);
    /**
     * Given an unsuccessful analysis, delegate to the block comment command
     */
    private _executeBlockComment(model, builder, s);
    getEditOperations(model: editorCommon.ITokenizedModel, builder: editorCommon.IEditOperationBuilder): void;
    computeCursorState(model: editorCommon.ITokenizedModel, helper: editorCommon.ICursorStateComputerData): Selection;
    /**
     * Generate edit operations in the remove line comment case
     */
    static _createRemoveLineCommentsOperations(lines: ILinePreflightData[], startLineNumber: number): editorCommon.IIdentifiedSingleEditOperation[];
    /**
     * Generate edit operations in the add line comment case
     */
    static _createAddLineCommentsOperations(lines: ILinePreflightData[], startLineNumber: number): editorCommon.IIdentifiedSingleEditOperation[];
    private static nextVisibleColumn(currentVisibleColumn, tabSize, isTab, columnSize);
    /**
     * Adjust insertion points to have them vertically aligned in the add line comment case
     */
    static _normalizeInsertionPoint(model: ISimpleModel, lines: IInsertionPoint[], startLineNumber: number, tabSize: number): void;
}
