import { TPromise } from 'vs/base/common/winjs.base';
import { Mode, IEntryRunContext, IAutoFocus, IQuickNavigateConfiguration, IModel } from 'vs/base/parts/quickopen/common/quickOpen';
import { QuickOpenModel, QuickOpenEntryGroup, QuickOpenEntry } from 'vs/base/parts/quickopen/browser/quickOpenModel';
import { QuickOpenHandler, QuickOpenAction } from 'vs/workbench/browser/quickopen';
import { IViewletService } from 'vs/workbench/services/viewlet/browser/viewlet';
import { IOutputService } from 'vs/workbench/parts/output/common/output';
import { ITerminalService } from 'vs/workbench/parts/terminal/common/terminal';
import { IPanelService } from 'vs/workbench/services/panel/common/panelService';
import { IQuickOpenService } from 'vs/platform/quickOpen/common/quickOpen';
import { Action } from 'vs/base/common/actions';
import { IKeybindingService } from 'vs/platform/keybinding/common/keybinding';
export declare const VIEW_PICKER_PREFIX = "view ";
export declare class ViewEntry extends QuickOpenEntryGroup {
    private label;
    private category;
    private open;
    constructor(label: string, category: string, open: () => void);
    getLabel(): string;
    getCategory(): string;
    getAriaLabel(): string;
    run(mode: Mode, context: IEntryRunContext): boolean;
    private runOpen(context);
}
export declare class ViewPickerHandler extends QuickOpenHandler {
    private viewletService;
    private outputService;
    private terminalService;
    private panelService;
    constructor(viewletService: IViewletService, outputService: IOutputService, terminalService: ITerminalService, panelService: IPanelService);
    getResults(searchValue: string): TPromise<QuickOpenModel>;
    private getViewEntries();
    getAutoFocus(searchValue: string, context: {
        model: IModel<QuickOpenEntry>;
        quickNavigateConfiguration?: IQuickNavigateConfiguration;
    }): IAutoFocus;
}
export declare class OpenViewPickerAction extends QuickOpenAction {
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, quickOpenService: IQuickOpenService);
}
export declare class QuickOpenViewPickerAction extends Action {
    private quickOpenService;
    private keybindingService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, quickOpenService: IQuickOpenService, keybindingService: IKeybindingService);
    run(): TPromise<boolean>;
}
