import URI from 'vs/base/common/uri';
import { TPromise } from 'vs/base/common/winjs.base';
import { RawContextKey } from 'vs/platform/contextkey/common/contextkey';
import { IEditor } from 'vs/platform/editor/common/editor';
import { IKeybindingItemEntry } from 'vs/workbench/parts/preferences/common/keybindingsEditorModel';
import { IRange } from 'vs/editor/common/core/range';
import { ConfigurationTarget } from 'vs/workbench/services/configuration/common/configurationEditing';
import { IWorkspaceContextService } from 'vs/platform/workspace/common/workspace';
export interface ISettingsGroup {
    id: string;
    range: IRange;
    title: string;
    titleRange: IRange;
    sections: ISettingsSection[];
}
export interface ISettingsSection {
    titleRange?: IRange;
    title?: string;
    settings: ISetting[];
}
export interface ISetting {
    range: IRange;
    key: string;
    keyRange: IRange;
    value: any;
    valueRange: IRange;
    description: string[];
    descriptionRanges: IRange[];
    overrides?: ISetting[];
    overrideOf?: ISetting;
}
export interface IFilterResult {
    filteredGroups: ISettingsGroup[];
    allGroups: ISettingsGroup[];
    matches: IRange[];
}
export interface IPreferencesEditorModel<T> {
    uri: URI;
    content: string;
    getPreference(key: string): T;
    dispose(): void;
}
export interface ISettingsEditorModel extends IPreferencesEditorModel<ISetting> {
    settingsGroups: ISettingsGroup[];
    groupsTerms: string[];
    filterSettings(filter: string): IFilterResult;
}
export interface IKeybindingsEditorModel<T> extends IPreferencesEditorModel<T> {
}
export declare const IPreferencesService: {
    (...args: any[]): void;
    type: IPreferencesService;
};
export interface IPreferencesService {
    _serviceBrand: any;
    defaultSettingsResource: URI;
    defaultResourceSettingsResource: URI;
    userSettingsResource: URI;
    workspaceSettingsResource: URI;
    getFolderSettingsResource(resource: URI): URI;
    resolveContent(uri: URI): TPromise<string>;
    createPreferencesEditorModel<T>(uri: URI): TPromise<IPreferencesEditorModel<T>>;
    openGlobalSettings(): TPromise<IEditor>;
    openWorkspaceSettings(): TPromise<IEditor>;
    openFolderSettings(folder: URI): TPromise<IEditor>;
    switchSettings(target: ConfigurationTarget, resource: URI): TPromise<void>;
    openGlobalKeybindingSettings(textual: boolean): TPromise<void>;
    configureSettingsForLanguage(language: string): void;
}
export interface IKeybindingsEditor extends IEditor {
    activeKeybindingEntry: IKeybindingItemEntry;
    search(filter: string): void;
    focusKeybindings(): void;
    defineKeybinding(keybindingEntry: IKeybindingItemEntry): TPromise<any>;
    removeKeybinding(keybindingEntry: IKeybindingItemEntry): TPromise<any>;
    resetKeybinding(keybindingEntry: IKeybindingItemEntry): TPromise<any>;
    copyKeybinding(keybindingEntry: IKeybindingItemEntry): TPromise<any>;
    showConflicts(keybindingEntry: IKeybindingItemEntry): TPromise<any>;
}
export declare function getSettingsTargetName(target: ConfigurationTarget, resource: URI, workspaceContextService: IWorkspaceContextService): string;
export declare const CONTEXT_SETTINGS_EDITOR: RawContextKey<boolean>;
export declare const CONTEXT_SETTINGS_SEARCH_FOCUS: RawContextKey<boolean>;
export declare const CONTEXT_KEYBINDINGS_EDITOR: RawContextKey<boolean>;
export declare const CONTEXT_KEYBINDINGS_SEARCH_FOCUS: RawContextKey<boolean>;
export declare const CONTEXT_KEYBINDING_FOCUS: RawContextKey<boolean>;
export declare const SETTINGS_EDITOR_COMMAND_SEARCH = "settings.action.search";
export declare const SETTINGS_EDITOR_COMMAND_FOCUS_FILE = "settings.action.focusSettingsFile";
export declare const KEYBINDINGS_EDITOR_COMMAND_SEARCH = "keybindings.editor.searchKeybindings";
export declare const KEYBINDINGS_EDITOR_COMMAND_DEFINE = "keybindings.editor.defineKeybinding";
export declare const KEYBINDINGS_EDITOR_COMMAND_REMOVE = "keybindings.editor.removeKeybinding";
export declare const KEYBINDINGS_EDITOR_COMMAND_RESET = "keybindings.editor.resetKeybinding";
export declare const KEYBINDINGS_EDITOR_COMMAND_COPY = "keybindings.editor.copyKeybindingEntry";
export declare const KEYBINDINGS_EDITOR_COMMAND_SHOW_CONFLICTS = "keybindings.editor.showConflicts";
export declare const KEYBINDINGS_EDITOR_COMMAND_FOCUS_KEYBINDINGS = "keybindings.editor.focusKeybindings";
