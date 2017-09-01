import 'vs/css!./media/editorstatus';
import { TPromise } from 'vs/base/common/winjs.base';
import { IStatusbarItem } from 'vs/workbench/browser/parts/statusbar/statusbar';
import { Action } from 'vs/base/common/actions';
import { IDisposable } from 'vs/base/common/lifecycle';
import { IUntitledEditorService } from 'vs/workbench/services/untitled/common/untitledEditorService';
import { IConfigurationEditingService } from 'vs/workbench/services/configuration/common/configurationEditing';
import { EndOfLineSequence } from 'vs/editor/common/editorCommon';
import { IWorkbenchEditorService } from 'vs/workbench/services/editor/common/editorService';
import { IQuickOpenService, IPickOpenEntry } from 'vs/platform/quickOpen/common/quickOpen';
import { IWorkspaceConfigurationService } from 'vs/workbench/services/configuration/common/configuration';
import { IFileService } from 'vs/platform/files/common/files';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { IModeService } from 'vs/editor/common/services/modeService';
import { IModelService } from 'vs/editor/common/services/modelService';
import { IEditorGroupService } from 'vs/workbench/services/group/common/groupService';
import { ICommandService } from 'vs/platform/commands/common/commands';
import { IExtensionGalleryService } from 'vs/platform/extensionManagement/common/extensionManagement';
import { ITextFileService } from 'vs/workbench/services/textfile/common/textfiles';
import { IPreferencesService } from 'vs/workbench/parts/preferences/common/preferences';
export declare class EditorStatus implements IStatusbarItem {
    private editorService;
    private editorGroupService;
    private quickOpenService;
    private instantiationService;
    private untitledEditorService;
    private modeService;
    private textFileService;
    private state;
    private element;
    private tabFocusModeElement;
    private screenRedearModeElement;
    private indentationElement;
    private selectionElement;
    private encodingElement;
    private eolElement;
    private modeElement;
    private metadataElement;
    private toDispose;
    private activeEditorListeners;
    private delayedRender;
    private toRender;
    constructor(editorService: IWorkbenchEditorService, editorGroupService: IEditorGroupService, quickOpenService: IQuickOpenService, instantiationService: IInstantiationService, untitledEditorService: IUntitledEditorService, modeService: IModeService, textFileService: ITextFileService);
    render(container: HTMLElement): IDisposable;
    private updateState(update);
    private _renderNow(changed);
    private getSelectionLabel(info);
    private onModeClick();
    private onIndentationClick();
    private onSelectionClick();
    private onEOLClick();
    private onEncodingClick();
    private onTabFocusModeClick();
    private onEditorsChanged();
    private onModeChange(editorWidget);
    private onIndentationChange(editorWidget);
    private onMetadataChange(editor);
    private onScreenReaderModeChange(editorWidget);
    private onSelectionChange(editorWidget);
    private onEOLChange(editorWidget);
    private onEncodingChange(e);
    private onResourceEncodingChange(resource);
    private onTabFocusModeChange();
    private isActiveEditor(e);
}
export declare class ShowLanguageExtensionsAction extends Action {
    private fileExtension;
    private commandService;
    static ID: string;
    constructor(fileExtension: string, commandService: ICommandService, galleryService: IExtensionGalleryService);
    run(): TPromise<void>;
}
export declare class ChangeModeAction extends Action {
    private modeService;
    private modelService;
    private editorService;
    private configurationEditingService;
    private configurationService;
    private quickOpenService;
    private preferencesService;
    private instantiationService;
    private commandService;
    private configurationEditService;
    static ID: string;
    static LABEL: string;
    private static FILE_ASSOCIATION_KEY;
    constructor(actionId: string, actionLabel: string, modeService: IModeService, modelService: IModelService, editorService: IWorkbenchEditorService, configurationEditingService: IConfigurationEditingService, configurationService: IWorkspaceConfigurationService, quickOpenService: IQuickOpenService, preferencesService: IPreferencesService, instantiationService: IInstantiationService, commandService: ICommandService, configurationEditService: IConfigurationEditingService);
    run(): TPromise<any>;
    private configureFileAssociation(resource);
}
export interface IChangeEOLEntry extends IPickOpenEntry {
    eol: EndOfLineSequence;
}
export declare class ChangeEOLAction extends Action {
    private editorService;
    private quickOpenService;
    static ID: string;
    static LABEL: string;
    constructor(actionId: string, actionLabel: string, editorService: IWorkbenchEditorService, quickOpenService: IQuickOpenService);
    run(): TPromise<any>;
}
export declare class ChangeEncodingAction extends Action {
    private editorService;
    private quickOpenService;
    private configurationService;
    private fileService;
    static ID: string;
    static LABEL: string;
    constructor(actionId: string, actionLabel: string, editorService: IWorkbenchEditorService, quickOpenService: IQuickOpenService, configurationService: IWorkspaceConfigurationService, fileService: IFileService);
    run(): TPromise<any>;
}
