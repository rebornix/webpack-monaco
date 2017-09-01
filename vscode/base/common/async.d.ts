import { Promise, TPromise } from 'vs/base/common/winjs.base';
import { CancellationToken } from 'vs/base/common/cancellation';
import { Disposable, IDisposable } from 'vs/base/common/lifecycle';
import Event from 'vs/base/common/event';
export declare function toThenable<T>(arg: T | Thenable<T>): Thenable<T>;
export declare function asWinJsPromise<T>(callback: (token: CancellationToken) => T | TPromise<T> | Thenable<T>): TPromise<T>;
/**
 * Hook a cancellation token to a WinJS Promise
 */
export declare function wireCancellationToken<T>(token: CancellationToken, promise: TPromise<T>, resolveAsUndefinedWhenCancelled?: boolean): Thenable<T>;
export interface ITask<T> {
    (): T;
}
/**
 * A helper to prevent accumulation of sequential async tasks.
 *
 * Imagine a mail man with the sole task of delivering letters. As soon as
 * a letter submitted for delivery, he drives to the destination, delivers it
 * and returns to his base. Imagine that during the trip, N more letters were submitted.
 * When the mail man returns, he picks those N letters and delivers them all in a
 * single trip. Even though N+1 submissions occurred, only 2 deliveries were made.
 *
 * The throttler implements this via the queue() method, by providing it a task
 * factory. Following the example:
 *
 * 		const throttler = new Throttler();
 * 		const letters = [];
 *
 * 		function deliver() {
 * 			const lettersToDeliver = letters;
 * 			letters = [];
 * 			return makeTheTrip(lettersToDeliver);
 * 		}
 *
 * 		function onLetterReceived(l) {
 * 			letters.push(l);
 * 			throttler.queue(deliver);
 * 		}
 */
export declare class Throttler {
    private activePromise;
    private queuedPromise;
    private queuedPromiseFactory;
    constructor();
    queue<T>(promiseFactory: ITask<TPromise<T>>): TPromise<T>;
}
export declare class SimpleThrottler {
    private current;
    queue<T>(promiseTask: ITask<TPromise<T>>): TPromise<T>;
}
/**
 * A helper to delay execution of a task that is being requested often.
 *
 * Following the throttler, now imagine the mail man wants to optimize the number of
 * trips proactively. The trip itself can be long, so the he decides not to make the trip
 * as soon as a letter is submitted. Instead he waits a while, in case more
 * letters are submitted. After said waiting period, if no letters were submitted, he
 * decides to make the trip. Imagine that N more letters were submitted after the first
 * one, all within a short period of time between each other. Even though N+1
 * submissions occurred, only 1 delivery was made.
 *
 * The delayer offers this behavior via the trigger() method, into which both the task
 * to be executed and the waiting period (delay) must be passed in as arguments. Following
 * the example:
 *
 * 		const delayer = new Delayer(WAITING_PERIOD);
 * 		const letters = [];
 *
 * 		function letterReceived(l) {
 * 			letters.push(l);
 * 			delayer.trigger(() => { return makeTheTrip(); });
 * 		}
 */
export declare class Delayer<T> {
    defaultDelay: number;
    private timeout;
    private completionPromise;
    private onSuccess;
    private task;
    constructor(defaultDelay: number);
    trigger(task: ITask<T>, delay?: number): TPromise<T>;
    isTriggered(): boolean;
    cancel(): void;
    private cancelTimeout();
}
/**
 * A helper to delay execution of a task that is being requested often, while
 * preventing accumulation of consecutive executions, while the task runs.
 *
 * Simply combine the two mail man strategies from the Throttler and Delayer
 * helpers, for an analogy.
 */
export declare class ThrottledDelayer<T> extends Delayer<TPromise<T>> {
    private throttler;
    constructor(defaultDelay: number);
    trigger(promiseFactory: ITask<TPromise<T>>, delay?: number): Promise;
}
/**
 * Similar to the ThrottledDelayer, except it also guarantees that the promise
 * factory doesn't get called more often than every `minimumPeriod` milliseconds.
 */
export declare class PeriodThrottledDelayer<T> extends ThrottledDelayer<T> {
    private minimumPeriod;
    private periodThrottler;
    constructor(defaultDelay: number, minimumPeriod?: number);
    trigger(promiseFactory: ITask<TPromise<T>>, delay?: number): Promise;
}
export declare class PromiseSource<T> {
    private _value;
    private _completeCallback;
    private _errorCallback;
    constructor();
    readonly value: TPromise<T>;
    complete(value?: T): void;
    error(err?: any): void;
}
export declare class ShallowCancelThenPromise<T> extends TPromise<T> {
    constructor(outer: TPromise<T>);
}
/**
 * Returns a new promise that joins the provided promise. Upon completion of
 * the provided promise the provided function will always be called. This
 * method is comparable to a try-finally code block.
 * @param promise a promise
 * @param f a function that will be call in the success and error case.
 */
export declare function always<T>(promise: TPromise<T>, f: Function): TPromise<T>;
/**
 * Runs the provided list of promise factories in sequential order. The returned
 * promise will complete to an array of results from each promise.
 */
export declare function sequence<T>(promiseFactories: ITask<TPromise<T>>[]): TPromise<T[]>;
export declare function first<T>(promiseFactories: ITask<TPromise<T>>[], shouldStop?: (t: T) => boolean): TPromise<T>;
/**
 * A helper to queue N promises and run them all with a max degree of parallelism. The helper
 * ensures that at any time no more than M promises are running at the same time.
 */
export declare class Limiter<T> {
    private runningPromises;
    private maxDegreeOfParalellism;
    private outstandingPromises;
    private _onFinished;
    constructor(maxDegreeOfParalellism: number);
    readonly onFinished: Event<void>;
    queue(promiseFactory: ITask<Promise>): Promise;
    private consume();
    private consumed();
    dispose(): void;
}
/**
 * A queue is handles one promise at a time and guarantees that at any time only one promise is executing.
 */
export declare class Queue<T> extends Limiter<T> {
    constructor();
}
export declare function setDisposableTimeout(handler: Function, timeout: number, ...args: any[]): IDisposable;
export declare class TimeoutTimer extends Disposable {
    private _token;
    constructor();
    dispose(): void;
    cancel(): void;
    cancelAndSet(runner: () => void, timeout: number): void;
    setIfNotSet(runner: () => void, timeout: number): void;
}
export declare class IntervalTimer extends Disposable {
    private _token;
    constructor();
    dispose(): void;
    cancel(): void;
    cancelAndSet(runner: () => void, interval: number): void;
}
export declare class RunOnceScheduler {
    private timeoutToken;
    private runner;
    private timeout;
    private timeoutHandler;
    constructor(runner: () => void, timeout: number);
    /**
     * Dispose RunOnceScheduler
     */
    dispose(): void;
    /**
     * Cancel current scheduled runner (if any).
     */
    cancel(): void;
    /**
     * Replace runner. If there is a runner already scheduled, the new runner will be called.
     */
    setRunner(runner: () => void): void;
    /**
     * Cancel previous runner (if any) & schedule a new runner.
     */
    schedule(delay?: number): void;
    /**
     * Returns true if scheduled.
     */
    isScheduled(): boolean;
    private onTimeout();
}
export declare function nfcall(fn: Function, ...args: any[]): Promise;
export declare function nfcall<T>(fn: Function, ...args: any[]): TPromise<T>;
export declare function ninvoke(thisArg: any, fn: Function, ...args: any[]): Promise;
export declare function ninvoke<T>(thisArg: any, fn: Function, ...args: any[]): TPromise<T>;
