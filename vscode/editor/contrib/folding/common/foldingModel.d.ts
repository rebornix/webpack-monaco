import * as editorCommon from 'vs/editor/common/editorCommon';
import { Range } from 'vs/editor/common/core/range';
export interface IFoldingRange {
    startLineNumber: number;
    endLineNumber: number;
    indent: number;
    isCollapsed?: boolean;
}
export declare function toString(range: IFoldingRange): string;
export declare class CollapsibleRegion {
    private decorationIds;
    private _isCollapsed;
    private _indent;
    private _lastRange;
    constructor(range: IFoldingRange, model: editorCommon.IModel, changeAccessor: editorCommon.IModelDecorationsChangeAccessor);
    readonly isCollapsed: boolean;
    readonly isExpanded: boolean;
    readonly indent: number;
    readonly foldingRange: IFoldingRange;
    readonly startLineNumber: number;
    readonly endLineNumber: number;
    setCollapsed(isCollaped: boolean, changeAccessor: editorCommon.IModelDecorationsChangeAccessor): void;
    getDecorationRange(model: editorCommon.IModel): Range;
    private static _COLLAPSED_VISUAL_DECORATION;
    private static _EXPANDED_VISUAL_DECORATION;
    private getVisualDecorationOptions();
    private static _RANGE_DECORATION;
    private getRangeDecorationOptions();
    update(newRange: IFoldingRange, model: editorCommon.IModel, changeAccessor: editorCommon.IModelDecorationsChangeAccessor): void;
    dispose(changeAccessor: editorCommon.IModelDecorationsChangeAccessor): void;
    toString(): string;
}
export declare function getCollapsibleRegionsToFoldAtLine(allRegions: CollapsibleRegion[], model: editorCommon.IModel, lineNumber: number, levels: number, up: boolean): CollapsibleRegion[];
export declare function getCollapsibleRegionsToUnfoldAtLine(allRegions: CollapsibleRegion[], model: editorCommon.IModel, lineNumber: number, levels: number): CollapsibleRegion[];
export declare function doesLineBelongsToCollapsibleRegion(range: IFoldingRange | Range, lineNumber: number): boolean;
