import { TPromise } from 'vs/base/common/winjs.base';
import { IExtensionService } from 'vs/platform/extensions/common/extensions';
import { IExtensionPoint } from 'vs/platform/extensions/common/extensionsRegistry';
import { ILanguageExtensionPoint } from 'vs/editor/common/services/modeService';
import { IConfigurationService } from 'vs/platform/configuration/common/configuration';
import { ModeServiceImpl } from 'vs/editor/common/services/modeServiceImpl';
export declare const languagesExtPoint: IExtensionPoint<ILanguageExtensionPoint[]>;
export declare class WorkbenchModeServiceImpl extends ModeServiceImpl {
    private _configurationService;
    private _extensionService;
    private _onReadyPromise;
    constructor(extensionService: IExtensionService, configurationService: IConfigurationService);
    protected _onReady(): TPromise<boolean>;
    private onConfigurationChange(configuration);
}
