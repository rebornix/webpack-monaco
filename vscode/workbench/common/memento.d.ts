import { IStorageService } from 'vs/platform/storage/common/storage';
/**
 * Supported memento scopes.
 */
export declare enum Scope {
    /**
     * The memento will be scoped to all workspaces of this domain.
     */
    GLOBAL = 0,
    /**
     * The memento will be scoped to the current workspace.
     */
    WORKSPACE = 1,
}
/**
 * A memento provides access to a datastructure that is persisted and restored as part of the workbench lifecycle.
 */
export declare class Memento {
    private static globalMementos;
    private static workspaceMementos;
    private static COMMON_PREFIX;
    private id;
    constructor(id: string);
    /**
     * Returns a JSON Object that represents the data of this memento. The optional
     * parameter scope allows to specify the scope of the memento to load. If not
     * provided, the scope will be global, Memento.Scope.WORKSPACE can be used to
     * scope the memento to the workspace.
     */
    getMemento(storageService: IStorageService, scope?: Scope): object;
    /**
     * Saves all data of the mementos that have been loaded to the local storage. This includes
     * global and workspace scope.
     */
    saveMemento(): void;
}
