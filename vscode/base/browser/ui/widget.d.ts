import { Disposable } from 'vs/base/common/lifecycle';
import { IMouseEvent } from 'vs/base/browser/mouseEvent';
import { IKeyboardEvent } from 'vs/base/browser/keyboardEvent';
export declare abstract class Widget extends Disposable {
    protected onclick(domNode: HTMLElement, listener: (e: IMouseEvent) => void): void;
    protected onmousedown(domNode: HTMLElement, listener: (e: IMouseEvent) => void): void;
    protected onmouseover(domNode: HTMLElement, listener: (e: IMouseEvent) => void): void;
    protected onnonbubblingmouseout(domNode: HTMLElement, listener: (e: IMouseEvent) => void): void;
    protected onkeydown(domNode: HTMLElement, listener: (e: IKeyboardEvent) => void): void;
    protected onkeyup(domNode: HTMLElement, listener: (e: IKeyboardEvent) => void): void;
    protected oninput(domNode: HTMLElement, listener: (e: Event) => void): void;
    protected onblur(domNode: HTMLElement, listener: (e: Event) => void): void;
    protected onfocus(domNode: HTMLElement, listener: (e: Event) => void): void;
    protected onchange(domNode: HTMLElement, listener: (e: Event) => void): void;
}
