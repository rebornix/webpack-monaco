import { TPromise } from 'vs/base/common/winjs.base';
import URI from 'vs/base/common/uri';
import { Action } from 'vs/base/common/actions';
import { ToggleViewletAction } from 'vs/workbench/browser/viewlet';
import { IViewletService } from 'vs/workbench/services/viewlet/browser/viewlet';
import { ITree } from 'vs/base/parts/tree/browser/tree';
import { SearchViewlet } from 'vs/workbench/parts/search/browser/searchViewlet';
import { Match, FileMatch, RenderableMatch } from 'vs/workbench/parts/search/common/searchModel';
import { IReplaceService } from 'vs/workbench/parts/search/common/replace';
import { CollapseAllAction as TreeCollapseAction } from 'vs/base/parts/tree/browser/treeDefaults';
import { IWorkbenchEditorService } from 'vs/workbench/services/editor/common/editorService';
import { ITelemetryService } from 'vs/platform/telemetry/common/telemetry';
import { ResolvedKeybinding } from 'vs/base/common/keyCodes';
import { IKeybindingService } from 'vs/platform/keybinding/common/keybinding';
import { ServicesAccessor, IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { IContextKeyService, ContextKeyExpr } from 'vs/platform/contextkey/common/contextkey';
export declare function isSearchViewletFocused(viewletService: IViewletService): boolean;
export declare function appendKeyBindingLabel(label: string, keyBinding: number | ResolvedKeybinding, keyBindingService2: IKeybindingService): string;
export declare class ToggleCaseSensitiveAction extends Action {
    private viewletService;
    constructor(id: string, label: string, viewletService: IViewletService);
    run(): TPromise<any>;
}
export declare class ToggleWholeWordAction extends Action {
    private viewletService;
    constructor(id: string, label: string, viewletService: IViewletService);
    run(): TPromise<any>;
}
export declare class ToggleRegexAction extends Action {
    private viewletService;
    constructor(id: string, label: string, viewletService: IViewletService);
    run(): TPromise<any>;
}
export declare class ShowNextSearchIncludeAction extends Action {
    private viewletService;
    private contextKeyService;
    static ID: string;
    static LABEL: string;
    static CONTEXT_KEY_EXPRESSION: ContextKeyExpr;
    constructor(id: string, label: string, viewletService: IViewletService, contextKeyService: IContextKeyService);
    run(): TPromise<any>;
}
export declare class ShowPreviousSearchIncludeAction extends Action {
    private viewletService;
    private contextKeyService;
    static ID: string;
    static LABEL: string;
    static CONTEXT_KEY_EXPRESSION: ContextKeyExpr;
    constructor(id: string, label: string, viewletService: IViewletService, contextKeyService: IContextKeyService);
    run(): TPromise<any>;
}
export declare class ShowNextSearchExcludeAction extends Action {
    private viewletService;
    private contextKeyService;
    static ID: string;
    static LABEL: string;
    static CONTEXT_KEY_EXPRESSION: ContextKeyExpr;
    constructor(id: string, label: string, viewletService: IViewletService, contextKeyService: IContextKeyService);
    run(): TPromise<any>;
}
export declare class ShowPreviousSearchExcludeAction extends Action {
    private viewletService;
    private contextKeyService;
    static ID: string;
    static LABEL: string;
    static CONTEXT_KEY_EXPRESSION: ContextKeyExpr;
    constructor(id: string, label: string, viewletService: IViewletService, contextKeyService: IContextKeyService);
    run(): TPromise<any>;
}
export declare class ShowNextSearchTermAction extends Action {
    private viewletService;
    private contextKeyService;
    static ID: string;
    static LABEL: string;
    static CONTEXT_KEY_EXPRESSION: ContextKeyExpr;
    constructor(id: string, label: string, viewletService: IViewletService, contextKeyService: IContextKeyService);
    run(): TPromise<any>;
}
export declare class ShowPreviousSearchTermAction extends Action {
    private viewletService;
    private contextKeyService;
    static ID: string;
    static LABEL: string;
    static CONTEXT_KEY_EXPRESSION: ContextKeyExpr;
    constructor(id: string, label: string, viewletService: IViewletService, contextKeyService: IContextKeyService);
    run(): TPromise<any>;
}
export declare class FocusNextInputAction extends Action {
    private viewletService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, viewletService: IViewletService);
    run(): TPromise<any>;
}
export declare class FocusPreviousInputAction extends Action {
    private viewletService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, viewletService: IViewletService);
    run(): TPromise<any>;
}
export declare class OpenSearchViewletAction extends ToggleViewletAction {
    constructor(id: string, label: string, viewletService: IViewletService, editorService: IWorkbenchEditorService);
    run(): TPromise<any>;
}
export declare class FocusActiveEditorAction extends Action {
    private editorService;
    constructor(id: string, label: string, editorService: IWorkbenchEditorService);
    run(): TPromise<any>;
}
export declare abstract class FindOrReplaceInFilesAction extends Action {
    private viewletService;
    private expandSearchReplaceWidget;
    private selectWidgetText;
    private focusReplace;
    constructor(id: string, label: string, viewletService: IViewletService, expandSearchReplaceWidget: boolean, selectWidgetText: any, focusReplace: any);
    run(): TPromise<any>;
}
export declare class FindInFilesAction extends FindOrReplaceInFilesAction {
    constructor(id: string, label: string, viewletService: IViewletService);
}
export declare class ReplaceInFilesAction extends FindOrReplaceInFilesAction {
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, viewletService: IViewletService);
}
export declare class CloseReplaceAction extends Action {
    private viewletService;
    constructor(id: string, label: string, viewletService: IViewletService);
    run(): TPromise<any>;
}
export declare class FindInWorkspaceAction extends Action {
    private viewletService;
    static ID: string;
    constructor(viewletService: IViewletService);
    run(event?: any): TPromise<any>;
}
export declare class FindInFolderAction extends Action {
    private instantiationService;
    static ID: string;
    private resource;
    constructor(resource: URI, instantiationService: IInstantiationService);
    run(event?: any): TPromise<any>;
}
export declare const findInFolderCommand: (accessor: ServicesAccessor, resource?: URI) => void;
export declare class RefreshAction extends Action {
    private viewlet;
    constructor(viewlet: SearchViewlet);
    run(): TPromise<void>;
}
export declare class CollapseAllAction extends TreeCollapseAction {
    constructor(viewlet: SearchViewlet);
}
export declare class ClearSearchResultsAction extends Action {
    private viewlet;
    constructor(viewlet: SearchViewlet);
    run(): TPromise<void>;
}
export declare class FocusNextSearchResultAction extends Action {
    private viewletService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, viewletService: IViewletService);
    run(): TPromise<any>;
}
export declare class FocusPreviousSearchResultAction extends Action {
    private viewletService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, viewletService: IViewletService);
    run(): TPromise<any>;
}
export declare abstract class AbstractSearchAndReplaceAction extends Action {
    /**
     * Returns element to focus after removing the given element
     */
    getElementToFocusAfterRemoved(viewer: ITree, elementToBeRemoved: RenderableMatch): RenderableMatch;
    getNextElementAfterRemoved(viewer: ITree, element: RenderableMatch): RenderableMatch;
    getPreviousElementAfterRemoved(viewer: ITree, element: RenderableMatch): RenderableMatch;
    private getNavigatorAt(element, viewer);
}
export declare class RemoveAction extends AbstractSearchAndReplaceAction {
    private viewer;
    private element;
    constructor(viewer: ITree, element: RenderableMatch);
    run(): TPromise<any>;
}
export declare class ReplaceAllAction extends AbstractSearchAndReplaceAction {
    private viewer;
    private fileMatch;
    private viewlet;
    private replaceService;
    private telemetryService;
    constructor(viewer: ITree, fileMatch: FileMatch, viewlet: SearchViewlet, replaceService: IReplaceService, keyBindingService: IKeybindingService, telemetryService: ITelemetryService);
    run(): TPromise<any>;
}
export declare class ReplaceAction extends AbstractSearchAndReplaceAction {
    private viewer;
    private element;
    private viewlet;
    private replaceService;
    private editorService;
    private telemetryService;
    constructor(viewer: ITree, element: Match, viewlet: SearchViewlet, replaceService: IReplaceService, keyBindingService: IKeybindingService, editorService: IWorkbenchEditorService, telemetryService: ITelemetryService);
    run(): TPromise<any>;
    private getElementToFocusAfterReplace();
    private getElementToShowReplacePreview(elementToFocus);
    private hasSameParent(element);
    private hasToOpenFile();
}
