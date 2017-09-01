import 'vs/css!./media/preferences';
import { TPromise } from 'vs/base/common/winjs.base';
import URI from 'vs/base/common/uri';
import { Disposable } from 'vs/base/common/lifecycle';
import { IWorkbenchEditorService } from 'vs/workbench/services/editor/common/editorService';
import { IWorkspaceContextService } from 'vs/platform/workspace/common/workspace';
import { IWorkspaceConfigurationService } from 'vs/workbench/services/configuration/common/configuration';
import { IEditor } from 'vs/platform/editor/common/editor';
import { IEditorGroupService } from 'vs/workbench/services/group/common/groupService';
import { IStorageService } from 'vs/platform/storage/common/storage';
import { IFileService } from 'vs/platform/files/common/files';
import { IMessageService, IChoiceService } from 'vs/platform/message/common/message';
import { IExtensionService } from 'vs/platform/extensions/common/extensions';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { IEnvironmentService } from 'vs/platform/environment/common/environment';
import { IConfigurationEditingService, ConfigurationTarget } from 'vs/workbench/services/configuration/common/configurationEditing';
import { IPreferencesService, IPreferencesEditorModel } from 'vs/workbench/parts/preferences/common/preferences';
import { ITelemetryService } from 'vs/platform/telemetry/common/telemetry';
import { ITextModelService } from 'vs/editor/common/services/resolverService';
import { IKeybindingService } from 'vs/platform/keybinding/common/keybinding';
import { IModelService } from 'vs/editor/common/services/modelService';
import { IJSONEditingService } from 'vs/workbench/services/configuration/common/jsonEditing';
export declare class PreferencesService extends Disposable implements IPreferencesService {
    private editorService;
    private editorGroupService;
    private fileService;
    private configurationService;
    private messageService;
    private choiceService;
    private contextService;
    private instantiationService;
    private storageService;
    private environmentService;
    private telemetryService;
    private textModelResolverService;
    private configurationEditingService;
    private extensionService;
    private modelService;
    private jsonEditingService;
    _serviceBrand: any;
    private defaultPreferencesEditorModels;
    private lastOpenedSettingsInput;
    private _onDispose;
    constructor(editorService: IWorkbenchEditorService, editorGroupService: IEditorGroupService, fileService: IFileService, configurationService: IWorkspaceConfigurationService, messageService: IMessageService, choiceService: IChoiceService, contextService: IWorkspaceContextService, instantiationService: IInstantiationService, storageService: IStorageService, environmentService: IEnvironmentService, telemetryService: ITelemetryService, textModelResolverService: ITextModelService, configurationEditingService: IConfigurationEditingService, extensionService: IExtensionService, keybindingService: IKeybindingService, modelService: IModelService, jsonEditingService: IJSONEditingService);
    readonly defaultSettingsResource: URI;
    readonly defaultResourceSettingsResource: URI;
    readonly defaultKeybindingsResource: URI;
    private readonly workspaceConfigSettingsResource;
    readonly userSettingsResource: URI;
    readonly workspaceSettingsResource: URI;
    getFolderSettingsResource(resource: URI): URI;
    resolveContent(uri: URI): TPromise<string>;
    createPreferencesEditorModel(uri: URI): TPromise<IPreferencesEditorModel<any>>;
    openGlobalSettings(): TPromise<IEditor>;
    openWorkspaceSettings(): TPromise<IEditor>;
    openFolderSettings(folder: URI): TPromise<IEditor>;
    switchSettings(target: ConfigurationTarget, resource: URI): TPromise<void>;
    openGlobalKeybindingSettings(textual: boolean): TPromise<void>;
    configureSettingsForLanguage(language: string): void;
    private doOpenSettings(configurationTarget, resource);
    private getDefaultSettingsResource(configurationTarget);
    private getPreferencesEditorInputName(target, resource);
    private getOrCreateEditableSettingsEditorInput(target, resource);
    private createEditableSettingsEditorModel(configurationTarget, resource);
    private resolveSettingsContentFromWorkspaceConfiguration();
    private getEditableSettingsURI(configurationTarget, resource?);
    private toResource(relativePath, root);
    private createSettingsIfNotExists(target, resource);
    private createIfNotExists(resource, contents);
    private fetchMostCommonlyUsedSettings();
    private getPosition(language, codeEditor);
    private spaces(count, {tabSize, insertSpaces});
    dispose(): void;
}
