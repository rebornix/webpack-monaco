import { IColorFormatter, IColor } from 'vs/editor/common/modes';
export declare class ColorFormatter implements IColorFormatter {
    readonly supportsTransparency: boolean;
    private tree;
    private static PATTERN;
    constructor(format: string);
    format(color: IColor): string;
}
export declare class CombinedColorFormatter implements IColorFormatter {
    private opaqueFormatter;
    private transparentFormatter;
    readonly supportsTransparency: boolean;
    constructor(opaqueFormatter: IColorFormatter, transparentFormatter: IColorFormatter);
    format(color: IColor): string;
}
