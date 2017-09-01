import { ViewEventHandler } from 'vs/editor/common/viewModel/viewEventHandler';
import { ViewEvent } from 'vs/editor/common/view/viewEvents';
export declare class ViewEventDispatcher {
    private _eventHandlerGateKeeper;
    private _eventHandlers;
    private _eventQueue;
    private _isConsumingQueue;
    constructor(eventHandlerGateKeeper: (callback: () => void) => void);
    addEventHandler(eventHandler: ViewEventHandler): void;
    removeEventHandler(eventHandler: ViewEventHandler): void;
    emit(event: ViewEvent): void;
    emitMany(events: ViewEvent[]): void;
    private consumeQueue();
    private _doConsumeQueue();
}
