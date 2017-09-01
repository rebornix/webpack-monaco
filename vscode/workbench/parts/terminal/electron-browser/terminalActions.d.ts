import { Action, IAction } from 'vs/base/common/actions';
import { ICodeEditorService } from 'vs/editor/common/services/codeEditorService';
import { ITerminalService } from 'vs/workbench/parts/terminal/common/terminal';
import { SelectActionItem } from 'vs/base/browser/ui/actionbar/actionbar';
import { TPromise } from 'vs/base/common/winjs.base';
import { TogglePanelAction } from 'vs/workbench/browser/panel';
import { IPartService } from 'vs/workbench/services/part/common/partService';
import { IPanelService } from 'vs/workbench/services/panel/common/panelService';
import { IMessageService } from 'vs/platform/message/common/message';
import { IThemeService } from 'vs/platform/theme/common/themeService';
import { IQuickOpenService } from 'vs/platform/quickOpen/common/quickOpen';
import { ActionBarContributor } from 'vs/workbench/browser/actions';
import { TerminalEntry } from 'vs/workbench/parts/terminal/browser/terminalQuickOpen';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
export declare const TERMINAL_PICKER_PREFIX = "term ";
export declare class ToggleTerminalAction extends TogglePanelAction {
    private terminalService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, panelService: IPanelService, partService: IPartService, terminalService: ITerminalService);
    run(event?: any): TPromise<any>;
}
export declare class KillTerminalAction extends Action {
    private terminalService;
    static ID: string;
    static LABEL: string;
    static PANEL_LABEL: string;
    constructor(id: string, label: string, terminalService: ITerminalService);
    run(event?: any): TPromise<any>;
}
export declare class QuickKillTerminalAction extends Action {
    private terminalEntry;
    private terminalService;
    private quickOpenService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, terminalEntry: TerminalEntry, terminalService: ITerminalService, quickOpenService: IQuickOpenService);
    run(event?: any): TPromise<any>;
}
/**
 * Copies the terminal selection. Note that since the command palette takes focus from the terminal,
 * this cannot be triggered through the command palette.
 */
export declare class CopyTerminalSelectionAction extends Action {
    private terminalService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, terminalService: ITerminalService);
    run(event?: any): TPromise<any>;
}
export declare class SelectAllTerminalAction extends Action {
    private terminalService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, terminalService: ITerminalService);
    run(event?: any): TPromise<any>;
}
export declare class DeleteWordLeftTerminalAction extends Action {
    private terminalService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, terminalService: ITerminalService);
    run(event?: any): TPromise<any>;
}
export declare class DeleteWordRightTerminalAction extends Action {
    private terminalService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, terminalService: ITerminalService);
    run(event?: any): TPromise<any>;
}
export declare class CreateNewTerminalAction extends Action {
    private terminalService;
    static ID: string;
    static LABEL: string;
    static PANEL_LABEL: string;
    constructor(id: string, label: string, terminalService: ITerminalService);
    run(event?: any): TPromise<any>;
}
export declare class FocusActiveTerminalAction extends Action {
    private terminalService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, terminalService: ITerminalService);
    run(event?: any): TPromise<any>;
}
export declare class FocusNextTerminalAction extends Action {
    private terminalService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, terminalService: ITerminalService);
    run(event?: any): TPromise<any>;
}
export declare class FocusTerminalAtIndexAction extends Action {
    private terminalService;
    private static ID_PREFIX;
    constructor(id: string, label: string, terminalService: ITerminalService);
    run(event?: any): TPromise<any>;
    static getId(n: number): string;
    static getLabel(n: number): string;
    private getTerminalNumber();
}
export declare class FocusPreviousTerminalAction extends Action {
    private terminalService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, terminalService: ITerminalService);
    run(event?: any): TPromise<any>;
}
export declare class TerminalPasteAction extends Action {
    private terminalService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, terminalService: ITerminalService);
    run(event?: any): TPromise<any>;
}
export declare class SelectDefaultShellWindowsTerminalAction extends Action {
    private terminalService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, terminalService: ITerminalService);
    run(event?: any): TPromise<any>;
}
export declare class RunSelectedTextInTerminalAction extends Action {
    private codeEditorService;
    private terminalService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, codeEditorService: ICodeEditorService, terminalService: ITerminalService);
    run(event?: any): TPromise<any>;
}
export declare class RunActiveFileInTerminalAction extends Action {
    private codeEditorService;
    private terminalService;
    private messageService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, codeEditorService: ICodeEditorService, terminalService: ITerminalService, messageService: IMessageService);
    run(event?: any): TPromise<any>;
}
export declare class SwitchTerminalInstanceAction extends Action {
    private terminalService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, terminalService: ITerminalService);
    run(item?: string): TPromise<any>;
}
export declare class SwitchTerminalInstanceActionItem extends SelectActionItem {
    private terminalService;
    constructor(action: IAction, terminalService: ITerminalService, themeService: IThemeService);
    private _updateItems();
}
export declare class ScrollDownTerminalAction extends Action {
    private terminalService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, terminalService: ITerminalService);
    run(event?: any): TPromise<any>;
}
export declare class ScrollDownPageTerminalAction extends Action {
    private terminalService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, terminalService: ITerminalService);
    run(event?: any): TPromise<any>;
}
export declare class ScrollToBottomTerminalAction extends Action {
    private terminalService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, terminalService: ITerminalService);
    run(event?: any): TPromise<any>;
}
export declare class ScrollUpTerminalAction extends Action {
    private terminalService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, terminalService: ITerminalService);
    run(event?: any): TPromise<any>;
}
export declare class ScrollUpPageTerminalAction extends Action {
    private terminalService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, terminalService: ITerminalService);
    run(event?: any): TPromise<any>;
}
export declare class ScrollToTopTerminalAction extends Action {
    private terminalService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, terminalService: ITerminalService);
    run(event?: any): TPromise<any>;
}
export declare class ClearTerminalAction extends Action {
    private terminalService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, terminalService: ITerminalService);
    run(event?: any): TPromise<any>;
}
export declare class AllowWorkspaceShellTerminalCommand extends Action {
    private terminalService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, terminalService: ITerminalService);
    run(event?: any): TPromise<any>;
}
export declare class DisallowWorkspaceShellTerminalCommand extends Action {
    private terminalService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, terminalService: ITerminalService);
    run(event?: any): TPromise<any>;
}
export declare class RenameTerminalAction extends Action {
    protected quickOpenService: IQuickOpenService;
    protected terminalService: ITerminalService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, quickOpenService: IQuickOpenService, terminalService: ITerminalService);
    run(terminal?: TerminalEntry): TPromise<any>;
}
export declare class FocusTerminalFindWidgetAction extends Action {
    private terminalService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, terminalService: ITerminalService);
    run(): TPromise<any>;
}
export declare class HideTerminalFindWidgetAction extends Action {
    private terminalService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, terminalService: ITerminalService);
    run(): TPromise<any>;
}
export declare class ShowNextFindTermTerminalFindWidgetAction extends Action {
    private terminalService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, terminalService: ITerminalService);
    run(): TPromise<any>;
}
export declare class ShowPreviousFindTermTerminalFindWidgetAction extends Action {
    private terminalService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, terminalService: ITerminalService);
    run(): TPromise<any>;
}
export declare class QuickOpenActionTermContributor extends ActionBarContributor {
    private terminalService;
    private quickOpenService;
    private instantiationService;
    constructor(terminalService: ITerminalService, quickOpenService: IQuickOpenService, instantiationService: IInstantiationService);
    getActions(context: any): IAction[];
    hasActions(context: any): boolean;
}
export declare class QuickOpenTermAction extends Action {
    private quickOpenService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, quickOpenService: IQuickOpenService);
    run(): TPromise<void>;
}
export declare class RenameTerminalQuickOpenAction extends RenameTerminalAction {
    private terminal;
    private instantiationService;
    constructor(id: string, label: string, terminal: TerminalEntry, quickOpenService: IQuickOpenService, terminalService: ITerminalService, instantiationService: IInstantiationService);
    run(): TPromise<any>;
}
