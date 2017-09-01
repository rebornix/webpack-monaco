import { IDisposable } from 'vs/base/common/lifecycle';
import { EventEmitter } from 'vs/base/common/eventEmitter';
import { TPromise } from 'vs/base/common/winjs.base';
/**
 * To an event a function with one or zero parameters
 * can be subscribed. The event is the subscriber function itself.
 */
interface Event<T> {
    (listener: (e: T) => any, thisArgs?: any, disposables?: IDisposable[]): IDisposable;
}
declare namespace Event {
    const None: Event<any>;
}
export default Event;
export interface EmitterOptions {
    onFirstListenerAdd?: Function;
    onFirstListenerDidAdd?: Function;
    onListenerDidAdd?: Function;
    onLastListenerRemove?: Function;
}
/**
 * The Emitter can be used to expose an Event to the public
 * to fire it from the insides.
 * Sample:
    class Document {

        private _onDidChange = new Emitter<(value:string)=>any>();

        public onDidChange = this._onDidChange.event;

        // getter-style
        // get onDidChange(): Event<(value:string)=>any> {
        // 	return this._onDidChange.event;
        // }

        private _doIt() {
            //...
            this._onDidChange.fire(value);
        }
    }
 */
export declare class Emitter<T> {
    private _options;
    private static _noop;
    private _event;
    private _callbacks;
    private _disposed;
    constructor(_options?: EmitterOptions);
    /**
     * For the public to allow to subscribe
     * to events from this Emitter
     */
    readonly event: Event<T>;
    /**
     * To be kept private to fire an event to
     * subscribers
     */
    fire(event?: T): any;
    dispose(): void;
}
export declare class EventMultiplexer<T> implements IDisposable {
    private emitter;
    private hasListeners;
    private events;
    constructor();
    readonly event: Event<T>;
    add(event: Event<T>): IDisposable;
    private onFirstListenerAdd();
    private onLastListenerRemove();
    private hook(e);
    private unhook(e);
    dispose(): void;
}
/**
 * Creates an Event which is backed-up by the event emitter. This allows
 * to use the existing eventing pattern and is likely using less memory.
 * Sample:
 *
 * 	class Document {
 *
 *		private _eventbus = new EventEmitter();
 *
 *		public onDidChange = fromEventEmitter(this._eventbus, 'changed');
 *
 *		// getter-style
 *		// get onDidChange(): Event<(value:string)=>any> {
 *		// 	cache fromEventEmitter result and return
 *		// }
 *
 *		private _doIt() {
 *			// ...
 *			this._eventbus.emit('changed', value)
 *		}
 *	}
 */
export declare function fromEventEmitter<T>(emitter: EventEmitter, eventType: string): Event<T>;
export declare function fromCallback<T>(fn: (handler: (e: T) => void) => IDisposable): Event<T>;
export declare function fromPromise(promise: TPromise<any>): Event<void>;
export declare function toPromise<T>(event: Event<T>): TPromise<T>;
export declare function delayed<T>(promise: TPromise<Event<T>>): Event<T>;
export declare function once<T>(event: Event<T>): Event<T>;
export declare function any<T>(...events: Event<T>[]): Event<T>;
export declare function debounceEvent<T>(event: Event<T>, merger: (last: T, event: T) => T, delay?: number, leading?: boolean): Event<T>;
export declare function debounceEvent<I, O>(event: Event<I>, merger: (last: O, event: I) => O, delay?: number, leading?: boolean): Event<O>;
/**
 * The EventDelayer is useful in situations in which you want
 * to delay firing your events during some code.
 * You can wrap that code and be sure that the event will not
 * be fired during that wrap.
 *
 * ```
 * const emitter: Emitter;
 * const delayer = new EventDelayer();
 * const delayedEvent = delayer.wrapEvent(emitter.event);
 *
 * delayedEvent(console.log);
 *
 * delayer.bufferEvents(() => {
 *   emitter.fire(); // event will not be fired yet
 * });
 *
 * // event will only be fired at this point
 * ```
 */
export declare class EventBufferer {
    private buffers;
    wrapEvent<T>(event: Event<T>): Event<T>;
    bufferEvents(fn: () => void): void;
}
export interface IChainableEvent<T> {
    event: Event<T>;
    map<O>(fn: (i: T) => O): IChainableEvent<O>;
    filter(fn: (e: T) => boolean): IChainableEvent<T>;
    on(listener: (e: T) => any, thisArgs?: any, disposables?: IDisposable[]): IDisposable;
}
export declare function mapEvent<I, O>(event: Event<I>, map: (i: I) => O): Event<O>;
export declare function filterEvent<T>(event: Event<T>, filter: (e: T) => boolean): Event<T>;
export declare function chain<T>(event: Event<T>): IChainableEvent<T>;
export declare function stopwatch<T>(event: Event<T>): Event<number>;
/**
 * Buffers the provided event until a first listener comes
 * along, at which point fire all the events at once and
 * pipe the event from then on.
 *
 * ```typescript
 * const emitter = new Emitter<number>();
 * const event = emitter.event;
 * const bufferedEvent = buffer(event);
 *
 * emitter.fire(1);
 * emitter.fire(2);
 * emitter.fire(3);
 * // nothing...
 *
 * const listener = bufferedEvent(num => console.log(num));
 * // 1, 2, 3
 *
 * emitter.fire(4);
 * // 4
 * ```
 */
export declare function buffer<T>(event: Event<T>, nextTick?: boolean, buffer?: T[]): Event<T>;
/**
 * Similar to `buffer` but it buffers indefinitely and repeats
 * the buffered events to every new listener.
 */
export declare function echo<T>(event: Event<T>, nextTick?: boolean, buffer?: T[]): Event<T>;
