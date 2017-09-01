import { TPromise } from 'vs/base/common/winjs.base';
import { IRequestOptions, IRequestContext } from 'vs/base/node/request';
export declare const IRequestService: {
    (...args: any[]): void;
    type: IRequestService;
};
export interface IRequestService {
    _serviceBrand: any;
    request(options: IRequestOptions): TPromise<IRequestContext>;
}
export interface IHTTPConfiguration {
    http?: {
        proxy?: string;
        proxyStrictSSL?: boolean;
        proxyAuthorization?: string;
    };
}
