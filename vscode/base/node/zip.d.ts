import { TPromise } from 'vs/base/common/winjs.base';
export interface IExtractOptions {
    overwrite?: boolean;
    /**
     * Source path within the ZIP archive. Only the files contained in this
     * path will be extracted.
     */
    sourcePath?: string;
}
export declare function extract(zipPath: string, targetPath: string, options?: IExtractOptions): TPromise<void>;
export declare function buffer(zipPath: string, filePath: string): TPromise<Buffer>;
