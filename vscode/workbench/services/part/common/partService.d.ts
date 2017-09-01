import { TPromise } from 'vs/base/common/winjs.base';
import { ServiceIdentifier } from 'vs/platform/instantiation/common/instantiation';
import Event from 'vs/base/common/event';
export declare enum Parts {
    ACTIVITYBAR_PART = 0,
    SIDEBAR_PART = 1,
    PANEL_PART = 2,
    EDITOR_PART = 3,
    STATUSBAR_PART = 4,
    TITLEBAR_PART = 5,
}
export declare enum Position {
    LEFT = 0,
    RIGHT = 1,
}
export interface ILayoutOptions {
    toggleMaximizedPanel?: boolean;
}
export declare const IPartService: {
    (...args: any[]): void;
    type: IPartService;
};
export interface IPartService {
    _serviceBrand: ServiceIdentifier<any>;
    /**
     * Emits when the visibility of the title bar changes.
     */
    onTitleBarVisibilityChange: Event<void>;
    /**
     * Emits when the editor part's layout changes.
     */
    onEditorLayout: Event<void>;
    /**
     * Asks the part service to layout all parts.
     */
    layout(options?: ILayoutOptions): void;
    /**
     * Asks the part service to if all parts have been created.
     */
    isCreated(): boolean;
    /**
     * Promise is complete when all parts have been created.
     */
    joinCreation(): TPromise<boolean>;
    /**
     * Returns whether the given part has the keyboard focus or not.
     */
    hasFocus(part: Parts): boolean;
    /**
     * Returns the parts HTML element, if there is one.
     */
    getContainer(part: Parts): HTMLElement;
    /**
     * Returns if the part is visible.
     */
    isVisible(part: Parts): boolean;
    /**
     * Set activity bar hidden or not
     */
    setActivityBarHidden(hidden: boolean): void;
    /**
     * Number of pixels (adjusted for zooming) that the title bar (if visible) pushes down the workbench contents.
     */
    getTitleBarOffset(): number;
    /**
     * Set sidebar hidden or not
     */
    setSideBarHidden(hidden: boolean): TPromise<void>;
    /**
     * Set panel part hidden or not
     */
    setPanelHidden(hidden: boolean): TPromise<void>;
    /**
     * Maximizes the panel height if the panel is not already maximized.
     * Shrinks the panel to the default starting size if the panel is maximized.
     */
    toggleMaximizedPanel(): void;
    /**
     * Returns true if the panel is maximized.
     */
    isPanelMaximized(): boolean;
    /**
     * Gets the current side bar position. Note that the sidebar can be hidden too.
     */
    getSideBarPosition(): Position;
    /**
     * Returns the identifier of the element that contains the workbench.
     */
    getWorkbenchElementId(): string;
    /**
     * Toggles the workbench in and out of zen mode - parts get hidden and window goes fullscreen.
     */
    toggleZenMode(): void;
    /**
     * Resizes currently focused part on main access
     */
    resizePart(part: Parts, sizeChange: number): void;
}
