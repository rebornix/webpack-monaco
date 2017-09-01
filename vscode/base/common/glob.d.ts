import { TPromise } from 'vs/base/common/winjs.base';
export interface IExpression {
    [pattern: string]: boolean | SiblingClause | any;
}
export declare function getEmptyExpression(): IExpression;
export declare function mergeExpressions(...expressions: IExpression[]): IExpression;
export interface SiblingClause {
    when: string;
}
export declare function splitGlobAware(pattern: string, splitChar: string): string[];
export declare type ParsedPattern = (path: string, basename?: string) => boolean;
export declare type ParsedExpression = (path: string, basename?: string, siblingsFn?: () => string[] | TPromise<string[]>) => string | TPromise<string>;
export interface IGlobOptions {
    /**
     * Simplify patterns for use as exclusion filters during tree traversal to skip entire subtrees. Cannot be used outside of a tree traversal.
     */
    trimForExclusions?: boolean;
}
/**
 * Simplified glob matching. Supports a subset of glob patterns:
 * - * matches anything inside a path segment
 * - ? matches 1 character inside a path segment
 * - ** matches anything including an empty path segment
 * - simple brace expansion ({js,ts} => js or ts)
 * - character ranges (using [...])
 */
export declare function match(pattern: string, path: string): boolean;
export declare function match(expression: IExpression, path: string, siblingsFn?: () => string[]): string;
/**
 * Simplified glob matching. Supports a subset of glob patterns:
 * - * matches anything inside a path segment
 * - ? matches 1 character inside a path segment
 * - ** matches anything including an empty path segment
 * - simple brace expansion ({js,ts} => js or ts)
 * - character ranges (using [...])
 */
export declare function parse(pattern: string, options?: IGlobOptions): ParsedPattern;
export declare function parse(expression: IExpression, options?: IGlobOptions): ParsedExpression;
/**
 * Same as `parse`, but the ParsedExpression is guaranteed to return a Promise
 */
export declare function parseToAsync(expression: IExpression, options?: IGlobOptions): ParsedExpression;
export declare function getBasenameTerms(patternOrExpression: ParsedPattern | ParsedExpression): string[];
export declare function getPathTerms(patternOrExpression: ParsedPattern | ParsedExpression): string[];
