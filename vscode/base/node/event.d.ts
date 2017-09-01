import Event from 'vs/base/common/event';
import { EventEmitter } from 'events';
export declare function fromEventEmitter<T>(emitter: EventEmitter, eventName: string, map?: (...args: any[]) => T): Event<T>;
