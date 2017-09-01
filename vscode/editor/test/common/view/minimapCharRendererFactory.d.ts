import { MinimapCharRenderer } from 'vs/editor/common/view/minimapCharRenderer';
export declare class MinimapCharRendererFactory {
    static create(source: Uint8ClampedArray): MinimapCharRenderer;
    private static toGrayscale(charData);
    private static _extractSampledChar(source, charIndex, dest);
    private static _downsample2xChar(source, dest);
    private static _downsample2x(data);
    private static _downsample1xChar(source, dest);
    private static _downsample1x(data);
}
