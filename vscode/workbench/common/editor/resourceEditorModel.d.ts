import { BaseTextEditorModel } from 'vs/workbench/common/editor/textEditorModel';
import URI from 'vs/base/common/uri';
import { IModeService } from 'vs/editor/common/services/modeService';
import { IModelService } from 'vs/editor/common/services/modelService';
/**
 * An editor model whith an in-memory, readonly content that is backed by an existing editor model.
 */
export declare class ResourceEditorModel extends BaseTextEditorModel {
    constructor(resource: URI, modeService: IModeService, modelService: IModelService);
}
