import { TPromise } from 'vs/base/common/winjs.base';
import { IThemable } from 'vs/platform/theme/common/styler';
import { Dimension, Builder } from 'vs/base/browser/builder';
import { IDisposable } from 'vs/base/common/lifecycle';
import { IAction, IActionRunner } from 'vs/base/common/actions';
import { IActionItem } from 'vs/base/browser/ui/actionbar/actionbar';
import { Viewlet } from 'vs/workbench/browser/viewlet';
import { ITree } from 'vs/base/parts/tree/browser/tree';
import { ToolBar } from 'vs/base/browser/ui/toolbar/toolbar';
import { IExtensionService } from 'vs/platform/extensions/common/extensions';
import { IKeybindingService } from 'vs/platform/keybinding/common/keybinding';
import { IContextMenuService } from 'vs/platform/contextview/browser/contextView';
import { AbstractCollapsibleView, CollapsibleState, IView as IBaseView, ViewSizing } from 'vs/base/browser/ui/splitview/splitview';
import { ViewLocation, IViewDescriptor } from 'vs/workbench/parts/views/browser/viewsRegistry';
import { ITelemetryService } from 'vs/platform/telemetry/common/telemetry';
import { IThemeService } from 'vs/platform/theme/common/themeService';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { IStorageService } from 'vs/platform/storage/common/storage';
import { IWorkspaceContextService } from 'vs/platform/workspace/common/workspace';
import { IContextKeyService } from 'vs/platform/contextkey/common/contextkey';
export interface IViewOptions {
    id: string;
    name: string;
    actionRunner: IActionRunner;
    collapsed: boolean;
}
export interface IViewConstructorSignature {
    new (initialSize: number, options: IViewOptions, ...services: {
        _serviceBrand: any;
    }[]): IView;
}
export interface IView extends IBaseView, IThemable {
    id: string;
    name: string;
    getHeaderElement(): HTMLElement;
    create(): TPromise<void>;
    setVisible(visible: boolean): TPromise<void>;
    isVisible(): boolean;
    getActions(): IAction[];
    getSecondaryActions(): IAction[];
    getActionItem(action: IAction): IActionItem;
    getActionsContext(): any;
    showHeader(): boolean;
    hideHeader(): boolean;
    focusBody(): void;
    isExpanded(): boolean;
    expand(): void;
    collapse(): void;
    getOptimalWidth(): number;
    shutdown(): void;
}
export interface ICollapsibleViewOptions extends IViewOptions {
    ariaHeaderLabel?: string;
    sizing: ViewSizing;
    initialBodySize?: number;
}
export declare abstract class CollapsibleView extends AbstractCollapsibleView implements IView {
    protected keybindingService: IKeybindingService;
    protected contextMenuService: IContextMenuService;
    readonly id: string;
    readonly name: string;
    protected treeContainer: HTMLElement;
    protected tree: ITree;
    protected toDispose: IDisposable[];
    protected toolBar: ToolBar;
    protected actionRunner: IActionRunner;
    protected isDisposed: boolean;
    private _isVisible;
    private dragHandler;
    constructor(initialSize: number, options: ICollapsibleViewOptions, keybindingService: IKeybindingService, contextMenuService: IContextMenuService);
    protected changeState(state: CollapsibleState): void;
    readonly draggableLabel: string;
    create(): TPromise<void>;
    getHeaderElement(): HTMLElement;
    renderHeader(container: HTMLElement): void;
    protected updateActions(): void;
    protected renderViewTree(container: HTMLElement): HTMLElement;
    getViewer(): ITree;
    isVisible(): boolean;
    setVisible(visible: boolean): TPromise<void>;
    focusBody(): void;
    protected reveal(element: any, relativeTop?: number): TPromise<void>;
    layoutBody(size: number): void;
    getActions(): IAction[];
    getSecondaryActions(): IAction[];
    getActionItem(action: IAction): IActionItem;
    getActionsContext(): any;
    shutdown(): void;
    getOptimalWidth(): number;
    dispose(): void;
    private updateTreeVisibility(tree, isVisible);
    private focusTree();
}
export interface IViewletViewOptions extends IViewOptions {
    viewletSettings: object;
}
export interface IViewState {
    collapsed: boolean;
    size: number | undefined;
    isHidden: boolean;
    order: number;
}
export declare class ViewsViewlet extends Viewlet {
    private location;
    private showHeaderInTitleWhenSingleView;
    protected storageService: IStorageService;
    protected instantiationService: IInstantiationService;
    protected contextService: IWorkspaceContextService;
    protected contextKeyService: IContextKeyService;
    protected contextMenuService: IContextMenuService;
    protected viewletContainer: HTMLElement;
    protected lastFocusedView: IView;
    private splitView;
    private viewHeaderContextMenuListeners;
    private dimension;
    private viewletSettings;
    private readonly viewsContextKeys;
    protected viewsStates: Map<string, IViewState>;
    private areExtensionsReady;
    constructor(id: string, location: ViewLocation, showHeaderInTitleWhenSingleView: boolean, telemetryService: ITelemetryService, storageService: IStorageService, instantiationService: IInstantiationService, themeService: IThemeService, contextService: IWorkspaceContextService, contextKeyService: IContextKeyService, contextMenuService: IContextMenuService, extensionService: IExtensionService);
    create(parent: Builder): TPromise<void>;
    getTitle(): string;
    getActions(): IAction[];
    getSecondaryActions(): IAction[];
    getContextMenuActions(): IAction[];
    setVisible(visible: boolean): TPromise<void>;
    focus(): void;
    layout(dimension: Dimension): void;
    getOptimalWidth(): number;
    shutdown(): void;
    private layoutViews();
    private toggleViewVisibility(id);
    private onViewsRegistered(views);
    private onViewsDeregistered(views);
    private onContextChanged(keys);
    protected updateViews(unregisteredViews?: IViewDescriptor[]): TPromise<IView[]>;
    private attachViewStyler(widget, options?);
    private attachSplitViewStyler(widget);
    private isCurrentlyVisible(viewDescriptor);
    private canBeVisible(viewDescriptor);
    private onViewsUpdated();
    private onContextMenu(event, view);
    protected showHeaderInTitleArea(): boolean;
    protected getViewDescriptorsFromRegistry(defaultOrder?: boolean): IViewDescriptor[];
    protected createView(viewDescriptor: IViewDescriptor, initialSize: number, options: IViewletViewOptions): IView;
    protected readonly views: IView[];
    protected getView(id: string): IView;
    private updateViewStateSize(view);
    protected createViewState(view: IView): IViewState;
}
export declare class PersistentViewsViewlet extends ViewsViewlet {
    private viewletStateStorageId;
    constructor(id: string, location: ViewLocation, viewletStateStorageId: string, showHeaderInTitleWhenSingleView: boolean, telemetryService: ITelemetryService, storageService: IStorageService, instantiationService: IInstantiationService, themeService: IThemeService, contextService: IWorkspaceContextService, contextKeyService: IContextKeyService, contextMenuService: IContextMenuService, extensionService: IExtensionService);
    shutdown(): void;
    private saveViewsStates();
    private loadViewsStates();
}
