import { Action, IAction } from 'vs/base/common/actions';
import { Builder, Dimension } from 'vs/base/browser/builder';
import { IActionItem } from 'vs/base/browser/ui/actionbar/actionbar';
import { IConfigurationService } from 'vs/platform/configuration/common/configuration';
import { IContextMenuService, IContextViewService } from 'vs/platform/contextview/browser/contextView';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { ITelemetryService } from 'vs/platform/telemetry/common/telemetry';
import { ITerminalService } from 'vs/workbench/parts/terminal/common/terminal';
import { IThemeService } from 'vs/platform/theme/common/themeService';
import { Panel } from 'vs/workbench/browser/panel';
import { TPromise } from 'vs/base/common/winjs.base';
export declare class TerminalPanel extends Panel {
    private _configurationService;
    private _contextMenuService;
    private _contextViewService;
    private _instantiationService;
    private _terminalService;
    protected themeService: IThemeService;
    private _actions;
    private _copyContextMenuAction;
    private _contextMenuActions;
    private _cancelContextMenu;
    private _font;
    private _fontStyleElement;
    private _parentDomElement;
    private _terminalContainer;
    private _themeStyleElement;
    private _findWidget;
    constructor(_configurationService: IConfigurationService, _contextMenuService: IContextMenuService, _contextViewService: IContextViewService, _instantiationService: IInstantiationService, _terminalService: ITerminalService, themeService: IThemeService, telemetryService: ITelemetryService);
    create(parent: Builder): TPromise<any>;
    layout(dimension?: Dimension): void;
    setVisible(visible: boolean): TPromise<void>;
    getActions(): IAction[];
    private _getContextMenuActions();
    getActionItem(action: Action): IActionItem;
    focus(): void;
    focusFindWidget(): void;
    hideFindWidget(): void;
    showNextFindTermFindWidget(): void;
    showPreviousFindTermFindWidget(): void;
    private _attachEventListeners();
    private _updateTheme(theme?);
    private _updateFont();
    private _fontsDiffer(a, b);
    /**
     * Adds quotes to a path if it contains whitespaces
     */
    static preparePathForTerminal(path: string): string;
}
