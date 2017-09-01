import { IContextMenuService, IContextViewService } from 'vs/platform/contextview/browser/contextView';
import { IKeybindingService } from 'vs/platform/keybinding/common/keybinding';
import { IContextKeyService } from 'vs/platform/contextkey/common/contextkey';
import { IMenuService } from 'vs/platform/actions/common/actions';
import { ICommonCodeEditor, IEditorContribution } from 'vs/editor/common/editorCommon';
import { ICodeEditor } from 'vs/editor/browser/editorBrowser';
export interface IPosition {
    x: number;
    y: number;
}
export declare class ContextMenuController implements IEditorContribution {
    private _contextMenuService;
    private _contextViewService;
    private _contextKeyService;
    private _keybindingService;
    private _menuService;
    private static ID;
    static get(editor: ICommonCodeEditor): ContextMenuController;
    private _toDispose;
    private _contextMenuIsBeingShownCount;
    private _editor;
    constructor(editor: ICodeEditor, _contextMenuService: IContextMenuService, _contextViewService: IContextViewService, _contextKeyService: IContextKeyService, _keybindingService: IKeybindingService, _menuService: IMenuService);
    private _onContextMenu(e);
    showContextMenu(forcedPosition?: IPosition): void;
    private _getMenuActions();
    private _doShowContextMenu(actions, forcedPosition?);
    private _keybindingFor(action);
    getId(): string;
    dispose(): void;
}
