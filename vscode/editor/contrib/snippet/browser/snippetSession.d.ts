import 'vs/css!./snippetSession';
import { ICommonCodeEditor, IModel, IIdentifiedSingleEditOperation } from 'vs/editor/common/editorCommon';
import { TextmateSnippet, Choice } from './snippetParser';
import { Selection } from 'vs/editor/common/core/selection';
import { Range } from 'vs/editor/common/core/range';
import { IPosition } from 'vs/editor/common/core/position';
export declare class OneSnippet {
    private readonly _editor;
    private readonly _snippet;
    private readonly _offset;
    private _placeholderDecorations;
    private _placeholderGroups;
    private _placeholderGroupsIdx;
    private _nestingLevel;
    private static readonly _decor;
    constructor(editor: ICommonCodeEditor, snippet: TextmateSnippet, offset: number);
    dispose(): void;
    private _initDecorations();
    move(fwd: boolean | undefined): Selection[];
    readonly isAtFirstPlaceholder: boolean;
    readonly isAtLastPlaceholder: boolean;
    readonly hasPlaceholder: boolean;
    readonly placeholderRanges: Range[];
    readonly choice: Choice;
    merge(others: OneSnippet[]): void;
}
export declare class SnippetSession {
    static adjustWhitespace(model: IModel, position: IPosition, template: string): string;
    static adjustSelection(model: IModel, selection: Selection, overwriteBefore: number, overwriteAfter: number): Selection;
    static createEditsAndSnippets(editor: ICommonCodeEditor, template: string, overwriteBefore: number, overwriteAfter: number, enforceFinalTabstop: boolean): {
        edits: IIdentifiedSingleEditOperation[];
        snippets: OneSnippet[];
    };
    private readonly _editor;
    private readonly _template;
    private readonly _overwriteBefore;
    private readonly _overwriteAfter;
    private _snippets;
    constructor(editor: ICommonCodeEditor, template: string, overwriteBefore?: number, overwriteAfter?: number);
    dispose(): void;
    insert(): void;
    merge(template: string, overwriteBefore?: number, overwriteAfter?: number): void;
    next(): void;
    prev(): void;
    private _move(fwd);
    readonly isAtFirstPlaceholder: boolean;
    readonly isAtLastPlaceholder: boolean;
    readonly hasPlaceholder: boolean;
    readonly choice: Choice;
    isSelectionWithinPlaceholders(): boolean;
}
