import Event from 'vs/base/common/event';
export interface CancellationToken {
    readonly isCancellationRequested: boolean;
    /**
     * An event emitted when cancellation is requested
     * @event
     */
    readonly onCancellationRequested: Event<any>;
}
export declare namespace CancellationToken {
    const None: CancellationToken;
    const Cancelled: CancellationToken;
}
export declare class CancellationTokenSource {
    private _token;
    readonly token: CancellationToken;
    cancel(): void;
    dispose(): void;
}
