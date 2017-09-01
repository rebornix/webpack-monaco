export declare const MIME_TEXT = "text/plain";
export declare const MIME_BINARY = "application/octet-stream";
export declare const MIME_UNKNOWN = "application/unknown";
export interface ITextMimeAssociation {
    id: string;
    mime: string;
    filename?: string;
    extension?: string;
    filepattern?: string;
    firstline?: RegExp;
    userConfigured?: boolean;
}
/**
 * Associate a text mime to the registry.
 */
export declare function registerTextMime(association: ITextMimeAssociation): void;
/**
 * Clear text mimes from the registry.
 */
export declare function clearTextMimes(onlyUserConfigured?: boolean): void;
/**
 * Given a file, return the best matching mime type for it
 */
export declare function guessMimeTypes(path: string, firstLine?: string): string[];
export declare function isBinaryMime(mimes: string): boolean;
export declare function isBinaryMime(mimes: string[]): boolean;
export declare function isUnspecific(mime: string[] | string): boolean;
export declare function suggestFilename(langId: string, prefix: string): string;
