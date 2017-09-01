import 'vs/css!./inputBox';
import { IAction } from 'vs/base/common/actions';
import { IContextViewProvider } from 'vs/base/browser/ui/contextview/contextview';
import Event from 'vs/base/common/event';
import { Widget } from 'vs/base/browser/ui/widget';
import { Color } from 'vs/base/common/color';
export interface IInputOptions extends IInputBoxStyles {
    placeholder?: string;
    ariaLabel?: string;
    type?: string;
    validationOptions?: IInputValidationOptions;
    flexibleHeight?: boolean;
    actions?: IAction[];
}
export interface IInputBoxStyles {
    inputBackground?: Color;
    inputForeground?: Color;
    inputBorder?: Color;
    inputValidationInfoBorder?: Color;
    inputValidationInfoBackground?: Color;
    inputValidationWarningBorder?: Color;
    inputValidationWarningBackground?: Color;
    inputValidationErrorBorder?: Color;
    inputValidationErrorBackground?: Color;
}
export interface IInputValidator {
    (value: string): IMessage;
}
export interface IMessage {
    content: string;
    formatContent?: boolean;
    type?: MessageType;
}
export interface IInputValidationOptions {
    validation: IInputValidator;
    showMessage?: boolean;
}
export declare enum MessageType {
    INFO = 1,
    WARNING = 2,
    ERROR = 3,
}
export interface IRange {
    start: number;
    end: number;
}
export declare class InputBox extends Widget {
    private contextViewProvider;
    private element;
    private input;
    private mirror;
    private actionbar;
    private options;
    private message;
    private placeholder;
    private ariaLabel;
    private validation;
    private showValidationMessage;
    private state;
    private cachedHeight;
    private inputBackground;
    private inputForeground;
    private inputBorder;
    private inputValidationInfoBorder;
    private inputValidationInfoBackground;
    private inputValidationWarningBorder;
    private inputValidationWarningBackground;
    private inputValidationErrorBorder;
    private inputValidationErrorBackground;
    private _onDidChange;
    onDidChange: Event<string>;
    private _onDidHeightChange;
    onDidHeightChange: Event<number>;
    constructor(container: HTMLElement, contextViewProvider: IContextViewProvider, options?: IInputOptions);
    private onBlur();
    private onFocus();
    setPlaceHolder(placeHolder: string): void;
    setAriaLabel(label: string): void;
    setContextViewProvider(contextViewProvider: IContextViewProvider): void;
    readonly inputElement: HTMLInputElement;
    value: string;
    readonly height: number;
    focus(): void;
    blur(): void;
    hasFocus(): boolean;
    select(range?: IRange): void;
    enable(): void;
    disable(): void;
    setEnabled(enabled: boolean): void;
    width: number;
    showMessage(message: IMessage, force?: boolean): void;
    hideMessage(): void;
    isInputValid(): boolean;
    validate(): boolean;
    private stylesForType(type);
    private classForType(type);
    private _showMessage();
    private _hideMessage();
    private onValueChange();
    private updateMirror();
    style(styles: IInputBoxStyles): void;
    protected applyStyles(): void;
    layout(): void;
    dispose(): void;
}
