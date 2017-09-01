import { TPromise } from 'vs/base/common/winjs.base';
import { IRequestOptions, IRequestContext, IRequestFunction } from 'vs/base/node/request';
import { RequestService as NodeRequestService } from 'vs/platform/request/node/requestService';
/**
 * This service exposes the `request` API, while using the global
 * or configured proxy settings.
 */
export declare class RequestService extends NodeRequestService {
    request(options: IRequestOptions): TPromise<IRequestContext>;
}
export declare const xhrRequest: IRequestFunction;
