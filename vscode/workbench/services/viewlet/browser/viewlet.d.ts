import { TPromise } from 'vs/base/common/winjs.base';
import { IViewlet } from 'vs/workbench/common/viewlet';
import { ServiceIdentifier } from 'vs/platform/instantiation/common/instantiation';
import Event from 'vs/base/common/event';
import { ViewletDescriptor } from 'vs/workbench/browser/viewlet';
import { IProgressService } from 'vs/platform/progress/common/progress';
export declare const IViewletService: {
    (...args: any[]): void;
    type: IViewletService;
};
export interface IViewletService {
    _serviceBrand: ServiceIdentifier<any>;
    onDidViewletOpen: Event<IViewlet>;
    onDidViewletClose: Event<IViewlet>;
    /**
     * Opens a viewlet with the given identifier and pass keyboard focus to it if specified.
     */
    openViewlet(id: string, focus?: boolean): TPromise<IViewlet>;
    /**
     * Returns the current active viewlet or null if none.
     */
    getActiveViewlet(): IViewlet;
    /**
     * Returns the id of the default viewlet.
     */
    getDefaultViewletId(): string;
    /**
     * Returns the viewlet by id.
     */
    getViewlet(id: string): ViewletDescriptor;
    /**
     * Returns all registered viewlets
     */
    getViewlets(): ViewletDescriptor[];
    /**
     *
     */
    getProgressIndicator(id: string): IProgressService;
}
