import { IConfiguration } from 'vs/editor/common/editorCommon';
import { IVisibleLine } from 'vs/editor/browser/view/viewLayer';
import { HorizontalRange } from 'vs/editor/common/view/renderingContext';
import { ViewportData } from 'vs/editor/common/viewLayout/viewLinesViewportData';
import { ThemeType } from 'vs/platform/theme/common/themeService';
import { IStringBuilder } from 'vs/editor/common/core/stringBuilder';
export declare class DomReadingContext {
    private readonly _domNode;
    private _clientRectDeltaLeft;
    private _clientRectDeltaLeftRead;
    readonly clientRectDeltaLeft: number;
    readonly endNode: HTMLElement;
    constructor(domNode: HTMLElement, endNode: HTMLElement);
}
export declare class ViewLineOptions {
    readonly themeType: ThemeType;
    readonly renderWhitespace: 'none' | 'boundary' | 'all';
    readonly renderControlCharacters: boolean;
    readonly spaceWidth: number;
    readonly useMonospaceOptimizations: boolean;
    readonly lineHeight: number;
    readonly stopRenderingLineAfter: number;
    readonly fontLigatures: boolean;
    constructor(config: IConfiguration, themeType: ThemeType);
    equals(other: ViewLineOptions): boolean;
}
export declare class ViewLine implements IVisibleLine {
    static CLASS_NAME: string;
    private _options;
    private _isMaybeInvalid;
    private _renderedViewLine;
    constructor(options: ViewLineOptions);
    getDomNode(): HTMLElement;
    setDomNode(domNode: HTMLElement): void;
    onContentChanged(): void;
    onTokensChanged(): void;
    onDecorationsChanged(): void;
    onOptionsChanged(newOptions: ViewLineOptions): void;
    onSelectionChanged(): boolean;
    renderLine(lineNumber: number, deltaTop: number, viewportData: ViewportData, sb: IStringBuilder): boolean;
    layoutLine(lineNumber: number, deltaTop: number): void;
    getWidth(): number;
    getWidthIsFast(): boolean;
    getVisibleRangesForRange(startColumn: number, endColumn: number, context: DomReadingContext): HorizontalRange[];
    getColumnOfNodeOffset(lineNumber: number, spanNode: HTMLElement, offset: number): number;
}
