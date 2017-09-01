import { TPromise } from 'vs/base/common/winjs.base';
import { IColorRange } from 'vs/editor/common/modes';
import { IReadOnlyModel } from 'vs/editor/common/editorCommon';
export declare function getColors(model: IReadOnlyModel): TPromise<IColorRange[]>;
