import URI from 'vs/base/common/uri';
import * as vscode from 'vscode';
export declare class Disposable {
    static from(...disposables: {
        dispose(): any;
    }[]): Disposable;
    private _callOnDispose;
    constructor(callOnDispose: Function);
    dispose(): any;
}
export declare class Position {
    static Min(...positions: Position[]): Position;
    static Max(...positions: Position[]): Position;
    static isPosition(other: any): other is Position;
    private _line;
    private _character;
    readonly line: number;
    readonly character: number;
    constructor(line: number, character: number);
    isBefore(other: Position): boolean;
    isBeforeOrEqual(other: Position): boolean;
    isAfter(other: Position): boolean;
    isAfterOrEqual(other: Position): boolean;
    isEqual(other: Position): boolean;
    compareTo(other: Position): number;
    translate(change: {
        lineDelta?: number;
        characterDelta?: number;
    }): Position;
    translate(lineDelta?: number, characterDelta?: number): Position;
    with(change: {
        line?: number;
        character?: number;
    }): Position;
    with(line?: number, character?: number): Position;
    toJSON(): any;
}
export declare class Range {
    static isRange(thing: any): thing is Range;
    protected _start: Position;
    protected _end: Position;
    readonly start: Position;
    readonly end: Position;
    constructor(start: Position, end: Position);
    constructor(startLine: number, startColumn: number, endLine: number, endColumn: number);
    contains(positionOrRange: Position | Range): boolean;
    isEqual(other: Range): boolean;
    intersection(other: Range): Range;
    union(other: Range): Range;
    readonly isEmpty: boolean;
    readonly isSingleLine: boolean;
    with(change: {
        start?: Position;
        end?: Position;
    }): Range;
    with(start?: Position, end?: Position): Range;
    toJSON(): any;
}
export declare class Selection extends Range {
    static isSelection(thing: any): thing is Selection;
    private _anchor;
    readonly anchor: Position;
    private _active;
    readonly active: Position;
    constructor(anchor: Position, active: Position);
    constructor(anchorLine: number, anchorColumn: number, activeLine: number, activeColumn: number);
    readonly isReversed: boolean;
    toJSON(): {
        start: Position;
        end: Position;
        active: Position;
        anchor: Position;
    };
}
export declare enum EndOfLine {
    LF = 1,
    CRLF = 2,
}
export declare class TextEdit {
    static isTextEdit(thing: any): thing is TextEdit;
    static replace(range: Range, newText: string): TextEdit;
    static insert(position: Position, newText: string): TextEdit;
    static delete(range: Range): TextEdit;
    static setEndOfLine(eol: EndOfLine): TextEdit;
    protected _range: Range;
    protected _newText: string;
    protected _newEol: EndOfLine;
    range: Range;
    newText: string;
    newEol: EndOfLine;
    constructor(range: Range, newText: string);
    toJSON(): any;
}
export declare class WorkspaceEdit {
    private _values;
    private _index;
    replace(uri: URI, range: Range, newText: string): void;
    insert(resource: URI, position: Position, newText: string): void;
    delete(resource: URI, range: Range): void;
    has(uri: URI): boolean;
    set(uri: URI, edits: TextEdit[]): void;
    get(uri: URI): TextEdit[];
    entries(): [URI, TextEdit[]][];
    readonly size: number;
    toJSON(): any;
}
export declare class SnippetString {
    static isSnippetString(thing: any): thing is SnippetString;
    private static _escape(value);
    private _tabstop;
    value: string;
    constructor(value?: string);
    appendText(string: string): SnippetString;
    appendTabstop(number?: number): SnippetString;
    appendPlaceholder(value: string | ((snippet: SnippetString) => any), number?: number): SnippetString;
    appendVariable(name: string, defaultValue?: string | ((snippet: SnippetString) => any)): SnippetString;
}
export declare enum DiagnosticSeverity {
    Hint = 3,
    Information = 2,
    Warning = 1,
    Error = 0,
}
export declare class Location {
    static isLocation(thing: any): thing is Location;
    uri: URI;
    range: Range;
    constructor(uri: URI, rangeOrPosition: Range | Position);
    toJSON(): any;
}
export declare class Diagnostic {
    range: Range;
    message: string;
    source: string;
    code: string | number;
    severity: DiagnosticSeverity;
    constructor(range: Range, message: string, severity?: DiagnosticSeverity);
    toJSON(): any;
}
export declare class Hover {
    contents: vscode.MarkdownString[] | vscode.MarkedString[];
    range: Range;
    constructor(contents: vscode.MarkdownString | vscode.MarkedString | vscode.MarkdownString[] | vscode.MarkedString[], range?: Range);
}
export declare enum DocumentHighlightKind {
    Text = 0,
    Read = 1,
    Write = 2,
}
export declare class DocumentHighlight {
    range: Range;
    kind: DocumentHighlightKind;
    constructor(range: Range, kind?: DocumentHighlightKind);
    toJSON(): any;
}
export declare enum SymbolKind {
    File = 0,
    Module = 1,
    Namespace = 2,
    Package = 3,
    Class = 4,
    Method = 5,
    Property = 6,
    Field = 7,
    Constructor = 8,
    Enum = 9,
    Interface = 10,
    Function = 11,
    Variable = 12,
    Constant = 13,
    String = 14,
    Number = 15,
    Boolean = 16,
    Array = 17,
    Object = 18,
    Key = 19,
    Null = 20,
    EnumMember = 21,
    Struct = 22,
    Event = 23,
    Operator = 24,
    TypeParameter = 25,
}
export declare class SymbolInformation {
    name: string;
    location: Location;
    kind: SymbolKind;
    containerName: string;
    constructor(name: string, kind: SymbolKind, containerName: string, location: Location);
    constructor(name: string, kind: SymbolKind, range: Range, uri?: URI, containerName?: string);
    toJSON(): any;
}
export declare class CodeLens {
    range: Range;
    command: vscode.Command;
    constructor(range: Range, command?: vscode.Command);
    readonly isResolved: boolean;
}
export declare class ParameterInformation {
    label: string;
    documentation?: string;
    constructor(label: string, documentation?: string);
}
export declare class SignatureInformation {
    label: string;
    documentation?: string;
    parameters: ParameterInformation[];
    constructor(label: string, documentation?: string);
}
export declare class SignatureHelp {
    signatures: SignatureInformation[];
    activeSignature: number;
    activeParameter: number;
    constructor();
}
export declare enum CompletionItemKind {
    Text = 0,
    Method = 1,
    Function = 2,
    Constructor = 3,
    Field = 4,
    Variable = 5,
    Class = 6,
    Interface = 7,
    Module = 8,
    Property = 9,
    Unit = 10,
    Value = 11,
    Enum = 12,
    Keyword = 13,
    Snippet = 14,
    Color = 15,
    File = 16,
    Reference = 17,
    Folder = 18,
    EnumMember = 19,
    Constant = 20,
    Struct = 21,
    Event = 22,
    Operator = 23,
    TypeParameter = 24,
}
export declare class CompletionItem {
    label: string;
    kind: CompletionItemKind;
    detail: string;
    documentation: string;
    sortText: string;
    filterText: string;
    insertText: string | SnippetString;
    range: Range;
    textEdit: TextEdit;
    additionalTextEdits: TextEdit[];
    command: vscode.Command;
    constructor(label: string, kind?: CompletionItemKind);
    toJSON(): any;
}
export declare class CompletionList {
    isIncomplete?: boolean;
    items: vscode.CompletionItem[];
    constructor(items?: vscode.CompletionItem[], isIncomplete?: boolean);
}
export declare enum ViewColumn {
    One = 1,
    Two = 2,
    Three = 3,
}
export declare enum StatusBarAlignment {
    Left = 1,
    Right = 2,
}
export declare enum TextEditorLineNumbersStyle {
    Off = 0,
    On = 1,
    Relative = 2,
}
export declare enum TextDocumentSaveReason {
    Manual = 1,
    AfterDelay = 2,
    FocusOut = 3,
}
export declare enum TextEditorRevealType {
    Default = 0,
    InCenter = 1,
    InCenterIfOutsideViewport = 2,
    AtTop = 3,
}
export declare enum TextEditorSelectionChangeKind {
    Keyboard = 1,
    Mouse = 2,
    Command = 3,
}
/**
 * These values match very carefully the values of `TrackedRangeStickiness`
 */
export declare enum DecorationRangeBehavior {
    /**
     * TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges
     */
    OpenOpen = 0,
    /**
     * TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges
     */
    ClosedClosed = 1,
    /**
     * TrackedRangeStickiness.GrowsOnlyWhenTypingBefore
     */
    OpenClosed = 2,
    /**
     * TrackedRangeStickiness.GrowsOnlyWhenTypingAfter
     */
    ClosedOpen = 3,
}
export declare namespace TextEditorSelectionChangeKind {
    function fromValue(s: string): TextEditorSelectionChangeKind;
}
export declare class DocumentLink {
    range: Range;
    target: URI;
    constructor(range: Range, target: URI);
}
export declare class Color {
    readonly red: number;
    readonly green: number;
    readonly blue: number;
    readonly alpha: number;
    constructor(red: number, green: number, blue: number, alpha: number);
    static fromHSLA(hue: number, saturation: number, luminance: number, alpha: number): Color;
    static fromHex(hex: string): Color | null;
}
export declare type IColorFormat = string | {
    opaque: string;
    transparent: string;
};
export declare class ColorRange {
    range: Range;
    color: Color;
    availableFormats: IColorFormat[];
    constructor(range: Range, color: Color, availableFormats: IColorFormat[]);
}
export declare enum TaskRevealKind {
    Always = 1,
    Silent = 2,
    Never = 3,
}
export declare enum TaskPanelKind {
    Shared = 1,
    Dedicated = 2,
    New = 3,
}
export declare class TaskGroup implements vscode.TaskGroup {
    private _id;
    private _label;
    static Clean: TaskGroup;
    static Build: TaskGroup;
    static Rebuild: TaskGroup;
    static Test: TaskGroup;
    constructor(id: string, label: string);
    readonly id: string;
}
export declare class ProcessExecution implements vscode.ProcessExecution {
    private _process;
    private _args;
    private _options;
    constructor(process: string, options?: vscode.ProcessExecutionOptions);
    constructor(process: string, args: string[], options?: vscode.ProcessExecutionOptions);
    process: string;
    args: string[];
    options: vscode.ProcessExecutionOptions;
}
export declare class ShellExecution implements vscode.ShellExecution {
    private _commandLine;
    private _options;
    constructor(commandLine: string, options?: vscode.ShellExecutionOptions);
    commandLine: string;
    options: vscode.ShellExecutionOptions;
}
export declare class Task implements vscode.Task {
    private _definition;
    private _definitionKey;
    private _name;
    private _execution;
    private _problemMatchers;
    private _hasDefinedMatchers;
    private _isBackground;
    private _source;
    private _group;
    private _presentationOptions;
    constructor(definition: vscode.TaskDefinition, name: string, source: string, execution?: ProcessExecution | ShellExecution, problemMatchers?: string | string[]);
    definition: vscode.TaskDefinition;
    readonly definitionKey: string;
    name: string;
    execution: ProcessExecution | ShellExecution;
    problemMatchers: string[];
    readonly hasDefinedMatchers: boolean;
    isBackground: boolean;
    source: string;
    group: TaskGroup;
    presentationOptions: vscode.TaskPresentationOptions;
}
export declare enum ProgressLocation {
    SourceControl = 1,
    Window = 10,
}
export declare class TreeItem {
    label: string;
    collapsibleState: vscode.TreeItemCollapsibleState;
    iconPath?: string | URI | {
        light: string | URI;
        dark: string | URI;
    };
    command?: vscode.Command;
    contextValue?: string;
    constructor(label: string, collapsibleState?: vscode.TreeItemCollapsibleState);
}
export declare enum TreeItemCollapsibleState {
    None = 0,
    Collapsed = 1,
    Expanded = 2,
}
export declare class ThemeColor {
    id: string;
    constructor(id: string);
}
export declare enum ConfigurationTarget {
    Global = 1,
    Workspace = 2,
    WorkspaceFolder = 3,
}
