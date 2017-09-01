import 'vs/css!./selectBox';
import Event from 'vs/base/common/event';
import { Widget } from 'vs/base/browser/ui/widget';
import { Color } from 'vs/base/common/color';
export interface ISelectBoxStyles {
    selectBackground?: Color;
    selectForeground?: Color;
    selectBorder?: Color;
}
export declare const defaultStyles: {
    selectBackground: Color;
    selectForeground: Color;
    selectBorder: Color;
};
export interface ISelectData {
    selected: string;
    index: number;
}
export declare class SelectBox extends Widget {
    private selectElement;
    private options;
    private selected;
    private container;
    private _onDidSelect;
    private toDispose;
    private selectBackground;
    private selectForeground;
    private selectBorder;
    constructor(options: string[], selected: number, styles?: ISelectBoxStyles);
    readonly onDidSelect: Event<ISelectData>;
    setOptions(options: string[], selected?: number, disabled?: number): void;
    select(index: number): void;
    focus(): void;
    blur(): void;
    render(container: HTMLElement): void;
    style(styles: ISelectBoxStyles): void;
    protected applyStyles(): void;
    private createOption(value, disabled?);
    dispose(): void;
}
