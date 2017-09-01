import { JSONPath } from 'vs/base/common/json';
import { Edit, FormattingOptions } from 'vs/base/common/jsonFormatter';
export declare function removeProperty(text: string, path: JSONPath, formattingOptions: FormattingOptions): Edit[];
export declare function setProperty(text: string, path: JSONPath, value: any, formattingOptions: FormattingOptions, getInsertionIndex?: (properties: string[]) => number): Edit[];
