import * as lifecycle from 'vs/base/common/lifecycle';
import { TPromise } from 'vs/base/common/winjs.base';
import { IAction, Action } from 'vs/base/common/actions';
import { BaseActionItem } from 'vs/base/browser/ui/actionbar/actionbar';
import { IContextViewService } from 'vs/platform/contextview/browser/contextView';
import { TogglePanelAction } from 'vs/workbench/browser/panel';
import { MarkersPanel } from 'vs/workbench/parts/markers/browser/markersPanel';
import { IPartService } from 'vs/workbench/services/part/common/partService';
import { IPanelService } from 'vs/workbench/services/panel/common/panelService';
import { ITelemetryService } from 'vs/platform/telemetry/common/telemetry';
import { CollapseAllAction as TreeCollapseAction } from 'vs/base/parts/tree/browser/treeDefaults';
import Tree = require('vs/base/parts/tree/browser/tree');
import { IThemeService } from 'vs/platform/theme/common/themeService';
export declare class ToggleMarkersPanelAction extends TogglePanelAction {
    private telemetryService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, partService: IPartService, panelService: IPanelService, telemetryService: ITelemetryService);
    run(): TPromise<any>;
}
export declare class ToggleErrorsAndWarningsAction extends TogglePanelAction {
    private telemetryService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, partService: IPartService, panelService: IPanelService, telemetryService: ITelemetryService);
    run(): TPromise<any>;
}
export declare class CollapseAllAction extends TreeCollapseAction {
    private telemetryService;
    constructor(viewer: Tree.ITree, enabled: boolean, telemetryService: ITelemetryService);
    run(context?: any): TPromise<any>;
}
export declare class FilterAction extends Action {
    private markersPanel;
    static ID: string;
    constructor(markersPanel: MarkersPanel);
}
export declare class FilterInputBoxActionItem extends BaseActionItem {
    private markersPanel;
    private contextViewService;
    private themeService;
    private telemetryService;
    protected toDispose: lifecycle.IDisposable[];
    private delayedFilterUpdate;
    constructor(markersPanel: MarkersPanel, action: IAction, contextViewService: IContextViewService, themeService: IThemeService, telemetryService: ITelemetryService);
    render(container: HTMLElement): void;
    private updateFilter(filter);
    private reportFilteringUsed();
    dispose(): void;
    private handleKeyboardEvent(e);
    private onInputKeyUp(keyboardEvent, filterInputBox);
}
