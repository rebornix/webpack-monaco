import 'vs/css!./media/dirtydiffDecorator';
import * as ext from 'vs/workbench/common/contributions';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { IMessageService } from 'vs/platform/message/common/message';
import { IWorkspaceContextService } from 'vs/platform/workspace/common/workspace';
import { IWorkbenchEditorService } from 'vs/workbench/services/editor/common/editorService';
import { IEditorGroupService } from 'vs/workbench/services/group/common/groupService';
export declare const editorGutterModifiedBackground: string;
export declare const editorGutterAddedBackground: string;
export declare const editorGutterDeletedBackground: string;
export declare class DirtyDiffDecorator implements ext.IWorkbenchContribution {
    private messageService;
    private editorService;
    private contextService;
    private instantiationService;
    private models;
    private decorators;
    private toDispose;
    constructor(messageService: IMessageService, editorService: IWorkbenchEditorService, editorGroupService: IEditorGroupService, contextService: IWorkspaceContextService, instantiationService: IInstantiationService);
    getId(): string;
    private onEditorsChanged();
    private onModelVisible(model, uri);
    private onModelInvisible(model);
    dispose(): void;
}
