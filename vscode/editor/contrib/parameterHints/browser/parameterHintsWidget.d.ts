import 'vs/css!./parameterHints';
import { IDisposable, Disposable } from 'vs/base/common/lifecycle';
import { SignatureHelp } from 'vs/editor/common/modes';
import { ICodeEditor, IContentWidget, IContentWidgetPosition } from 'vs/editor/browser/editorBrowser';
import Event from 'vs/base/common/event';
import { ICommonCodeEditor } from 'vs/editor/common/editorCommon';
import { IContextKeyService } from 'vs/platform/contextkey/common/contextkey';
export interface IHintEvent {
    hints: SignatureHelp;
}
export declare class ParameterHintsModel extends Disposable {
    static DELAY: number;
    private _onHint;
    onHint: Event<IHintEvent>;
    private _onCancel;
    onCancel: Event<void>;
    private editor;
    private enabled;
    private triggerCharactersListeners;
    private active;
    private throttledDelayer;
    constructor(editor: ICommonCodeEditor);
    cancel(silent?: boolean): void;
    trigger(delay?: number): void;
    private doTrigger();
    isTriggered(): boolean;
    private onModelChanged();
    private onCursorChange(e);
    private onEditorConfigurationChange();
    dispose(): void;
}
export declare class ParameterHintsWidget implements IContentWidget, IDisposable {
    private editor;
    private static ID;
    private model;
    private keyVisible;
    private keyMultipleSignatures;
    private element;
    private signature;
    private docs;
    private overloads;
    private currentSignature;
    private visible;
    private hints;
    private announcedLabel;
    private scrollbar;
    private disposables;
    allowEditorOverflow: boolean;
    constructor(editor: ICodeEditor, contextKeyService: IContextKeyService);
    private show();
    private hide();
    getPosition(): IContentWidgetPosition;
    private render();
    private renderParameters(parent, signature, currentParameter);
    next(): boolean;
    previous(): boolean;
    cancel(): void;
    getDomNode(): HTMLElement;
    getId(): string;
    trigger(): void;
    private updateMaxHeight();
    dispose(): void;
}
