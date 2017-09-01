import { CharacterPairSupport } from 'vs/editor/common/modes/supports/characterPair';
import { BracketElectricCharacterSupport, IElectricAction } from 'vs/editor/common/modes/supports/electricCharacter';
import { OnEnterSupport } from 'vs/editor/common/modes/supports/onEnter';
import { IndentRulesSupport } from 'vs/editor/common/modes/supports/indentRules';
import { RichEditBrackets } from 'vs/editor/common/modes/supports/richEditBrackets';
import Event from 'vs/base/common/event';
import { ITokenizedModel } from 'vs/editor/common/editorCommon';
import { IDisposable } from 'vs/base/common/lifecycle';
import { LineTokens } from 'vs/editor/common/core/lineTokens';
import { Range } from 'vs/editor/common/core/range';
import { IndentAction, EnterAction, IAutoClosingPair, LanguageConfiguration, IndentationRule } from 'vs/editor/common/modes/languageConfiguration';
import { LanguageIdentifier, LanguageId } from 'vs/editor/common/modes';
/**
 * Interface used to support insertion of mode specific comments.
 */
export interface ICommentsConfiguration {
    lineCommentToken?: string;
    blockCommentStartToken?: string;
    blockCommentEndToken?: string;
}
export interface IVirtualModel {
    getLineTokens(lineNumber: number): LineTokens;
    getLanguageIdentifier(): LanguageIdentifier;
    getLanguageIdAtPosition(lineNumber: number, column: number): LanguageId;
    getLineContent(lineNumber: number): string;
}
export interface IIndentConverter {
    shiftIndent?(indentation: string): string;
    unshiftIndent?(indentation: string): string;
    normalizeIndentation?(indentation: string): string;
}
export declare class RichEditSupport {
    private readonly _conf;
    readonly electricCharacter: BracketElectricCharacterSupport;
    readonly comments: ICommentsConfiguration;
    readonly characterPair: CharacterPairSupport;
    readonly wordDefinition: RegExp;
    readonly onEnter: OnEnterSupport;
    readonly indentRulesSupport: IndentRulesSupport;
    readonly brackets: RichEditBrackets;
    readonly indentationRules: IndentationRule;
    constructor(languageIdentifier: LanguageIdentifier, previous: RichEditSupport, rawConf: LanguageConfiguration);
    private static _mergeConf(prev, current);
    private static _handleOnEnter(conf);
    private static _handleComments(conf);
}
export declare class LanguageConfigurationRegistryImpl {
    private _entries;
    private _onDidChange;
    onDidChange: Event<void>;
    constructor();
    register(languageIdentifier: LanguageIdentifier, configuration: LanguageConfiguration): IDisposable;
    private _getRichEditSupport(languageId);
    getIndentationRules(languageId: LanguageId): IndentationRule;
    private _getElectricCharacterSupport(languageId);
    getElectricCharacters(languageId: LanguageId): string[];
    /**
     * Should return opening bracket type to match indentation with
     */
    onElectricCharacter(character: string, context: LineTokens, column: number): IElectricAction;
    getComments(languageId: LanguageId): ICommentsConfiguration;
    private _getCharacterPairSupport(languageId);
    getAutoClosingPairs(languageId: LanguageId): IAutoClosingPair[];
    getSurroundingPairs(languageId: LanguageId): IAutoClosingPair[];
    shouldAutoClosePair(character: string, context: LineTokens, column: number): boolean;
    getWordDefinition(languageId: LanguageId): RegExp;
    getIndentRulesSupport(languageId: LanguageId): IndentRulesSupport;
    /**
     * Get nearest preceiding line which doesn't match unIndentPattern or contains all whitespace.
     * Result:
     * -1: run into the boundary of embedded languages
     * 0: every line above are invalid
     * else: nearest preceding line of the same language
     */
    private getPrecedingValidLine(model, lineNumber, indentRulesSupport);
    /**
     * Get inherited indentation from above lines.
     * 1. Find the nearest preceding line which doesn't match unIndentedLinePattern.
     * 2. If this line matches indentNextLinePattern or increaseIndentPattern, it means that the indent level of `lineNumber` should be 1 greater than this line.
     * 3. If this line doesn't match any indent rules
     *   a. check whether the line above it matches indentNextLinePattern
     *   b. If not, the indent level of this line is the result
     *   c. If so, it means the indent of this line is *temporary*, go upward utill we find a line whose indent is not temporary (the same workflow a -> b -> c).
     * 4. Otherwise, we fail to get an inherited indent from aboves. Return null and we should not touch the indent of `lineNumber`
     *
     * This function only return the inherited indent based on above lines, it doesn't check whether current line should decrease or not.
     */
    getInheritIndentForLine(model: IVirtualModel, lineNumber: number, honorIntentialIndent?: boolean): {
        indentation: string;
        action: IndentAction;
        line?: number;
    };
    getGoodIndentForLine(virtualModel: IVirtualModel, languageId: LanguageId, lineNumber: number, indentConverter: IIndentConverter): string;
    getIndentForEnter(model: ITokenizedModel, range: Range, indentConverter: IIndentConverter, autoIndent: boolean): {
        beforeEnter: string;
        afterEnter: string;
    };
    /**
     * We should always allow intentional indentation. It means, if users change the indentation of `lineNumber` and the content of
     * this line doesn't match decreaseIndentPattern, we should not adjust the indentation.
     */
    getIndentActionForType(model: ITokenizedModel, range: Range, ch: string, indentConverter: IIndentConverter): string;
    getIndentMetadata(model: ITokenizedModel, lineNumber: number): number;
    private _getOnEnterSupport(languageId);
    getRawEnterActionAtPosition(model: ITokenizedModel, lineNumber: number, column: number): EnterAction;
    getEnterAction(model: ITokenizedModel, range: Range): {
        enterAction: EnterAction;
        indentation: string;
    };
    getIndentationAtPosition(model: ITokenizedModel, lineNumber: number, column: number): string;
    private getScopedLineTokens(model, lineNumber, columnNumber?);
    getBracketsSupport(languageId: LanguageId): RichEditBrackets;
}
export declare const LanguageConfigurationRegistry: LanguageConfigurationRegistryImpl;
