import { TPromise } from 'vs/base/common/winjs.base';
import URI from 'vs/base/common/uri';
import { ServiceIdentifier } from 'vs/platform/instantiation/common/instantiation';
import { IWorkspaceIdentifier } from 'vs/platform/workspaces/common/workspaces';
export declare const IWorkspaceEditingService: {
    (...args: any[]): void;
    type: IWorkspaceEditingService;
};
export interface IWorkspaceEditingService {
    _serviceBrand: ServiceIdentifier<any>;
    /**
     * add roots to the existing workspace
     */
    addRoots(roots: URI[]): TPromise<void>;
    /**
     * remove roots from the existing workspace
     */
    removeRoots(roots: URI[]): TPromise<void>;
}
export declare const IWorkspaceMigrationService: {
    (...args: any[]): void;
    type: IWorkspaceMigrationService;
};
export interface IWorkspaceMigrationService {
    /**
     * Migrate current workspace to given workspace
     */
    migrate(toWokspaceId: IWorkspaceIdentifier): TPromise<void>;
}
