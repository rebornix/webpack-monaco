import Event from 'vs/base/common/event';
import { Color } from 'vs/base/common/color';
import { IColorFormatter } from 'vs/editor/common/modes';
export declare class ColorPickerModel {
    private formatterIndex;
    readonly originalColor: Color;
    private _color;
    color: Color;
    readonly formatter: IColorFormatter;
    readonly formatters: IColorFormatter[];
    private _onColorFlushed;
    readonly onColorFlushed: Event<Color>;
    private _onDidChangeColor;
    readonly onDidChangeColor: Event<Color>;
    private _onDidChangeFormatter;
    readonly onDidChangeFormatter: Event<IColorFormatter>;
    constructor(color: Color, availableFormatters: IColorFormatter[], formatterIndex: number);
    selectNextColorFormat(): void;
    flushColor(): void;
    private _checkFormat(start?);
}
