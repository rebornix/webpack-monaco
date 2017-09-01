import { ParsedArgs } from 'vs/platform/environment/common/environment';
export declare function validatePaths(args: ParsedArgs): ParsedArgs;
export interface IPathWithLineAndColumn {
    path: string;
    line?: number;
    column?: number;
}
export declare function parseLineAndColumnAware(rawPath: string): IPathWithLineAndColumn;
