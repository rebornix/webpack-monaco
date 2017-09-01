import { TPromise } from 'vs/base/common/winjs.base';
import { Dimension, Builder } from 'vs/base/browser/builder';
import { Action } from 'vs/base/common/actions';
import { ITree, IFocusEvent, ISelectionEvent } from 'vs/base/parts/tree/browser/tree';
import { IViewletService } from 'vs/workbench/services/viewlet/browser/viewlet';
import { IWorkbenchEditorService } from 'vs/workbench/services/editor/common/editorService';
import { IViewlet } from 'vs/workbench/common/viewlet';
import { Composite, CompositeDescriptor, CompositeRegistry } from 'vs/workbench/browser/composite';
export declare abstract class Viewlet extends Composite implements IViewlet {
    getOptimalWidth(): number;
}
/**
 * Helper subtype of viewlet for those that use a tree inside.
 */
export declare abstract class ViewerViewlet extends Viewlet {
    protected viewer: ITree;
    private viewerContainer;
    private wasLayouted;
    create(parent: Builder): TPromise<void>;
    /**
     * Called when an element in the viewer receives selection.
     */
    abstract onSelection(e: ISelectionEvent): void;
    /**
     * Called when an element in the viewer receives focus.
     */
    abstract onFocus(e: IFocusEvent): void;
    /**
     * Returns true if this viewlet is currently visible and false otherwise.
     */
    abstract createViewer(viewerContainer: Builder): ITree;
    /**
     * Returns the viewer that is contained in this viewlet.
     */
    getViewer(): ITree;
    setVisible(visible: boolean): TPromise<void>;
    focus(): void;
    reveal(element: any, relativeTop?: number): TPromise<void>;
    layout(dimension: Dimension): void;
    getControl(): ITree;
    dispose(): void;
}
/**
 * A viewlet descriptor is a leightweight descriptor of a viewlet in the workbench.
 */
export declare class ViewletDescriptor extends CompositeDescriptor<Viewlet> {
    private _extensionId;
    constructor(moduleId: string, ctorName: string, id: string, name: string, cssClass?: string, order?: number, _extensionId?: string);
    readonly extensionId: string;
}
export declare const Extensions: {
    Viewlets: string;
};
export declare class ViewletRegistry extends CompositeRegistry<Viewlet> {
    private defaultViewletId;
    /**
     * Registers a viewlet to the platform.
     */
    registerViewlet(descriptor: ViewletDescriptor): void;
    /**
     * Returns the viewlet descriptor for the given id or null if none.
     */
    getViewlet(id: string): ViewletDescriptor;
    /**
     * Returns an array of registered viewlets known to the platform.
     */
    getViewlets(): ViewletDescriptor[];
    /**
     * Sets the id of the viewlet that should open on startup by default.
     */
    setDefaultViewletId(id: string): void;
    /**
     * Gets the id of the viewlet that should open on startup by default.
     */
    getDefaultViewletId(): string;
}
/**
 * A reusable action to toggle a viewlet with a specific id.
 */
export declare class ToggleViewletAction extends Action {
    protected viewletService: IViewletService;
    private editorService;
    private viewletId;
    constructor(id: string, name: string, viewletId: string, viewletService: IViewletService, editorService: IWorkbenchEditorService);
    run(): TPromise<any>;
    private otherViewletShowing();
    private sidebarHasFocus();
}
export declare class CollapseAction extends Action {
    constructor(viewer: ITree, enabled: boolean, clazz: string);
}
