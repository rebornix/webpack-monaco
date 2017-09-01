/**
 * The forward slash path separator.
 */
export declare const sep = "/";
/**
 * The native path separator depending on the OS.
 */
export declare const nativeSep: string;
export declare function relative(from: string, to: string): string;
/**
 * @returns the directory name of a path.
 */
export declare function dirname(path: string): string;
/**
 * @returns the base name of a path.
 */
export declare function basename(path: string): string;
/**
 * @returns {{.far}} from boo.far or the empty string.
 */
export declare function extname(path: string): string;
export declare function normalize(path: string, toOSPath?: boolean): string;
/**
 * Computes the _root_ this path, like `getRoot('c:\files') === c:\`,
 * `getRoot('files:///files/path') === files:///`,
 * or `getRoot('\\server\shares\path') === \\server\shares\`
 */
export declare function getRoot(path: string, sep?: string): string;
export declare const join: (...parts: string[]) => string;
/**
 * Check if the path follows this pattern: `\\hostname\sharename`.
 *
 * @see https://msdn.microsoft.com/en-us/library/gg465305.aspx
 * @return A boolean indication if the path is a UNC path, on none-windows
 * always false.
 */
export declare function isUNC(path: string): boolean;
export declare function isValidBasename(name: string): boolean;
export declare function isEqual(pathA: string, pathB: string, ignoreCase?: boolean): boolean;
export declare function isEqualOrParent(path: string, candidate: string, ignoreCase?: boolean): boolean;
/**
 * Adapted from Node's path.isAbsolute functions
 */
export declare function isAbsolute(path: string): boolean;
export declare function isAbsolute_win32(path: string): boolean;
export declare function isAbsolute_posix(path: string): boolean;
