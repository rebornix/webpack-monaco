import { Promise } from 'vs/base/common/winjs.base';
import { IDataSource, ITree, IRenderer, IAccessibilityProvider, ISorter, IActionProvider } from 'vs/base/parts/tree/browser/tree';
import { IActionRunner } from 'vs/base/common/actions';
import { IWorkspaceContextService } from 'vs/platform/workspace/common/workspace';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { IThemeService } from 'vs/platform/theme/common/themeService';
export declare class DataSource implements IDataSource {
    getId(tree: ITree, element: any): string;
    hasChildren(tree: ITree, element: any): boolean;
    getChildren(tree: ITree, element: any): Promise;
    getParent(tree: ITree, element: any): Promise;
}
export declare class Renderer implements IRenderer {
    private actionRunner;
    private actionProvider;
    private contextService;
    private instantiationService;
    private themeService;
    private static RESOURCE_TEMPLATE_ID;
    private static FILE_RESOURCE_TEMPLATE_ID;
    private static MARKER_TEMPLATE_ID;
    constructor(actionRunner: IActionRunner, actionProvider: IActionProvider, contextService: IWorkspaceContextService, instantiationService: IInstantiationService, themeService: IThemeService);
    getHeight(tree: ITree, element: any): number;
    getTemplateId(tree: ITree, element: any): string;
    renderTemplate(tree: ITree, templateId: string, container: HTMLElement): any;
    private renderFileResourceTemplate(container);
    private renderResourceTemplate(container);
    private renderMarkerTemplate(container);
    renderElement(tree: ITree, element: any, templateId: string, templateData: any): void;
    private renderResourceElement(tree, element, templateData);
    private renderMarkerElement(tree, element, templateData);
    private static iconClassNameFor(element);
    disposeTemplate(tree: ITree, templateId: string, templateData: any): void;
}
export declare class MarkersTreeAccessibilityProvider implements IAccessibilityProvider {
    getAriaLabel(tree: ITree, element: any): string;
}
export declare class Sorter implements ISorter {
    compare(tree: ITree, element: any, otherElement: any): number;
}
