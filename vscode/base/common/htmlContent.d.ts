export interface IMarkdownString {
    value: string;
    isTrusted?: boolean;
}
export declare class MarkdownString implements IMarkdownString {
    value: string;
    isTrusted?: boolean;
    constructor(value?: string);
    appendText(value: string): MarkdownString;
    appendMarkdown(value: string): MarkdownString;
    appendCodeblock(langId: string, code: string): MarkdownString;
}
export declare function isEmptyMarkdownString(oneOrMany: IMarkdownString | IMarkdownString[]): boolean;
export declare function isMarkdownString(thing: any): thing is IMarkdownString;
export declare function markedStringsEquals(a: IMarkdownString | IMarkdownString[], b: IMarkdownString | IMarkdownString[]): boolean;
export declare function removeMarkdownEscapes(text: string): string;
export declare function containsCommandLink(value: string): boolean;
