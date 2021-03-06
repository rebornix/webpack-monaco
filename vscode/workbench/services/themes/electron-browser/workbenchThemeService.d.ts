import { TPromise } from 'vs/base/common/winjs.base';
import { IExtensionService } from 'vs/platform/extensions/common/extensions';
import { IWorkbenchThemeService, IColorTheme, IFileIconTheme } from 'vs/workbench/services/themes/common/workbenchThemeService';
import { IStorageService } from 'vs/platform/storage/common/storage';
import { ITelemetryService } from 'vs/platform/telemetry/common/telemetry';
import { ConfigurationTarget } from 'vs/workbench/services/configuration/common/configurationEditing';
import { IConfigurationService } from 'vs/platform/configuration/common/configuration';
import { IEnvironmentService } from 'vs/platform/environment/common/environment';
import { IMessageService } from 'vs/platform/message/common/message';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { ColorThemeData } from './colorThemeData';
import { ITheme } from 'vs/platform/theme/common/themeService';
import Event from 'vs/base/common/event';
import { IBroadcastService } from 'vs/platform/broadcast/electron-browser/broadcastService';
export interface IColorCustomizations {
    [colorId: string]: string;
}
export declare class WorkbenchThemeService implements IWorkbenchThemeService {
    private extensionService;
    private storageService;
    private broadcastService;
    private configurationService;
    private environmentService;
    private messageService;
    private telemetryService;
    private instantiationService;
    _serviceBrand: any;
    private extensionsColorThemes;
    private colorCustomizations;
    private tokenColorCustomizations;
    private numberOfColorCustomizations;
    private currentColorTheme;
    private container;
    private onColorThemeChange;
    private knownIconThemes;
    private currentIconTheme;
    private onFileIconThemeChange;
    private themingParticipantChangeListener;
    private _configurationWriter;
    constructor(container: HTMLElement, extensionService: IExtensionService, storageService: IStorageService, broadcastService: IBroadcastService, configurationService: IConfigurationService, environmentService: IEnvironmentService, messageService: IMessageService, telemetryService: ITelemetryService, instantiationService: IInstantiationService);
    readonly onDidColorThemeChange: Event<IColorTheme>;
    readonly onDidFileIconThemeChange: Event<IFileIconTheme>;
    readonly onThemeChange: Event<ITheme>;
    private backupSettings();
    private migrate();
    private initialize();
    private installConfigurationListener();
    getTheme(): ITheme;
    setColorTheme(themeId: string, settingsTarget: ConfigurationTarget): TPromise<IColorTheme>;
    private updateDynamicCSSRules(themeData);
    private applyTheme(newTheme, settingsTarget, silent?);
    private writeColorThemeConfiguration(settingsTarget);
    getColorTheme(): IColorTheme;
    private findThemeData(themeId, defaultId?);
    findThemeDataBySettingsId(settingsId: string, defaultId: string): TPromise<ColorThemeData>;
    getColorThemes(): TPromise<IColorTheme[]>;
    private hasCustomizationChanged(newColorCustomizations, newColorIds, newTokenColorCustomizations);
    private updateColorCustomizations(notify?);
    private onThemes(extensionFolderPath, extensionData, themes, collector);
    private onIconThemes(extensionFolderPath, extensionData, iconThemes, collector);
    private themeExtensionsActivated;
    private sendTelemetry(themeId, themeData, themeType);
    getFileIconThemes(): TPromise<IFileIconTheme[]>;
    getFileIconTheme(): IFileIconTheme;
    setFileIconTheme(iconTheme: string, settingsTarget: ConfigurationTarget): TPromise<IFileIconTheme>;
    private writeFileIconConfiguration(settingsTarget);
    private readonly configurationWriter;
    private _findIconThemeData(iconTheme);
    private findIconThemeBySettingsId(settingsId);
}
