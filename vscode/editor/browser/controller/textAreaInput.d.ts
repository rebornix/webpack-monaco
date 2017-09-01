import { Position } from 'vs/editor/common/core/position';
import { Selection } from 'vs/editor/common/core/selection';
import Event from 'vs/base/common/event';
import { Disposable } from 'vs/base/common/lifecycle';
import { ITypeData, TextAreaState } from 'vs/editor/browser/controller/textAreaState';
import { IKeyboardEvent } from 'vs/base/browser/keyboardEvent';
import { FastDomNode } from 'vs/base/browser/fastDomNode';
export interface ICompositionData {
    data: string;
}
export declare const CopyOptions: {
    forceCopyWithSyntaxHighlighting: boolean;
};
export interface IPasteData {
    text: string;
}
export interface ITextAreaInputHost {
    getPlainTextToCopy(): string;
    getHTMLToCopy(): string;
    getScreenReaderContent(currentState: TextAreaState): TextAreaState;
    deduceModelPosition(viewAnchorPosition: Position, deltaOffset: number, lineFeedCnt: number): Position;
}
/**
 * Writes screen reader content to the textarea and is able to analyze its input events to generate:
 *  - onCut
 *  - onPaste
 *  - onType
 *
 * Composition events are generated for presentation purposes (composition input is reflected in onType).
 */
export declare class TextAreaInput extends Disposable {
    private _onFocus;
    onFocus: Event<void>;
    private _onBlur;
    onBlur: Event<void>;
    private _onKeyDown;
    onKeyDown: Event<IKeyboardEvent>;
    private _onKeyUp;
    onKeyUp: Event<IKeyboardEvent>;
    private _onCut;
    onCut: Event<void>;
    private _onPaste;
    onPaste: Event<IPasteData>;
    private _onType;
    onType: Event<ITypeData>;
    private _onCompositionStart;
    onCompositionStart: Event<void>;
    private _onCompositionUpdate;
    onCompositionUpdate: Event<ICompositionData>;
    private _onCompositionEnd;
    onCompositionEnd: Event<void>;
    private _onSelectionChangeRequest;
    onSelectionChangeRequest: Event<Selection>;
    private readonly _host;
    private readonly _textArea;
    private readonly _asyncTriggerCut;
    private _textAreaState;
    private _hasFocus;
    private _isDoingComposition;
    private _nextCommand;
    constructor(host: ITextAreaInputHost, textArea: FastDomNode<HTMLTextAreaElement>);
    dispose(): void;
    focusTextArea(): void;
    isFocused(): boolean;
    private _setHasFocus(newHasFocus);
    private _setAndWriteTextAreaState(reason, textAreaState);
    writeScreenReaderContent(reason: string): void;
    private _ensureClipboardGetsEditorSelection(e);
}
