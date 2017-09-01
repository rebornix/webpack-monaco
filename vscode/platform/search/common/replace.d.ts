import { IPatternInfo } from 'vs/platform/search/common/search';
export declare class ReplacePattern {
    private _replacePattern;
    private _hasParameters;
    private _regExp;
    constructor(replaceString: string, searchPatternInfo: IPatternInfo);
    constructor(replaceString: string, parseParameters: boolean, regEx: RegExp);
    readonly hasParameters: boolean;
    readonly pattern: string;
    readonly regExp: RegExp;
    /**
    * Returns the replace string for the first match in the given text.
    * If text has no matches then returns null.
    */
    getReplaceString(text: string): string;
    /**
     * \n => LF
     * \t => TAB
     * \\ => \
     * $0 => $& (see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#Specifying_a_string_as_a_parameter)
     * everything else stays untouched
     */
    private parseReplaceString(replaceString);
    private between(value, from, to);
}
