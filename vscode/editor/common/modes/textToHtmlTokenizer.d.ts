import { ViewLineToken } from 'vs/editor/common/core/viewLineToken';
export declare function tokenizeToString(text: string, languageId: string): string;
export declare function tokenizeLineToHTML(text: string, viewLineTokens: ViewLineToken[], colorMap: string[], startOffset: number, endOffset: number, tabSize: number): string;
