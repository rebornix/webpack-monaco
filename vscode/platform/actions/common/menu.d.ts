import Event from 'vs/base/common/event';
import { TPromise } from 'vs/base/common/winjs.base';
import { IContextKeyService } from 'vs/platform/contextkey/common/contextkey';
import { MenuId, MenuItemAction, IMenu, IMenuActionOptions } from 'vs/platform/actions/common/actions';
import { ICommandService } from 'vs/platform/commands/common/commands';
export declare class Menu implements IMenu {
    private _id;
    private _commandService;
    private _contextKeyService;
    private _menuGroups;
    private _disposables;
    private _onDidChange;
    constructor(_id: MenuId, startupSignal: TPromise<boolean>, _commandService: ICommandService, _contextKeyService: IContextKeyService);
    dispose(): void;
    readonly onDidChange: Event<IMenu>;
    getActions(options: IMenuActionOptions): [string, MenuItemAction[]][];
    private static _fillInKbExprKeys(exp, set);
    private static _compareMenuItems(a, b);
}
