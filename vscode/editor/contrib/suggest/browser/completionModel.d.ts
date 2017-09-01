import { ISuggestSupport } from 'vs/editor/common/modes';
import { ISuggestionItem, SnippetConfig } from './suggest';
export interface ICompletionItem extends ISuggestionItem {
    matches?: number[];
    score?: number;
    idx?: number;
}
export interface ICompletionStats {
    suggestionCount: number;
    snippetCount: number;
    textCount: number;
    [name: string]: any;
}
export declare class LineContext {
    leadingLineContent: string;
    characterCountDelta: number;
}
export declare class CompletionModel {
    private readonly _column;
    private readonly _items;
    private readonly _snippetCompareFn;
    private _lineContext;
    private _filteredItems;
    private _isIncomplete;
    private _stats;
    constructor(items: ISuggestionItem[], column: number, lineContext: LineContext, snippetConfig?: SnippetConfig);
    lineContext: LineContext;
    readonly items: ICompletionItem[];
    readonly incomplete: boolean;
    resolveIncompleteInfo(): {
        incomplete: ISuggestSupport[];
        complete: ISuggestionItem[];
    };
    readonly stats: ICompletionStats;
    private _ensureCachedState();
    private _createCachedState();
    private static _compareCompletionItems(a, b);
    private static _compareCompletionItemsSnippetsDown(a, b);
    private static _compareCompletionItemsSnippetsUp(a, b);
}
