import 'vs/css!./media/extensionActions';
import { TPromise } from 'vs/base/common/winjs.base';
import { IAction, Action } from 'vs/base/common/actions';
import Event from 'vs/base/common/event';
import { ActionItem, IActionItem } from 'vs/base/browser/ui/actionbar/actionbar';
import { IContextMenuService } from 'vs/platform/contextview/browser/contextView';
import { IExtension, IExtensionsWorkbenchService } from 'vs/workbench/parts/extensions/common/extensions';
import { IExtensionEnablementService } from 'vs/platform/extensionManagement/common/extensionManagement';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { IMessageService } from 'vs/platform/message/common/message';
import { ToggleViewletAction } from 'vs/workbench/browser/viewlet';
import { IViewletService } from 'vs/workbench/services/viewlet/browser/viewlet';
import { IWorkbenchEditorService } from 'vs/workbench/services/editor/common/editorService';
import { IFileService } from 'vs/platform/files/common/files';
import { IWorkspaceContextService } from 'vs/platform/workspace/common/workspace';
import { IWindowService } from 'vs/platform/windows/common/windows';
import { IExtensionService } from 'vs/platform/extensions/common/extensions';
import { IConfigurationService } from 'vs/platform/configuration/common/configuration';
export declare class InstallAction extends Action {
    private extensionsWorkbenchService;
    private static InstallLabel;
    private static InstallingLabel;
    private static Class;
    private static InstallingClass;
    private disposables;
    private _extension;
    extension: IExtension;
    constructor(extensionsWorkbenchService: IExtensionsWorkbenchService);
    private update();
    run(): TPromise<any>;
    dispose(): void;
}
export declare class UninstallAction extends Action {
    private extensionsWorkbenchService;
    private messageService;
    private instantiationService;
    private static UninstallLabel;
    private static UninstallingLabel;
    private static UninstallClass;
    private static UnInstallingClass;
    private disposables;
    private _extension;
    extension: IExtension;
    constructor(extensionsWorkbenchService: IExtensionsWorkbenchService, messageService: IMessageService, instantiationService: IInstantiationService);
    private update();
    run(): TPromise<any>;
    dispose(): void;
}
export declare class CombinedInstallAction extends Action {
    private static NoExtensionClass;
    private installAction;
    private uninstallAction;
    private disposables;
    private _extension;
    extension: IExtension;
    constructor(instantiationService: IInstantiationService);
    private update();
    run(): TPromise<any>;
    dispose(): void;
}
export declare class UpdateAction extends Action {
    private extensionsWorkbenchService;
    private static EnabledClass;
    private static DisabledClass;
    private static Label;
    private disposables;
    private _extension;
    extension: IExtension;
    constructor(extensionsWorkbenchService: IExtensionsWorkbenchService);
    private update();
    run(): TPromise<any>;
    dispose(): void;
}
export interface IExtensionAction extends IAction {
    extension: IExtension;
}
export declare class DropDownMenuActionItem extends ActionItem {
    private menuActionGroups;
    private contextMenuService;
    private disposables;
    private _extension;
    constructor(action: IAction, menuActionGroups: IExtensionAction[][], contextMenuService: IContextMenuService);
    extension: IExtension;
    showMenu(): void;
    private getActions();
    dispose(): void;
}
export declare class ManageExtensionAction extends Action {
    private workspaceContextService;
    private extensionsWorkbenchService;
    private extensionEnablementService;
    private instantiationService;
    static ID: string;
    private static Class;
    private static HideManageExtensionClass;
    private _actionItem;
    readonly actionItem: IActionItem;
    private disposables;
    private _extension;
    extension: IExtension;
    constructor(workspaceContextService: IWorkspaceContextService, extensionsWorkbenchService: IExtensionsWorkbenchService, extensionEnablementService: IExtensionEnablementService, instantiationService: IInstantiationService);
    private update();
    run(): TPromise<any>;
    dispose(): void;
}
export declare class EnableForWorkspaceAction extends Action implements IExtensionAction {
    private workspaceContextService;
    private extensionsWorkbenchService;
    private extensionEnablementService;
    private instantiationService;
    static ID: string;
    static LABEL: string;
    private disposables;
    private _extension;
    extension: IExtension;
    constructor(label: string, workspaceContextService: IWorkspaceContextService, extensionsWorkbenchService: IExtensionsWorkbenchService, extensionEnablementService: IExtensionEnablementService, instantiationService: IInstantiationService);
    private update();
    run(): TPromise<any>;
    dispose(): void;
}
export declare class EnableGloballyAction extends Action implements IExtensionAction {
    private extensionsWorkbenchService;
    private extensionEnablementService;
    private instantiationService;
    static ID: string;
    static LABEL: string;
    private disposables;
    private _extension;
    extension: IExtension;
    constructor(label: string, extensionsWorkbenchService: IExtensionsWorkbenchService, extensionEnablementService: IExtensionEnablementService, instantiationService: IInstantiationService);
    private update();
    run(): TPromise<any>;
    dispose(): void;
}
export declare class EnableAction extends Action {
    private instantiationService;
    private extensionsWorkbenchService;
    private extensionEnablementService;
    static ID: string;
    private static EnabledClass;
    private static DisabledClass;
    private disposables;
    private _actionItem;
    readonly actionItem: IActionItem;
    private _extension;
    extension: IExtension;
    constructor(instantiationService: IInstantiationService, extensionsWorkbenchService: IExtensionsWorkbenchService, extensionEnablementService: IExtensionEnablementService);
    private update();
    run(): TPromise<any>;
    dispose(): void;
}
export declare class DisableForWorkspaceAction extends Action implements IExtensionAction {
    private workspaceContextService;
    private extensionsWorkbenchService;
    private instantiationService;
    static ID: string;
    static LABEL: string;
    private disposables;
    private _extension;
    extension: IExtension;
    constructor(label: string, workspaceContextService: IWorkspaceContextService, extensionsWorkbenchService: IExtensionsWorkbenchService, instantiationService: IInstantiationService);
    private update();
    run(): TPromise<any>;
    dispose(): void;
}
export declare class DisableGloballyAction extends Action implements IExtensionAction {
    private extensionsWorkbenchService;
    private instantiationService;
    static ID: string;
    static LABEL: string;
    private disposables;
    private _extension;
    extension: IExtension;
    constructor(label: string, extensionsWorkbenchService: IExtensionsWorkbenchService, instantiationService: IInstantiationService);
    private update();
    run(): TPromise<any>;
    dispose(): void;
}
export declare class DisableAction extends Action {
    private instantiationService;
    private extensionsWorkbenchService;
    static ID: string;
    private static EnabledClass;
    private static DisabledClass;
    private disposables;
    private _actionItem;
    readonly actionItem: IActionItem;
    private _extension;
    extension: IExtension;
    constructor(instantiationService: IInstantiationService, extensionsWorkbenchService: IExtensionsWorkbenchService);
    private update();
    run(): TPromise<any>;
    dispose(): void;
}
export declare class CheckForUpdatesAction extends Action {
    private extensionsWorkbenchService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, extensionsWorkbenchService: IExtensionsWorkbenchService);
    run(): TPromise<any>;
}
export declare class ToggleAutoUpdateAction extends Action {
    private autoUpdateValue;
    private extensionsWorkbenchService;
    constructor(id: string, label: string, autoUpdateValue: boolean, configurationService: IConfigurationService, extensionsWorkbenchService: IExtensionsWorkbenchService);
    private updateEnablement();
    run(): TPromise<any>;
}
export declare class EnableAutoUpdateAction extends ToggleAutoUpdateAction {
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, configurationService: IConfigurationService, extensionsWorkbenchService: IExtensionsWorkbenchService);
}
export declare class DisableAutoUpdateAction extends ToggleAutoUpdateAction {
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, configurationService: IConfigurationService, extensionsWorkbenchService: IExtensionsWorkbenchService);
}
export declare class UpdateAllAction extends Action {
    private extensionsWorkbenchService;
    static ID: string;
    static LABEL: string;
    private disposables;
    constructor(id: string, label: string, extensionsWorkbenchService: IExtensionsWorkbenchService);
    private readonly outdated;
    private update();
    run(): TPromise<any>;
    dispose(): void;
}
export declare class ReloadAction extends Action {
    private extensionsWorkbenchService;
    private messageService;
    private windowService;
    private extensionService;
    private static EnabledClass;
    private static DisabledClass;
    private disposables;
    private _extension;
    extension: IExtension;
    reloadMessaage: string;
    private throttler;
    constructor(extensionsWorkbenchService: IExtensionsWorkbenchService, messageService: IMessageService, windowService: IWindowService, extensionService: IExtensionService);
    private update();
    private computeReloadState(runningExtensions);
    run(): TPromise<any>;
}
export declare class OpenExtensionsViewletAction extends ToggleViewletAction {
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, viewletService: IViewletService, editorService: IWorkbenchEditorService);
}
export declare class InstallExtensionsAction extends OpenExtensionsViewletAction {
    static ID: string;
    static LABEL: string;
}
export declare class ShowEnabledExtensionsAction extends Action {
    private viewletService;
    private extensionsWorkbenchService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, viewletService: IViewletService, extensionsWorkbenchService: IExtensionsWorkbenchService);
    run(): TPromise<void>;
}
export declare class ShowInstalledExtensionsAction extends Action {
    private viewletService;
    private extensionsWorkbenchService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, viewletService: IViewletService, extensionsWorkbenchService: IExtensionsWorkbenchService);
    run(): TPromise<void>;
}
export declare class ShowDisabledExtensionsAction extends Action {
    private viewletService;
    private extensionsWorkbenchService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, viewletService: IViewletService, extensionsWorkbenchService: IExtensionsWorkbenchService);
    run(): TPromise<void>;
}
export declare class ClearExtensionsInputAction extends Action {
    private viewletService;
    private extensionsWorkbenchService;
    static ID: string;
    static LABEL: string;
    private disposables;
    constructor(id: string, label: string, onSearchChange: Event<string>, viewletService: IViewletService, extensionsWorkbenchService: IExtensionsWorkbenchService);
    private onSearchChange(value);
    run(): TPromise<void>;
    dispose(): void;
}
export declare class ShowOutdatedExtensionsAction extends Action {
    private viewletService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, viewletService: IViewletService);
    run(): TPromise<void>;
    protected isEnabled(): boolean;
}
export declare class ShowPopularExtensionsAction extends Action {
    private viewletService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, viewletService: IViewletService);
    run(): TPromise<void>;
    protected isEnabled(): boolean;
}
export declare class ShowRecommendedExtensionsAction extends Action {
    private viewletService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, viewletService: IViewletService);
    run(): TPromise<void>;
    protected isEnabled(): boolean;
}
export declare class ShowWorkspaceRecommendedExtensionsAction extends Action {
    private viewletService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, contextService: IWorkspaceContextService, viewletService: IViewletService);
    run(): TPromise<void>;
    protected isEnabled(): boolean;
}
export declare class ShowRecommendedKeymapExtensionsAction extends Action {
    private viewletService;
    static ID: string;
    static LABEL: string;
    static SHORT_LABEL: string;
    constructor(id: string, label: string, viewletService: IViewletService);
    run(): TPromise<void>;
    protected isEnabled(): boolean;
}
export declare class ShowLanguageExtensionsAction extends Action {
    private viewletService;
    static ID: string;
    static LABEL: string;
    static SHORT_LABEL: string;
    constructor(id: string, label: string, viewletService: IViewletService);
    run(): TPromise<void>;
    protected isEnabled(): boolean;
}
export declare class ShowAzureExtensionsAction extends Action {
    private viewletService;
    static ID: string;
    static LABEL: string;
    static SHORT_LABEL: string;
    constructor(id: string, label: string, viewletService: IViewletService);
    run(): TPromise<void>;
    protected isEnabled(): boolean;
}
export declare class ChangeSortAction extends Action {
    private sortBy;
    private viewletService;
    private query;
    private disposables;
    constructor(id: string, label: string, onSearchChange: Event<string>, sortBy: string, viewletService: IViewletService);
    private onSearchChange(value);
    run(): TPromise<void>;
    protected isEnabled(): boolean;
}
export declare class ConfigureWorkspaceRecommendedExtensionsAction extends Action {
    private fileService;
    private contextService;
    private extensionsService;
    private editorService;
    private messageService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, fileService: IFileService, contextService: IWorkspaceContextService, extensionsService: IExtensionsWorkbenchService, editorService: IWorkbenchEditorService, messageService: IMessageService);
    run(event: any): TPromise<any>;
    private openExtensionsFile();
    private getOrCreateExtensionsFile();
}
export declare class BuiltinStatusLabelAction extends Action {
    private static Class;
    private _extension;
    extension: IExtension;
    constructor();
    private update();
    run(): TPromise<any>;
}
export declare class DisableAllAction extends Action {
    private extensionsWorkbenchService;
    private extensionEnablementService;
    static ID: string;
    static LABEL: string;
    private disposables;
    constructor(id: string, label: string, extensionsWorkbenchService: IExtensionsWorkbenchService, extensionEnablementService: IExtensionEnablementService);
    private update();
    run(): TPromise<any>;
    dispose(): void;
}
export declare class DisableAllWorkpsaceAction extends Action {
    private workspaceContextService;
    private extensionsWorkbenchService;
    private extensionEnablementService;
    static ID: string;
    static LABEL: string;
    private disposables;
    constructor(id: string, label: string, workspaceContextService: IWorkspaceContextService, extensionsWorkbenchService: IExtensionsWorkbenchService, extensionEnablementService: IExtensionEnablementService);
    private update();
    run(): TPromise<any>;
    dispose(): void;
}
export declare class EnableAllAction extends Action {
    private extensionsWorkbenchService;
    private extensionEnablementService;
    static ID: string;
    static LABEL: string;
    private disposables;
    constructor(id: string, label: string, extensionsWorkbenchService: IExtensionsWorkbenchService, extensionEnablementService: IExtensionEnablementService);
    private update();
    run(): TPromise<any>;
    dispose(): void;
}
export declare class EnableAllWorkpsaceAction extends Action {
    private workspaceContextService;
    private extensionsWorkbenchService;
    private extensionEnablementService;
    static ID: string;
    static LABEL: string;
    private disposables;
    constructor(id: string, label: string, workspaceContextService: IWorkspaceContextService, extensionsWorkbenchService: IExtensionsWorkbenchService, extensionEnablementService: IExtensionEnablementService);
    private update();
    run(): TPromise<any>;
    dispose(): void;
}
export declare const extensionButtonProminentBackground: string;
export declare const extensionButtonProminentForeground: string;
export declare const extensionButtonProminentHoverBackground: string;
