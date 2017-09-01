import { IDisposable } from 'vs/base/common/lifecycle';
import { Scope } from 'vs/workbench/common/memento';
import { IStorageService } from 'vs/platform/storage/common/storage';
import { IThemeService } from 'vs/platform/theme/common/themeService';
import { Themable } from 'vs/workbench/common/theme';
/**
 * Base class of any core/ui component in the workbench. Examples include services, extensions, parts, viewlets and quick open.
 * Provides some convinience methods to participate in the workbench lifecycle (dispose, shutdown) and
 * loading and saving settings through memento.
 */
export interface IWorkbenchComponent extends IDisposable {
    /**
    * The unique identifier of this component.
    */
    getId(): string;
    /**
    * Called when the browser containing the container is closed.
    *
    * Use this function to store settings that you want to restore next time. Should not be used to free resources
    * because dispose() is being called for this purpose and shutdown() has a chance to be vetoed by the user.
    */
    shutdown(): void;
}
export declare class Component extends Themable implements IWorkbenchComponent {
    private id;
    private componentMemento;
    constructor(id: string, themeService: IThemeService);
    getId(): string;
    /**
    * Returns a JSON Object that represents the data of this memento. The optional
    * parameter scope allows to specify the scope of the memento to load. If not
    * provided, the scope will be global, Scope.WORKSPACE can be used to
    * scope the memento to the workspace.
    *
    * Mementos are shared across components with the same id. This means that multiple components
    * with the same id will store data into the same data structure.
    */
    protected getMemento(storageService: IStorageService, scope?: Scope): object;
    /**
    * Saves all data of the mementos that have been loaded to the local storage. This includes
    * global and workspace scope.
    *
    * Mementos are shared across components with the same id. This means that multiple components
    * with the same id will store data into the same data structure.
    */
    protected saveMemento(): void;
    shutdown(): void;
}
