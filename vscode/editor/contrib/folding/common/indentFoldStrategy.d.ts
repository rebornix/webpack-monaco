import { IModel } from 'vs/editor/common/editorCommon';
import { IFoldingRange } from 'vs/editor/contrib/folding/common/foldingModel';
export declare function computeRanges(model: IModel): IFoldingRange[];
/**
 * Limits the number of folding ranges by removing ranges with larger indent levels
 */
export declare function limitByIndent(ranges: IFoldingRange[], maxEntries: number): IFoldingRange[];
