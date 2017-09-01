import { TPromise } from 'vs/base/common/winjs.base';
import URI from 'vs/base/common/uri';
import { Dimension, Builder } from 'vs/base/browser/builder';
import { EditorInput, EditorOptions } from 'vs/workbench/common/editor';
import { BaseEditor } from 'vs/workbench/browser/parts/editor/baseEditor';
import { IEditorViewState, IEditor } from 'vs/editor/common/editorCommon';
import { Position } from 'vs/platform/editor/common/editor';
import { IStorageService } from 'vs/platform/storage/common/storage';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { ITelemetryService } from 'vs/platform/telemetry/common/telemetry';
import { IThemeService } from 'vs/platform/theme/common/themeService';
import { IModeService } from 'vs/editor/common/services/modeService';
import { ITextFileService } from 'vs/workbench/services/textfile/common/textfiles';
import { ITextResourceConfigurationService } from 'vs/editor/common/services/resourceConfiguration';
import { IEditorGroupService } from 'vs/workbench/services/group/common/groupService';
import { IEditorOptions } from 'vs/editor/common/config/editorOptions';
export interface IEditorConfiguration {
    editor: object;
    diffEditor: object;
}
/**
 * The base class of editors that leverage the text editor for the editing experience. This class is only intended to
 * be subclassed and not instantiated.
 */
export declare abstract class BaseTextEditor extends BaseEditor {
    private _instantiationService;
    private storageService;
    private _configurationService;
    protected themeService: IThemeService;
    private modeService;
    private _textFileService;
    protected editorGroupService: IEditorGroupService;
    private editorControl;
    private _editorContainer;
    private hasPendingConfigurationChange;
    private lastAppliedEditorOptions;
    constructor(id: string, telemetryService: ITelemetryService, _instantiationService: IInstantiationService, storageService: IStorageService, _configurationService: ITextResourceConfigurationService, themeService: IThemeService, modeService: IModeService, _textFileService: ITextFileService, editorGroupService: IEditorGroupService);
    protected readonly instantiationService: IInstantiationService;
    protected readonly configurationService: ITextResourceConfigurationService;
    protected readonly textFileService: ITextFileService;
    private handleConfigurationChangeEvent(configuration?);
    private consumePendingConfigurationChangeEvent();
    protected computeConfiguration(configuration: IEditorConfiguration): IEditorOptions;
    private computeAriaLabel();
    protected getConfigurationOverrides(): IEditorOptions;
    protected createEditor(parent: Builder): void;
    private onEditorFocusLost();
    private onWindowFocusLost();
    private maybeTriggerSaveAll(reason);
    /**
     * This method creates and returns the text editor control to be used. Subclasses can override to
     * provide their own editor control that should be used (e.g. a DiffEditor).
     *
     * The passed in configuration object should be passed to the editor control when creating it.
     */
    protected createEditorControl(parent: Builder, configuration: IEditorOptions): IEditor;
    setInput(input: EditorInput, options?: EditorOptions): TPromise<void>;
    changePosition(position: Position): void;
    protected setEditorVisible(visible: boolean, position?: Position): void;
    focus(): void;
    layout(dimension: Dimension): void;
    getControl(): IEditor;
    /**
     * Saves the text editor view state under the given key.
     */
    protected saveTextEditorViewState(key: string): void;
    /**
     * Clears the text editor view state under the given key.
     */
    protected clearTextEditorViewState(keys: string[]): void;
    /**
     * Loads the text editor view state for the given key and returns it.
     */
    protected loadTextEditorViewState(key: string): IEditorViewState;
    private updateEditorConfiguration(configuration?);
    protected getResource(): URI;
    protected abstract getAriaLabel(): string;
    dispose(): void;
}
