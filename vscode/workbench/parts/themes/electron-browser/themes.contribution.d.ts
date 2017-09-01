import { TPromise } from 'vs/base/common/winjs.base';
import { Action } from 'vs/base/common/actions';
import { IMessageService } from 'vs/platform/message/common/message';
import { IQuickOpenService } from 'vs/platform/quickOpen/common/quickOpen';
import { IWorkbenchThemeService } from 'vs/workbench/services/themes/common/workbenchThemeService';
import { IExtensionGalleryService } from 'vs/platform/extensionManagement/common/extensionManagement';
import { IViewletService } from 'vs/workbench/services/viewlet/browser/viewlet';
import { IWorkspaceConfigurationService } from 'vs/workbench/services/configuration/common/configuration';
export declare class SelectColorThemeAction extends Action {
    private quickOpenService;
    private messageService;
    private themeService;
    private extensionGalleryService;
    private viewletService;
    private configurationService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, quickOpenService: IQuickOpenService, messageService: IMessageService, themeService: IWorkbenchThemeService, extensionGalleryService: IExtensionGalleryService, viewletService: IViewletService, configurationService: IWorkspaceConfigurationService);
    run(): TPromise<void>;
}
