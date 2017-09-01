import { IInplaceReplaceSupportResult } from 'vs/editor/common/modes';
import { IRange } from 'vs/editor/common/core/range';
export declare class BasicInplaceReplace {
    static INSTANCE: BasicInplaceReplace;
    navigateValueSet(range1: IRange, text1: string, range2: IRange, text2: string, up: boolean): IInplaceReplaceSupportResult;
    private doNavigateValueSet(text, up);
    private numberReplace(value, up);
    private _defaultValueSet;
    private textReplace(value, up);
    private valueSetsReplace(valueSets, value, up);
    private valueSetReplace(valueSet, value, up);
}
