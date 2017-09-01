import 'vs/css!./media/compositepart';
import { TPromise } from 'vs/base/common/winjs.base';
import { Dimension, Builder } from 'vs/base/browser/builder';
import { Emitter } from 'vs/base/common/event';
import { IAction } from 'vs/base/common/actions';
import { Part, IPartOptions } from 'vs/workbench/browser/part';
import { Composite, CompositeRegistry } from 'vs/workbench/browser/composite';
import { IComposite } from 'vs/workbench/common/composite';
import { IPartService } from 'vs/workbench/services/part/common/partService';
import { IStorageService } from 'vs/platform/storage/common/storage';
import { IContextMenuService } from 'vs/platform/contextview/browser/contextView';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { IMessageService } from 'vs/platform/message/common/message';
import { IProgressService } from 'vs/platform/progress/common/progress';
import { ITelemetryService } from 'vs/platform/telemetry/common/telemetry';
import { IKeybindingService } from 'vs/platform/keybinding/common/keybinding';
import { IThemeService } from 'vs/platform/theme/common/themeService';
export interface ICompositeTitleLabel {
    /**
     * Asks to update the title for the composite with the given ID.
     */
    updateTitle(id: string, title: string, keybinding?: string): void;
    /**
     * Called when theming information changes.
     */
    updateStyles(): void;
}
export declare abstract class CompositePart<T extends Composite> extends Part {
    private messageService;
    private storageService;
    private telemetryService;
    private contextMenuService;
    protected partService: IPartService;
    private keybindingService;
    protected instantiationService: IInstantiationService;
    private registry;
    private activeCompositeSettingsKey;
    private defaultCompositeId;
    private nameForTelemetry;
    private compositeCSSClass;
    private actionContributionScope;
    private titleForegroundColor;
    private instantiatedCompositeListeners;
    private mapCompositeToCompositeContainer;
    private mapActionsBindingToComposite;
    private mapProgressServiceToComposite;
    private activeComposite;
    private lastActiveCompositeId;
    private instantiatedComposites;
    private titleLabel;
    private toolBar;
    private compositeLoaderPromises;
    private progressBar;
    private contentAreaSize;
    private telemetryActionsListener;
    private currentCompositeOpenToken;
    protected _onDidCompositeOpen: Emitter<IComposite>;
    protected _onDidCompositeClose: Emitter<IComposite>;
    constructor(messageService: IMessageService, storageService: IStorageService, telemetryService: ITelemetryService, contextMenuService: IContextMenuService, partService: IPartService, keybindingService: IKeybindingService, instantiationService: IInstantiationService, themeService: IThemeService, registry: CompositeRegistry<T>, activeCompositeSettingsKey: string, defaultCompositeId: string, nameForTelemetry: string, compositeCSSClass: string, actionContributionScope: string, titleForegroundColor: string, id: string, options: IPartOptions);
    protected openComposite(id: string, focus?: boolean): TPromise<Composite>;
    private doOpenComposite(id, focus?);
    protected createComposite(id: string, isActive?: boolean): TPromise<Composite>;
    protected showComposite(composite: Composite): TPromise<void>;
    protected onTitleAreaUpdate(compositeId: string): void;
    private updateTitle(compositeId, compositeTitle?);
    private collectCompositeActions(composite);
    protected getActiveComposite(): IComposite;
    protected getLastActiveCompositetId(): string;
    protected hideActiveComposite(): TPromise<Composite>;
    createTitleArea(parent: Builder): Builder;
    protected createTitleLabel(parent: Builder): ICompositeTitleLabel;
    protected updateStyles(): void;
    private onTitleAreaContextMenu(event);
    protected getTitleAreaContextMenuActions(): IAction[];
    private actionItemProvider(action);
    createContentArea(parent: Builder): Builder;
    private onError(error);
    getProgressIndicator(id: string): IProgressService;
    protected getActions(): IAction[];
    protected getSecondaryActions(): IAction[];
    layout(dimension: Dimension): Dimension[];
    shutdown(): void;
    dispose(): void;
}
