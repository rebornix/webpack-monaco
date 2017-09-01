import { TPromise } from 'vs/base/common/winjs.base';
import URI from 'vs/base/common/uri';
import { IWorkbenchEditorService } from 'vs/workbench/services/editor/common/editorService';
import { ITextFileService, ISaveErrorHandler, ITextFileEditorModel } from 'vs/workbench/services/textfile/common/textfiles';
import { IInstantiationService, ServicesAccessor } from 'vs/platform/instantiation/common/instantiation';
import { IMessageService } from 'vs/platform/message/common/message';
import { IModeService } from 'vs/editor/common/services/modeService';
import { IModelService } from 'vs/editor/common/services/modelService';
import { IWorkbenchContribution } from 'vs/workbench/common/contributions';
import { ITextModelService, ITextModelContentProvider } from 'vs/editor/common/services/resolverService';
import { IModel } from 'vs/editor/common/editorCommon';
import { IEditorGroupService } from 'vs/workbench/services/group/common/groupService';
import { IContextKeyService } from 'vs/platform/contextkey/common/contextkey';
export declare const CONFLICT_RESOLUTION_CONTEXT = "saveConflictResolutionContext";
export declare const CONFLICT_RESOLUTION_SCHEME = "conflictResolution";
export declare class SaveErrorHandler implements ISaveErrorHandler, IWorkbenchContribution, ITextModelContentProvider {
    private messageService;
    private textFileService;
    private textModelResolverService;
    private modelService;
    private modeService;
    private instantiationService;
    private editorGroupService;
    private editorService;
    private messages;
    private toUnbind;
    private conflictResolutionContext;
    constructor(messageService: IMessageService, textFileService: ITextFileService, textModelResolverService: ITextModelService, modelService: IModelService, modeService: IModeService, instantiationService: IInstantiationService, editorGroupService: IEditorGroupService, contextKeyService: IContextKeyService, editorService: IWorkbenchEditorService);
    provideTextContent(resource: URI): TPromise<IModel>;
    getId(): string;
    private registerListeners();
    private onEditorsChanged();
    private onFileSavedOrReverted(resource);
    onSaveError(error: any, model: ITextFileEditorModel): void;
    dispose(): void;
}
export declare const acceptLocalChangesCommand: (accessor: ServicesAccessor, resource: URI) => void;
export declare const revertLocalChangesCommand: (accessor: ServicesAccessor, resource: URI) => void;
