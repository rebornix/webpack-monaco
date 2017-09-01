import { IDisposable } from 'vs/base/common/lifecycle';
import { Range } from 'vs/editor/common/core/range';
import * as editorCommon from 'vs/editor/common/editorCommon';
import { InlineDecoration, ViewModelDecoration, ICoordinatesConverter } from 'vs/editor/common/viewModel/viewModel';
import { IModelDecorationsChangedEvent } from 'vs/editor/common/model/textModelEvents';
export interface IDecorationsViewportData {
    /**
     * decorations in the viewport.
     */
    readonly decorations: ViewModelDecoration[];
    /**
     * inline decorations grouped by each line in the viewport.
     */
    readonly inlineDecorations: InlineDecoration[][];
}
export declare class ViewModelDecorations implements IDisposable {
    private readonly editorId;
    private readonly model;
    private readonly configuration;
    private readonly _coordinatesConverter;
    private _decorationsCache;
    private _cachedModelDecorationsResolver;
    private _cachedModelDecorationsResolverViewRange;
    constructor(editorId: number, model: editorCommon.IModel, configuration: editorCommon.IConfiguration, coordinatesConverter: ICoordinatesConverter);
    private _clearCachedModelDecorationsResolver();
    dispose(): void;
    reset(): void;
    onModelDecorationsChanged(e: IModelDecorationsChangedEvent): void;
    onLineMappingChanged(): void;
    private _getOrCreateViewModelDecoration(modelDecoration);
    getAllOverviewRulerDecorations(): ViewModelDecoration[];
    getDecorationsViewportData(viewRange: Range): IDecorationsViewportData;
    private _getDecorationsViewportData(viewportRange);
}
