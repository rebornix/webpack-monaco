import URI from 'vs/base/common/uri';
import { TPromise } from 'vs/base/common/winjs.base';
import { Range } from 'vs/editor/common/core/range';
import { IModelService } from 'vs/editor/common/services/modelService';
import { Position } from 'vs/editor/common/core/position';
/**
 * Interface used to compute a hierachry of logical ranges.
 */
export interface ILogicalSelectionEntry {
    type: string;
    range: Range;
}
export declare class TokenSelectionSupport {
    private _modelService;
    constructor(modelService: IModelService);
    getRangesToPosition(resource: URI, position: Position): TPromise<ILogicalSelectionEntry[]>;
    getRangesToPositionSync(resource: URI, position: Position): ILogicalSelectionEntry[];
    private _doGetRangesToPosition(model, position);
}
