import { ExtHostDocumentData } from 'vs/workbench/api/node/extHostDocumentData';
import { Selection, Range, Position, EndOfLine, TextEditorLineNumbersStyle, SnippetString } from './extHostTypes';
import { MainThreadEditorsShape, MainThreadTelemetryShape, IResolvedTextEditorConfiguration } from './extHost.protocol';
import * as vscode from 'vscode';
import { TextEditorCursorStyle } from 'vs/editor/common/config/editorOptions';
import { ExtHostExtensionService } from 'vs/workbench/api/node/extHostExtensionService';
export declare class TextEditorDecorationType implements vscode.TextEditorDecorationType {
    private static _Keys;
    private _proxy;
    key: string;
    constructor(proxy: MainThreadEditorsShape, options: vscode.DecorationRenderOptions);
    dispose(): void;
}
export interface ITextEditOperation {
    range: vscode.Range;
    text: string;
    forceMoveMarkers: boolean;
}
export interface IEditData {
    documentVersionId: number;
    edits: ITextEditOperation[];
    setEndOfLine: EndOfLine;
    undoStopBefore: boolean;
    undoStopAfter: boolean;
}
export declare class TextEditorEdit {
    private readonly _document;
    private readonly _documentVersionId;
    private _collectedEdits;
    private _setEndOfLine;
    private readonly _undoStopBefore;
    private readonly _undoStopAfter;
    constructor(document: vscode.TextDocument, options: {
        undoStopBefore: boolean;
        undoStopAfter: boolean;
    });
    finalize(): IEditData;
    replace(location: Position | Range | Selection, value: string): void;
    insert(location: Position, value: string): void;
    delete(location: Range | Selection): void;
    private _pushEdit(range, text, forceMoveMarkers);
    setEndOfLine(endOfLine: EndOfLine): void;
}
export declare class ExtHostTextEditorOptions implements vscode.TextEditorOptions {
    private _proxy;
    private _id;
    private _tabSize;
    private _insertSpaces;
    private _cursorStyle;
    private _lineNumbers;
    constructor(proxy: MainThreadEditorsShape, id: string, source: IResolvedTextEditorConfiguration);
    _accept(source: IResolvedTextEditorConfiguration): void;
    tabSize: number | string;
    private _validateTabSize(value);
    insertSpaces: boolean | string;
    private _validateInsertSpaces(value);
    cursorStyle: TextEditorCursorStyle;
    lineNumbers: TextEditorLineNumbersStyle;
    assign(newOptions: vscode.TextEditorOptions): void;
}
export declare class ExtHostTextEditor implements vscode.TextEditor {
    private readonly _proxy;
    private readonly _id;
    private readonly _documentData;
    private _selections;
    private _options;
    private _viewColumn;
    private _disposed;
    readonly id: string;
    constructor(proxy: MainThreadEditorsShape, id: string, document: ExtHostDocumentData, selections: Selection[], options: IResolvedTextEditorConfiguration, viewColumn: vscode.ViewColumn);
    dispose(): void;
    show(column: vscode.ViewColumn): void;
    hide(): void;
    document: vscode.TextDocument;
    options: vscode.TextEditorOptions;
    _acceptOptions(options: IResolvedTextEditorConfiguration): void;
    viewColumn: vscode.ViewColumn;
    _acceptViewColumn(value: vscode.ViewColumn): void;
    selection: Selection;
    selections: Selection[];
    setDecorations(decorationType: vscode.TextEditorDecorationType, ranges: Range[] | vscode.DecorationOptions[]): void;
    revealRange(range: Range, revealType: vscode.TextEditorRevealType): void;
    private _trySetSelection();
    _acceptSelections(selections: Selection[]): void;
    edit(callback: (edit: TextEditorEdit) => void, options?: {
        undoStopBefore: boolean;
        undoStopAfter: boolean;
    }): Thenable<boolean>;
    private _applyEdit(editBuilder);
    insertSnippet(snippet: SnippetString, where?: Position | Position[] | Range | Range[], options?: {
        undoStopBefore: boolean;
        undoStopAfter: boolean;
    }): Thenable<boolean>;
    private _runOnProxy(callback);
}
export declare class ExtHostTextEditor2 extends ExtHostTextEditor {
    private readonly _extHostExtensions;
    private readonly _mainThreadTelemetry;
    constructor(_extHostExtensions: ExtHostExtensionService, _mainThreadTelemetry: MainThreadTelemetryShape, proxy: MainThreadEditorsShape, id: string, document: ExtHostDocumentData, selections: Selection[], options: IResolvedTextEditorConfiguration, viewColumn: vscode.ViewColumn);
    setDecorations(decorationType: vscode.TextEditorDecorationType, rangesOrOptions: Range[] | vscode.DecorationOptions[]): void;
}
