import Event from 'vs/base/common/event';
import { TPromise } from 'vs/base/common/winjs.base';
import { IPanel } from 'vs/workbench/common/panel';
import { ServiceIdentifier } from 'vs/platform/instantiation/common/instantiation';
export declare const IPanelService: {
    (...args: any[]): void;
    type: IPanelService;
};
export interface IPanelIdentifier {
    id: string;
    name: string;
    commandId: string;
}
export interface IPanelService {
    _serviceBrand: ServiceIdentifier<any>;
    onDidPanelOpen: Event<IPanel>;
    onDidPanelClose: Event<IPanel>;
    /**
     * Opens a panel with the given identifier and pass keyboard focus to it if specified.
     */
    openPanel(id: string, focus?: boolean): TPromise<IPanel>;
    /**
     * Returns the current active panel or null if none
     */
    getActivePanel(): IPanel;
    /**
     * Returns all registered panels
     */
    getPanels(): IPanelIdentifier[];
}
