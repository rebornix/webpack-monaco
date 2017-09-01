import { TPromise } from 'vs/base/common/winjs.base';
import http = require('http');
import { Stream } from 'stream';
export declare type Agent = any;
export interface IRawRequestFunction {
    (options: http.RequestOptions, callback?: (res: http.IncomingMessage) => void): http.ClientRequest;
}
export interface IRequestOptions {
    type?: string;
    url?: string;
    user?: string;
    password?: string;
    headers?: any;
    timeout?: number;
    data?: any;
    agent?: Agent;
    followRedirects?: number;
    strictSSL?: boolean;
    getRawRequest?(options: IRequestOptions): IRawRequestFunction;
}
export interface IRequestContext {
    res: {
        headers: {
            [n: string]: string;
        };
        statusCode?: number;
    };
    stream: Stream;
}
export interface IRequestFunction {
    (options: IRequestOptions): TPromise<IRequestContext>;
}
export declare function request(options: IRequestOptions): TPromise<IRequestContext>;
export declare function download(filePath: string, context: IRequestContext): TPromise<void>;
export declare function asText(context: IRequestContext): TPromise<string>;
export declare function asJson<T>(context: IRequestContext): TPromise<T>;
