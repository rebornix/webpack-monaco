import streams = require('stream');
import { TPromise } from 'vs/base/common/winjs.base';
import stream = require('vs/base/node/stream');
export interface IMimeAndEncoding {
    encoding: string;
    mimes: string[];
}
export interface DetectMimesOption {
    autoGuessEncoding?: boolean;
}
export declare function detectMimeAndEncodingFromBuffer(readResult: stream.ReadResult, autoGuessEncoding?: false): IMimeAndEncoding;
export declare function detectMimeAndEncodingFromBuffer(readResult: stream.ReadResult, autoGuessEncoding?: boolean): TPromise<IMimeAndEncoding>;
/**
 * Opens the given stream to detect its mime type. Returns an array of mime types sorted from most specific to unspecific.
 * @param instream the readable stream to detect the mime types from.
 * @param nameHint an additional hint that can be used to detect a mime from a file extension.
 */
export declare function detectMimesFromStream(instream: streams.Readable, nameHint: string, option?: DetectMimesOption): TPromise<IMimeAndEncoding>;
/**
 * Opens the given file to detect its mime type. Returns an array of mime types sorted from most specific to unspecific.
 * @param absolutePath the absolute path of the file.
 */
export declare function detectMimesFromFile(absolutePath: string, option?: DetectMimesOption): TPromise<IMimeAndEncoding>;
