import { Range } from 'vs/editor/common/core/range';
import { Position } from 'vs/editor/common/core/position';
import { IIdentifiedSingleEditOperation } from 'vs/editor/common/editorCommon';
export declare class EditOperation {
    static insert(position: Position, text: string): IIdentifiedSingleEditOperation;
    static delete(range: Range): IIdentifiedSingleEditOperation;
    static replace(range: Range, text: string): IIdentifiedSingleEditOperation;
    static replaceMove(range: Range, text: string): IIdentifiedSingleEditOperation;
}
