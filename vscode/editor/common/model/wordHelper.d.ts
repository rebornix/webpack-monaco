import { IWordAtPosition } from 'vs/editor/common/editorCommon';
export declare const USUAL_WORD_SEPARATORS = "`~!@#$%^&*()-=+[{]}\\|;:'\",.<>/?";
export declare const DEFAULT_WORD_REGEXP: RegExp;
export declare function ensureValidWordDefinition(wordDefinition?: RegExp): RegExp;
export declare function getWordAtText(column: number, wordDefinition: RegExp, text: string, textOffset: number): IWordAtPosition;
