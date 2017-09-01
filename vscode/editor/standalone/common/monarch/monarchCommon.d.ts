export declare const enum MonarchBracket {
    None = 0,
    Open = 1,
    Close = -1,
}
export interface ILexerMin {
    languageId: string;
    noThrow: boolean;
    ignoreCase: boolean;
    usesEmbedded: boolean;
    defaultToken: string;
    stateNames: Object;
}
export interface ILexer extends ILexerMin {
    maxStack: number;
    start: string;
    ignoreCase: boolean;
    tokenPostfix: string;
    tokenizer: IRule[][];
    brackets: IBracket[];
}
export interface IBracket {
    token: string;
    open: string;
    close: string;
}
export declare type FuzzyAction = IAction | string;
export declare function isFuzzyActionArr(what: FuzzyAction | FuzzyAction[]): what is FuzzyAction[];
export declare function isFuzzyAction(what: FuzzyAction | FuzzyAction[]): what is FuzzyAction;
export declare function isString(what: FuzzyAction): what is string;
export declare function isIAction(what: FuzzyAction): what is IAction;
export interface IRule {
    regex: RegExp;
    action: FuzzyAction;
    matchOnlyAtLineStart: boolean;
    name: string;
}
export interface IAction {
    group?: FuzzyAction[];
    test?: (id: string, matches: string[], state: string, eos: boolean) => FuzzyAction;
    token?: string;
    tokenSubst?: boolean;
    next?: string;
    nextEmbedded?: string;
    bracket?: MonarchBracket;
    log?: string;
    switchTo?: string;
    goBack?: number;
    transform?: (states: string[]) => string[];
}
export interface IBranch {
    name: string;
    value: FuzzyAction;
    test: (id: string, matches: string[], state: string, eos: boolean) => boolean;
}
/**
 * Is a string null, undefined, or empty?
 */
export declare function empty(s: string): boolean;
/**
 * Puts a string to lower case if 'ignoreCase' is set.
 */
export declare function fixCase(lexer: ILexerMin, str: string): string;
/**
 * Ensures there are no bad characters in a CSS token class.
 */
export declare function sanitize(s: string): string;
/**
 * Logs a message.
 */
export declare function log(lexer: ILexerMin, msg: string): void;
/**
 * Throws error. May actually just log the error and continue.
 */
export declare function throwError(lexer: ILexerMin, msg: string): void;
/**
 * substituteMatches is used on lexer strings and can substitutes predefined patterns:
 * 		$$  => $
 * 		$#  => id
 * 		$n  => matched entry n
 * 		@attr => contents of lexer[attr]
 *
 * See documentation for more info
 */
export declare function substituteMatches(lexer: ILexerMin, str: string, id: string, matches: string[], state: string): string;
/**
 * Find the tokenizer rules for a specific state (i.e. next action)
 */
export declare function findRules(lexer: ILexer, state: string): IRule[];
/**
 * Is a certain state defined? In contrast to 'findRules' this works on a ILexerMin.
 * This is used during compilation where we may know the defined states
 * but not yet whether the corresponding rules are correct.
 */
export declare function stateExists(lexer: ILexerMin, state: string): boolean;
