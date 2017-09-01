import { ICommandService } from 'vs/platform/commands/common/commands';
import { IContextMenuService } from 'vs/platform/contextview/browser/contextView';
import { IContextKeyService } from 'vs/platform/contextkey/common/contextkey';
import { IKeybindingService } from 'vs/platform/keybinding/common/keybinding';
import { IMarkerService } from 'vs/platform/markers/common/markers';
import { ICommonCodeEditor, IEditorContribution } from 'vs/editor/common/editorCommon';
import { ServicesAccessor, EditorAction } from 'vs/editor/common/editorCommonExtensions';
import { ICodeEditor } from 'vs/editor/browser/editorBrowser';
export declare class QuickFixController implements IEditorContribution {
    private _keybindingService;
    private static ID;
    static get(editor: ICommonCodeEditor): QuickFixController;
    private _editor;
    private _model;
    private _quickFixContextMenu;
    private _lightBulbWidget;
    private _disposables;
    constructor(editor: ICodeEditor, markerService: IMarkerService, contextKeyService: IContextKeyService, commandService: ICommandService, contextMenuService: IContextMenuService, _keybindingService: IKeybindingService);
    dispose(): void;
    private _onQuickFixEvent(e);
    getId(): string;
    private _handleLightBulbSelect(coords);
    triggerFromEditorSelection(): void;
    private _updateLightBulbTitle();
}
export declare class QuickFixAction extends EditorAction {
    static Id: string;
    constructor();
    run(accessor: ServicesAccessor, editor: ICommonCodeEditor): void;
}
