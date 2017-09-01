import 'vs/css!./media/workbench';
import { TPromise } from 'vs/base/common/winjs.base';
import Event from 'vs/base/common/event';
import { EditorPart } from 'vs/workbench/browser/parts/editor/editorPart';
import { SidebarPart } from 'vs/workbench/browser/parts/sidebar/sidebarPart';
import { PanelPart } from 'vs/workbench/browser/parts/panel/panelPart';
import { Position, Parts, IPartService, ILayoutOptions } from 'vs/workbench/services/part/common/partService';
import { IWorkspaceContextService } from 'vs/platform/workspace/common/workspace';
import { IStorageService } from 'vs/platform/storage/common/storage';
import { WorkspaceService } from 'vs/workbench/services/configuration/node/configuration';
import { ContextKeyExpr, RawContextKey } from 'vs/platform/contextkey/common/contextkey';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { ServiceCollection } from 'vs/platform/instantiation/common/serviceCollection';
import { ILifecycleService } from 'vs/platform/lifecycle/common/lifecycle';
import { IWindowService, IWindowConfiguration } from 'vs/platform/windows/common/windows';
import { IMessageService } from 'vs/platform/message/common/message';
import { IEnvironmentService } from 'vs/platform/environment/common/environment';
import { ITelemetryService } from 'vs/platform/telemetry/common/telemetry';
export declare const MessagesVisibleContext: RawContextKey<boolean>;
export declare const EditorsVisibleContext: RawContextKey<boolean>;
export declare const InZenModeContext: RawContextKey<boolean>;
export declare const NoEditorsVisibleContext: ContextKeyExpr;
export interface IWorkbenchStartedInfo {
    customKeybindingsCount: number;
    restoreViewletDuration: number;
    restoreEditorsDuration: number;
    pinnedViewlets: string[];
    restoredViewlet: string;
    restoredEditors: string[];
}
export interface IWorkbenchCallbacks {
    onServicesCreated?: () => void;
    onWorkbenchStarted?: (info: IWorkbenchStartedInfo) => void;
}
/**
 * The workbench creates and lays out all parts that make up the workbench.
 */
export declare class Workbench implements IPartService {
    private instantiationService;
    private contextService;
    private storageService;
    private lifecycleService;
    private messageService;
    private configurationService;
    private telemetryService;
    private environmentService;
    private windowService;
    private static sidebarHiddenSettingKey;
    private static sidebarRestoreSettingKey;
    private static panelHiddenSettingKey;
    private static zenModeActiveSettingKey;
    private static sidebarPositionConfigurationKey;
    private static statusbarVisibleConfigurationKey;
    private static activityBarVisibleConfigurationKey;
    private static closeWhenEmptyConfigurationKey;
    private static fontAliasingConfigurationKey;
    private _onTitleBarVisibilityChange;
    _serviceBrand: any;
    private parent;
    private container;
    private workbenchParams;
    private workbenchContainer;
    private workbench;
    private workbenchStarted;
    private workbenchCreated;
    private workbenchShutdown;
    private editorService;
    private viewletService;
    private contextKeyService;
    private keybindingService;
    private backupFileService;
    private configurationEditingService;
    private workspaceMigrationService;
    private titlebarPart;
    private activitybarPart;
    private sidebarPart;
    private panelPart;
    private editorPart;
    private statusbarPart;
    private quickOpen;
    private workbenchLayout;
    private toDispose;
    private toShutdown;
    private callbacks;
    private creationPromise;
    private creationPromiseComplete;
    private sideBarHidden;
    private statusBarHidden;
    private activityBarHidden;
    private sideBarPosition;
    private panelHidden;
    private editorBackgroundDelayer;
    private closeEmptyWindowScheduler;
    private messagesVisibleContext;
    private editorsVisibleContext;
    private inZenMode;
    private hasFilesToCreateOpenOrDiff;
    private fontAliasing;
    private zenMode;
    constructor(parent: HTMLElement, container: HTMLElement, configuration: IWindowConfiguration, serviceCollection: ServiceCollection, instantiationService: IInstantiationService, contextService: IWorkspaceContextService, storageService: IStorageService, lifecycleService: ILifecycleService, messageService: IMessageService, configurationService: WorkspaceService, telemetryService: ITelemetryService, environmentService: IEnvironmentService, windowService: IWindowService);
    readonly onTitleBarVisibilityChange: Event<void>;
    readonly onEditorLayout: Event<void>;
    /**
     * Starts the workbench and creates the HTML elements on the container. A workbench can only be started
     * once. Use the shutdown function to free up resources created by the workbench on startup.
     */
    startup(callbacks?: IWorkbenchCallbacks): void;
    private createGlobalActions();
    private resolveEditorsToOpen();
    private toInputs(paths?);
    private openUntitledFile();
    private initServices();
    private initSettings();
    /**
     * Returns whether the workbench has been started.
     */
    isStarted(): boolean;
    /**
     * Returns whether the workbench has been fully created.
     */
    isCreated(): boolean;
    joinCreation(): TPromise<boolean>;
    hasFocus(part: Parts): boolean;
    getContainer(part: Parts): HTMLElement;
    isVisible(part: Parts): boolean;
    getTitleBarOffset(): number;
    private getCustomTitleBarStyle();
    private setStatusBarHidden(hidden, skipLayout?);
    setActivityBarHidden(hidden: boolean, skipLayout?: boolean): void;
    setSideBarHidden(hidden: boolean, skipLayout?: boolean): TPromise<void>;
    setPanelHidden(hidden: boolean, skipLayout?: boolean): TPromise<void>;
    toggleMaximizedPanel(): void;
    isPanelMaximized(): boolean;
    getSideBarPosition(): Position;
    private setSideBarPosition(position);
    private setFontAliasing(aliasing);
    dispose(): void;
    /**
     * Asks the workbench and all its UI components inside to lay out according to
     * the containers dimension the workbench is living in.
     */
    layout(options?: ILayoutOptions): void;
    private onWillShutdown(event);
    private shutdownComponents(reason?);
    private registerListeners();
    private onFullscreenChanged();
    private onEditorsChanged();
    private handleEditorBackground();
    private onAllEditorsClosed();
    private onDidUpdateConfiguration(skipLayout?);
    private createWorkbenchLayout();
    private createWorkbench();
    private renderWorkbench();
    private createTitlebarPart();
    private createActivityBarPart();
    private createSidebarPart();
    private createPanelPart();
    private createEditorPart();
    private createStatusbarPart();
    getEditorPart(): EditorPart;
    getSidebarPart(): SidebarPart;
    getPanelPart(): PanelPart;
    getInstantiationService(): IInstantiationService;
    addClass(clazz: string): void;
    removeClass(clazz: string): void;
    getWorkbenchElementId(): string;
    toggleZenMode(skipLayout?: boolean): void;
    resizePart(part: Parts, sizeChange: number): void;
    private shouldRestoreLastOpenedViewlet();
}
