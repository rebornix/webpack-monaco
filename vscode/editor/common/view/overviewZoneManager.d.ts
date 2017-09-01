import { OverviewRulerLane } from 'vs/editor/common/editorCommon';
import { ThemeType } from 'vs/platform/theme/common/themeService';
export declare class ColorZone {
    _colorZoneBrand: void;
    from: number;
    to: number;
    colorId: number;
    position: OverviewRulerLane;
    constructor(from: number, to: number, colorId: number, position: OverviewRulerLane);
}
/**
 * A zone in the overview ruler
 */
export declare class OverviewRulerZone {
    _overviewRulerZoneBrand: void;
    startLineNumber: number;
    endLineNumber: number;
    position: OverviewRulerLane;
    forceHeight: number;
    private _color;
    private _darkColor;
    private _hcColor;
    private _colorZones;
    constructor(startLineNumber: number, endLineNumber: number, position: OverviewRulerLane, forceHeight: number, color: string, darkColor: string, hcColor: string);
    getColor(themeType: ThemeType): string;
    equals(other: OverviewRulerZone): boolean;
    compareTo(other: OverviewRulerZone): number;
    setColorZones(colorZones: ColorZone[]): void;
    getColorZones(): ColorZone[];
}
export declare class OverviewZoneManager {
    private _getVerticalOffsetForLine;
    private _zones;
    private _colorZonesInvalid;
    private _lineHeight;
    private _domWidth;
    private _domHeight;
    private _outerHeight;
    private _maximumHeight;
    private _minimumHeight;
    private _themeType;
    private _pixelRatio;
    private _lastAssignedId;
    private _color2Id;
    private _id2Color;
    constructor(getVerticalOffsetForLine: (lineNumber: number) => number);
    getId2Color(): string[];
    setZones(newZones: OverviewRulerZone[]): void;
    setLineHeight(lineHeight: number): boolean;
    setPixelRatio(pixelRatio: number): void;
    getDOMWidth(): number;
    getCanvasWidth(): number;
    setDOMWidth(width: number): boolean;
    getDOMHeight(): number;
    getCanvasHeight(): number;
    setDOMHeight(height: number): boolean;
    getOuterHeight(): number;
    setOuterHeight(outerHeight: number): boolean;
    setMaximumHeight(maximumHeight: number): boolean;
    setMinimumHeight(minimumHeight: number): boolean;
    setThemeType(themeType: ThemeType): boolean;
    resolveColorZones(): ColorZone[];
    createZone(totalHeight: number, y1: number, y2: number, minimumHeight: number, maximumHeight: number, color: string, position: OverviewRulerLane): ColorZone;
}
