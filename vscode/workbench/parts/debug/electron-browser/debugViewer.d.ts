import { TPromise } from 'vs/base/common/winjs.base';
import { IKeyboardEvent } from 'vs/base/browser/keyboardEvent';
import { IMouseEvent, DragMouseEvent } from 'vs/base/browser/mouseEvent';
import { IAction, IActionRunner } from 'vs/base/common/actions';
import { IActionItem } from 'vs/base/browser/ui/actionbar/actionbar';
import { ITree, IAccessibilityProvider, ContextMenuEvent, IDataSource, IRenderer, IDragAndDropData, IDragOverReaction, IActionProvider } from 'vs/base/parts/tree/browser/tree';
import { DefaultController, DefaultDragAndDrop } from 'vs/base/parts/tree/browser/treeDefaults';
import { IContextViewService, IContextMenuService } from 'vs/platform/contextview/browser/contextView';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { IWorkspaceContextService } from 'vs/platform/workspace/common/workspace';
import { IContextKeyService } from 'vs/platform/contextkey/common/contextkey';
import { IMenuService, MenuId } from 'vs/platform/actions/common/actions';
import { IWorkbenchEditorService } from 'vs/workbench/services/editor/common/editorService';
import * as debug from 'vs/workbench/parts/debug/common/debug';
import { Expression, Variable, Breakpoint, Model, ThreadAndProcessIds } from 'vs/workbench/parts/debug/common/debugModel';
import { IThemeService } from 'vs/platform/theme/common/themeService';
import { IEnvironmentService } from 'vs/platform/environment/common/environment';
export interface IRenderValueOptions {
    preserveWhitespace?: boolean;
    showChanged?: boolean;
    maxValueLength?: number;
    showHover?: boolean;
}
export declare function renderExpressionValue(expressionOrValue: debug.IExpression | string, container: HTMLElement, options: IRenderValueOptions): void;
export declare function renderVariable(tree: ITree, variable: Variable, data: IVariableTemplateData, showChanged: boolean): void;
export declare class BaseDebugController extends DefaultController {
    private actionProvider;
    protected debugService: debug.IDebugService;
    protected editorService: IWorkbenchEditorService;
    private contextMenuService;
    private contributedContextMenu;
    constructor(actionProvider: IActionProvider, menuId: MenuId, debugService: debug.IDebugService, editorService: IWorkbenchEditorService, contextMenuService: IContextMenuService, contextKeyService: IContextKeyService, menuService: IMenuService);
    onContextMenu(tree: ITree, element: debug.IEnablement, event: ContextMenuEvent): boolean;
    protected getContext(element: any): any;
}
export declare class CallStackController extends BaseDebugController {
    protected onLeftClick(tree: ITree, element: any, event: IMouseEvent): boolean;
    protected getContext(element: any): any;
    showMoreStackFrames(tree: ITree, threadAndProcessIds: ThreadAndProcessIds): boolean;
    focusStackFrame(stackFrame: debug.IStackFrame, event: IKeyboardEvent | IMouseEvent, preserveFocus: boolean): void;
}
export declare class CallStackActionProvider implements IActionProvider {
    private instantiationService;
    private debugService;
    constructor(instantiationService: IInstantiationService, debugService: debug.IDebugService);
    hasActions(tree: ITree, element: any): boolean;
    getActions(tree: ITree, element: any): TPromise<IAction[]>;
    hasSecondaryActions(tree: ITree, element: any): boolean;
    getSecondaryActions(tree: ITree, element: any): TPromise<IAction[]>;
    getActionItem(tree: ITree, element: any, action: IAction): IActionItem;
}
export declare class CallStackDataSource implements IDataSource {
    getId(tree: ITree, element: any): string;
    hasChildren(tree: ITree, element: any): boolean;
    getChildren(tree: ITree, element: any): TPromise<any>;
    private getThreadChildren(thread);
    getParent(tree: ITree, element: any): TPromise<any>;
}
export declare class CallStackRenderer implements IRenderer {
    private contextService;
    private environmentService;
    private static THREAD_TEMPLATE_ID;
    private static STACK_FRAME_TEMPLATE_ID;
    private static ERROR_TEMPLATE_ID;
    private static LOAD_MORE_TEMPLATE_ID;
    private static PROCESS_TEMPLATE_ID;
    constructor(contextService: IWorkspaceContextService, environmentService: IEnvironmentService);
    getHeight(tree: ITree, element: any): number;
    getTemplateId(tree: ITree, element: any): string;
    renderTemplate(tree: ITree, templateId: string, container: HTMLElement): any;
    renderElement(tree: ITree, element: any, templateId: string, templateData: any): void;
    private renderProcess(process, data);
    private renderThread(thread, data);
    private renderError(element, data);
    private renderLoadMore(element, data);
    private renderStackFrame(stackFrame, data);
    disposeTemplate(tree: ITree, templateId: string, templateData: any): void;
}
export declare class CallstackAccessibilityProvider implements IAccessibilityProvider {
    private contextService;
    constructor(contextService: IWorkspaceContextService);
    getAriaLabel(tree: ITree, element: any): string;
}
export declare class VariablesActionProvider implements IActionProvider {
    private instantiationService;
    constructor(instantiationService: IInstantiationService);
    hasActions(tree: ITree, element: any): boolean;
    getActions(tree: ITree, element: any): TPromise<IAction[]>;
    hasSecondaryActions(tree: ITree, element: any): boolean;
    getSecondaryActions(tree: ITree, element: any): TPromise<IAction[]>;
    getActionItem(tree: ITree, element: any, action: IAction): IActionItem;
}
export declare class VariablesDataSource implements IDataSource {
    getId(tree: ITree, element: any): string;
    hasChildren(tree: ITree, element: any): boolean;
    getChildren(tree: ITree, element: any): TPromise<any>;
    getParent(tree: ITree, element: any): TPromise<any>;
}
export interface IVariableTemplateData {
    expression: HTMLElement;
    name: HTMLElement;
    value: HTMLElement;
}
export declare class VariablesRenderer implements IRenderer {
    private debugService;
    private contextViewService;
    private themeService;
    private static SCOPE_TEMPLATE_ID;
    private static VARIABLE_TEMPLATE_ID;
    constructor(debugService: debug.IDebugService, contextViewService: IContextViewService, themeService: IThemeService);
    getHeight(tree: ITree, element: any): number;
    getTemplateId(tree: ITree, element: any): string;
    renderTemplate(tree: ITree, templateId: string, container: HTMLElement): any;
    renderElement(tree: ITree, element: any, templateId: string, templateData: any): void;
    private renderScope(scope, data);
    disposeTemplate(tree: ITree, templateId: string, templateData: any): void;
}
export declare class VariablesAccessibilityProvider implements IAccessibilityProvider {
    getAriaLabel(tree: ITree, element: any): string;
}
export declare class VariablesController extends BaseDebugController {
    protected onLeftClick(tree: ITree, element: any, event: IMouseEvent): boolean;
}
export declare class WatchExpressionsActionProvider implements IActionProvider {
    private instantiationService;
    constructor(instantiationService: IInstantiationService);
    hasActions(tree: ITree, element: any): boolean;
    hasSecondaryActions(tree: ITree, element: any): boolean;
    getActions(tree: ITree, element: any): TPromise<IAction[]>;
    getSecondaryActions(tree: ITree, element: any): TPromise<IAction[]>;
    getActionItem(tree: ITree, element: any, action: IAction): IActionItem;
}
export declare class WatchExpressionsDataSource implements IDataSource {
    getId(tree: ITree, element: any): string;
    hasChildren(tree: ITree, element: any): boolean;
    getChildren(tree: ITree, element: any): TPromise<any>;
    getParent(tree: ITree, element: any): TPromise<any>;
}
export declare class WatchExpressionsRenderer implements IRenderer {
    private actionRunner;
    private debugService;
    private contextViewService;
    private themeService;
    private static WATCH_EXPRESSION_TEMPLATE_ID;
    private static VARIABLE_TEMPLATE_ID;
    private toDispose;
    private actionProvider;
    constructor(actionProvider: IActionProvider, actionRunner: IActionRunner, debugService: debug.IDebugService, contextViewService: IContextViewService, themeService: IThemeService);
    getHeight(tree: ITree, element: any): number;
    getTemplateId(tree: ITree, element: any): string;
    renderTemplate(tree: ITree, templateId: string, container: HTMLElement): any;
    renderElement(tree: ITree, element: any, templateId: string, templateData: any): void;
    private renderWatchExpression(tree, watchExpression, data);
    disposeTemplate(tree: ITree, templateId: string, templateData: any): void;
    dispose(): void;
}
export declare class WatchExpressionsAccessibilityProvider implements IAccessibilityProvider {
    getAriaLabel(tree: ITree, element: any): string;
}
export declare class WatchExpressionsController extends BaseDebugController {
    protected onLeftClick(tree: ITree, element: any, event: IMouseEvent): boolean;
}
export declare class WatchExpressionsDragAndDrop extends DefaultDragAndDrop {
    private debugService;
    constructor(debugService: debug.IDebugService);
    getDragURI(tree: ITree, element: Expression): string;
    getDragLabel(tree: ITree, elements: Expression[]): string;
    onDragOver(tree: ITree, data: IDragAndDropData, target: Expression | Model, originalEvent: DragMouseEvent): IDragOverReaction;
    drop(tree: ITree, data: IDragAndDropData, target: Expression | Model, originalEvent: DragMouseEvent): void;
}
export declare class BreakpointsActionProvider implements IActionProvider {
    private instantiationService;
    private debugService;
    constructor(instantiationService: IInstantiationService, debugService: debug.IDebugService);
    hasActions(tree: ITree, element: any): boolean;
    hasSecondaryActions(tree: ITree, element: any): boolean;
    getActions(tree: ITree, element: any): TPromise<IAction[]>;
    getSecondaryActions(tree: ITree, element: any): TPromise<IAction[]>;
    getActionItem(tree: ITree, element: any, action: IAction): IActionItem;
}
export declare class BreakpointsDataSource implements IDataSource {
    getId(tree: ITree, element: any): string;
    hasChildren(tree: ITree, element: any): boolean;
    getChildren(tree: ITree, element: any): TPromise<any>;
    getParent(tree: ITree, element: any): TPromise<any>;
}
export declare class BreakpointsRenderer implements IRenderer {
    private actionProvider;
    private actionRunner;
    private contextService;
    private debugService;
    private contextViewService;
    private themeService;
    private environmentService;
    private static EXCEPTION_BREAKPOINT_TEMPLATE_ID;
    private static FUNCTION_BREAKPOINT_TEMPLATE_ID;
    private static BREAKPOINT_TEMPLATE_ID;
    constructor(actionProvider: BreakpointsActionProvider, actionRunner: IActionRunner, contextService: IWorkspaceContextService, debugService: debug.IDebugService, contextViewService: IContextViewService, themeService: IThemeService, environmentService: IEnvironmentService);
    getHeight(tree: ITree, element: any): number;
    getTemplateId(tree: ITree, element: any): string;
    renderTemplate(tree: ITree, templateId: string, container: HTMLElement): any;
    renderElement(tree: ITree, element: any, templateId: string, templateData: any): void;
    private renderExceptionBreakpoint(exceptionBreakpoint, data);
    private renderFunctionBreakpoint(tree, functionBreakpoint, data);
    private renderBreakpoint(tree, breakpoint, data);
    disposeTemplate(tree: ITree, templateId: string, templateData: any): void;
}
export declare class BreakpointsAccessibilityProvider implements IAccessibilityProvider {
    private contextService;
    constructor(contextService: IWorkspaceContextService);
    getAriaLabel(tree: ITree, element: any): string;
}
export declare class BreakpointsController extends BaseDebugController {
    protected onLeftClick(tree: ITree, element: any, event: IMouseEvent): boolean;
    openBreakpointSource(breakpoint: Breakpoint, event: IKeyboardEvent | IMouseEvent, preserveFocus: boolean): void;
}
