import { IAction, IActionRunner } from 'vs/base/common/actions';
import { SelectActionItem, IActionItem } from 'vs/base/browser/ui/actionbar/actionbar';
import { EventEmitter } from 'vs/base/common/eventEmitter';
import { IConfigurationService } from 'vs/platform/configuration/common/configuration';
import { ICommandService } from 'vs/platform/commands/common/commands';
import { IQuickOpenService } from 'vs/platform/quickOpen/common/quickOpen';
import { IDebugService } from 'vs/workbench/parts/debug/common/debug';
import { IThemeService } from 'vs/platform/theme/common/themeService';
export declare class StartDebugActionItem extends EventEmitter implements IActionItem {
    private context;
    private action;
    private debugService;
    private themeService;
    private configurationService;
    private commandService;
    private quickOpenService;
    private static SEPARATOR;
    actionRunner: IActionRunner;
    private container;
    private start;
    private selectBox;
    private executeOnSelect;
    private toDispose;
    private selected;
    constructor(context: any, action: IAction, debugService: IDebugService, themeService: IThemeService, configurationService: IConfigurationService, commandService: ICommandService, quickOpenService: IQuickOpenService);
    private registerListeners();
    render(container: HTMLElement): void;
    setActionContext(context: any): void;
    isEnabled(): boolean;
    focus(fromRight?: boolean): void;
    blur(): void;
    dispose(): void;
    private updateOptions();
}
export declare class FocusProcessActionItem extends SelectActionItem {
    private debugService;
    constructor(action: IAction, debugService: IDebugService, themeService: IThemeService);
    private update();
}
