import { TPromise } from 'vs/base/common/winjs.base';
export declare const UTF8 = "utf8";
export declare const UTF8_with_bom = "utf8bom";
export declare const UTF16be = "utf16be";
export declare const UTF16le = "utf16le";
export declare function bomLength(encoding: string): number;
export declare function decode(buffer: NodeBuffer, encoding: string, options?: any): string;
export declare function encode(content: string, encoding: string, options?: any): NodeBuffer;
export declare function encodingExists(encoding: string): boolean;
export declare function decodeStream(encoding: string): NodeJS.ReadWriteStream;
export declare function encodeStream(encoding: string): NodeJS.ReadWriteStream;
export declare function detectEncodingByBOMFromBuffer(buffer: NodeBuffer, bytesRead: number): string;
/**
 * Detects the Byte Order Mark in a given file.
 * If no BOM is detected, null will be passed to callback.
 */
export declare function detectEncodingByBOM(file: string): TPromise<string>;
/**
 * Guesses the encoding from buffer.
 */
export declare function guessEncodingByBuffer(buffer: NodeBuffer): TPromise<string>;
/**
 * The encodings that are allowed in a settings file don't match the canonical encoding labels specified by WHATWG.
 * See https://encoding.spec.whatwg.org/#names-and-labels
 * Iconv-lite strips all non-alphanumeric characters, but ripgrep doesn't. For backcompat, allow these labels.
 */
export declare function toCanonicalName(enc: string): string;
