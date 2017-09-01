import { TPromise } from 'vs/base/common/winjs.base';
import { IPanel } from 'vs/workbench/common/panel';
import { Composite, CompositeDescriptor, CompositeRegistry } from 'vs/workbench/browser/composite';
import { Action } from 'vs/base/common/actions';
import { IPanelService } from 'vs/workbench/services/panel/common/panelService';
import { IPartService } from 'vs/workbench/services/part/common/partService';
export declare abstract class Panel extends Composite implements IPanel {
}
/**
 * A panel descriptor is a leightweight descriptor of a panel in the workbench.
 */
export declare class PanelDescriptor extends CompositeDescriptor<Panel> {
    private _commandId;
    constructor(moduleId: string, ctorName: string, id: string, name: string, cssClass?: string, order?: number, _commandId?: string);
    readonly commandId: string;
}
export declare class PanelRegistry extends CompositeRegistry<Panel> {
    private defaultPanelId;
    /**
     * Registers a panel to the platform.
     */
    registerPanel(descriptor: PanelDescriptor): void;
    /**
     * Returns the panel descriptor for the given id or null if none.
     */
    getPanel(id: string): PanelDescriptor;
    /**
     * Returns an array of registered panels known to the platform.
     */
    getPanels(): PanelDescriptor[];
    /**
     * Sets the id of the panel that should open on startup by default.
     */
    setDefaultPanelId(id: string): void;
    /**
     * Gets the id of the panel that should open on startup by default.
     */
    getDefaultPanelId(): string;
}
/**
 * A reusable action to toggle a panel with a specific id.
 */
export declare abstract class TogglePanelAction extends Action {
    protected panelService: IPanelService;
    private partService;
    private panelId;
    constructor(id: string, label: string, panelId: string, panelService: IPanelService, partService: IPartService, cssClass?: string);
    run(): TPromise<any>;
    private isPanelShowing();
    protected isPanelFocused(): boolean;
}
export declare const Extensions: {
    Panels: string;
};
