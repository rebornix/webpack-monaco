import 'vs/css!./toolbar';
import { Builder } from 'vs/base/browser/builder';
import { IActionRunner, IAction } from 'vs/base/common/actions';
import { ActionsOrientation, IActionItemProvider, BaseActionItem } from 'vs/base/browser/ui/actionbar/actionbar';
import { IContextMenuProvider, IActionProvider } from 'vs/base/browser/ui/dropdown/dropdown';
import { ResolvedKeybinding } from 'vs/base/common/keyCodes';
export declare const CONTEXT = "context.toolbar";
export interface IToolBarOptions {
    orientation?: ActionsOrientation;
    actionItemProvider?: IActionItemProvider;
    ariaLabel?: string;
    getKeyBinding?: (action: IAction) => ResolvedKeybinding;
}
/**
 * A widget that combines an action bar for primary actions and a dropdown for secondary actions.
 */
export declare class ToolBar {
    private options;
    private actionBar;
    private toggleMenuAction;
    private toggleMenuActionItem;
    private hasSecondaryActions;
    private lookupKeybindings;
    constructor(container: HTMLElement, contextMenuProvider: IContextMenuProvider, options?: IToolBarOptions);
    actionRunner: IActionRunner;
    context: any;
    getContainer(): Builder;
    setAriaLabel(label: string): void;
    setActions(primaryActions: IAction[], secondaryActions?: IAction[]): () => void;
    private getKeybindingLabel(action);
    addPrimaryAction(primaryAction: IAction): () => void;
    dispose(): void;
}
export declare class DropdownMenuActionItem extends BaseActionItem {
    private menuActionsOrProvider;
    private dropdownMenu;
    private toUnbind;
    private contextMenuProvider;
    private actionItemProvider;
    private keybindings;
    private clazz;
    constructor(action: IAction, menuActions: IAction[], contextMenuProvider: IContextMenuProvider, actionItemProvider: IActionItemProvider, actionRunner: IActionRunner, keybindings: (action: IAction) => ResolvedKeybinding, clazz: string);
    constructor(action: IAction, actionProvider: IActionProvider, contextMenuProvider: IContextMenuProvider, actionItemProvider: IActionItemProvider, actionRunner: IActionRunner, keybindings: (action: IAction) => ResolvedKeybinding, clazz: string);
    render(container: HTMLElement): void;
    setActionContext(newContext: any): void;
    show(): void;
    dispose(): void;
}
