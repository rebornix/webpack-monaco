import 'vs/css!./media/extensionsWidgets';
import { IDisposable } from 'vs/base/common/lifecycle';
import { IExtension, IExtensionsWorkbenchService } from '../common/extensions';
export interface IOptions {
    extension?: IExtension;
    small?: boolean;
}
export declare class Label implements IDisposable {
    private element;
    private fn;
    private listener;
    private _extension;
    extension: IExtension;
    constructor(element: HTMLElement, fn: (extension: IExtension) => string, extensionsWorkbenchService: IExtensionsWorkbenchService);
    private render();
    dispose(): void;
}
export declare class InstallWidget implements IDisposable {
    private container;
    private options;
    private disposables;
    private _extension;
    extension: IExtension;
    constructor(container: HTMLElement, options: IOptions, extensionsWorkbenchService: IExtensionsWorkbenchService);
    private render();
    dispose(): void;
}
export declare class RatingsWidget implements IDisposable {
    private container;
    private options;
    private disposables;
    private _extension;
    extension: IExtension;
    constructor(container: HTMLElement, options: IOptions, extensionsWorkbenchService: IExtensionsWorkbenchService);
    private render();
    dispose(): void;
}
