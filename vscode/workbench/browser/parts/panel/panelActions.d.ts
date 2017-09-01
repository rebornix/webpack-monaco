import 'vs/css!./media/panelpart';
import { TPromise } from 'vs/base/common/winjs.base';
import { Action } from 'vs/base/common/actions';
import { IPanelService, IPanelIdentifier } from 'vs/workbench/services/panel/common/panelService';
import { IPartService } from 'vs/workbench/services/part/common/partService';
import { IKeybindingService } from 'vs/platform/keybinding/common/keybinding';
export declare class PanelAction extends Action {
    private panel;
    private keybindingService;
    private panelService;
    constructor(panel: IPanelIdentifier, keybindingService: IKeybindingService, panelService: IPanelService);
    run(event: any): TPromise<any>;
    activate(): void;
    deactivate(): void;
    private getKeybindingLabel(id);
}
export declare class ClosePanelAction extends Action {
    private partService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, name: string, partService: IPartService);
    run(): TPromise<any>;
}
export declare class TogglePanelAction extends Action {
    private partService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, name: string, partService: IPartService);
    run(): TPromise<any>;
}
export declare class ToggleMaximizedPanelAction extends Action {
    private partService;
    static ID: string;
    static LABEL: string;
    private static MAXIMIZE_LABEL;
    private static RESTORE_LABEL;
    private toDispose;
    constructor(id: string, label: string, partService: IPartService);
    run(): TPromise<any>;
    dispose(): void;
}
