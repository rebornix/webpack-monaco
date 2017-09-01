import URI from 'vs/base/common/uri';
import { TPromise } from 'vs/base/common/winjs.base';
export declare const IOpenerService: {
    (...args: any[]): void;
    type: IOpenerService;
};
export interface IOpenerService {
    _serviceBrand: any;
    /**
     * Opens a resource, like a webadress, a document uri, or executes command.
     *
     * @param resource A resource
     * @return A promise that resolves when the opening is done.
     */
    open(resource: URI, options?: {
        openToSide?: boolean;
    }): TPromise<any>;
}
export declare const NullOpenerService: IOpenerService;
