import { TPromise } from 'vs/base/common/winjs.base';
import { ITree, IRenderer, IFilter, IDataSource, IAccessibilityProvider } from 'vs/base/parts/tree/browser/tree';
import { IModel } from 'vs/base/parts/quickopen/common/quickOpen';
import { IQuickOpenStyles } from 'vs/base/parts/quickopen/browser/quickOpenWidget';
export interface IModelProvider {
    getModel<T>(): IModel<T>;
}
export declare class DataSource implements IDataSource {
    private modelProvider;
    constructor(model: IModel<any>);
    constructor(modelProvider: IModelProvider);
    getId(tree: ITree, element: any): string;
    hasChildren(tree: ITree, element: any): boolean;
    getChildren(tree: ITree, element: any): TPromise<any[]>;
    getParent(tree: ITree, element: any): TPromise<any>;
}
export declare class AccessibilityProvider implements IAccessibilityProvider {
    private modelProvider;
    constructor(modelProvider: IModelProvider);
    getAriaLabel(tree: ITree, element: any): string;
    getPosInSet(tree: ITree, element: any): string;
    getSetSize(): string;
}
export declare class Filter implements IFilter {
    private modelProvider;
    constructor(modelProvider: IModelProvider);
    isVisible(tree: ITree, element: any): boolean;
}
export declare class Renderer implements IRenderer {
    private modelProvider;
    private styles;
    constructor(modelProvider: IModelProvider, styles: IQuickOpenStyles);
    updateStyles(styles: IQuickOpenStyles): void;
    getHeight(tree: ITree, element: any): number;
    getTemplateId(tree: ITree, element: any): string;
    renderTemplate(tree: ITree, templateId: string, container: HTMLElement): any;
    renderElement(tree: ITree, element: any, templateId: string, templateData: any): void;
    disposeTemplate(tree: ITree, templateId: string, templateData: any): void;
}
