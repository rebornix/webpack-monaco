import URI from 'vs/base/common/uri';
import { IReference } from 'vs/base/common/lifecycle';
import Event from 'vs/base/common/event';
import { IModel } from 'vs/editor/common/editorCommon';
import { EditorModel } from 'vs/workbench/common/editor';
import { ConfigurationScope } from 'vs/platform/configuration/common/configurationRegistry';
import { ISettingsEditorModel, IKeybindingsEditorModel, ISettingsGroup, ISetting, IFilterResult } from 'vs/workbench/parts/preferences/common/preferences';
import { IKeybindingService } from 'vs/platform/keybinding/common/keybinding';
import { ConfigurationTarget } from 'vs/workbench/services/configuration/common/configurationEditing';
import { ITextEditorModel, ITextModelService } from 'vs/editor/common/services/resolverService';
import { IRange } from 'vs/editor/common/core/range';
import { ITextFileService } from 'vs/workbench/services/textfile/common/textfiles';
import { TPromise } from 'vs/base/common/winjs.base';
import { IFileService } from 'vs/platform/files/common/files';
export declare abstract class AbstractSettingsModel extends EditorModel {
    readonly groupsTerms: string[];
    protected doFilterSettings(filter: string, allGroups: ISettingsGroup[]): IFilterResult;
    private filterByGroupTerm(filter);
    getPreference(key: string): ISetting;
    abstract settingsGroups: ISettingsGroup[];
    protected abstract findValueMatches(filter: string, setting: ISetting): IRange[];
}
export declare class SettingsEditorModel extends AbstractSettingsModel implements ISettingsEditorModel {
    private _configurationTarget;
    protected textFileService: ITextFileService;
    private _settingsGroups;
    protected settingsModel: IModel;
    private queue;
    constructor(reference: IReference<ITextEditorModel>, _configurationTarget: ConfigurationTarget, textFileService: ITextFileService);
    readonly uri: URI;
    readonly configurationTarget: ConfigurationTarget;
    readonly settingsGroups: ISettingsGroup[];
    readonly content: string;
    filterSettings(filter: string): IFilterResult;
    save(): TPromise<any>;
    protected doSave(): TPromise<any>;
    protected findValueMatches(filter: string, setting: ISetting): IRange[];
    private parse();
}
export declare class WorkspaceConfigModel extends SettingsEditorModel implements ISettingsEditorModel {
    private fileService;
    private textModelResolverService;
    private workspaceConfigModel;
    private workspaceConfigEtag;
    constructor(reference: IReference<ITextEditorModel>, workspaceConfigModelReference: IReference<ITextEditorModel>, _configurationTarget: ConfigurationTarget, onDispose: Event<void>, fileService: IFileService, textModelResolverService: ITextModelService, textFileService: ITextFileService);
    protected doSave(): TPromise<any>;
    private createWorkspaceConfigContentFromSettingsModel();
    private _onWorkspaceConfigFileStateChanged(stateChange);
    private onWorkspaceConfigFileContentChanged();
    dispose(): void;
    static getSettingsContentFromConfigContent(workspaceConfigContent: string): string;
    static parseWorkspaceConfigContent(content: string): {
        settingsPropertyEndsAt: number;
        nodeAfterSettingStartsAt: number;
    };
}
export declare class DefaultSettingsEditorModel extends AbstractSettingsModel implements ISettingsEditorModel {
    private _uri;
    private _mostCommonlyUsedSettingsKeys;
    readonly configurationScope: ConfigurationScope;
    private _allSettingsGroups;
    private _content;
    private _contentByLines;
    constructor(_uri: URI, _mostCommonlyUsedSettingsKeys: string[], configurationScope: ConfigurationScope);
    readonly uri: URI;
    readonly content: string;
    readonly settingsGroups: ISettingsGroup[];
    readonly mostCommonlyUsedSettings: ISettingsGroup;
    filterSettings(filter: string): IFilterResult;
    getPreference(key: string): ISetting;
    private parse();
    private getMostCommonlyUsedSettings(allSettingsGroups);
    private parseConfig(config, result, configurations, settingsGroup?);
    private removeEmptySettingsGroups(settingsGroups);
    private parseSettings(settingsObject);
    private parseOverrideSettings(overrideSettings);
    private matchesScope(property);
    private compareConfigurationNodes(c1, c2);
    private toContent(mostCommonlyUsed, settingsGroups);
    private pushGroups(settingsGroups);
    private pushGroup(group);
    private pushSetting(setting, indent);
    private pushValue(setting, preValueConent, indent);
    private addDescription(description, indent, result);
    protected findValueMatches(filter: string, setting: ISetting): IRange[];
    dispose(): void;
}
export declare function defaultKeybindingsContents(keybindingService: IKeybindingService): string;
export declare class DefaultKeybindingsEditorModel implements IKeybindingsEditorModel<any> {
    private _uri;
    private keybindingService;
    private _content;
    constructor(_uri: URI, keybindingService: IKeybindingService);
    readonly uri: URI;
    readonly content: string;
    getPreference(): any;
    dispose(): void;
}
