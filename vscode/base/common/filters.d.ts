export interface IFilter {
    (word: string, wordToMatchAgainst: string): IMatch[];
}
export interface IMatch {
    start: number;
    end: number;
}
/**
 * @returns A filter which combines the provided set
 * of filters with an or. The *first* filters that
 * matches defined the return value of the returned
 * filter.
 */
export declare function or(...filter: IFilter[]): IFilter;
/**
 * @returns A filter which combines the provided set
 * of filters with an and. The combines matches are
 * returned if *all* filters match.
 */
export declare function and(...filter: IFilter[]): IFilter;
export declare const matchesStrictPrefix: IFilter;
export declare const matchesPrefix: IFilter;
export declare function matchesContiguousSubString(word: string, wordToMatchAgainst: string): IMatch[];
export declare function matchesSubString(word: string, wordToMatchAgainst: string): IMatch[];
export declare function matchesCamelCase(word: string, camelCaseWord: string): IMatch[];
export declare function matchesWords(word: string, target: string, contiguous?: boolean): IMatch[];
export declare enum SubstringMatching {
    Contiguous = 0,
    Separate = 1,
}
export declare const fuzzyContiguousFilter: IFilter;
export declare function matchesFuzzy(word: string, wordToMatchAgainst: string, enableSeparateSubstringMatching?: boolean): IMatch[];
export declare function createMatches(position: number[]): IMatch[];
export declare function fuzzyScore(pattern: string, word: string, patternMaxWhitespaceIgnore?: number): [number, number[]];
export declare function nextTypoPermutation(pattern: string, patternPos: number): string;
export declare function fuzzyScoreGraceful(pattern: string, word: string): [number, number[]];
