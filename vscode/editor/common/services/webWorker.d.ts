import URI from 'vs/base/common/uri';
import { TPromise } from 'vs/base/common/winjs.base';
import { IModelService } from 'vs/editor/common/services/modelService';
/**
 * Create a new web worker that has model syncing capabilities built in.
 * Specify an AMD module to load that will `create` an object that will be proxied.
 */
export declare function createWebWorker<T>(modelService: IModelService, opts: IWebWorkerOptions): MonacoWebWorker<T>;
/**
 * A web worker that can provide a proxy to an arbitrary file.
 */
export interface MonacoWebWorker<T> {
    /**
     * Terminate the web worker, thus invalidating the returned proxy.
     */
    dispose(): void;
    /**
     * Get a proxy to the arbitrary loaded code.
     */
    getProxy(): TPromise<T>;
    /**
     * Synchronize (send) the models at `resources` to the web worker,
     * making them available in the monaco.worker.getMirrorModels().
     */
    withSyncedResources(resources: URI[]): TPromise<T>;
}
export interface IWebWorkerOptions {
    /**
     * The AMD moduleId to load.
     * It should export a function `create` that should return the exported proxy.
     */
    moduleId: string;
    /**
     * The data to send over when calling create on the module.
     */
    createData?: any;
    /**
     * A label to be used to identify the web worker for debugging purposes.
     */
    label?: string;
}
