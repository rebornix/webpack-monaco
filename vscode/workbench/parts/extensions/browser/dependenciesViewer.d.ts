import { IMouseEvent } from 'vs/base/browser/mouseEvent';
import { IDisposable } from 'vs/base/common/lifecycle';
import { Promise } from 'vs/base/common/winjs.base';
import { IDataSource, ITree, IRenderer } from 'vs/base/parts/tree/browser/tree';
import { DefaultController } from 'vs/base/parts/tree/browser/treeDefaults';
import { IExtensionDependencies, IExtensionsWorkbenchService } from 'vs/workbench/parts/extensions/common/extensions';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
export interface IExtensionTemplateData {
    icon: HTMLImageElement;
    name: HTMLElement;
    identifier: HTMLElement;
    author: HTMLElement;
    extensionDisposables: IDisposable[];
    extensionDependencies: IExtensionDependencies;
}
export interface IUnknownExtensionTemplateData {
    identifier: HTMLElement;
}
export declare class DataSource implements IDataSource {
    getId(tree: ITree, element: IExtensionDependencies): string;
    hasChildren(tree: ITree, element: IExtensionDependencies): boolean;
    getChildren(tree: ITree, element: IExtensionDependencies): Promise;
    getParent(tree: ITree, element: IExtensionDependencies): Promise;
}
export declare class Renderer implements IRenderer {
    private instantiationService;
    private static EXTENSION_TEMPLATE_ID;
    private static UNKNOWN_EXTENSION_TEMPLATE_ID;
    constructor(instantiationService: IInstantiationService);
    getHeight(tree: ITree, element: IExtensionDependencies): number;
    getTemplateId(tree: ITree, element: IExtensionDependencies): string;
    renderTemplate(tree: ITree, templateId: string, container: HTMLElement): any;
    private renderExtensionTemplate(tree, container);
    private renderUnknownExtensionTemplate(tree, container);
    renderElement(tree: ITree, element: IExtensionDependencies, templateId: string, templateData: any): void;
    private renderExtension(tree, element, data);
    private renderUnknownExtension(tree, element, data);
    disposeTemplate(tree: ITree, templateId: string, templateData: any): void;
}
export declare class Controller extends DefaultController {
    private extensionsWorkdbenchService;
    constructor(extensionsWorkdbenchService: IExtensionsWorkbenchService);
    protected onLeftClick(tree: ITree, element: IExtensionDependencies, event: IMouseEvent): boolean;
    openExtension(tree: ITree, sideByside: boolean): boolean;
}
