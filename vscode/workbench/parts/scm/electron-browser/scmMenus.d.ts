import 'vs/css!./media/scmViewlet';
import Event from 'vs/base/common/event';
import { IDisposable } from 'vs/base/common/lifecycle';
import { IContextKeyService } from 'vs/platform/contextkey/common/contextkey';
import { IMenuService } from 'vs/platform/actions/common/actions';
import { IAction } from 'vs/base/common/actions';
import { ISCMProvider, ISCMResource, ISCMResourceGroup } from 'vs/workbench/services/scm/common/scm';
export declare class SCMMenus implements IDisposable {
    private provider;
    private menuService;
    private contextKeyService;
    private titleMenu;
    private titleActions;
    private titleSecondaryActions;
    private _onDidChangeTitle;
    readonly onDidChangeTitle: Event<void>;
    private disposables;
    constructor(provider: ISCMProvider, contextKeyService: IContextKeyService, menuService: IMenuService);
    private updateTitleActions();
    getTitleActions(): IAction[];
    getTitleSecondaryActions(): IAction[];
    getResourceGroupActions(group: ISCMResourceGroup): IAction[];
    getResourceGroupContextActions(group: ISCMResourceGroup): IAction[];
    getResourceActions(resource: ISCMResource): IAction[];
    getResourceContextActions(resource: ISCMResource): IAction[];
    private getActions(menuId, resource);
    dispose(): void;
}
