import { Action } from 'vs/base/common/actions';
import { TPromise } from 'vs/base/common/winjs.base';
import { SyncDescriptor0 } from 'vs/platform/instantiation/common/descriptors';
import { IConstructorSignature2 } from 'vs/platform/instantiation/common/instantiation';
import { IKeybindings } from 'vs/platform/keybinding/common/keybindingsRegistry';
import { ContextKeyExpr, IContextKeyService } from 'vs/platform/contextkey/common/contextkey';
import { ICommandService } from 'vs/platform/commands/common/commands';
import { IDisposable } from 'vs/base/common/lifecycle';
import Event from 'vs/base/common/event';
export interface ILocalizedString {
    value: string;
    original: string;
}
export interface ICommandAction {
    id: string;
    title: string | ILocalizedString;
    category?: string | ILocalizedString;
    iconClass?: string;
}
export interface IMenuItem {
    command: ICommandAction;
    alt?: ICommandAction;
    when?: ContextKeyExpr;
    group?: 'navigation' | string;
    order?: number;
}
export declare class MenuId {
    private _id;
    static readonly EditorTitle: MenuId;
    static readonly EditorTitleContext: MenuId;
    static readonly EditorContext: MenuId;
    static readonly ExplorerContext: MenuId;
    static readonly ProblemsPanelContext: MenuId;
    static readonly DebugVariablesContext: MenuId;
    static readonly DebugWatchContext: MenuId;
    static readonly DebugCallStackContext: MenuId;
    static readonly DebugBreakpointsContext: MenuId;
    static readonly DebugConsoleContext: MenuId;
    static readonly SCMTitle: MenuId;
    static readonly SCMResourceGroupContext: MenuId;
    static readonly SCMResourceContext: MenuId;
    static readonly CommandPalette: MenuId;
    static readonly ViewTitle: MenuId;
    static readonly ViewItemContext: MenuId;
    constructor(_id: string);
    readonly id: string;
}
export interface IMenuActionOptions {
    arg?: any;
    shouldForwardArgs?: boolean;
}
export interface IMenu extends IDisposable {
    onDidChange: Event<IMenu>;
    getActions(options?: IMenuActionOptions): [string, MenuItemAction[]][];
}
export declare const IMenuService: {
    (...args: any[]): void;
    type: IMenuService;
};
export interface IMenuService {
    _serviceBrand: any;
    createMenu(id: MenuId, scopedKeybindingService: IContextKeyService): IMenu;
}
export interface IMenuRegistry {
    addCommand(userCommand: ICommandAction): boolean;
    getCommand(id: string): ICommandAction;
    appendMenuItem(menu: MenuId, item: IMenuItem): IDisposable;
    getMenuItems(loc: MenuId): IMenuItem[];
}
export declare const MenuRegistry: IMenuRegistry;
export declare class ExecuteCommandAction extends Action {
    private _commandService;
    constructor(id: string, label: string, _commandService: ICommandService);
    run(...args: any[]): TPromise<any>;
}
export declare class MenuItemAction extends ExecuteCommandAction {
    private _options;
    readonly item: ICommandAction;
    readonly alt: MenuItemAction;
    constructor(item: ICommandAction, alt: ICommandAction, options: IMenuActionOptions, commandService: ICommandService);
    run(...args: any[]): TPromise<any>;
}
export declare class SyncActionDescriptor {
    private _descriptor;
    private _id;
    private _label;
    private _keybindings;
    private _keybindingContext;
    private _keybindingWeight;
    constructor(ctor: IConstructorSignature2<string, string, Action>, id: string, label: string, keybindings?: IKeybindings, keybindingContext?: ContextKeyExpr, keybindingWeight?: number);
    readonly syncDescriptor: SyncDescriptor0<Action>;
    readonly id: string;
    readonly label: string;
    readonly keybindings: IKeybindings;
    readonly keybindingContext: ContextKeyExpr;
    readonly keybindingWeight: number;
}
