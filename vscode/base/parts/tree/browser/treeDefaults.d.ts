import { TPromise } from 'vs/base/common/winjs.base';
import { Action } from 'vs/base/common/actions';
import touch = require('vs/base/browser/touch');
import mouse = require('vs/base/browser/mouseEvent');
import { IKeyboardEvent } from 'vs/base/browser/keyboardEvent';
import _ = require('vs/base/parts/tree/browser/tree');
import { SimpleKeybinding } from 'vs/base/common/keyCodes';
export interface IKeyBindingCallback {
    (tree: _.ITree, event: IKeyboardEvent): void;
}
export interface ICancelableEvent {
    preventDefault(): void;
    stopPropagation(): void;
}
export declare enum ClickBehavior {
    /**
     * Handle the click when the mouse button is pressed but not released yet.
     */
    ON_MOUSE_DOWN = 0,
    /**
     * Handle the click when the mouse button is released.
     */
    ON_MOUSE_UP = 1,
}
export interface IControllerOptions {
    clickBehavior?: ClickBehavior;
    keyboardSupport?: boolean;
}
export declare class KeybindingDispatcher {
    private _arr;
    constructor();
    set(keybinding: number, callback: IKeyBindingCallback): void;
    dispatch(keybinding: SimpleKeybinding): IKeyBindingCallback;
}
export declare class DefaultController implements _.IController {
    protected downKeyBindingDispatcher: KeybindingDispatcher;
    protected upKeyBindingDispatcher: KeybindingDispatcher;
    private options;
    constructor(options?: IControllerOptions);
    onMouseDown(tree: _.ITree, element: any, event: mouse.IMouseEvent, origin?: string): boolean;
    onClick(tree: _.ITree, element: any, event: mouse.IMouseEvent): boolean;
    protected onLeftClick(tree: _.ITree, element: any, eventish: ICancelableEvent, origin?: string): boolean;
    onContextMenu(tree: _.ITree, element: any, event: _.ContextMenuEvent): boolean;
    onTap(tree: _.ITree, element: any, event: touch.GestureEvent): boolean;
    onKeyDown(tree: _.ITree, event: IKeyboardEvent): boolean;
    onKeyUp(tree: _.ITree, event: IKeyboardEvent): boolean;
    private onKey(bindings, tree, event);
    protected onUp(tree: _.ITree, event: IKeyboardEvent): boolean;
    protected onPageUp(tree: _.ITree, event: IKeyboardEvent): boolean;
    protected onDown(tree: _.ITree, event: IKeyboardEvent): boolean;
    protected onPageDown(tree: _.ITree, event: IKeyboardEvent): boolean;
    protected onHome(tree: _.ITree, event: IKeyboardEvent): boolean;
    protected onEnd(tree: _.ITree, event: IKeyboardEvent): boolean;
    protected onLeft(tree: _.ITree, event: IKeyboardEvent): boolean;
    protected onRight(tree: _.ITree, event: IKeyboardEvent): boolean;
    protected onEnter(tree: _.ITree, event: IKeyboardEvent): boolean;
    protected onSpace(tree: _.ITree, event: IKeyboardEvent): boolean;
    protected onEscape(tree: _.ITree, event: IKeyboardEvent): boolean;
}
export declare class DefaultDragAndDrop implements _.IDragAndDrop {
    getDragURI(tree: _.ITree, element: any): string;
    onDragStart(tree: _.ITree, data: _.IDragAndDropData, originalEvent: mouse.DragMouseEvent): void;
    onDragOver(tree: _.ITree, data: _.IDragAndDropData, targetElement: any, originalEvent: mouse.DragMouseEvent): _.IDragOverReaction;
    drop(tree: _.ITree, data: _.IDragAndDropData, targetElement: any, originalEvent: mouse.DragMouseEvent): void;
}
export declare class DefaultFilter implements _.IFilter {
    isVisible(tree: _.ITree, element: any): boolean;
}
export declare class DefaultSorter implements _.ISorter {
    compare(tree: _.ITree, element: any, otherElement: any): number;
}
export declare class DefaultAccessibilityProvider implements _.IAccessibilityProvider {
    getAriaLabel(tree: _.ITree, element: any): string;
}
export declare class CollapseAllAction extends Action {
    private viewer;
    constructor(viewer: _.ITree, enabled: boolean);
    run(context?: any): TPromise<any>;
}
