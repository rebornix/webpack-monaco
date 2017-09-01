import { TPromise } from 'vs/base/common/winjs.base';
import { IModel } from 'vs/editor/common/editorCommon';
import { CodeLensProvider, ICodeLensSymbol } from 'vs/editor/common/modes';
export interface ICodeLensData {
    symbol: ICodeLensSymbol;
    provider: CodeLensProvider;
}
export declare function getCodeLensData(model: IModel): TPromise<ICodeLensData[]>;
