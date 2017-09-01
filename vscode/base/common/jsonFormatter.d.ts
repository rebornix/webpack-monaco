export interface FormattingOptions {
    /**
     * If indentation is based on spaces (`insertSpaces` = true), then what is the number of spaces that make an indent?
     */
    tabSize: number;
    /**
     * Is indentation based on spaces?
     */
    insertSpaces: boolean;
    /**
     * The default end of line line character
     */
    eol: string;
}
export interface Edit {
    offset: number;
    length: number;
    content: string;
}
export declare function applyEdit(text: string, edit: Edit): string;
export declare function applyEdits(text: string, edits: Edit[]): string;
export declare function format(documentText: string, range: {
    offset: number;
    length: number;
}, options: FormattingOptions): Edit[];
