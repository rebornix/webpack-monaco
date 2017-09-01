import { Disposable, IDisposable } from 'vs/base/common/lifecycle';
import Event from 'vs/base/common/event';
import { IRange } from 'vs/editor/common/core/range';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { IPreferencesService, ISettingsGroup, ISetting, IPreferencesEditorModel, IFilterResult } from 'vs/workbench/parts/preferences/common/preferences';
import { SettingsEditorModel, DefaultSettingsEditorModel } from 'vs/workbench/parts/preferences/common/preferencesModels';
import { ICodeEditor } from 'vs/editor/browser/editorBrowser';
import { ITelemetryService } from 'vs/platform/telemetry/common/telemetry';
import { IConfigurationEditingService } from 'vs/workbench/services/configuration/common/configurationEditing';
import { ITextFileService } from 'vs/workbench/services/textfile/common/textfiles';
import { IMessageService } from 'vs/platform/message/common/message';
import { IWorkbenchEditorService } from 'vs/workbench/services/editor/common/editorService';
export interface IPreferencesRenderer<T> extends IDisposable {
    preferencesModel: IPreferencesEditorModel<T>;
    associatedPreferencesModel: IPreferencesEditorModel<T>;
    onFocusPreference: Event<T>;
    onClearFocusPreference: Event<T>;
    onUpdatePreference: Event<{
        key: string;
        value: any;
        source: T;
    }>;
    render(): void;
    updatePreference(key: string, value: any, source: T): void;
    filterPreferences(filterResult: IFilterResult): void;
    focusPreference(setting: T): void;
    clearFocus(setting: T): void;
}
export declare class UserSettingsRenderer extends Disposable implements IPreferencesRenderer<ISetting> {
    protected editor: ICodeEditor;
    readonly preferencesModel: SettingsEditorModel;
    private _associatedPreferencesModel;
    protected preferencesService: IPreferencesService;
    private telemetryService;
    private textFileService;
    private configurationEditingService;
    private messageService;
    protected instantiationService: IInstantiationService;
    private settingHighlighter;
    private editSettingActionRenderer;
    private highlightMatchesRenderer;
    private modelChangeDelayer;
    private _onFocusPreference;
    readonly onFocusPreference: Event<ISetting>;
    private _onUpdatePreference;
    readonly onUpdatePreference: Event<{
        key: string;
        value: any;
        source: ISetting;
    }>;
    private _onClearFocusPreference;
    readonly onClearFocusPreference: Event<ISetting>;
    private filterResult;
    constructor(editor: ICodeEditor, preferencesModel: SettingsEditorModel, _associatedPreferencesModel: IPreferencesEditorModel<ISetting>, preferencesService: IPreferencesService, telemetryService: ITelemetryService, textFileService: ITextFileService, configurationEditingService: IConfigurationEditingService, messageService: IMessageService, instantiationService: IInstantiationService);
    associatedPreferencesModel: IPreferencesEditorModel<ISetting>;
    protected createHeader(): void;
    render(): void;
    updatePreference(key: string, value: any, source: ISetting): void;
    private toErrorMessage(error, target);
    private onModelChanged();
    private onSettingUpdated(setting);
    private getSetting(setting);
    filterPreferences(filterResult: IFilterResult): void;
    focusPreference(setting: ISetting): void;
    clearFocus(setting: ISetting): void;
}
export declare class WorkspaceSettingsRenderer extends UserSettingsRenderer implements IPreferencesRenderer<ISetting> {
    private untrustedSettingRenderer;
    private workspaceConfigurationRenderer;
    constructor(editor: ICodeEditor, preferencesModel: SettingsEditorModel, associatedPreferencesModel: IPreferencesEditorModel<ISetting>, preferencesService: IPreferencesService, telemetryService: ITelemetryService, textFileService: ITextFileService, configurationEditingService: IConfigurationEditingService, messageService: IMessageService, instantiationService: IInstantiationService);
    protected createHeader(): void;
    render(): void;
}
export declare class FolderSettingsRenderer extends UserSettingsRenderer implements IPreferencesRenderer<ISetting> {
    private unsupportedWorkbenchSettingsRenderer;
    constructor(editor: ICodeEditor, preferencesModel: SettingsEditorModel, associatedPreferencesModel: IPreferencesEditorModel<ISetting>, preferencesService: IPreferencesService, telemetryService: ITelemetryService, textFileService: ITextFileService, configurationEditingService: IConfigurationEditingService, messageService: IMessageService, instantiationService: IInstantiationService);
    protected createHeader(): void;
    render(): void;
}
export declare class DefaultSettingsRenderer extends Disposable implements IPreferencesRenderer<ISetting> {
    protected editor: ICodeEditor;
    readonly preferencesModel: DefaultSettingsEditorModel;
    protected preferencesService: IPreferencesService;
    private editorService;
    protected instantiationService: IInstantiationService;
    private _associatedPreferencesModel;
    private settingHighlighter;
    private settingsHeaderRenderer;
    private settingsGroupTitleRenderer;
    private filteredMatchesRenderer;
    private hiddenAreasRenderer;
    private editSettingActionRenderer;
    private _onUpdatePreference;
    readonly onUpdatePreference: Event<{
        key: string;
        value: any;
        source: ISetting;
    }>;
    private _onFocusPreference;
    readonly onFocusPreference: Event<ISetting>;
    private _onClearFocusPreference;
    readonly onClearFocusPreference: Event<ISetting>;
    private filterResult;
    constructor(editor: ICodeEditor, preferencesModel: DefaultSettingsEditorModel, preferencesService: IPreferencesService, editorService: IWorkbenchEditorService, instantiationService: IInstantiationService);
    associatedPreferencesModel: IPreferencesEditorModel<ISetting>;
    render(): void;
    filterPreferences(filterResult: IFilterResult): void;
    focusPreference(s: ISetting): void;
    private getSetting(setting);
    private getPreference(key, settingsGroups);
    clearFocus(setting: ISetting): void;
    collapseAll(): void;
    updatePreference(key: string, value: any, source: ISetting): void;
}
export interface HiddenAreasProvider {
    hiddenAreas: IRange[];
}
export declare class StaticContentHidingRenderer extends Disposable implements HiddenAreasProvider {
    private editor;
    private settingsGroups;
    constructor(editor: ICodeEditor, settingsGroups: ISettingsGroup[]);
    readonly hiddenAreas: IRange[];
}
export declare class SettingsGroupTitleRenderer extends Disposable implements HiddenAreasProvider {
    private editor;
    private instantiationService;
    private _onHiddenAreasChanged;
    readonly onHiddenAreasChanged: Event<void>;
    private settingsGroups;
    private hiddenGroups;
    private settingsGroupTitleWidgets;
    private disposables;
    constructor(editor: ICodeEditor, instantiationService: IInstantiationService);
    readonly hiddenAreas: IRange[];
    render(settingsGroups: ISettingsGroup[]): void;
    showGroup(group: number): void;
    showSetting(setting: ISetting): void;
    collapseAll(): void;
    private onToggled(collapsed, group);
    private disposeWidgets();
    dispose(): void;
}
export declare class HiddenAreasRenderer extends Disposable {
    private editor;
    private hiddenAreasProviders;
    private instantiationService;
    constructor(editor: ICodeEditor, hiddenAreasProviders: HiddenAreasProvider[], instantiationService: IInstantiationService);
    render(): void;
    dispose(): void;
}
export declare class FilteredMatchesRenderer extends Disposable implements HiddenAreasProvider {
    private editor;
    private instantiationService;
    private decorationIds;
    hiddenAreas: IRange[];
    constructor(editor: ICodeEditor, instantiationService: IInstantiationService);
    render(result: IFilterResult): void;
    private createDecoration(range, model);
    private computeHiddenRanges(filteredGroups, allSettingsGroups, model);
    private containsLine(lineNumber, settingsGroup);
    private createCompleteRange(range, model);
    dispose(): void;
}
export declare class HighlightMatchesRenderer extends Disposable {
    private editor;
    private instantiationService;
    private decorationIds;
    constructor(editor: ICodeEditor, instantiationService: IInstantiationService);
    render(matches: IRange[]): void;
    private static _FIND_MATCH;
    private createDecoration(range, model);
    dispose(): void;
}
