import { Disposable } from 'vs/base/common/lifecycle';
import { IKeyboardEvent } from 'vs/base/browser/keyboardEvent';
import { IViewModel } from 'vs/editor/common/viewModel/viewModel';
import { IScrollEvent } from 'vs/editor/common/editorCommon';
import { IEditorMouseEvent } from 'vs/editor/browser/editorBrowser';
import * as viewEvents from 'vs/editor/common/view/viewEvents';
export interface EventCallback<T> {
    (event: T): void;
}
export declare class ViewOutgoingEvents extends Disposable {
    onDidScroll: EventCallback<IScrollEvent>;
    onDidGainFocus: EventCallback<void>;
    onDidLoseFocus: EventCallback<void>;
    onKeyDown: EventCallback<IKeyboardEvent>;
    onKeyUp: EventCallback<IKeyboardEvent>;
    onContextMenu: EventCallback<IEditorMouseEvent>;
    onMouseMove: EventCallback<IEditorMouseEvent>;
    onMouseLeave: EventCallback<IEditorMouseEvent>;
    onMouseUp: EventCallback<IEditorMouseEvent>;
    onMouseDown: EventCallback<IEditorMouseEvent>;
    onMouseDrag: EventCallback<IEditorMouseEvent>;
    onMouseDrop: EventCallback<IEditorMouseEvent>;
    private _viewModel;
    constructor(viewModel: IViewModel);
    emitScrollChanged(e: viewEvents.ViewScrollChangedEvent): void;
    emitViewFocusGained(): void;
    emitViewFocusLost(): void;
    emitKeyDown(e: IKeyboardEvent): void;
    emitKeyUp(e: IKeyboardEvent): void;
    emitContextMenu(e: IEditorMouseEvent): void;
    emitMouseMove(e: IEditorMouseEvent): void;
    emitMouseLeave(e: IEditorMouseEvent): void;
    emitMouseUp(e: IEditorMouseEvent): void;
    emitMouseDown(e: IEditorMouseEvent): void;
    emitMouseDrag(e: IEditorMouseEvent): void;
    emitMouseDrop(e: IEditorMouseEvent): void;
    private _convertViewToModelMouseEvent(e);
    private _convertViewToModelMouseTarget(target);
    private _convertViewToModelPosition(viewPosition);
    private _convertViewToModelRange(viewRange);
}
