import Event from 'vs/base/common/event';
import URI from 'vs/base/common/uri';
import { TPromise } from 'vs/base/common/winjs.base';
import { IMarkerService } from 'vs/platform/markers/common/markers';
import * as editorCommon from 'vs/editor/common/editorCommon';
import { IMode } from 'vs/editor/common/modes';
import { IModelService } from 'vs/editor/common/services/modelService';
import { IConfigurationService } from 'vs/platform/configuration/common/configuration';
import { IRawTextSource, ITextSource } from 'vs/editor/common/model/textSource';
export declare class ModelServiceImpl implements IModelService {
    _serviceBrand: any;
    private _markerService;
    private _markerServiceSubscription;
    private _configurationService;
    private _configurationServiceSubscription;
    private _onModelAdded;
    private _onModelRemoved;
    private _onModelModeChanged;
    private _modelCreationOptionsByLanguageAndResource;
    /**
     * All the models known in the system.
     */
    private _models;
    constructor(markerService: IMarkerService, configurationService: IConfigurationService);
    private static _readModelOptions(config);
    getCreationOptions(language: string, resource: URI): editorCommon.ITextModelCreationOptions;
    private _updateModelOptions();
    private static _setModelOptionsForModel(model, newOptions, currentOptions);
    dispose(): void;
    private _handleMarkerChange(changedResources);
    private _cleanUp(model);
    private _createModelData(value, languageIdentifier, resource);
    updateModel(model: editorCommon.IModel, value: string | IRawTextSource): void;
    /**
     * Compute edits to bring `model` to the state of `textSource`.
     */
    static _computeEdits(model: editorCommon.IModel, textSource: ITextSource): editorCommon.IIdentifiedSingleEditOperation[];
    createModel(value: string | IRawTextSource, modeOrPromise: TPromise<IMode> | IMode, resource: URI): editorCommon.IModel;
    setMode(model: editorCommon.IModel, modeOrPromise: TPromise<IMode> | IMode): void;
    destroyModel(resource: URI): void;
    getModels(): editorCommon.IModel[];
    getModel(resource: URI): editorCommon.IModel;
    readonly onModelAdded: Event<editorCommon.IModel>;
    readonly onModelRemoved: Event<editorCommon.IModel>;
    readonly onModelModeChanged: Event<{
        model: editorCommon.IModel;
        oldModeId: string;
    }>;
    private _onModelDisposing(model);
    private _onModelEvents(modelData, events);
}
