import Event from 'vs/base/common/event';
import { TPromise } from 'vs/base/common/winjs.base';
import { ExtHostTextEditor } from './extHostTextEditor';
import { ExtHostDocumentsAndEditors } from './extHostDocumentsAndEditors';
import { ExtHostEditorsShape, ITextEditorPositionData, IResolvedTextEditorConfiguration, ISelectionChangeEvent, IMainContext } from './extHost.protocol';
import * as vscode from 'vscode';
export declare class ExtHostEditors implements ExtHostEditorsShape {
    private readonly _onDidChangeTextEditorSelection;
    private readonly _onDidChangeTextEditorOptions;
    private readonly _onDidChangeTextEditorViewColumn;
    private readonly _onDidChangeActiveTextEditor;
    private readonly _onDidChangeVisibleTextEditors;
    readonly onDidChangeTextEditorSelection: Event<vscode.TextEditorSelectionChangeEvent>;
    readonly onDidChangeTextEditorOptions: Event<vscode.TextEditorOptionsChangeEvent>;
    readonly onDidChangeTextEditorViewColumn: Event<vscode.TextEditorViewColumnChangeEvent>;
    readonly onDidChangeActiveTextEditor: Event<vscode.TextEditor>;
    readonly onDidChangeVisibleTextEditors: Event<vscode.TextEditor[]>;
    private _proxy;
    private _extHostDocumentsAndEditors;
    constructor(mainContext: IMainContext, extHostDocumentsAndEditors: ExtHostDocumentsAndEditors);
    getActiveTextEditor(): ExtHostTextEditor;
    getVisibleTextEditors(): vscode.TextEditor[];
    showTextDocument(document: vscode.TextDocument, column: vscode.ViewColumn, preserveFocus: boolean): TPromise<vscode.TextEditor>;
    showTextDocument(document: vscode.TextDocument, options: {
        column: vscode.ViewColumn;
        preserveFocus: boolean;
        pinned: boolean;
    }): TPromise<vscode.TextEditor>;
    showTextDocument(document: vscode.TextDocument, columnOrOptions: vscode.ViewColumn | vscode.TextDocumentShowOptions, preserveFocus?: boolean): TPromise<vscode.TextEditor>;
    createTextEditorDecorationType(options: vscode.DecorationRenderOptions): vscode.TextEditorDecorationType;
    $acceptOptionsChanged(id: string, opts: IResolvedTextEditorConfiguration): void;
    $acceptSelectionsChanged(id: string, event: ISelectionChangeEvent): void;
    $acceptEditorPositionData(data: ITextEditorPositionData): void;
    getDiffInformation(id: string): Thenable<vscode.LineChange[]>;
}
