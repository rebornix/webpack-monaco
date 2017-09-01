import { TPromise } from 'vs/base/common/winjs.base';
import { Position } from 'vs/editor/common/core/position';
import { ICodeEditor } from 'vs/editor/browser/editorBrowser';
import { Command } from 'vs/editor/common/modes';
import { IContextMenuService } from 'vs/platform/contextview/browser/contextView';
import { ICommandService } from 'vs/platform/commands/common/commands';
import Event from 'vs/base/common/event';
export declare class QuickFixContextMenu {
    private _editor;
    private _contextMenuService;
    private _commandService;
    private _visible;
    private _onDidExecuteCodeAction;
    readonly onDidExecuteCodeAction: Event<void>;
    constructor(editor: ICodeEditor, contextMenuService: IContextMenuService, commandService: ICommandService);
    show(fixes: TPromise<Command[]>, at: {
        x: number;
        y: number;
    } | Position): void;
    readonly isVisible: boolean;
    private _toCoords(position);
}
