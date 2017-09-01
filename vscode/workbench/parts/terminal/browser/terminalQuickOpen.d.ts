import { TPromise } from 'vs/base/common/winjs.base';
import { Mode, IEntryRunContext, IAutoFocus, IQuickNavigateConfiguration, IModel } from 'vs/base/parts/quickopen/common/quickOpen';
import { QuickOpenModel, QuickOpenEntry } from 'vs/base/parts/quickopen/browser/quickOpenModel';
import { QuickOpenHandler } from 'vs/workbench/browser/quickopen';
import { ITerminalService } from 'vs/workbench/parts/terminal/common/terminal';
import { IPanelService } from 'vs/workbench/services/panel/common/panelService';
export declare class TerminalEntry extends QuickOpenEntry {
    private label;
    private terminalService;
    constructor(label: string, terminalService: ITerminalService);
    getLabel(): string;
    getAriaLabel(): string;
    run(mode: Mode, context: IEntryRunContext): boolean;
}
export declare class CreateTerminal extends QuickOpenEntry {
    private label;
    private terminalService;
    constructor(label: string, terminalService: ITerminalService);
    getLabel(): string;
    getAriaLabel(): string;
    run(mode: Mode, context: IEntryRunContext): boolean;
}
export declare class TerminalPickerHandler extends QuickOpenHandler {
    private terminalService;
    private panelService;
    constructor(terminalService: ITerminalService, panelService: IPanelService);
    getResults(searchValue: string): TPromise<QuickOpenModel>;
    private getTerminals();
    getAutoFocus(searchValue: string, context: {
        model: IModel<QuickOpenEntry>;
        quickNavigateConfiguration?: IQuickNavigateConfiguration;
    }): IAutoFocus;
    getEmptyLabel(searchString: string): string;
}
