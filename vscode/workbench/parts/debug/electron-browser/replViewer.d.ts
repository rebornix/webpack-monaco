import { TPromise } from 'vs/base/common/winjs.base';
import { IAction } from 'vs/base/common/actions';
import { IActionItem } from 'vs/base/browser/ui/actionbar/actionbar';
import { ITree, IAccessibilityProvider, IDataSource, IRenderer, IActionProvider } from 'vs/base/parts/tree/browser/tree';
import { ICancelableEvent } from 'vs/base/parts/tree/browser/treeDefaults';
import { BaseDebugController } from 'vs/workbench/parts/debug/electron-browser/debugViewer';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { IWorkbenchEditorService } from 'vs/workbench/services/editor/common/editorService';
export declare class ReplExpressionsDataSource implements IDataSource {
    getId(tree: ITree, element: any): string;
    hasChildren(tree: ITree, element: any): boolean;
    getChildren(tree: ITree, element: any): TPromise<any>;
    getParent(tree: ITree, element: any): TPromise<any>;
}
export declare class ReplExpressionsRenderer implements IRenderer {
    private editorService;
    private instantiationService;
    private static VARIABLE_TEMPLATE_ID;
    private static EXPRESSION_TEMPLATE_ID;
    private static VALUE_OUTPUT_TEMPLATE_ID;
    private static NAME_VALUE_OUTPUT_TEMPLATE_ID;
    private static LINE_HEIGHT_PX;
    private width;
    private characterWidth;
    private linkDetector;
    constructor(editorService: IWorkbenchEditorService, instantiationService: IInstantiationService);
    getHeight(tree: ITree, element: any): number;
    private getHeightForString(s);
    setWidth(fullWidth: number, characterWidth: number): void;
    getTemplateId(tree: ITree, element: any): string;
    renderTemplate(tree: ITree, templateId: string, container: HTMLElement): any;
    renderElement(tree: ITree, element: any, templateId: string, templateData: any): void;
    private renderExpression(tree, expression, templateData);
    private renderOutputValue(output, templateData);
    private renderOutputNameValue(tree, output, templateData);
    private handleANSIOutput(text);
    private insert(arg, target);
    disposeTemplate(tree: ITree, templateId: string, templateData: any): void;
}
export declare class ReplExpressionsAccessibilityProvider implements IAccessibilityProvider {
    getAriaLabel(tree: ITree, element: any): string;
}
export declare class ReplExpressionsActionProvider implements IActionProvider {
    private instantiationService;
    constructor(instantiationService: IInstantiationService);
    hasActions(tree: ITree, element: any): boolean;
    getActions(tree: ITree, element: any): TPromise<IAction[]>;
    hasSecondaryActions(tree: ITree, element: any): boolean;
    getSecondaryActions(tree: ITree, element: any): TPromise<IAction[]>;
    getActionItem(tree: ITree, element: any, action: IAction): IActionItem;
}
export declare class ReplExpressionsController extends BaseDebugController {
    private lastSelectedString;
    toFocusOnClick: {
        focus(): void;
    };
    protected onLeftClick(tree: ITree, element: any, eventish: ICancelableEvent, origin?: string): boolean;
}
