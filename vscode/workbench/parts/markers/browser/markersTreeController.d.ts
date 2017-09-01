import * as mouse from 'vs/base/browser/mouseEvent';
import tree = require('vs/base/parts/tree/browser/tree');
import treedefaults = require('vs/base/parts/tree/browser/treeDefaults');
import { IContextMenuService } from 'vs/platform/contextview/browser/contextView';
import { IContextKeyService } from 'vs/platform/contextkey/common/contextkey';
import { IMenuService } from 'vs/platform/actions/common/actions';
import { IKeybindingService } from 'vs/platform/keybinding/common/keybinding';
export declare class Controller extends treedefaults.DefaultController {
    private contextMenuService;
    private _keybindingService;
    private contextMenu;
    constructor(contextMenuService: IContextMenuService, menuService: IMenuService, contextKeyService: IContextKeyService, _keybindingService: IKeybindingService);
    protected onLeftClick(tree: tree.ITree, element: any, event: mouse.IMouseEvent): boolean;
    onContextMenu(tree: tree.ITree, element: any, event: tree.ContextMenuEvent): boolean;
    private _getMenuActions();
}
