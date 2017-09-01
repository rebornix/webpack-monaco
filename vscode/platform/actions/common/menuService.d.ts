import { IContextKeyService } from 'vs/platform/contextkey/common/contextkey';
import { MenuId, IMenu, IMenuService } from 'vs/platform/actions/common/actions';
import { IExtensionService } from 'vs/platform/extensions/common/extensions';
import { ICommandService } from 'vs/platform/commands/common/commands';
export declare class MenuService implements IMenuService {
    private _extensionService;
    private _commandService;
    _serviceBrand: any;
    constructor(_extensionService: IExtensionService, _commandService: ICommandService);
    createMenu(id: MenuId, contextKeyService: IContextKeyService): IMenu;
}
