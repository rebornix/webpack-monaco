/**
 * The empty string.
 */
export declare const empty = "";
export declare function isFalsyOrWhitespace(str: string): boolean;
/**
 * @returns the provided number with the given number of preceding zeros.
 */
export declare function pad(n: number, l: number, char?: string): string;
/**
 * Helper to produce a string with a variable number of arguments. Insert variable segments
 * into the string using the {n} notation where N is the index of the argument following the string.
 * @param value string to which formatting is applied
 * @param args replacements for {n}-entries
 */
export declare function format(value: string, ...args: any[]): string;
/**
 * Converts HTML characters inside the string to use entities instead. Makes the string safe from
 * being used e.g. in HTMLElement.innerHTML.
 */
export declare function escape(html: string): string;
/**
 * Escapes regular expression characters in a given string
 */
export declare function escapeRegExpCharacters(value: string): string;
/**
 * Removes all occurrences of needle from the beginning and end of haystack.
 * @param haystack string to trim
 * @param needle the thing to trim (default is a blank)
 */
export declare function trim(haystack: string, needle?: string): string;
/**
 * Removes all occurrences of needle from the beginning of haystack.
 * @param haystack string to trim
 * @param needle the thing to trim
 */
export declare function ltrim(haystack?: string, needle?: string): string;
/**
 * Removes all occurrences of needle from the end of haystack.
 * @param haystack string to trim
 * @param needle the thing to trim
 */
export declare function rtrim(haystack?: string, needle?: string): string;
export declare function convertSimple2RegExpPattern(pattern: string): string;
export declare function stripWildcards(pattern: string): string;
/**
 * Determines if haystack starts with needle.
 */
export declare function startsWith(haystack: string, needle: string): boolean;
/**
 * Determines if haystack ends with needle.
 */
export declare function endsWith(haystack: string, needle: string): boolean;
export interface RegExpOptions {
    matchCase?: boolean;
    wholeWord?: boolean;
    multiline?: boolean;
    global?: boolean;
}
export declare function createRegExp(searchString: string, isRegex: boolean, options?: RegExpOptions): RegExp;
export declare function regExpLeadsToEndlessLoop(regexp: RegExp): boolean;
/**
 * The normalize() method returns the Unicode Normalization Form of a given string. The form will be
 * the Normalization Form Canonical Composition.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize}
 */
export declare const canNormalize: boolean;
export declare function normalizeNFC(str: string): string;
/**
 * Returns first index of the string that is not whitespace.
 * If string is empty or contains only whitespaces, returns -1
 */
export declare function firstNonWhitespaceIndex(str: string): number;
/**
 * Returns the leading whitespace of the string.
 * If the string contains only whitespaces, returns entire string
 */
export declare function getLeadingWhitespace(str: string, start?: number, end?: number): string;
/**
 * Returns last index of the string that is not whitespace.
 * If string is empty or contains only whitespaces, returns -1
 */
export declare function lastNonWhitespaceIndex(str: string, startIndex?: number): number;
export declare function compare(a: string, b: string): number;
export declare function compareIgnoreCase(a: string, b: string): number;
export declare function equalsIgnoreCase(a: string, b: string): boolean;
export declare function beginsWithIgnoreCase(str: string, candidate: string): boolean;
/**
 * @returns the length of the common prefix of the two strings.
 */
export declare function commonPrefixLength(a: string, b: string): number;
/**
 * @returns the length of the common suffix of the two strings.
 */
export declare function commonSuffixLength(a: string, b: string): number;
/**
 * Return the overlap between the suffix of `a` and the prefix of `b`.
 * For instance `overlap("foobar", "arr, I'm a pirate") === 2`.
 */
export declare function overlap(a: string, b: string): number;
export declare function isHighSurrogate(charCode: number): boolean;
export declare function isLowSurrogate(charCode: number): boolean;
/**
 * Returns true if `str` contains any Unicode character that is classified as "R" or "AL".
 */
export declare function containsRTL(str: string): boolean;
export declare function containsEmoji(str: string): boolean;
/**
 * Returns true if `str` contains only basic ASCII characters in the range 32 - 126 (including 32 and 126) or \n, \r, \t
 */
export declare function isBasicASCII(str: string): boolean;
export declare function containsFullWidthCharacter(str: string): boolean;
export declare function isFullWidthCharacter(charCode: number): boolean;
/**
 * Computes the difference score for two strings. More similar strings have a higher score.
 * We use largest common subsequence dynamic programming approach but penalize in the end for length differences.
 * Strings that have a large length difference will get a bad default score 0.
 * Complexity - both time and space O(first.length * second.length)
 * Dynamic programming LCS computation http://en.wikipedia.org/wiki/Longest_common_subsequence_problem
 *
 * @param first a string
 * @param second a string
 */
export declare function difference(first: string, second: string, maxLenDelta?: number): number;
/**
 * Returns an array in which every entry is the offset of a
 * line. There is always one entry which is zero.
 */
export declare function computeLineStarts(text: string): number[];
/**
 * Given a string and a max length returns a shorted version. Shorting
 * happens at favorable positions - such as whitespace or punctuation characters.
 */
export declare function lcut(text: string, n: number): string;
export declare function removeAnsiEscapeCodes(str: string): string;
export declare const UTF8_BOM_CHARACTER: string;
export declare function startsWithUTF8BOM(str: string): boolean;
/**
 * Appends two strings. If the appended result is longer than maxLength,
 * trims the start of the result and replaces it with '...'.
 */
export declare function appendWithLimit(first: string, second: string, maxLength: number): string;
export declare function safeBtoa(str: string): string;
export declare function repeat(s: string, count: number): string;
