import stream = require('stream');
import { TPromise } from 'vs/base/common/winjs.base';
export interface ReadResult {
    buffer: NodeBuffer;
    bytesRead: number;
}
/**
 * Reads up to total bytes from the provided stream.
 */
export declare function readExactlyByStream(stream: stream.Readable, totalBytes: number): TPromise<ReadResult>;
/**
 * Reads totalBytes from the provided file.
 */
export declare function readExactlyByFile(file: string, totalBytes: number): TPromise<ReadResult>;
/**
 * Reads a file until a matching string is found.
 *
 * @param file The file to read.
 * @param matchingString The string to search for.
 * @param chunkBytes The number of bytes to read each iteration.
 * @param maximumBytesToRead The maximum number of bytes to read before giving up.
 * @param callback The finished callback.
 */
export declare function readToMatchingString(file: string, matchingString: string, chunkBytes: number, maximumBytesToRead: number): TPromise<string>;
