import { Agent } from './request';
import { TPromise } from 'vs/base/common/winjs.base';
export interface IOptions {
    proxyUrl?: string;
    strictSSL?: boolean;
}
export declare function getProxyAgent(rawRequestURL: string, options?: IOptions): TPromise<Agent>;
