import { TPromise } from 'vs/base/common/winjs.base';
import * as fs from 'fs';
export declare function readdir(path: string): TPromise<string[]>;
export declare function exists(path: string): TPromise<boolean>;
export declare function chmod(path: string, mode: number): TPromise<boolean>;
export declare function mkdirp(path: string, mode?: number): TPromise<boolean>;
export declare function rimraf(path: string): TPromise<void>;
export declare function realpath(path: string): TPromise<string>;
export declare function stat(path: string): TPromise<fs.Stats>;
export declare function lstat(path: string): TPromise<fs.Stats>;
export declare function rename(oldPath: string, newPath: string): TPromise<void>;
export declare function rmdir(path: string): TPromise<void>;
export declare function unlink(path: string): TPromise<void>;
export declare function symlink(target: string, path: string, type?: string): TPromise<void>;
export declare function readlink(path: string): TPromise<string>;
export declare function touch(path: string): TPromise<void>;
export declare function truncate(path: string, len: number): TPromise<void>;
export declare function readFile(path: string): TPromise<Buffer>;
export declare function readFile(path: string, encoding: string): TPromise<string>;
export declare function writeFile(path: string, data: string, options?: {
    mode?: number;
    flag?: string;
}): TPromise<void>;
export declare function writeFile(path: string, data: NodeBuffer, options?: {
    mode?: number;
    flag?: string;
}): TPromise<void>;
/**
* Read a dir and return only subfolders
*/
export declare function readDirsInDir(dirPath: string): TPromise<string[]>;
/**
* `path` exists and is a directory
*/
export declare function dirExists(path: string): TPromise<boolean>;
/**
* `path` exists and is a file.
*/
export declare function fileExists(path: string): TPromise<boolean>;
export declare function del(path: string, tmp?: string): TPromise<void>;
