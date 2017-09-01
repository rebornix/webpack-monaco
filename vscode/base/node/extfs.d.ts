export declare function readdirSync(path: string): string[];
export declare function readdir(path: string, callback: (error: Error, files: string[]) => void): void;
export declare function mkdirp(path: string, mode: number, callback: (error: Error) => void): void;
export declare function copy(source: string, target: string, callback: (error: Error) => void, copiedSources?: {
    [path: string]: boolean;
}): void;
export declare function del(path: string, tmpFolder: string, callback: (error: Error) => void, done?: (error: Error) => void): void;
export declare function delSync(path: string): void;
export declare function mv(source: string, target: string, callback: (error: Error) => void): void;
export declare function writeFileAndFlush(path: string, data: string | NodeBuffer, options: {
    mode?: number;
    flag?: string;
}, callback: (error: Error) => void): void;
/**
 * Copied from: https://github.com/Microsoft/vscode-node-debug/blob/master/src/node/pathUtilities.ts#L83
 *
 * Given an absolute, normalized, and existing file path 'realcase' returns the exact path that the file has on disk.
 * On a case insensitive file system, the returned path might differ from the original path by character casing.
 * On a case sensitive file system, the returned path will always be identical to the original path.
 * In case of errors, null is returned. But you cannot use this function to verify that a path exists.
 * realcaseSync does not handle '..' or '.' path segments and it does not take the locale into account.
 */
export declare function realcaseSync(path: string): string;
export declare function realpathSync(path: string): string;
export declare function realpath(path: string, callback: (error: Error, realpath: string) => void): void;
