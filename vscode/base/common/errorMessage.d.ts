export interface IXHRResponse {
    responseText: string;
    status: number;
    readyState: number;
    getResponseHeader: (header: string) => string;
}
export interface IConnectionErrorData {
    status: number;
    statusText?: string;
    responseText?: string;
}
/**
 * The base class for all connection errors originating from XHR requests.
 */
export declare class ConnectionError implements Error {
    status: number;
    statusText: string;
    responseText: string;
    errorMessage: string;
    errorCode: string;
    errorObject: any;
    name: string;
    constructor(mixin: IConnectionErrorData);
    constructor(request: IXHRResponse);
    readonly message: string;
    readonly verboseMessage: string;
    private connectionErrorDetailsToMessage(error, verbose);
    private connectionErrorToMessage(error, verbose);
}
/**
 * Tries to generate a human readable error message out of the error. If the verbose parameter
 * is set to true, the error message will include stacktrace details if provided.
 * @returns A string containing the error message.
 */
export declare function toErrorMessage(error?: any, verbose?: boolean): string;
