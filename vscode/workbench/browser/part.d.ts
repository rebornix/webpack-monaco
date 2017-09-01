import 'vs/css!./media/part';
import { Dimension, Builder } from 'vs/base/browser/builder';
import { Component } from 'vs/workbench/common/component';
import { IThemeService, ITheme } from 'vs/platform/theme/common/themeService';
export interface IPartOptions {
    hasTitle?: boolean;
    borderWidth?: () => number;
}
/**
 * Parts are layed out in the workbench and have their own layout that arranges an optional title
 * and mandatory content area to show content.
 */
export declare abstract class Part extends Component {
    private options;
    private parent;
    private titleArea;
    private contentArea;
    private partLayout;
    constructor(id: string, options: IPartOptions, themeService: IThemeService);
    protected onThemeChange(theme: ITheme): void;
    /**
     * Note: Clients should not call this method, the workbench calls this
     * method. Calling it otherwise may result in unexpected behavior.
     *
     * Called to create title and content area of the part.
     */
    create(parent: Builder): void;
    /**
     * Returns the overall part container.
     */
    getContainer(): Builder;
    /**
     * Subclasses override to provide a title area implementation.
     */
    protected createTitleArea(parent: Builder): Builder;
    /**
     * Returns the title area container.
     */
    protected getTitleArea(): Builder;
    /**
     * Subclasses override to provide a content area implementation.
     */
    protected createContentArea(parent: Builder): Builder;
    /**
     * Returns the content area container.
     */
    protected getContentArea(): Builder;
    /**
     * Layout title and content area in the given dimension.
     */
    layout(dimension: Dimension): Dimension[];
    /**
     * Returns the part layout implementation.
     */
    getLayout(): PartLayout;
}
export declare class PartLayout {
    private container;
    private options;
    private titleArea;
    private contentArea;
    constructor(container: Builder, options: IPartOptions, titleArea: Builder, contentArea: Builder);
    layout(dimension: Dimension): Dimension[];
}
