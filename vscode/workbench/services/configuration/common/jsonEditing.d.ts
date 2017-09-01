import URI from 'vs/base/common/uri';
import { TPromise } from 'vs/base/common/winjs.base';
import { ServiceIdentifier } from 'vs/platform/instantiation/common/instantiation';
export declare const IJSONEditingService: {
    (...args: any[]): void;
    type: IJSONEditingService;
};
export declare enum JSONEditingErrorCode {
    /**
     * Error when trying to write and save to the file while it is dirty in the editor.
     */
    ERROR_FILE_DIRTY = 0,
    /**
     * Error when trying to write to a file that contains JSON errors.
     */
    ERROR_INVALID_FILE = 1,
}
export declare class JSONEditingError extends Error {
    code: JSONEditingErrorCode;
    constructor(message: string, code: JSONEditingErrorCode);
}
export interface IJSONValue {
    key: string;
    value: any;
}
export interface IJSONEditingService {
    _serviceBrand: ServiceIdentifier<any>;
    write(resource: URI, value: IJSONValue, save: boolean): TPromise<void>;
}
