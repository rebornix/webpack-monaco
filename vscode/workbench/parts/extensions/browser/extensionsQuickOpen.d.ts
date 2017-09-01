import { TPromise } from 'vs/base/common/winjs.base';
import { IAutoFocus, IModel } from 'vs/base/parts/quickopen/common/quickOpen';
import { QuickOpenHandler } from 'vs/workbench/browser/quickopen';
import { IViewletService } from 'vs/workbench/services/viewlet/browser/viewlet';
export declare class ExtensionsHandler extends QuickOpenHandler {
    private viewletService;
    constructor(viewletService: IViewletService);
    getResults(text: string): TPromise<IModel<any>>;
    getEmptyLabel(input: string): string;
    getAutoFocus(searchValue: string): IAutoFocus;
}
export declare class GalleryExtensionsHandler extends QuickOpenHandler {
    private viewletService;
    constructor(viewletService: IViewletService);
    getResults(text: string): TPromise<IModel<any>>;
    getEmptyLabel(input: string): string;
    getAutoFocus(searchValue: string): IAutoFocus;
}
