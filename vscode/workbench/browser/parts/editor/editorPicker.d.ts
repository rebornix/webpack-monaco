import 'vs/css!./media/editorpicker';
import { TPromise } from 'vs/base/common/winjs.base';
import URI from 'vs/base/common/uri';
import { IIconLabelOptions } from 'vs/base/browser/ui/iconLabel/iconLabel';
import { IAutoFocus, Mode, IEntryRunContext, IQuickNavigateConfiguration, IModel } from 'vs/base/parts/quickopen/common/quickOpen';
import { QuickOpenModel, QuickOpenEntry, QuickOpenEntryGroup } from 'vs/base/parts/quickopen/browser/quickOpenModel';
import { IModeService } from 'vs/editor/common/services/modeService';
import { IModelService } from 'vs/editor/common/services/modelService';
import { QuickOpenHandler } from 'vs/workbench/browser/quickopen';
import { Position } from 'vs/platform/editor/common/editor';
import { IEditorGroupService } from 'vs/workbench/services/group/common/groupService';
import { IWorkbenchEditorService } from 'vs/workbench/services/editor/common/editorService';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { IWorkspaceContextService } from 'vs/platform/workspace/common/workspace';
import { EditorInput, IEditorGroup } from 'vs/workbench/common/editor';
export declare class EditorPickerEntry extends QuickOpenEntryGroup {
    private editor;
    private _group;
    private editorService;
    private modeService;
    private modelService;
    private stacks;
    constructor(editor: EditorInput, _group: IEditorGroup, editorService: IWorkbenchEditorService, modeService: IModeService, modelService: IModelService, editorGroupService: IEditorGroupService);
    getLabelOptions(): IIconLabelOptions;
    getLabel(): string;
    getIcon(): string;
    readonly group: IEditorGroup;
    getResource(): URI;
    getAriaLabel(): string;
    getDescription(): string;
    run(mode: Mode, context: IEntryRunContext): boolean;
    private runOpen(context);
}
export declare abstract class BaseEditorPicker extends QuickOpenHandler {
    protected instantiationService: IInstantiationService;
    private contextService;
    protected editorService: IWorkbenchEditorService;
    protected editorGroupService: IEditorGroupService;
    private scorerCache;
    constructor(instantiationService: IInstantiationService, contextService: IWorkspaceContextService, editorService: IWorkbenchEditorService, editorGroupService: IEditorGroupService);
    getResults(searchValue: string): TPromise<QuickOpenModel>;
    onClose(canceled: boolean): void;
    protected abstract getEditorEntries(): EditorPickerEntry[];
}
export declare abstract class EditorGroupPicker extends BaseEditorPicker {
    protected getEditorEntries(): EditorPickerEntry[];
    protected abstract getPosition(): Position;
    getEmptyLabel(searchString: string): string;
    getAutoFocus(searchValue: string, context: {
        model: IModel<QuickOpenEntry>;
        quickNavigateConfiguration?: IQuickNavigateConfiguration;
    }): IAutoFocus;
}
export declare class GroupOnePicker extends EditorGroupPicker {
    protected getPosition(): Position;
}
export declare class GroupTwoPicker extends EditorGroupPicker {
    protected getPosition(): Position;
}
export declare class GroupThreePicker extends EditorGroupPicker {
    protected getPosition(): Position;
}
export declare class AllEditorsPicker extends BaseEditorPicker {
    protected getEditorEntries(): EditorPickerEntry[];
    getEmptyLabel(searchString: string): string;
    getAutoFocus(searchValue: string, context: {
        model: IModel<QuickOpenEntry>;
        quickNavigateConfiguration?: IQuickNavigateConfiguration;
    }): IAutoFocus;
}
