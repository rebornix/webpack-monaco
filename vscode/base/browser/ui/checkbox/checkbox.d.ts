import 'vs/css!./checkbox';
import { Widget } from 'vs/base/browser/ui/widget';
import { IKeyboardEvent } from 'vs/base/browser/keyboardEvent';
import { Color } from 'vs/base/common/color';
export interface ICheckboxOpts extends ICheckboxStyles {
    actionClassName: string;
    title: string;
    isChecked: boolean;
    onChange: (viaKeyboard: boolean) => void;
    onKeyDown?: (e: IKeyboardEvent) => void;
}
export interface ICheckboxStyles {
    inputActiveOptionBorder?: Color;
}
export declare class Checkbox extends Widget {
    private _opts;
    domNode: HTMLElement;
    private _checked;
    constructor(opts: ICheckboxOpts);
    focus(): void;
    checked: boolean;
    private _className();
    width(): number;
    style(styles: ICheckboxStyles): void;
    protected applyStyles(): void;
    enable(): void;
    disable(): void;
}
