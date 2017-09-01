import { ColorId, FontStyle, StandardTokenType, LanguageId } from 'vs/editor/common/modes';
export declare class TokenMetadata {
    static getLanguageId(metadata: number): LanguageId;
    static getTokenType(metadata: number): StandardTokenType;
    static getFontStyle(metadata: number): FontStyle;
    static getForeground(metadata: number): ColorId;
    static getBackground(metadata: number): ColorId;
    static getClassNameFromMetadata(metadata: number): string;
    static getInlineStyleFromMetadata(metadata: number, colorMap: string[]): string;
}
