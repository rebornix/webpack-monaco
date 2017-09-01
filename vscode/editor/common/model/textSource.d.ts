import { DefaultEndOfLine } from 'vs/editor/common/editorCommon';
/**
 * A processed string ready to be turned into an editor model.
 */
export interface IRawTextSource {
    /**
     * The entire text length.
     */
    readonly length: number;
    /**
     * The text split into lines.
     */
    readonly lines: string[];
    /**
     * The BOM (leading character sequence of the file).
     */
    readonly BOM: string;
    /**
     * The number of lines ending with '\r\n'
     */
    readonly totalCRCount: number;
    /**
     * The text contains Unicode characters classified as "R" or "AL".
     */
    readonly containsRTL: boolean;
    /**
     * The text contains only characters inside the ASCII range 32-126 or \t \r \n
     */
    readonly isBasicASCII: boolean;
}
export declare class RawTextSource {
    static fromString(rawText: string): IRawTextSource;
}
/**
 * A processed string with its EOL resolved ready to be turned into an editor model.
 */
export interface ITextSource {
    /**
     * The entire text length.
     */
    readonly length: number;
    /**
     * The text split into lines.
     */
    readonly lines: string[];
    /**
     * The BOM (leading character sequence of the file).
     */
    readonly BOM: string;
    /**
     * The end of line sequence.
     */
    readonly EOL: string;
    /**
     * The text contains Unicode characters classified as "R" or "AL".
     */
    readonly containsRTL: boolean;
    /**
     * The text contains only characters inside the ASCII range 32-126 or \t \r \n
     */
    readonly isBasicASCII: boolean;
}
export declare class TextSource {
    /**
     * if text source is empty or with precisely one line, returns null. No end of line is detected.
     * if text source contains more lines ending with '\r\n', returns '\r\n'.
     * Otherwise returns '\n'. More lines end with '\n'.
     */
    private static _getEOL(rawTextSource, defaultEOL);
    static fromRawTextSource(rawTextSource: IRawTextSource, defaultEOL: DefaultEndOfLine): ITextSource;
    static fromString(text: string, defaultEOL: DefaultEndOfLine): ITextSource;
    static create(source: string | IRawTextSource, defaultEOL: DefaultEndOfLine): ITextSource;
}
