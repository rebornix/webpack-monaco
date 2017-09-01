import Event from 'vs/base/common/event';
import { IDisposable } from 'vs/base/common/lifecycle';
import { ICommonCodeEditor, IModel, IWordAtPosition } from 'vs/editor/common/editorCommon';
import { ISuggestSupport } from 'vs/editor/common/modes';
import { Position } from 'vs/editor/common/core/position';
import { ISuggestionItem } from './suggest';
import { CompletionModel } from './completionModel';
export interface ICancelEvent {
    retrigger: boolean;
}
export interface ITriggerEvent {
    auto: boolean;
}
export interface ISuggestEvent {
    completionModel: CompletionModel;
    isFrozen: boolean;
    auto: boolean;
}
export declare class LineContext {
    static shouldAutoTrigger(editor: ICommonCodeEditor): boolean;
    static isInEditableRange(editor: ICommonCodeEditor): boolean;
    readonly lineNumber: number;
    readonly column: number;
    readonly leadingLineContent: string;
    readonly leadingWord: IWordAtPosition;
    readonly auto: boolean;
    constructor(model: IModel, position: Position, auto: boolean);
}
export declare const enum State {
    Idle = 0,
    Manual = 1,
    Auto = 2,
}
export declare class SuggestModel implements IDisposable {
    private editor;
    private toDispose;
    private quickSuggestDelay;
    private triggerCharacterListener;
    private triggerAutoSuggestPromise;
    private triggerRefilter;
    private _state;
    private requestPromise;
    private context;
    private currentPosition;
    private completionModel;
    private _onDidCancel;
    readonly onDidCancel: Event<ICancelEvent>;
    private _onDidTrigger;
    readonly onDidTrigger: Event<ITriggerEvent>;
    private _onDidSuggest;
    readonly onDidSuggest: Event<ISuggestEvent>;
    constructor(editor: ICommonCodeEditor);
    dispose(): void;
    private updateQuickSuggest();
    private updateTriggerCharacters();
    readonly state: State;
    cancel(retrigger?: boolean): void;
    private updateActiveSuggestSession();
    private onCursorChange(e);
    trigger(auto: boolean, retrigger?: boolean, onlyFrom?: ISuggestSupport[], existingItems?: ISuggestionItem[]): void;
    private onNewContext(ctx);
}
