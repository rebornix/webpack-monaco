import { TPromise } from 'vs/base/common/winjs.base';
import { IReadOnlyModel } from 'vs/editor/common/editorCommon';
import { Hover } from 'vs/editor/common/modes';
import { Position } from 'vs/editor/common/core/position';
export declare function getHover(model: IReadOnlyModel, position: Position): TPromise<Hover[]>;
