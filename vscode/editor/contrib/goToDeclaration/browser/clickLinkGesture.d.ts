import 'vs/css!./goToDeclarationMouse';
import { KeyCode } from 'vs/base/common/keyCodes';
import { IKeyboardEvent } from 'vs/base/browser/keyboardEvent';
import { ICodeEditor, IEditorMouseEvent, IMouseTarget } from 'vs/editor/browser/editorBrowser';
import { Disposable } from 'vs/base/common/lifecycle';
import Event from 'vs/base/common/event';
/**
 * An event that encapsulates the various trigger modifiers logic needed for go to definition.
 */
export declare class ClickLinkMouseEvent {
    readonly target: IMouseTarget;
    readonly hasTriggerModifier: boolean;
    readonly hasSideBySideModifier: boolean;
    readonly isNoneOrSingleMouseDown: boolean;
    constructor(source: IEditorMouseEvent, opts: ClickLinkOptions);
}
/**
 * An event that encapsulates the various trigger modifiers logic needed for go to definition.
 */
export declare class ClickLinkKeyboardEvent {
    readonly keyCodeIsTriggerKey: boolean;
    readonly keyCodeIsSideBySideKey: boolean;
    readonly hasTriggerModifier: boolean;
    constructor(source: IKeyboardEvent, opts: ClickLinkOptions);
}
export declare class ClickLinkOptions {
    readonly triggerKey: KeyCode;
    readonly triggerModifier: 'ctrlKey' | 'shiftKey' | 'altKey' | 'metaKey';
    readonly triggerSideBySideKey: KeyCode;
    readonly triggerSideBySideModifier: 'ctrlKey' | 'shiftKey' | 'altKey' | 'metaKey';
    constructor(triggerKey: KeyCode, triggerModifier: 'ctrlKey' | 'shiftKey' | 'altKey' | 'metaKey', triggerSideBySideKey: KeyCode, triggerSideBySideModifier: 'ctrlKey' | 'shiftKey' | 'altKey' | 'metaKey');
    equals(other: ClickLinkOptions): boolean;
}
export declare class ClickLinkGesture extends Disposable {
    private readonly _onMouseMoveOrRelevantKeyDown;
    readonly onMouseMoveOrRelevantKeyDown: Event<[ClickLinkMouseEvent, ClickLinkKeyboardEvent]>;
    private readonly _onExecute;
    readonly onExecute: Event<ClickLinkMouseEvent>;
    private readonly _onCancel;
    readonly onCancel: Event<void>;
    private readonly _editor;
    private _opts;
    private lastMouseMoveEvent;
    private hasTriggerKeyOnMouseDown;
    constructor(editor: ICodeEditor);
    private onDidChangeCursorSelection(e);
    private onEditorMouseMove(mouseEvent);
    private onEditorMouseDown(mouseEvent);
    private onEditorMouseUp(mouseEvent);
    private onEditorKeyDown(e);
    private onEditorKeyUp(e);
    private resetHandler();
}
