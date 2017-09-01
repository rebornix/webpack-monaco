import 'vs/css!./media/quickopen';
import { TPromise } from 'vs/base/common/winjs.base';
import { Dimension } from 'vs/base/browser/builder';
import URI from 'vs/base/common/uri';
import { Action } from 'vs/base/common/actions';
import { IIconLabelOptions } from 'vs/base/browser/ui/iconLabel/iconLabel';
import { CancellationToken } from 'vs/base/common/cancellation';
import { Mode, IEntryRunContext, IQuickNavigateConfiguration } from 'vs/base/parts/quickopen/common/quickOpen';
import { QuickOpenEntryGroup } from 'vs/base/parts/quickopen/browser/quickOpenModel';
import { ITextFileService } from 'vs/workbench/services/textfile/common/textfiles';
import { IResourceInput, IEditorInput } from 'vs/platform/editor/common/editor';
import { IModeService } from 'vs/editor/common/services/modeService';
import { IModelService } from 'vs/editor/common/services/modelService';
import { Component } from 'vs/workbench/common/component';
import Event from 'vs/base/common/event';
import { IPartService } from 'vs/workbench/services/part/common/partService';
import { EditorQuickOpenEntry } from 'vs/workbench/browser/quickopen';
import { IWorkbenchEditorService } from 'vs/workbench/services/editor/common/editorService';
import { IPickOpenEntry, IInputOptions, IQuickOpenService, IPickOptions, IShowOptions } from 'vs/platform/quickOpen/common/quickOpen';
import { IConfigurationService } from 'vs/platform/configuration/common/configuration';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { IMessageService } from 'vs/platform/message/common/message';
import { ITelemetryService } from 'vs/platform/telemetry/common/telemetry';
import { IWorkspaceContextService } from 'vs/platform/workspace/common/workspace';
import { IContextKeyService } from 'vs/platform/contextkey/common/contextkey';
import { IHistoryService } from 'vs/workbench/services/history/common/history';
import { IListService } from 'vs/platform/list/browser/listService';
import { IThemeService } from 'vs/platform/theme/common/themeService';
import { IEnvironmentService } from 'vs/platform/environment/common/environment';
export declare class QuickOpenController extends Component implements IQuickOpenService {
    private editorService;
    private messageService;
    private telemetryService;
    private contextService;
    private contextKeyService;
    private configurationService;
    private historyService;
    private instantiationService;
    private partService;
    private listService;
    private static MAX_SHORT_RESPONSE_TIME;
    _serviceBrand: any;
    private static ID;
    private _onShow;
    private _onHide;
    private quickOpenWidget;
    private pickOpenWidget;
    private layoutDimensions;
    private mapResolvedHandlersToPrefix;
    private mapContextKeyToContext;
    private handlerOnOpenCalled;
    private currentResultToken;
    private currentPickerToken;
    private inQuickOpenMode;
    private promisesToCompleteOnHide;
    private previousActiveHandlerDescriptor;
    private actionProvider;
    private previousValue;
    private visibilityChangeTimeoutHandle;
    private closeOnFocusLost;
    constructor(editorService: IWorkbenchEditorService, messageService: IMessageService, telemetryService: ITelemetryService, contextService: IWorkspaceContextService, contextKeyService: IContextKeyService, configurationService: IConfigurationService, historyService: IHistoryService, instantiationService: IInstantiationService, partService: IPartService, listService: IListService, themeService: IThemeService);
    private registerListeners();
    private updateConfiguration(settings);
    readonly onShow: Event<void>;
    readonly onHide: Event<void>;
    navigate(next: boolean, quickNavigate?: IQuickNavigateConfiguration): void;
    input(options?: IInputOptions, token?: CancellationToken): TPromise<string>;
    pick(picks: TPromise<string[]>, options?: IPickOptions, token?: CancellationToken): TPromise<string>;
    pick<T extends IPickOpenEntry>(picks: TPromise<T[]>, options?: IPickOptions, token?: CancellationToken): TPromise<string>;
    pick(picks: string[], options?: IPickOptions, token?: CancellationToken): TPromise<string>;
    pick<T extends IPickOpenEntry>(picks: T[], options?: IPickOptions, token?: CancellationToken): TPromise<T>;
    private doPick(picksPromise, options, token?);
    accept(): void;
    focus(): void;
    close(): void;
    private emitQuickOpenVisibilityChange(isVisible);
    show(prefix?: string, options?: IShowOptions): TPromise<void>;
    private positionQuickOpenWidget();
    private handleOnShow(isPicker);
    private handleOnHide(isPicker, reason);
    private resetQuickOpenContextKeys();
    private setQuickOpenContextKey(id?);
    private hasHandler(prefix);
    private getEditorHistoryWithGroupLabel();
    private restoreFocus();
    private onType(value);
    private handleDefaultHandler(handler, value, currentResultToken);
    private getEditorHistoryEntries(searchValue?);
    private mergeResults(quickOpenModel, handlerResults, groupLabel);
    private handleSpecificHandler(handlerDescriptor, value, currentResultToken);
    private showModel(model, autoFocus?, ariaLabel?);
    private clearModel();
    private mapEntriesToResource(model);
    private resolveHandler(handler);
    private _resolveHandler(handler);
    layout(dimension: Dimension): void;
    dispose(): void;
}
export declare class EditorHistoryEntryGroup extends QuickOpenEntryGroup {
}
export declare class EditorHistoryEntry extends EditorQuickOpenEntry {
    private modeService;
    private modelService;
    private textFileService;
    private configurationService;
    private input;
    private resource;
    private label;
    private description;
    private dirty;
    constructor(input: IEditorInput | IResourceInput, editorService: IWorkbenchEditorService, modeService: IModeService, modelService: IModelService, textFileService: ITextFileService, contextService: IWorkspaceContextService, configurationService: IConfigurationService, environmentService: IEnvironmentService);
    getIcon(): string;
    getLabel(): string;
    getLabelOptions(): IIconLabelOptions;
    getAriaLabel(): string;
    getDescription(): string;
    getResource(): URI;
    getInput(): IEditorInput | IResourceInput;
    run(mode: Mode, context: IEntryRunContext): boolean;
}
export declare class RemoveFromEditorHistoryAction extends Action {
    private quickOpenService;
    private instantiationService;
    private historyService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, quickOpenService: IQuickOpenService, instantiationService: IInstantiationService, historyService: IHistoryService);
    run(): TPromise<any>;
}