/**
 * Convenient way to iterate over output line by line. This helper accommodates for the fact that
 * a buffer might not end with new lines all the way.
 *
 * To use:
 * - call the write method
 * - forEach() over the result to get the lines
 */
export declare class LineDecoder {
    private stringDecoder;
    private remaining;
    constructor(encoding?: string);
    write(buffer: NodeBuffer): string[];
    end(): string;
}
