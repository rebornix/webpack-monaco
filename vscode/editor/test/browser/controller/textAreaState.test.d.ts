import { ITextAreaWrapper } from 'vs/editor/browser/controller/textAreaState';
import { Disposable } from 'vs/base/common/lifecycle';
export declare class MockTextAreaWrapper extends Disposable implements ITextAreaWrapper {
    _value: string;
    _selectionStart: number;
    _selectionEnd: number;
    constructor();
    getValue(): string;
    setValue(reason: string, value: string): void;
    getSelectionStart(): number;
    getSelectionEnd(): number;
    setSelectionRange(reason: string, selectionStart: number, selectionEnd: number): void;
}
