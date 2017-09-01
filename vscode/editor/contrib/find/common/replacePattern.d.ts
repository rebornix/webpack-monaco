export declare class ReplacePattern {
    static fromStaticValue(value: string): ReplacePattern;
    /**
     * Assigned when the replace pattern is entirely static.
     */
    private readonly _staticValue;
    readonly hasReplacementPatterns: boolean;
    /**
     * Assigned when the replace pattern has replacemend patterns.
     */
    private readonly _pieces;
    constructor(pieces: ReplacePiece[]);
    buildReplaceString(matches: string[]): string;
    private static _substitute(matchIndex, matches);
}
/**
 * A replace piece can either be a static string or an index to a specific match.
 */
export declare class ReplacePiece {
    static staticValue(value: string): ReplacePiece;
    static matchIndex(index: number): ReplacePiece;
    readonly staticValue: string;
    readonly matchIndex: number;
    private constructor();
}
/**
 * \n			=> inserts a LF
 * \t			=> inserts a TAB
 * \\			=> inserts a "\".
 * $$			=> inserts a "$".
 * $& and $0	=> inserts the matched substring.
 * $n			=> Where n is a non-negative integer lesser than 100, inserts the nth parenthesized submatch string
 * everything else stays untouched
 *
 * Also see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#Specifying_a_string_as_a_parameter
 */
export declare function parseReplaceString(replaceString: string): ReplacePattern;
