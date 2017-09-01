import { TPromise } from 'vs/base/common/winjs.base';
import { ITextFileService } from 'vs/workbench/services/textfile/common/textfiles';
import { BaseTextEditor } from 'vs/workbench/browser/parts/editor/textEditor';
import { EditorOptions } from 'vs/workbench/common/editor';
import { FileEditorInput } from 'vs/workbench/parts/files/common/editors/fileEditorInput';
import { IViewletService } from 'vs/workbench/services/viewlet/browser/viewlet';
import { IFileService } from 'vs/platform/files/common/files';
import { ITelemetryService } from 'vs/platform/telemetry/common/telemetry';
import { IWorkspaceContextService } from 'vs/platform/workspace/common/workspace';
import { IStorageService } from 'vs/platform/storage/common/storage';
import { ITextResourceConfigurationService } from 'vs/editor/common/services/resourceConfiguration';
import { IHistoryService } from 'vs/workbench/services/history/common/history';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { IWorkbenchEditorService } from 'vs/workbench/services/editor/common/editorService';
import { IThemeService } from 'vs/platform/theme/common/themeService';
import { IEditorGroupService } from 'vs/workbench/services/group/common/groupService';
import { IModeService } from 'vs/editor/common/services/modeService';
/**
 * An implementation of editor for file system resources.
 */
export declare class TextFileEditor extends BaseTextEditor {
    private fileService;
    private viewletService;
    private contextService;
    private historyService;
    private editorService;
    static ID: string;
    constructor(telemetryService: ITelemetryService, fileService: IFileService, viewletService: IViewletService, instantiationService: IInstantiationService, contextService: IWorkspaceContextService, storageService: IStorageService, historyService: IHistoryService, configurationService: ITextResourceConfigurationService, editorService: IWorkbenchEditorService, themeService: IThemeService, editorGroupService: IEditorGroupService, modeService: IModeService, textFileService: ITextFileService);
    private onFilesChanged(e);
    private onWillCloseEditor(e);
    getTitle(): string;
    readonly input: FileEditorInput;
    setInput(input: FileEditorInput, options?: EditorOptions): TPromise<void>;
    private openAsBinary(input, options);
    private openAsFolder(input);
    protected getAriaLabel(): string;
    clearInput(): void;
    shutdown(): void;
    private doSaveTextEditorViewState(input);
}
