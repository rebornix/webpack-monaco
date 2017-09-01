import 'vs/css!./findInput';
import { IMessage as InputBoxMessage, IInputValidator, InputBox, IInputBoxStyles } from 'vs/base/browser/ui/inputbox/inputBox';
import { IContextViewProvider } from 'vs/base/browser/ui/contextview/contextview';
import { Widget } from 'vs/base/browser/ui/widget';
import Event from 'vs/base/common/event';
import { IKeyboardEvent } from 'vs/base/browser/keyboardEvent';
import { IMouseEvent } from 'vs/base/browser/mouseEvent';
import { Color } from 'vs/base/common/color';
export interface IFindInputOptions extends IFindInputStyles {
    placeholder?: string;
    width?: number;
    validation?: IInputValidator;
    label: string;
    appendCaseSensitiveLabel?: string;
    appendWholeWordsLabel?: string;
    appendRegexLabel?: string;
}
export interface IFindInputStyles extends IInputBoxStyles {
    inputActiveOptionBorder?: Color;
}
export declare class FindInput extends Widget {
    static OPTION_CHANGE: string;
    private contextViewProvider;
    private width;
    private placeholder;
    private validation;
    private label;
    private inputActiveOptionBorder;
    private inputBackground;
    private inputForeground;
    private inputBorder;
    private inputValidationInfoBorder;
    private inputValidationInfoBackground;
    private inputValidationWarningBorder;
    private inputValidationWarningBackground;
    private inputValidationErrorBorder;
    private inputValidationErrorBackground;
    private regex;
    private wholeWords;
    private caseSensitive;
    domNode: HTMLElement;
    inputBox: InputBox;
    private _onDidOptionChange;
    onDidOptionChange: Event<boolean>;
    private _onKeyDown;
    onKeyDown: Event<IKeyboardEvent>;
    private _onMouseDown;
    onMouseDown: Event<IMouseEvent>;
    private _onInput;
    onInput: Event<void>;
    private _onKeyUp;
    onKeyUp: Event<IKeyboardEvent>;
    private _onCaseSensitiveKeyDown;
    onCaseSensitiveKeyDown: Event<IKeyboardEvent>;
    constructor(parent: HTMLElement, contextViewProvider: IContextViewProvider, options?: IFindInputOptions);
    enable(): void;
    disable(): void;
    setEnabled(enabled: boolean): void;
    clear(): void;
    setWidth(newWidth: number): void;
    getValue(): string;
    setValue(value: string): void;
    style(styles: IFindInputStyles): void;
    protected applyStyles(): void;
    select(): void;
    focus(): void;
    getCaseSensitive(): boolean;
    setCaseSensitive(value: boolean): void;
    getWholeWords(): boolean;
    setWholeWords(value: boolean): void;
    getRegex(): boolean;
    setRegex(value: boolean): void;
    focusOnCaseSensitive(): void;
    private _lastHighlightFindOptions;
    highlightFindOptions(): void;
    private setInputWidth();
    private buildDomNode(appendCaseSensitiveLabel, appendWholeWordsLabel, appendRegexLabel);
    validate(): void;
    showMessage(message: InputBoxMessage): void;
    clearMessage(): void;
    private clearValidation();
    dispose(): void;
}
