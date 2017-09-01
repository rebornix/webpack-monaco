import 'vs/css!./media/textdiffeditor';
import { TPromise } from 'vs/base/common/winjs.base';
import { Builder } from 'vs/base/browser/builder';
import { IAction } from 'vs/base/common/actions';
import { IDiffEditor } from 'vs/editor/browser/editorBrowser';
import { IEditorOptions } from 'vs/editor/common/config/editorOptions';
import { BaseTextEditor, IEditorConfiguration } from 'vs/workbench/browser/parts/editor/textEditor';
import { EditorInput, EditorOptions } from 'vs/workbench/common/editor';
import { DiffNavigator } from 'vs/editor/browser/widget/diffNavigator';
import { ITelemetryService } from 'vs/platform/telemetry/common/telemetry';
import { IStorageService } from 'vs/platform/storage/common/storage';
import { ITextResourceConfigurationService } from 'vs/editor/common/services/resourceConfiguration';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { IWorkbenchEditorService } from 'vs/workbench/services/editor/common/editorService';
import { IThemeService } from 'vs/platform/theme/common/themeService';
import { IEditorGroupService } from 'vs/workbench/services/group/common/groupService';
import { IModeService } from 'vs/editor/common/services/modeService';
import { ITextFileService } from 'vs/workbench/services/textfile/common/textfiles';
/**
 * The text editor that leverages the diff text editor for the editing experience.
 */
export declare class TextDiffEditor extends BaseTextEditor {
    private editorService;
    static ID: string;
    private diffNavigator;
    private nextDiffAction;
    private previousDiffAction;
    constructor(telemetryService: ITelemetryService, instantiationService: IInstantiationService, storageService: IStorageService, configurationService: ITextResourceConfigurationService, editorService: IWorkbenchEditorService, themeService: IThemeService, editorGroupService: IEditorGroupService, modeService: IModeService, textFileService: ITextFileService);
    getTitle(): string;
    createEditorControl(parent: Builder, configuration: IEditorOptions): IDiffEditor;
    setInput(input: EditorInput, options?: EditorOptions): TPromise<void>;
    private openAsBinary(input, options);
    protected computeConfiguration(configuration: IEditorConfiguration): IEditorOptions;
    protected getConfigurationOverrides(): IEditorOptions;
    protected getAriaLabel(): string;
    private isReadOnly();
    private isFileBinaryError(error);
    private isFileBinaryError(error);
    clearInput(): void;
    getDiffNavigator(): DiffNavigator;
    getActions(): IAction[];
    getSecondaryActions(): IAction[];
    getControl(): IDiffEditor;
    dispose(): void;
}
