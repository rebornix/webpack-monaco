import { TPromise } from 'vs/base/common/winjs.base';
import { IEventEmitter, EventEmitter } from 'vs/base/common/eventEmitter';
import { IDisposable } from 'vs/base/common/lifecycle';
import Event, { Emitter } from 'vs/base/common/event';
export interface ITelemetryData {
    from?: string;
    target?: string;
    [key: string]: any;
}
export interface IAction extends IDisposable {
    id: string;
    label: string;
    tooltip: string;
    class: string;
    enabled: boolean;
    checked: boolean;
    radio: boolean;
    run(event?: any): TPromise<any>;
}
export interface IActionRunner extends IEventEmitter {
    run(action: IAction, context?: any): TPromise<any>;
}
export interface IActionItem extends IEventEmitter {
    actionRunner: IActionRunner;
    setActionContext(context: any): void;
    render(element: any): void;
    isEnabled(): boolean;
    focus(): void;
    blur(): void;
    dispose(): void;
}
/**
 * Checks if the provided object is compatible
 * with the IAction interface.
 * @param thing an object
 */
export declare function isAction(thing: any): thing is IAction;
export interface IActionChangeEvent {
    label?: string;
    tooltip?: string;
    class?: string;
    enabled?: boolean;
    checked?: boolean;
    radio?: boolean;
}
export declare class Action implements IAction {
    protected _onDidChange: Emitter<IActionChangeEvent>;
    protected _id: string;
    protected _label: string;
    protected _tooltip: string;
    protected _cssClass: string;
    protected _enabled: boolean;
    protected _checked: boolean;
    protected _radio: boolean;
    protected _order: number;
    protected _actionCallback: (event?: any) => TPromise<any>;
    constructor(id: string, label?: string, cssClass?: string, enabled?: boolean, actionCallback?: (event?: any) => TPromise<any>);
    dispose(): void;
    readonly onDidChange: Event<IActionChangeEvent>;
    readonly id: string;
    label: string;
    protected _setLabel(value: string): void;
    tooltip: string;
    protected _setTooltip(value: string): void;
    class: string;
    protected _setClass(value: string): void;
    enabled: boolean;
    protected _setEnabled(value: boolean): void;
    checked: boolean;
    radio: boolean;
    protected _setChecked(value: boolean): void;
    protected _setRadio(value: boolean): void;
    order: number;
    run(event?: any, data?: ITelemetryData): TPromise<any>;
}
export interface IRunEvent {
    action: IAction;
    result?: any;
    error?: any;
}
export declare class ActionRunner extends EventEmitter implements IActionRunner {
    run(action: IAction, context?: any): TPromise<any>;
    protected runAction(action: IAction, context?: any): TPromise<any>;
}
