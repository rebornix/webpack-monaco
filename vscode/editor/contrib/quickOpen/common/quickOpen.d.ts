import { TPromise } from 'vs/base/common/winjs.base';
import { IModel } from 'vs/editor/common/editorCommon';
import { IOutline } from 'vs/editor/common/modes';
export declare function getDocumentSymbols(model: IModel): TPromise<IOutline>;
