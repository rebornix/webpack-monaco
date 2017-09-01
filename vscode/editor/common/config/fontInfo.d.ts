export declare class BareFontInfo {
    readonly _bareFontInfoBrand: void;
    /**
     * @internal
     */
    static createFromRawSettings(opts: {
        fontFamily?: string;
        fontWeight?: string;
        fontSize?: number | string;
        lineHeight?: number | string;
        letterSpacing?: number | string;
    }, zoomLevel: number): BareFontInfo;
    readonly zoomLevel: number;
    readonly fontFamily: string;
    readonly fontWeight: string;
    readonly fontSize: number;
    readonly lineHeight: number;
    readonly letterSpacing: number;
    /**
     * @internal
     */
    protected constructor(opts: {
        zoomLevel: number;
        fontFamily: string;
        fontWeight: string;
        fontSize: number;
        lineHeight: number;
        letterSpacing: number;
    });
    /**
     * @internal
     */
    getId(): string;
}
export declare class FontInfo extends BareFontInfo {
    readonly _editorStylingBrand: void;
    readonly isTrusted: boolean;
    readonly isMonospace: boolean;
    readonly typicalHalfwidthCharacterWidth: number;
    readonly typicalFullwidthCharacterWidth: number;
    readonly spaceWidth: number;
    readonly maxDigitWidth: number;
    /**
     * @internal
     */
    constructor(opts: {
        zoomLevel: number;
        fontFamily: string;
        fontWeight: string;
        fontSize: number;
        lineHeight: number;
        letterSpacing: number;
        isMonospace: boolean;
        typicalHalfwidthCharacterWidth: number;
        typicalFullwidthCharacterWidth: number;
        spaceWidth: number;
        maxDigitWidth: number;
    }, isTrusted: boolean);
    /**
     * @internal
     */
    equals(other: FontInfo): boolean;
}
