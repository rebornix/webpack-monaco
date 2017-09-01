import { TPromise } from 'vs/base/common/winjs.base';
import { IRequestOptions, IRequestContext, IRequestFunction } from 'vs/base/node/request';
import { IRequestService } from 'vs/platform/request/node/request';
import { IConfigurationService } from 'vs/platform/configuration/common/configuration';
/**
 * This service exposes the `request` API, while using the global
 * or configured proxy settings.
 */
export declare class RequestService implements IRequestService {
    _serviceBrand: any;
    private proxyUrl;
    private strictSSL;
    private authorization;
    private disposables;
    constructor(configurationService: IConfigurationService);
    private configure(config);
    request(options: IRequestOptions, requestFn?: IRequestFunction): TPromise<IRequestContext>;
}
