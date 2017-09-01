import { IAction } from 'vs/base/common/actions';
import { CollapsibleView, IViewletViewOptions } from 'vs/workbench/parts/views/browser/views';
import { IDebugService } from 'vs/workbench/parts/debug/common/debug';
import { IContextMenuService } from 'vs/platform/contextview/browser/contextView';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { ITelemetryService } from 'vs/platform/telemetry/common/telemetry';
import { IKeybindingService } from 'vs/platform/keybinding/common/keybinding';
import { IContextKeyService } from 'vs/platform/contextkey/common/contextkey';
import { IListService } from 'vs/platform/list/browser/listService';
import { IThemeService } from 'vs/platform/theme/common/themeService';
export declare class VariablesView extends CollapsibleView {
    private options;
    private telemetryService;
    private debugService;
    private instantiationService;
    private listService;
    private themeService;
    private static MEMENTO;
    private onFocusStackFrameScheduler;
    private variablesFocusedContext;
    private settings;
    constructor(initialSize: number, options: IViewletViewOptions, contextMenuService: IContextMenuService, telemetryService: ITelemetryService, debugService: IDebugService, keybindingService: IKeybindingService, instantiationService: IInstantiationService, contextKeyService: IContextKeyService, listService: IListService, themeService: IThemeService);
    renderHeader(container: HTMLElement): void;
    renderBody(container: HTMLElement): void;
    shutdown(): void;
}
export declare class WatchExpressionsView extends CollapsibleView {
    private options;
    private debugService;
    private instantiationService;
    private listService;
    private themeService;
    private static MEMENTO;
    private onWatchExpressionsUpdatedScheduler;
    private toReveal;
    private watchExpressionsFocusedContext;
    private settings;
    constructor(size: number, options: IViewletViewOptions, contextMenuService: IContextMenuService, debugService: IDebugService, keybindingService: IKeybindingService, instantiationService: IInstantiationService, contextKeyService: IContextKeyService, listService: IListService, themeService: IThemeService);
    renderHeader(container: HTMLElement): void;
    renderBody(container: HTMLElement): void;
    shutdown(): void;
}
export declare class CallStackView extends CollapsibleView {
    private options;
    private telemetryService;
    private debugService;
    private instantiationService;
    private listService;
    private themeService;
    private static MEMENTO;
    private pauseMessage;
    private pauseMessageLabel;
    private onCallStackChangeScheduler;
    private settings;
    constructor(size: number, options: IViewletViewOptions, contextMenuService: IContextMenuService, telemetryService: ITelemetryService, debugService: IDebugService, keybindingService: IKeybindingService, instantiationService: IInstantiationService, listService: IListService, themeService: IThemeService);
    renderHeader(container: HTMLElement): void;
    renderBody(container: HTMLElement): void;
    private updateTreeSelection();
    shutdown(): void;
}
export declare class BreakpointsView extends CollapsibleView {
    private options;
    private debugService;
    private instantiationService;
    private listService;
    private themeService;
    private static MAX_VISIBLE_FILES;
    private static MEMENTO;
    private breakpointsFocusedContext;
    private settings;
    constructor(size: number, options: IViewletViewOptions, contextMenuService: IContextMenuService, debugService: IDebugService, keybindingService: IKeybindingService, instantiationService: IInstantiationService, contextKeyService: IContextKeyService, listService: IListService, themeService: IThemeService);
    renderHeader(container: HTMLElement): void;
    renderBody(container: HTMLElement): void;
    getActions(): IAction[];
    private onBreakpointsChange();
    private static getExpandedBodySize(length);
    shutdown(): void;
}
