import 'vs/css!./button';
import { EventEmitter } from 'vs/base/common/eventEmitter';
import { Builder } from 'vs/base/browser/builder';
import { Color } from 'vs/base/common/color';
export interface IButtonOptions extends IButtonStyles {
}
export interface IButtonStyles {
    buttonBackground?: Color;
    buttonHoverBackground?: Color;
    buttonForeground?: Color;
    buttonBorder?: Color;
}
export declare class Button extends EventEmitter {
    private $el;
    private options;
    private buttonBackground;
    private buttonHoverBackground;
    private buttonForeground;
    private buttonBorder;
    constructor(container: Builder, options?: IButtonOptions);
    constructor(container: HTMLElement, options?: IButtonOptions);
    style(styles: IButtonStyles): void;
    private applyStyles();
    getElement(): HTMLElement;
    label: string;
    icon: string;
    enabled: boolean;
    focus(): void;
    dispose(): void;
}
