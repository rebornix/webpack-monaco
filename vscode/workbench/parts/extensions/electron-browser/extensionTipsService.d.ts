import { TPromise } from 'vs/base/common/winjs.base';
import { IExtensionManagementService, IExtensionGalleryService, IExtensionTipsService } from 'vs/platform/extensionManagement/common/extensionManagement';
import { IModelService } from 'vs/editor/common/services/modelService';
import { IStorageService } from 'vs/platform/storage/common/storage';
import { IChoiceService, IMessageService } from 'vs/platform/message/common/message';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { IWorkspaceContextService } from 'vs/platform/workspace/common/workspace';
import { IFileService } from 'vs/platform/files/common/files';
import { IConfigurationService } from 'vs/platform/configuration/common/configuration';
import { IConfigurationEditingService } from 'vs/workbench/services/configuration/common/configurationEditing';
import { ITelemetryService } from 'vs/platform/telemetry/common/telemetry';
export declare class ExtensionTipsService implements IExtensionTipsService {
    private _galleryService;
    private _modelService;
    private storageService;
    private choiceService;
    private extensionsService;
    private instantiationService;
    private fileService;
    private contextService;
    private configurationService;
    private configurationEditingService;
    private messageService;
    private telemetryService;
    _serviceBrand: any;
    private _fileBasedRecommendations;
    private _exeBasedRecommendations;
    private _availableRecommendations;
    private importantRecommendations;
    private importantRecommendationsIgnoreList;
    private _allRecommendations;
    private _disposables;
    constructor(_galleryService: IExtensionGalleryService, _modelService: IModelService, storageService: IStorageService, choiceService: IChoiceService, extensionsService: IExtensionManagementService, instantiationService: IInstantiationService, fileService: IFileService, contextService: IWorkspaceContextService, configurationService: IConfigurationService, configurationEditingService: IConfigurationEditingService, messageService: IMessageService, telemetryService: ITelemetryService);
    getWorkspaceRecommendations(): TPromise<string[]>;
    getRecommendations(): string[];
    getKeymapRecommendations(): string[];
    private _getAllRecommendationsInProduct();
    private _suggestTips();
    private _suggest(model);
    private _suggestWorkspaceRecommendations();
    private ignoreExtensionRecommendations();
    private _suggestBasedOnExecutables();
    private setIgnoreRecommendationsConfig(configVal);
    getKeywordsForExtension(extension: string): string[];
    getRecommendationsForExtension(extension: string): string[];
    dispose(): void;
}
