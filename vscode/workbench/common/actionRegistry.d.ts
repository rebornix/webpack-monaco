import { TPromise } from 'vs/base/common/winjs.base';
import { IAction } from 'vs/base/common/actions';
import { IPartService } from 'vs/workbench/services/part/common/partService';
import { ICommandHandler } from 'vs/platform/commands/common/commands';
import { SyncActionDescriptor } from 'vs/platform/actions/common/actions';
import { ITelemetryService } from 'vs/platform/telemetry/common/telemetry';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
export declare const Extensions: {
    WorkbenchActions: string;
};
export interface IActionProvider {
    getActions(): IAction[];
}
export interface IWorkbenchActionRegistry {
    /**
     * Registers a workbench action to the platform. Workbench actions are not
     * visible by default and can only be invoked through a keybinding if provided.
     */
    registerWorkbenchAction(descriptor: SyncActionDescriptor, alias: string, category?: string): void;
    /**
     * Unregisters a workbench action from the platform.
     */
    unregisterWorkbenchAction(id: string): boolean;
    /**
     * Returns the workbench action descriptor for the given id or null if none.
     */
    getWorkbenchAction(id: string): SyncActionDescriptor;
    /**
     * Returns an array of registered workbench actions known to the platform.
     */
    getWorkbenchActions(): SyncActionDescriptor[];
    /**
     * Returns the alias associated with the given action or null if none.
     */
    getAlias(actionId: string): string;
    /**
     * Returns the category for the given action or null if none.
     */
    getCategory(actionId: string): string;
}
export declare function createCommandHandler(descriptor: SyncActionDescriptor): ICommandHandler;
export declare function triggerAndDisposeAction(instantitationService: IInstantiationService, telemetryService: ITelemetryService, partService: IPartService, descriptor: SyncActionDescriptor, args: any): TPromise<any>;
