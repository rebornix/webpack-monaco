import Severity from 'vs/base/common/severity';
import * as modes from 'vs/editor/common/modes';
import * as types from './extHostTypes';
import { Position as EditorPosition } from 'vs/platform/editor/common/editor';
import { IDecorationOptions, EndOfLineSequence } from 'vs/editor/common/editorCommon';
import * as vscode from 'vscode';
import { ProgressLocation as MainProgressLocation } from 'vs/platform/progress/common/progress';
import { SaveReason } from 'vs/workbench/services/textfile/common/textfiles';
import { IPosition } from 'vs/editor/common/core/position';
import { IRange } from 'vs/editor/common/core/range';
import { ISelection } from 'vs/editor/common/core/selection';
import * as htmlContent from 'vs/base/common/htmlContent';
export interface PositionLike {
    line: number;
    character: number;
}
export interface RangeLike {
    start: PositionLike;
    end: PositionLike;
}
export interface SelectionLike extends RangeLike {
    anchor: PositionLike;
    active: PositionLike;
}
export declare function toSelection(selection: ISelection): types.Selection;
export declare function fromSelection(selection: SelectionLike): ISelection;
export declare function fromRange(range: RangeLike): IRange;
export declare function toRange(range: IRange): types.Range;
export declare function toPosition(position: IPosition): types.Position;
export declare function fromPosition(position: types.Position): IPosition;
export declare function fromDiagnosticSeverity(value: number): Severity;
export declare function toDiagnosticSeverty(value: Severity): types.DiagnosticSeverity;
export declare function fromViewColumn(column?: vscode.ViewColumn): EditorPosition;
export declare function toViewColumn(position?: EditorPosition): vscode.ViewColumn;
export declare namespace MarkdownString {
    function fromMany(markup: (vscode.MarkdownString | vscode.MarkedString)[]): htmlContent.IMarkdownString[];
    function from(markup: vscode.MarkdownString | vscode.MarkedString): htmlContent.IMarkdownString;
    function to(value: htmlContent.IMarkdownString): vscode.MarkdownString;
}
export declare function fromRangeOrRangeWithMessage(ranges: vscode.Range[] | vscode.DecorationOptions[]): IDecorationOptions[];
export declare const TextEdit: {
    from(edit: vscode.TextEdit): modes.TextEdit;
    to(edit: modes.TextEdit): vscode.TextEdit;
};
export declare namespace SymbolKind {
    function from(kind: vscode.SymbolKind): modes.SymbolKind;
    function to(kind: modes.SymbolKind): vscode.SymbolKind;
}
export declare function fromSymbolInformation(info: vscode.SymbolInformation): modes.SymbolInformation;
export declare function toSymbolInformation(bearing: modes.SymbolInformation): types.SymbolInformation;
export declare const location: {
    from(value: vscode.Location): modes.Location;
    to(value: modes.Location): types.Location;
};
export declare function fromHover(hover: vscode.Hover): modes.Hover;
export declare function toHover(info: modes.Hover): types.Hover;
export declare function toDocumentHighlight(occurrence: modes.DocumentHighlight): types.DocumentHighlight;
export declare const CompletionItemKind: {
    from(kind: types.CompletionItemKind): modes.SuggestionType;
    to(type: modes.SuggestionType): types.CompletionItemKind;
};
export declare namespace Suggest {
    function to(position: types.Position, suggestion: modes.ISuggestion): types.CompletionItem;
}
export declare namespace SignatureHelp {
    function from(signatureHelp: types.SignatureHelp): modes.SignatureHelp;
    function to(hints: modes.SignatureHelp): types.SignatureHelp;
}
export declare namespace DocumentLink {
    function from(link: vscode.DocumentLink): modes.ILink;
    function to(link: modes.ILink): vscode.DocumentLink;
}
export declare namespace TextDocumentSaveReason {
    function to(reason: SaveReason): vscode.TextDocumentSaveReason;
}
export declare namespace EndOfLine {
    function from(eol: vscode.EndOfLine): EndOfLineSequence;
    function to(eol: EndOfLineSequence): vscode.EndOfLine;
}
export declare namespace ProgressLocation {
    function from(loc: vscode.ProgressLocation): MainProgressLocation;
}
