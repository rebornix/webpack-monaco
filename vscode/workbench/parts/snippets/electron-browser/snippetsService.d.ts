import { IModel } from 'vs/editor/common/editorCommon';
import { ISuggestSupport, ISuggestResult, ISuggestion, LanguageId, SuggestionType, SnippetType } from 'vs/editor/common/modes';
import { IModeService } from 'vs/editor/common/services/modeService';
import { Position } from 'vs/editor/common/core/position';
export declare const ISnippetsService: {
    (...args: any[]): void;
    type: ISnippetsService;
};
export interface ISnippetsService {
    _serviceBrand: any;
    registerSnippets(languageId: LanguageId, snippets: ISnippet[], owner: string): void;
    visitSnippets(languageId: LanguageId, accept: (snippet: ISnippet) => boolean): void;
    getSnippets(languageId: LanguageId): ISnippet[];
}
export interface ISnippet {
    name: string;
    prefix: string;
    description: string;
    codeSnippet: string;
    extensionName?: string;
}
export declare class SnippetsService implements ISnippetsService {
    _serviceBrand: any;
    private readonly _snippets;
    constructor(modeService: IModeService);
    registerSnippets(languageId: LanguageId, snippets: ISnippet[], fileName: string): void;
    visitSnippets(languageId: LanguageId, accept: (snippet: ISnippet) => boolean): void;
    getSnippets(languageId: LanguageId): ISnippet[];
}
export interface ISimpleModel {
    getLineContent(lineNumber: number): string;
}
export declare class SnippetSuggestion implements ISuggestion {
    readonly snippet: ISnippet;
    private static _userSnippet;
    label: string;
    detail: string;
    insertText: string;
    documentation: string;
    overwriteBefore: number;
    sortText: string;
    noAutoAccept: boolean;
    type: SuggestionType;
    snippetType: SnippetType;
    constructor(snippet: ISnippet, overwriteBefore: number);
    resolve(): this;
    static compareByLabel(a: SnippetSuggestion, b: SnippetSuggestion): number;
}
export declare class SnippetSuggestProvider implements ISuggestSupport {
    private _modeService;
    private _snippets;
    constructor(_modeService: IModeService, _snippets: ISnippetsService);
    provideCompletionItems(model: IModel, position: Position): ISuggestResult;
    resolveCompletionItem?(model: IModel, position: Position, item: ISuggestion): ISuggestion;
    private _getLanguageIdAtPosition(model, position);
}
export declare function getNonWhitespacePrefix(model: ISimpleModel, position: Position): string;
