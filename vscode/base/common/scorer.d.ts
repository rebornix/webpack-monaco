export declare function score(target: string, query: string, cache?: {
    [id: string]: number;
}): number;
/**
 * A fast method to check if a given string would produce a score > 0 for the given query.
 */
export declare function matches(target: string, queryLower: string): boolean;
