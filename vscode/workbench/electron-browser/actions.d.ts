import 'vs/css!./media/actions';
import { TPromise } from 'vs/base/common/winjs.base';
import { Action } from 'vs/base/common/actions';
import { IWindowService, IWindowsService } from 'vs/platform/windows/common/windows';
import { IWorkbenchEditorService } from 'vs/workbench/services/editor/common/editorService';
import { IMessageService } from 'vs/platform/message/common/message';
import { IWorkspaceContextService } from 'vs/platform/workspace/common/workspace';
import { IEnvironmentService } from 'vs/platform/environment/common/environment';
import { IConfigurationEditingService } from 'vs/workbench/services/configuration/common/configurationEditing';
import { IConfigurationService } from 'vs/platform/configuration/common/configuration';
import { IExtensionManagementService } from 'vs/platform/extensionManagement/common/extensionManagement';
import { IWorkspaceConfigurationService } from 'vs/workbench/services/configuration/common/configuration';
import { IQuickOpenService } from 'vs/platform/quickOpen/common/quickOpen';
import { IIntegrityService } from 'vs/platform/integrity/common/integrity';
import { ITimerService } from 'vs/workbench/services/timer/common/timerService';
import { IEditorGroupService } from 'vs/workbench/services/group/common/groupService';
import { IPanelService } from 'vs/workbench/services/panel/common/panelService';
import { IPartService } from 'vs/workbench/services/part/common/partService';
import { IViewletService } from 'vs/workbench/services/viewlet/browser/viewlet';
import { IKeybindingService } from 'vs/platform/keybinding/common/keybinding';
import { IViewlet } from 'vs/workbench/common/viewlet';
import { IPanel } from 'vs/workbench/common/panel';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { IExtensionService } from 'vs/platform/extensions/common/extensions';
export declare class CloseEditorAction extends Action {
    private editorService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, editorService: IWorkbenchEditorService);
    run(): TPromise<void>;
}
export declare class CloseCurrentWindowAction extends Action {
    private windowService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, windowService: IWindowService);
    run(): TPromise<boolean>;
}
export declare class CloseWorkspaceAction extends Action {
    private contextService;
    private messageService;
    private windowService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, contextService: IWorkspaceContextService, messageService: IMessageService, windowService: IWindowService);
    run(): TPromise<void>;
}
export declare class NewWindowAction extends Action {
    private windowsService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, windowsService: IWindowsService);
    run(): TPromise<void>;
}
export declare class ToggleFullScreenAction extends Action {
    private windowService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, windowService: IWindowService);
    run(): TPromise<void>;
}
export declare class ToggleMenuBarAction extends Action {
    private messageService;
    private configurationService;
    private configurationEditingService;
    static ID: string;
    static LABEL: string;
    private static menuBarVisibilityKey;
    constructor(id: string, label: string, messageService: IMessageService, configurationService: IConfigurationService, configurationEditingService: IConfigurationEditingService);
    run(): TPromise<void>;
}
export declare class ToggleDevToolsAction extends Action {
    private windowsService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, windowsService: IWindowService);
    run(): TPromise<void>;
}
export declare abstract class BaseZoomAction extends Action {
    private configurationService;
    private configurationEditingService;
    private static SETTING_KEY;
    constructor(id: string, label: string, configurationService: IWorkspaceConfigurationService, configurationEditingService: IConfigurationEditingService);
    protected setConfiguredZoomLevel(level: number): void;
}
export declare class ZoomInAction extends BaseZoomAction {
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, configurationService: IWorkspaceConfigurationService, configurationEditingService: IConfigurationEditingService);
    run(): TPromise<boolean>;
}
export declare class ZoomOutAction extends BaseZoomAction {
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, configurationService: IWorkspaceConfigurationService, configurationEditingService: IConfigurationEditingService);
    run(): TPromise<boolean>;
}
export declare class ZoomResetAction extends BaseZoomAction {
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, configurationService: IWorkspaceConfigurationService, configurationEditingService: IConfigurationEditingService);
    run(): TPromise<boolean>;
}
export declare class ShowStartupPerformance extends Action {
    private windowService;
    private timerService;
    private environmentService;
    private extensionService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, windowService: IWindowService, timerService: ITimerService, environmentService: IEnvironmentService, extensionService: IExtensionService);
    run(): TPromise<boolean>;
    private getStartupMetricsTable(nodeModuleLoadTime?);
    private analyzeNodeModulesLoadTimes();
    private analyzeLoaderStats();
}
export declare class ReloadWindowAction extends Action {
    private windowService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, windowService: IWindowService);
    run(): TPromise<boolean>;
}
export declare abstract class BaseSwitchWindow extends Action {
    private windowsService;
    private windowService;
    private quickOpenService;
    private keybindingService;
    private instantiationService;
    private closeWindowAction;
    constructor(id: string, label: string, windowsService: IWindowsService, windowService: IWindowService, quickOpenService: IQuickOpenService, keybindingService: IKeybindingService, instantiationService: IInstantiationService);
    protected abstract isQuickNavigate(): boolean;
    run(): TPromise<void>;
    dispose(): void;
}
export declare class SwitchWindow extends BaseSwitchWindow {
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, windowsService: IWindowsService, windowService: IWindowService, quickOpenService: IQuickOpenService, keybindingService: IKeybindingService, instantiationService: IInstantiationService);
    protected isQuickNavigate(): boolean;
}
export declare class QuickSwitchWindow extends BaseSwitchWindow {
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, windowsService: IWindowsService, windowService: IWindowService, quickOpenService: IQuickOpenService, keybindingService: IKeybindingService, instantiationService: IInstantiationService);
    protected isQuickNavigate(): boolean;
}
export declare const inRecentFilesPickerContextKey = "inRecentFilesPicker";
export declare abstract class BaseOpenRecentAction extends Action {
    private windowsService;
    private windowService;
    private quickOpenService;
    private contextService;
    private environmentService;
    private keybindingService;
    private removeAction;
    constructor(id: string, label: string, windowsService: IWindowsService, windowService: IWindowService, quickOpenService: IQuickOpenService, contextService: IWorkspaceContextService, environmentService: IEnvironmentService, keybindingService: IKeybindingService, instantiationService: IInstantiationService);
    protected abstract isQuickNavigate(): boolean;
    run(): TPromise<void>;
    private openRecent(recentWorkspaces, recentFiles);
    dispose(): void;
}
export declare class OpenRecentAction extends BaseOpenRecentAction {
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, windowsService: IWindowsService, windowService: IWindowService, quickOpenService: IQuickOpenService, contextService: IWorkspaceContextService, environmentService: IEnvironmentService, keybindingService: IKeybindingService, instantiationService: IInstantiationService);
    protected isQuickNavigate(): boolean;
}
export declare class QuickOpenRecentAction extends BaseOpenRecentAction {
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, windowsService: IWindowsService, windowService: IWindowService, quickOpenService: IQuickOpenService, contextService: IWorkspaceContextService, environmentService: IEnvironmentService, keybindingService: IKeybindingService, instantiationService: IInstantiationService);
    protected isQuickNavigate(): boolean;
}
export declare class CloseMessagesAction extends Action {
    private messageService;
    private editorService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, messageService: IMessageService, editorService: IWorkbenchEditorService);
    run(): TPromise<boolean>;
}
export declare class ReportIssueAction extends Action {
    private integrityService;
    private extensionManagementService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, integrityService: IIntegrityService, extensionManagementService: IExtensionManagementService);
    private _optimisticIsPure();
    run(): TPromise<boolean>;
    private generateNewIssueUrl(baseUrl, name, version, commit, date, isPure, extensions);
    private generateExtensionTable(extensions);
}
export declare class ReportPerformanceIssueAction extends Action {
    private integrityService;
    private environmentService;
    private timerService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, integrityService: IIntegrityService, environmentService: IEnvironmentService, timerService: ITimerService);
    run(appendix?: string): TPromise<boolean>;
    private generatePerformanceIssueUrl(baseUrl, name, version, commit, date, isPure, appendix?);
    private computeNodeModulesLoadTime();
    private generatePerformanceTable(nodeModuleLoadTime?);
    private getStartupMetricsTable(nodeModuleLoadTime?);
}
export declare class KeybindingsReferenceAction extends Action {
    static ID: string;
    static LABEL: string;
    private static URL;
    static AVAILABLE: boolean;
    constructor(id: string, label: string);
    run(): TPromise<void>;
}
export declare class OpenDocumentationUrlAction extends Action {
    static ID: string;
    static LABEL: string;
    private static URL;
    static AVAILABLE: boolean;
    constructor(id: string, label: string);
    run(): TPromise<void>;
}
export declare class OpenIntroductoryVideosUrlAction extends Action {
    static ID: string;
    static LABEL: string;
    private static URL;
    static AVAILABLE: boolean;
    constructor(id: string, label: string);
    run(): TPromise<void>;
}
export declare class OpenTipsAndTricksUrlAction extends Action {
    static ID: string;
    static LABEL: string;
    private static URL;
    static AVAILABLE: boolean;
    constructor(id: string, label: string);
    run(): TPromise<void>;
}
export declare class ToggleSharedProcessAction extends Action {
    private windowsService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, windowsService: IWindowsService);
    run(): TPromise<void>;
}
export declare abstract class BaseNavigationAction extends Action {
    protected groupService: IEditorGroupService;
    protected panelService: IPanelService;
    protected partService: IPartService;
    protected viewletService: IViewletService;
    constructor(id: string, label: string, groupService: IEditorGroupService, panelService: IPanelService, partService: IPartService, viewletService: IViewletService);
    run(): TPromise<any>;
    protected navigateOnEditorFocus(isEditorGroupVertical: boolean, isSidebarPositionLeft: boolean): TPromise<boolean | IViewlet | IPanel>;
    protected navigateOnPanelFocus(isEditorGroupVertical: boolean, isSidebarPositionLeft: boolean): TPromise<boolean | IPanel>;
    protected navigateOnSidebarFocus(isEditorGroupVertical: boolean, isSidebarPositionLeft: boolean): TPromise<boolean | IViewlet>;
    protected navigateToPanel(): TPromise<IPanel | boolean>;
    protected navigateToSidebar(): TPromise<IViewlet | boolean>;
    protected navigateAcrossEditorGroup(direction: any): TPromise<boolean>;
    protected navigateToLastActiveGroup(): TPromise<boolean>;
    protected navigateToFirstEditorGroup(): TPromise<boolean>;
    protected navigateToLastEditorGroup(): TPromise<boolean>;
}
export declare class NavigateLeftAction extends BaseNavigationAction {
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, groupService: IEditorGroupService, panelService: IPanelService, partService: IPartService, viewletService: IViewletService);
    protected navigateOnEditorFocus(isEditorGroupVertical: any, isSidebarPositionLeft: any): TPromise<boolean | IViewlet>;
    protected navigateOnPanelFocus(isEditorGroupVertical: any, isSidebarPositionLeft: any): TPromise<boolean | IViewlet>;
    protected navigateOnSidebarFocus(isEditorGroupVertical: any, isSidebarPositionLeft: any): TPromise<boolean>;
}
export declare class NavigateRightAction extends BaseNavigationAction {
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, groupService: IEditorGroupService, panelService: IPanelService, partService: IPartService, viewletService: IViewletService);
    protected navigateOnEditorFocus(isEditorGroupVertical: any, isSidebarPositionLeft: any): TPromise<boolean | IViewlet>;
    protected navigateOnPanelFocus(isEditorGroupVertical: any, isSidebarPositionLeft: any): TPromise<boolean | IViewlet>;
    protected navigateOnSidebarFocus(isEditorGroupVertical: any, isSidebarPositionLeft: any): TPromise<boolean>;
}
export declare class NavigateUpAction extends BaseNavigationAction {
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, groupService: IEditorGroupService, panelService: IPanelService, partService: IPartService, viewletService: IViewletService);
    protected navigateOnEditorFocus(isEditorGroupVertical: any, isSidebarPositionLeft: any): TPromise<boolean>;
    protected navigateOnPanelFocus(isEditorGroupVertical: any, isSidebarPositionLeft: any): TPromise<boolean>;
}
export declare class NavigateDownAction extends BaseNavigationAction {
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, groupService: IEditorGroupService, panelService: IPanelService, partService: IPartService, viewletService: IViewletService);
    protected navigateOnEditorFocus(isEditorGroupVertical: any, isSidebarPositionLeft: any): TPromise<boolean | IPanel>;
}
export declare abstract class BaseResizeViewAction extends Action {
    protected partService: IPartService;
    protected static RESIZE_INCREMENT: number;
    constructor(id: string, label: string, partService: IPartService);
    protected resizePart(sizeChange: number): void;
}
export declare class IncreaseViewSizeAction extends BaseResizeViewAction {
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, partService: IPartService);
    run(): TPromise<boolean>;
}
export declare class DecreaseViewSizeAction extends BaseResizeViewAction {
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, partService: IPartService);
    run(): TPromise<boolean>;
}
