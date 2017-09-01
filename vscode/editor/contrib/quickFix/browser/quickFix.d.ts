import { IReadOnlyModel } from 'vs/editor/common/editorCommon';
import { Range } from 'vs/editor/common/core/range';
import { Command } from 'vs/editor/common/modes';
import { TPromise } from 'vs/base/common/winjs.base';
export declare function getCodeActions(model: IReadOnlyModel, range: Range): TPromise<Command[]>;
