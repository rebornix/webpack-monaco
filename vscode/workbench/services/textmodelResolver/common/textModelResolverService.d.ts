import { TPromise } from 'vs/base/common/winjs.base';
import URI from 'vs/base/common/uri';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { IDisposable, IReference } from 'vs/base/common/lifecycle';
import { IModelService } from 'vs/editor/common/services/modelService';
import { ITextFileService } from 'vs/workbench/services/textfile/common/textfiles';
import { ITextModelService, ITextModelContentProvider, ITextEditorModel } from 'vs/editor/common/services/resolverService';
import { IUntitledEditorService } from 'vs/workbench/services/untitled/common/untitledEditorService';
export declare class TextModelResolverService implements ITextModelService {
    private textFileService;
    private untitledEditorService;
    private instantiationService;
    private modelService;
    _serviceBrand: any;
    private resourceModelCollection;
    constructor(textFileService: ITextFileService, untitledEditorService: IUntitledEditorService, instantiationService: IInstantiationService, modelService: IModelService);
    createModelReference(resource: URI): TPromise<IReference<ITextEditorModel>>;
    private _createModelReference(resource);
    registerTextModelContentProvider(scheme: string, provider: ITextModelContentProvider): IDisposable;
}
