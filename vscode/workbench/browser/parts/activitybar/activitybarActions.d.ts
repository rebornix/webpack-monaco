import 'vs/css!./media/activityaction';
import { TPromise } from 'vs/base/common/winjs.base';
import { Builder } from 'vs/base/browser/builder';
import { Action } from 'vs/base/common/actions';
import { BaseActionItem, IBaseActionItemOptions } from 'vs/base/browser/ui/actionbar/actionbar';
import { IActivityBarService, IBadge } from 'vs/workbench/services/activity/common/activityBarService';
import Event from 'vs/base/common/event';
import { IContextMenuService } from 'vs/platform/contextview/browser/contextView';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { IKeybindingService } from 'vs/platform/keybinding/common/keybinding';
import { ViewletDescriptor } from 'vs/workbench/browser/viewlet';
import { IActivity, IGlobalActivity } from 'vs/workbench/browser/activity';
import { IViewletService } from 'vs/workbench/services/viewlet/browser/viewlet';
import { IPartService } from 'vs/workbench/services/part/common/partService';
import { IThemeService } from 'vs/platform/theme/common/themeService';
export interface IViewletActivity {
    badge: IBadge;
    clazz: string;
}
export declare class ActivityAction extends Action {
    private _activity;
    private badge;
    private _onDidChangeBadge;
    constructor(_activity: IActivity);
    readonly activity: IActivity;
    readonly onDidChangeBadge: Event<this>;
    activate(): void;
    deactivate(): void;
    getBadge(): IBadge;
    setBadge(badge: IBadge): void;
}
export declare class ViewletActivityAction extends ActivityAction {
    private viewlet;
    private viewletService;
    private partService;
    private static preventDoubleClickDelay;
    private lastRun;
    constructor(viewlet: ViewletDescriptor, viewletService: IViewletService, partService: IPartService);
    run(event: any): TPromise<any>;
}
export declare class ActivityActionItem extends BaseActionItem {
    protected themeService: IThemeService;
    protected $container: Builder;
    protected $label: Builder;
    protected $badge: Builder;
    private $badgeContent;
    private mouseUpTimeout;
    constructor(action: ActivityAction, options: IBaseActionItemOptions, themeService: IThemeService);
    protected readonly activity: IActivity;
    protected updateStyles(): void;
    render(container: HTMLElement): void;
    private onThemeChange(theme);
    setBadge(badge: IBadge): void;
    protected updateBadge(badge: IBadge): void;
    private handleBadgeChangeEvenet();
    dispose(): void;
}
export declare class ViewletActionItem extends ActivityActionItem {
    private action;
    private contextMenuService;
    private activityBarService;
    private keybindingService;
    private static manageExtensionAction;
    private static toggleViewletPinnedAction;
    private static draggedViewlet;
    private _keybinding;
    private cssClass;
    constructor(action: ViewletActivityAction, contextMenuService: IContextMenuService, activityBarService: IActivityBarService, keybindingService: IKeybindingService, instantiationService: IInstantiationService, themeService: IThemeService);
    private readonly viewlet;
    private getKeybindingLabel(id);
    render(container: HTMLElement): void;
    private updateFromDragging(element, isDragging);
    static getDraggedViewlet(): ViewletDescriptor;
    private setDraggedViewlet(viewlet);
    static clearDraggedViewlet(): void;
    private showContextMenu(container);
    focus(): void;
    keybinding: string;
    protected _updateClass(): void;
    protected _updateChecked(): void;
    protected _updateEnabled(): void;
    dispose(): void;
}
export declare class ViewletOverflowActivityAction extends ActivityAction {
    private showMenu;
    constructor(showMenu: () => void);
    run(event: any): TPromise<any>;
}
export declare class ViewletOverflowActivityActionItem extends ActivityActionItem {
    private getOverflowingViewlets;
    private getBadge;
    private instantiationService;
    private viewletService;
    private contextMenuService;
    private name;
    private cssClass;
    private actions;
    constructor(action: ActivityAction, getOverflowingViewlets: () => ViewletDescriptor[], getBadge: (viewlet: ViewletDescriptor) => IBadge, instantiationService: IInstantiationService, viewletService: IViewletService, contextMenuService: IContextMenuService, themeService: IThemeService);
    showMenu(): void;
    private getActions();
    dispose(): void;
}
export declare class ToggleViewletPinnedAction extends Action {
    private viewlet;
    private activityBarService;
    constructor(viewlet: ViewletDescriptor, activityBarService: IActivityBarService);
    run(context?: ViewletDescriptor): TPromise<any>;
}
export declare class GlobalActivityAction extends ActivityAction {
    constructor(activity: IGlobalActivity);
}
export declare class GlobalActivityActionItem extends ActivityActionItem {
    protected contextMenuService: IContextMenuService;
    constructor(action: GlobalActivityAction, themeService: IThemeService, contextMenuService: IContextMenuService);
    render(container: HTMLElement): void;
    private showContextMenu(location);
}
