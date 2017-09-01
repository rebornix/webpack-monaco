import { TPromise } from 'vs/base/common/winjs.base';
import { IAction, Action } from 'vs/base/common/actions';
import { IOutputService } from 'vs/workbench/parts/output/common/output';
import { SelectActionItem } from 'vs/base/browser/ui/actionbar/actionbar';
import { IPartService } from 'vs/workbench/services/part/common/partService';
import { IPanelService } from 'vs/workbench/services/panel/common/panelService';
import { TogglePanelAction } from 'vs/workbench/browser/panel';
import { IThemeService } from 'vs/platform/theme/common/themeService';
export declare class ToggleOutputAction extends TogglePanelAction {
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, partService: IPartService, panelService: IPanelService);
}
export declare class ClearOutputAction extends Action {
    private outputService;
    private panelService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, outputService: IOutputService, panelService: IPanelService);
    run(): TPromise<boolean>;
}
export declare class ToggleOutputScrollLockAction extends Action {
    private outputService;
    static ID: string;
    static LABEL: string;
    private toDispose;
    constructor(id: string, label: string, outputService: IOutputService);
    run(): TPromise<boolean>;
    private setClass(locked);
    dispose(): void;
}
export declare class SwitchOutputAction extends Action {
    private outputService;
    static ID: string;
    constructor(outputService: IOutputService);
    run(channelId?: string): TPromise<any>;
}
export declare class SwitchOutputActionItem extends SelectActionItem {
    private outputService;
    constructor(action: IAction, outputService: IOutputService, themeService: IThemeService);
    protected getActionContext(option: string): string;
    private getOptions();
    private getSelected(outputId);
}
