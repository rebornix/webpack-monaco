import { IKeybindingService } from 'vs/platform/keybinding/common/keybinding';
import { IMenu, MenuItemAction, IMenuActionOptions } from 'vs/platform/actions/common/actions';
import { IMessageService } from 'vs/platform/message/common/message';
import { IAction } from 'vs/base/common/actions';
import { ActionItem } from 'vs/base/browser/ui/actionbar/actionbar';
export declare function fillInActions(menu: IMenu, options: IMenuActionOptions, target: IAction[] | {
    primary: IAction[];
    secondary: IAction[];
}, isPrimaryGroup?: (group: string) => boolean): void;
export declare function createActionItem(action: IAction, keybindingService: IKeybindingService, messageService: IMessageService): ActionItem;
export declare class MenuItemActionItem extends ActionItem {
    private _keybindingService;
    protected _messageService: IMessageService;
    private _wantsAltCommand;
    constructor(action: MenuItemAction, _keybindingService: IKeybindingService, _messageService: IMessageService);
    protected readonly _commandAction: IAction;
    onClick(event: MouseEvent): void;
    render(container: HTMLElement): void;
    _updateLabel(): void;
    _updateTooltip(): void;
    _updateClass(): void;
}
