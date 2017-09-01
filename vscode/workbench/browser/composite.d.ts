import { TPromise } from 'vs/base/common/winjs.base';
import { Dimension, Builder } from 'vs/base/browser/builder';
import { IAction, IActionRunner } from 'vs/base/common/actions';
import { IActionItem } from 'vs/base/browser/ui/actionbar/actionbar';
import { Component } from 'vs/workbench/common/component';
import { ITelemetryService } from 'vs/platform/telemetry/common/telemetry';
import { AsyncDescriptor } from 'vs/platform/instantiation/common/descriptors';
import { IComposite } from 'vs/workbench/common/composite';
import { IEditorControl } from 'vs/platform/editor/common/editor';
import Event from 'vs/base/common/event';
import { IThemeService } from 'vs/platform/theme/common/themeService';
/**
 * Composites are layed out in the sidebar and panel part of the workbench. At a time only one composite
 * can be open in the sidebar, and only one composite can be open in the panel.
 * Each composite has a minimized representation that is good enough to provide some
 * information about the state of the composite data.
 * The workbench will keep a composite alive after it has been created and show/hide it based on
 * user interaction. The lifecycle of a composite goes in the order create(), setVisible(true|false),
 * layout(), focus(), dispose(). During use of the workbench, a composite will often receive a setVisible,
 * layout and focus call, but only one create and dispose call.
 */
export declare abstract class Composite extends Component implements IComposite {
    private _telemetryService;
    private _telemetryData;
    private visible;
    private parent;
    private _onTitleAreaUpdate;
    protected actionRunner: IActionRunner;
    /**
     * Create a new composite with the given ID and context.
     */
    constructor(id: string, _telemetryService: ITelemetryService, themeService: IThemeService);
    getTitle(): string;
    protected readonly telemetryService: ITelemetryService;
    readonly onTitleAreaUpdate: Event<void>;
    /**
     * Note: Clients should not call this method, the workbench calls this
     * method. Calling it otherwise may result in unexpected behavior.
     *
     * Called to create this composite on the provided builder. This method is only
     * called once during the lifetime of the workbench.
     * Note that DOM-dependent calculations should be performed from the setVisible()
     * call. Only then the composite will be part of the DOM.
     */
    create(parent: Builder): TPromise<void>;
    updateStyles(): void;
    /**
     * Returns the container this composite is being build in.
     */
    getContainer(): Builder;
    /**
     * Note: Clients should not call this method, the workbench calls this
     * method. Calling it otherwise may result in unexpected behavior.
     *
     * Called to indicate that the composite has become visible or hidden. This method
     * is called more than once during workbench lifecycle depending on the user interaction.
     * The composite will be on-DOM if visible is set to true and off-DOM otherwise.
     *
     * The returned promise is complete when the composite is visible. As such it is valid
     * to do a long running operation from this call. Typically this operation should be
     * fast though because setVisible might be called many times during a session.
     */
    setVisible(visible: boolean): TPromise<void>;
    /**
     * Called when this composite should receive keyboard focus.
     */
    focus(): void;
    /**
     * Layout the contents of this composite using the provided dimensions.
     */
    abstract layout(dimension: Dimension): void;
    /**
     * Returns an array of actions to show in the action bar of the composite.
     */
    getActions(): IAction[];
    /**
     * Returns an array of actions to show in the action bar of the composite
     * in a less prominent way then action from getActions.
     */
    getSecondaryActions(): IAction[];
    /**
     * Returns an array of actions to show in the context menu of the composite
     */
    getContextMenuActions(): IAction[];
    /**
     * For any of the actions returned by this composite, provide an IActionItem in
     * cases where the implementor of the composite wants to override the presentation
     * of an action. Returns null to indicate that the action is not rendered through
     * an action item.
     */
    getActionItem(action: IAction): IActionItem;
    /**
     * Returns the instance of IActionRunner to use with this composite for the
     * composite tool bar.
     */
    getActionRunner(): IActionRunner;
    /**
     * Method for composite implementors to indicate to the composite container that the title or the actions
     * of the composite have changed. Calling this method will cause the container to ask for title (getTitle())
     * and actions (getActions(), getSecondaryActions()) if the composite is visible or the next time the composite
     * gets visible.
     */
    protected updateTitleArea(): void;
    /**
     * Returns true if this composite is currently visible and false otherwise.
     */
    isVisible(): boolean;
    /**
     * Returns the underlying composite control or null if it is not accessible.
     */
    getControl(): IEditorControl;
    dispose(): void;
}
/**
 * A composite descriptor is a leightweight descriptor of a composite in the workbench.
 */
export declare abstract class CompositeDescriptor<T extends Composite> extends AsyncDescriptor<T> {
    id: string;
    name: string;
    cssClass: string;
    order: number;
    constructor(moduleId: string, ctorName: string, id: string, name: string, cssClass?: string, order?: number);
}
export declare abstract class CompositeRegistry<T extends Composite> {
    private composites;
    constructor();
    protected registerComposite(descriptor: CompositeDescriptor<T>): void;
    getComposite(id: string): CompositeDescriptor<T>;
    protected getComposites(): CompositeDescriptor<T>[];
    protected setComposites(compositesToSet: CompositeDescriptor<T>[]): void;
    private compositeById(id);
}
