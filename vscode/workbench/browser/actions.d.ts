import { TPromise } from 'vs/base/common/winjs.base';
import { Action, IAction } from 'vs/base/common/actions';
import { BaseActionItem } from 'vs/base/browser/ui/actionbar/actionbar';
import { ITree, IActionProvider } from 'vs/base/parts/tree/browser/tree';
import { IInstantiationService, IConstructorSignature0 } from 'vs/platform/instantiation/common/instantiation';
/**
 * The action bar contributor allows to add actions to an actionbar in a given context.
 */
export declare class ActionBarContributor {
    /**
     * Returns true if this contributor has actions for the given context.
     */
    hasActions(context: any): boolean;
    /**
     * Returns an array of primary actions in the given context.
     */
    getActions(context: any): IAction[];
    /**
     * Returns true if this contributor has secondary actions for the given context.
     */
    hasSecondaryActions(context: any): boolean;
    /**
     * Returns an array of secondary actions in the given context.
     */
    getSecondaryActions(context: any): IAction[];
    /**
     * Can return a specific IActionItem to render the given action.
     */
    getActionItem(context: any, action: Action): BaseActionItem;
}
/**
 * Some predefined scopes to contribute actions to
 */
export declare const Scope: {
    GLOBAL: string;
    VIEWLET: string;
    PANEL: string;
    EDITOR: string;
    VIEWER: string;
};
/**
 * The ContributableActionProvider leverages the actionbar contribution model to find actions.
 */
export declare class ContributableActionProvider implements IActionProvider {
    private registry;
    constructor();
    private toContext(tree, element);
    hasActions(tree: ITree, element: any): boolean;
    getActions(tree: ITree, element: any): TPromise<IAction[]>;
    hasSecondaryActions(tree: ITree, element: any): boolean;
    getSecondaryActions(tree: ITree, element: any): TPromise<IAction[]>;
    getActionItem(tree: ITree, element: any, action: Action): BaseActionItem;
}
export declare function prepareActions(actions: IAction[]): IAction[];
export declare const Extensions: {
    Actionbar: string;
};
export interface IActionBarRegistry {
    /**
     * Goes through all action bar contributors and asks them for contributed actions for
     * the provided scope and context. Supports primary actions.
     */
    getActionBarActionsForContext(scope: string, context: any): IAction[];
    /**
     * Goes through all action bar contributors and asks them for contributed actions for
     * the provided scope and context. Supports secondary actions.
     */
    getSecondaryActionBarActionsForContext(scope: string, context: any): IAction[];
    /**
     * Goes through all action bar contributors and asks them for contributed action item for
     * the provided scope and context.
     */
    getActionItemForContext(scope: string, context: any, action: Action): BaseActionItem;
    /**
     * Registers an Actionbar contributor. It will be called to contribute actions to all the action bars
     * that are used in the Workbench in the given scope.
     */
    registerActionBarContributor(scope: string, ctor: IConstructorSignature0<ActionBarContributor>): void;
    /**
     * Returns an array of registered action bar contributors known to the workbench for the given scope.
     */
    getActionBarContributors(scope: string): ActionBarContributor[];
    setInstantiationService(service: IInstantiationService): void;
}
