import { TPromise } from 'vs/base/common/winjs.base';
import { IViewlet } from 'vs/workbench/common/viewlet';
import { IViewletService } from 'vs/workbench/services/viewlet/browser/viewlet';
import Event from 'vs/base/common/event';
import { SidebarPart } from 'vs/workbench/browser/parts/sidebar/sidebarPart';
import { ViewletDescriptor } from 'vs/workbench/browser/viewlet';
import { IExtensionService } from 'vs/platform/extensions/common/extensions';
import { IProgressService } from 'vs/platform/progress/common/progress';
export declare class ViewletService implements IViewletService {
    private extensionService;
    _serviceBrand: any;
    private sidebarPart;
    private viewletRegistry;
    private extensionViewlets;
    private extensionViewletsLoaded;
    private extensionViewletsLoadedPromiseComplete;
    readonly onDidViewletOpen: Event<IViewlet>;
    readonly onDidViewletClose: Event<IViewlet>;
    constructor(sidebarPart: SidebarPart, extensionService: IExtensionService);
    private loadExtensionViewlets();
    openViewlet(id: string, focus?: boolean): TPromise<IViewlet>;
    getActiveViewlet(): IViewlet;
    getViewlets(): ViewletDescriptor[];
    private getBuiltInViewlets();
    getDefaultViewletId(): string;
    getViewlet(id: string): ViewletDescriptor;
    getProgressIndicator(id: string): IProgressService;
}
