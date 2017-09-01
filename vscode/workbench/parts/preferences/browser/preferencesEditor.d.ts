import { TPromise } from 'vs/base/common/winjs.base';
import URI from 'vs/base/common/uri';
import { Dimension, Builder } from 'vs/base/browser/builder';
import { SideBySideEditorInput, EditorOptions, EditorInput } from 'vs/workbench/common/editor';
import { BaseEditor } from 'vs/workbench/browser/parts/editor/baseEditor';
import { IEditorControl, Position, Verbosity } from 'vs/platform/editor/common/editor';
import { ResourceEditorInput } from 'vs/workbench/common/editor/resourceEditorInput';
import * as editorCommon from 'vs/editor/common/editorCommon';
import { BaseTextEditor } from 'vs/workbench/browser/parts/editor/textEditor';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { IPreferencesService } from 'vs/workbench/parts/preferences/common/preferences';
import { IContextKeyService } from 'vs/platform/contextkey/common/contextkey';
import { ITelemetryService } from 'vs/platform/telemetry/common/telemetry';
import { IThemeService } from 'vs/platform/theme/common/themeService';
import { IModelService } from 'vs/editor/common/services/modelService';
import { IModeService } from 'vs/editor/common/services/modeService';
import { IStorageService } from 'vs/platform/storage/common/storage';
import { ITextResourceConfigurationService } from 'vs/editor/common/services/resourceConfiguration';
import { IWorkbenchEditorService } from 'vs/workbench/services/editor/common/editorService';
import { ITextModelService } from 'vs/editor/common/services/resolverService';
import { IEnvironmentService } from 'vs/platform/environment/common/environment';
import { ITextFileService } from 'vs/workbench/services/textfile/common/textfiles';
import { IEditorGroupService } from 'vs/workbench/services/group/common/groupService';
import { IEditorOptions } from 'vs/editor/common/config/editorOptions';
import { IWorkspaceContextService } from 'vs/platform/workspace/common/workspace';
export declare class PreferencesEditorInput extends SideBySideEditorInput {
    static ID: string;
    getTypeId(): string;
    getTitle(verbosity: Verbosity): string;
}
export declare class DefaultPreferencesEditorInput extends ResourceEditorInput {
    static ID: string;
    constructor(defaultSettingsResource: URI, textModelResolverService: ITextModelService);
    getTypeId(): string;
    matches(other: any): boolean;
}
export declare class PreferencesEditor extends BaseEditor {
    private preferencesService;
    private environmentService;
    private editorService;
    private contextKeyService;
    private instantiationService;
    private workspaceContextService;
    static ID: string;
    private defaultSettingsEditorContextKey;
    private focusSettingsContextKey;
    private headerContainer;
    private searchWidget;
    private settingsTargetsWidget;
    private sideBySidePreferencesWidget;
    private preferencesRenderers;
    private delayedFilterLogging;
    private latestEmptyFilters;
    private lastFocusedWidget;
    constructor(preferencesService: IPreferencesService, environmentService: IEnvironmentService, telemetryService: ITelemetryService, editorService: IWorkbenchEditorService, contextKeyService: IContextKeyService, instantiationService: IInstantiationService, themeService: IThemeService, workspaceContextService: IWorkspaceContextService);
    createEditor(parent: Builder): void;
    setInput(newInput: PreferencesEditorInput, options?: EditorOptions): TPromise<void>;
    layout(dimension: Dimension): void;
    getControl(): IEditorControl;
    focus(): void;
    focusSearch(filter?: string): void;
    focusSettingsFileEditor(): void;
    clearInput(): void;
    protected setEditorVisible(visible: boolean, position: Position): void;
    changePosition(position: Position): void;
    private updateInput(oldInput, newInput, options?);
    private getSettingsConfigurationTarget(resource);
    private switchSettings(resource);
    private filterPreferences(filter);
    private showSearchResultsMessage(count);
    private reportFilteringUsed(filter);
    /**
     * Put a rough limit on the size of the telemetry data, since otherwise it could be an unbounded large amount
     * of data. 8192 is the max size of a property value. This is rough since that probably includes ""s, etc.
     */
    private getLatestEmptyFiltersForTelemetry();
}
export declare class EditableSettingsEditor extends BaseTextEditor {
    private editorService;
    private preferencesService;
    private modelService;
    static ID: string;
    private modelDisposables;
    private saveDelayer;
    constructor(telemetryService: ITelemetryService, editorService: IWorkbenchEditorService, instantiationService: IInstantiationService, storageService: IStorageService, configurationService: ITextResourceConfigurationService, themeService: IThemeService, preferencesService: IPreferencesService, modelService: IModelService, modeService: IModeService, textFileService: ITextFileService, editorGroupService: IEditorGroupService);
    protected createEditor(parent: Builder): void;
    protected getAriaLabel(): string;
    setInput(input: EditorInput, options: EditorOptions): TPromise<void>;
    clearInput(): void;
    private onDidModelChange();
}
export declare class DefaultPreferencesEditor extends BaseTextEditor {
    private editorService;
    private preferencesService;
    private modelService;
    static ID: string;
    constructor(telemetryService: ITelemetryService, editorService: IWorkbenchEditorService, instantiationService: IInstantiationService, storageService: IStorageService, configurationService: ITextResourceConfigurationService, themeService: IThemeService, preferencesService: IPreferencesService, modelService: IModelService, modeService: IModeService, textFileService: ITextFileService, editorGroupService: IEditorGroupService);
    createEditorControl(parent: Builder, configuration: IEditorOptions): editorCommon.IEditor;
    protected getConfigurationOverrides(): IEditorOptions;
    setInput(input: DefaultPreferencesEditorInput, options: EditorOptions): TPromise<void>;
    layout(dimension: Dimension): void;
    protected getAriaLabel(): string;
}
