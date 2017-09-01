import { TPromise } from 'vs/base/common/winjs.base';
import { IRequestOptions, IRequestContext } from 'vs/base/node/request';
import { RequestService as NodeRequestService } from 'vs/platform/request/node/requestService';
export declare class RequestService extends NodeRequestService {
    request(options: IRequestOptions): TPromise<IRequestContext>;
}
