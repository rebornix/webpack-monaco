import { TPromise } from 'vs/base/common/winjs.base';
import { IModel, ICommonCodeEditor } from 'vs/editor/common/editorCommon';
import { ISuggestResult, ISuggestSupport, ISuggestion } from 'vs/editor/common/modes';
import { Position, IPosition } from 'vs/editor/common/core/position';
import { RawContextKey } from 'vs/platform/contextkey/common/contextkey';
export declare const Context: {
    Visible: RawContextKey<boolean>;
    MultipleSuggestions: RawContextKey<boolean>;
    MakesTextEdit: RawContextKey<boolean>;
    AcceptOnKey: RawContextKey<boolean>;
    AcceptSuggestionsOnEnter: RawContextKey<boolean>;
};
export interface ISuggestionItem {
    position: IPosition;
    suggestion: ISuggestion;
    container: ISuggestResult;
    support: ISuggestSupport;
    resolve(): TPromise<void>;
}
export declare type SnippetConfig = 'top' | 'bottom' | 'inline' | 'none';
export declare function setSnippetSuggestSupport(support: ISuggestSupport): ISuggestSupport;
export declare function provideSuggestionItems(model: IModel, position: Position, snippetConfig?: SnippetConfig, onlyFrom?: ISuggestSupport[]): TPromise<ISuggestionItem[]>;
export declare function getSuggestionComparator(snippetConfig: SnippetConfig): (a: ISuggestionItem, b: ISuggestionItem) => number;
/**
 *
 * @param editor
 * @param suggestions
 */
export declare function showSimpleSuggestions(editor: ICommonCodeEditor, suggestions: ISuggestion[]): void;
