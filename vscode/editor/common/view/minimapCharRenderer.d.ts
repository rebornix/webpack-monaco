import { ColorId } from 'vs/editor/common/modes';
import Event from 'vs/base/common/event';
import { RGBA8 } from 'vs/editor/common/core/rgba';
export declare class MinimapTokensColorTracker {
    private static _INSTANCE;
    static getInstance(): MinimapTokensColorTracker;
    private _colors;
    private _backgroundIsLight;
    private _onDidChange;
    onDidChange: Event<void>;
    private constructor();
    private _updateColorMap();
    getColor(colorId: ColorId): RGBA8;
    backgroundIsLight(): boolean;
}
export declare const enum Constants {
    START_CH_CODE = 32,
    END_CH_CODE = 126,
    CHAR_COUNT = 95,
    SAMPLED_CHAR_HEIGHT = 16,
    SAMPLED_CHAR_WIDTH = 10,
    SAMPLED_HALF_CHAR_WIDTH = 5,
    x2_CHAR_HEIGHT = 4,
    x2_CHAR_WIDTH = 2,
    x1_CHAR_HEIGHT = 2,
    x1_CHAR_WIDTH = 1,
    RGBA_CHANNELS_CNT = 4,
}
export declare class MinimapCharRenderer {
    _minimapCharRendererBrand: void;
    readonly x2charData: Uint8ClampedArray;
    readonly x1charData: Uint8ClampedArray;
    readonly x2charDataLight: Uint8ClampedArray;
    readonly x1charDataLight: Uint8ClampedArray;
    constructor(x2CharData: Uint8ClampedArray, x1CharData: Uint8ClampedArray);
    private static soften(input, ratio);
    private static _getChIndex(chCode);
    x2RenderChar(target: ImageData, dx: number, dy: number, chCode: number, color: RGBA8, backgroundColor: RGBA8, useLighterFont: boolean): void;
    x1RenderChar(target: ImageData, dx: number, dy: number, chCode: number, color: RGBA8, backgroundColor: RGBA8, useLighterFont: boolean): void;
    x2BlockRenderChar(target: ImageData, dx: number, dy: number, color: RGBA8, backgroundColor: RGBA8, useLighterFont: boolean): void;
    x1BlockRenderChar(target: ImageData, dx: number, dy: number, color: RGBA8, backgroundColor: RGBA8, useLighterFont: boolean): void;
}
