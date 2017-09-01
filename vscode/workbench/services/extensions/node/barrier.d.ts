import { TPromise } from 'vs/base/common/winjs.base';
/**
 * A barrier that is initially closed and then becomes opened permanently.
 */
export declare class Barrier {
    private _isOpen;
    private _promise;
    private _completePromise;
    constructor();
    isOpen(): boolean;
    open(): void;
    wait(): TPromise<boolean>;
}
