import { EventEmitter } from 'events';
import { ILineMatch, ISearchLog } from 'vs/platform/search/common/search';
import { ISerializedFileMatch, ISerializedSearchComplete, IRawSearch } from './search';
export declare class RipgrepEngine {
    private config;
    private isDone;
    private rgProc;
    private postProcessExclusions;
    private ripgrepParser;
    private resultsHandledP;
    constructor(config: IRawSearch);
    cancel(): void;
    search(onResult: (match: ISerializedFileMatch) => void, onMessage: (message: ISearchLog) => void, done: (error: Error, complete: ISerializedSearchComplete) => void): void;
    /**
     * Read the first line of stderr and return an error for display or undefined, based on a whitelist.
     * Ripgrep produces stderr output which is not from a fatal error, and we only want the search to be
     * "failed" when a fatal error was produced.
     */
    private rgErrorMsgForDisplay(msg);
}
export declare class RipgrepParser extends EventEmitter {
    private maxResults;
    private rootFolder;
    private static RESULT_REGEX;
    private static FILE_REGEX;
    static MATCH_START_MARKER: string;
    static MATCH_END_MARKER: string;
    private fileMatch;
    private remainder;
    private isDone;
    private stringDecoder;
    private numResults;
    constructor(maxResults: number, rootFolder: string);
    cancel(): void;
    flush(): void;
    handleData(data: Buffer | string): void;
    private handleDecodedData(decodedData);
    private handleMatchLine(outputLine, lineNum, text);
    private onResult();
}
export declare class FileMatch implements ISerializedFileMatch {
    path: string;
    lineMatches: LineMatch[];
    constructor(path: string);
    addMatch(lineMatch: LineMatch): void;
    isEmpty(): boolean;
    serialize(): ISerializedFileMatch;
}
export declare class LineMatch implements ILineMatch {
    preview: string;
    lineNumber: number;
    offsetAndLengths: number[][];
    constructor(preview: string, lineNumber: number);
    getText(): string;
    getLineNumber(): number;
    addMatch(offset: number, length: number): void;
    serialize(): ILineMatch;
}
/**
 * Resolves a glob like "node_modules/**" in "/foo/bar" to "/foo/bar/node_modules/**".
 * Special cases C:/foo paths to write the glob like /foo instead - see https://github.com/BurntSushi/ripgrep/issues/530.
 *
 * Exported for testing
 */
export declare function getAbsoluteGlob(folder: string, key: string): string;
export declare function fixDriveC(path: string): string;
