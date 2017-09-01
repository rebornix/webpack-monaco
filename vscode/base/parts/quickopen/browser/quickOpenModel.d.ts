import URI from 'vs/base/common/uri';
import { IActionProvider } from 'vs/base/parts/tree/browser/tree';
import { IconLabel, IIconLabelOptions } from 'vs/base/browser/ui/iconLabel/iconLabel';
import { IQuickNavigateConfiguration, IModel, IDataSource, IFilter, IAccessiblityProvider, IRenderer, IRunner, Mode } from 'vs/base/parts/quickopen/common/quickOpen';
import { ActionBar } from 'vs/base/browser/ui/actionbar/actionbar';
import { HighlightedLabel } from 'vs/base/browser/ui/highlightedlabel/highlightedLabel';
import { KeybindingLabel } from 'vs/base/browser/ui/keybindingLabel/keybindingLabel';
import { ResolvedKeybinding } from 'vs/base/common/keyCodes';
export interface IContext {
    event: any;
    quickNavigateConfiguration: IQuickNavigateConfiguration;
}
export interface IHighlight {
    start: number;
    end: number;
}
export declare class QuickOpenEntry {
    private id;
    private labelHighlights;
    private descriptionHighlights;
    private detailHighlights;
    private hidden;
    constructor(highlights?: IHighlight[]);
    /**
     * A unique identifier for the entry
     */
    getId(): string;
    /**
     * The label of the entry to identify it from others in the list
     */
    getLabel(): string;
    /**
     * The options for the label to use for this entry
     */
    getLabelOptions(): IIconLabelOptions;
    /**
     * The label of the entry to use when a screen reader wants to read about the entry
     */
    getAriaLabel(): string;
    /**
     * Detail information about the entry that is optional and can be shown below the label
     */
    getDetail(): string;
    /**
     * The icon of the entry to identify it from others in the list
     */
    getIcon(): string;
    /**
     * A secondary description that is optional and can be shown right to the label
     */
    getDescription(): string;
    /**
     * An optional keybinding to show for an entry.
     */
    getKeybinding(): ResolvedKeybinding;
    /**
     * A resource for this entry. Resource URIs can be used to compare different kinds of entries and group
     * them together.
     */
    getResource(): URI;
    /**
     * Allows to reuse the same model while filtering. Hidden entries will not show up in the viewer.
     */
    isHidden(): boolean;
    /**
     * Allows to reuse the same model while filtering. Hidden entries will not show up in the viewer.
     */
    setHidden(hidden: boolean): void;
    /**
     * Allows to set highlight ranges that should show up for the entry label and optionally description if set.
     */
    setHighlights(labelHighlights: IHighlight[], descriptionHighlights?: IHighlight[], detailHighlights?: IHighlight[]): void;
    /**
     * Allows to return highlight ranges that should show up for the entry label and description.
     */
    getHighlights(): [IHighlight[], IHighlight[], IHighlight[]];
    /**
     * Called when the entry is selected for opening. Returns a boolean value indicating if an action was performed or not.
     * The mode parameter gives an indication if the element is previewed (using arrow keys) or opened.
     *
     * The context parameter provides additional context information how the run was triggered.
     */
    run(mode: Mode, context: IContext): boolean;
    /**
     * A good default sort implementation for quick open entries respecting highlight information
     * as well as associated resources.
     */
    static compare(elementA: QuickOpenEntry, elementB: QuickOpenEntry, lookFor: string): number;
    static compareByScore(elementA: QuickOpenEntry, elementB: QuickOpenEntry, lookFor: string, lookForNormalizedLower: string, scorerCache?: {
        [key: string]: number;
    }): number;
    /**
     * A good default highlight implementation for an entry with label and description.
     */
    static highlight(entry: QuickOpenEntry, lookFor: string, fuzzyHighlight?: boolean): {
        labelHighlights: IHighlight[];
        descriptionHighlights: IHighlight[];
    };
    isFile(): boolean;
}
export declare class QuickOpenEntryGroup extends QuickOpenEntry {
    private entry;
    private groupLabel;
    private withBorder;
    constructor(entry?: QuickOpenEntry, groupLabel?: string, withBorder?: boolean);
    /**
     * The label of the group or null if none.
     */
    getGroupLabel(): string;
    setGroupLabel(groupLabel: string): void;
    /**
     * Whether to show a border on top of the group entry or not.
     */
    showBorder(): boolean;
    setShowBorder(showBorder: boolean): void;
    getLabel(): string;
    getLabelOptions(): IIconLabelOptions;
    getAriaLabel(): string;
    getDetail(): string;
    getResource(): URI;
    getIcon(): string;
    getDescription(): string;
    getEntry(): QuickOpenEntry;
    getHighlights(): [IHighlight[], IHighlight[], IHighlight[]];
    isHidden(): boolean;
    setHighlights(labelHighlights: IHighlight[], descriptionHighlights?: IHighlight[], detailHighlights?: IHighlight[]): void;
    setHidden(hidden: boolean): void;
    run(mode: Mode, context: IContext): boolean;
}
export interface IQuickOpenEntryTemplateData {
    container: HTMLElement;
    entry: HTMLElement;
    icon: HTMLSpanElement;
    label: IconLabel;
    detail: HighlightedLabel;
    description: HighlightedLabel;
    keybinding: KeybindingLabel;
    actionBar: ActionBar;
}
export interface IQuickOpenEntryGroupTemplateData extends IQuickOpenEntryTemplateData {
    group: HTMLDivElement;
}
export declare class QuickOpenModel implements IModel<QuickOpenEntry>, IDataSource<QuickOpenEntry>, IFilter<QuickOpenEntry>, IRunner<QuickOpenEntry> {
    private _entries;
    private _dataSource;
    private _renderer;
    private _filter;
    private _runner;
    private _accessibilityProvider;
    constructor(entries?: QuickOpenEntry[], actionProvider?: IActionProvider);
    entries: QuickOpenEntry[];
    readonly dataSource: IDataSource<QuickOpenEntry>;
    readonly renderer: IRenderer<QuickOpenEntry>;
    readonly filter: IFilter<QuickOpenEntry>;
    readonly runner: IRunner<QuickOpenEntry>;
    readonly accessibilityProvider: IAccessiblityProvider<QuickOpenEntry>;
    /**
     * Adds entries that should show up in the quick open viewer.
     */
    addEntries(entries: QuickOpenEntry[]): void;
    /**
     * Set the entries that should show up in the quick open viewer.
     */
    setEntries(entries: QuickOpenEntry[]): void;
    /**
     * Get the entries that should show up in the quick open viewer.
     *
     * @visibleOnly optional parameter to only return visible entries
     */
    getEntries(visibleOnly?: boolean): QuickOpenEntry[];
    getId(entry: QuickOpenEntry): string;
    getLabel(entry: QuickOpenEntry): string;
    getAriaLabel(entry: QuickOpenEntry): string;
    isVisible(entry: QuickOpenEntry): boolean;
    run(entry: QuickOpenEntry, mode: Mode, context: IContext): boolean;
}
