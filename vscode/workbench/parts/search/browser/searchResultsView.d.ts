import { Disposable } from 'vs/base/common/lifecycle';
import { TPromise } from 'vs/base/common/winjs.base';
import { IActionRunner } from 'vs/base/common/actions';
import { ITree, IDataSource, ISorter, IAccessibilityProvider, IFilter, IRenderer } from 'vs/base/parts/tree/browser/tree';
import { FileMatchOrMatch } from 'vs/workbench/parts/search/common/searchModel';
import { IWorkspaceContextService } from 'vs/platform/workspace/common/workspace';
import { SearchViewlet } from 'vs/workbench/parts/search/browser/searchViewlet';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { IThemeService } from 'vs/platform/theme/common/themeService';
export declare class SearchDataSource implements IDataSource {
    private includeFolderMatch;
    private static AUTOEXPAND_CHILD_LIMIT;
    constructor(includeFolderMatch?: boolean);
    getId(tree: ITree, element: any): string;
    private _getChildren(element);
    getChildren(tree: ITree, element: any): TPromise<any[]>;
    hasChildren(tree: ITree, element: any): boolean;
    getParent(tree: ITree, element: any): TPromise<any>;
    shouldAutoexpand(tree: ITree, element: any): boolean;
}
export declare class SearchSorter implements ISorter {
    compare(tree: ITree, elementA: FileMatchOrMatch, elementB: FileMatchOrMatch): number;
}
export declare class SearchRenderer extends Disposable implements IRenderer {
    private viewlet;
    private contextService;
    private instantiationService;
    private themeService;
    private static FOLDER_MATCH_TEMPLATE_ID;
    private static FILE_MATCH_TEMPLATE_ID;
    private static MATCH_TEMPLATE_ID;
    constructor(actionRunner: IActionRunner, viewlet: SearchViewlet, contextService: IWorkspaceContextService, instantiationService: IInstantiationService, themeService: IThemeService);
    getHeight(tree: ITree, element: any): number;
    getTemplateId(tree: ITree, element: any): string;
    renderTemplate(tree: ITree, templateId: string, container: HTMLElement): any;
    renderElement(tree: ITree, element: any, templateId: string, templateData: any): void;
    private renderFolderMatchTemplate(tree, templateId, container);
    private renderFileMatchTemplate(tree, templateId, container);
    private renderMatchTemplate(tree, templateId, container);
    private renderFolderMatch(tree, folderMatch, templateData);
    private renderFileMatch(tree, fileMatch, templateData);
    private renderMatch(tree, match, templateData);
    disposeTemplate(tree: ITree, templateId: string, templateData: any): void;
}
export declare class SearchAccessibilityProvider implements IAccessibilityProvider {
    private contextService;
    constructor(contextService: IWorkspaceContextService);
    getAriaLabel(tree: ITree, element: FileMatchOrMatch): string;
}
export declare class SearchFilter implements IFilter {
    isVisible(tree: ITree, element: any): boolean;
}
