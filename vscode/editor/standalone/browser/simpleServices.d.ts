import Severity from 'vs/base/common/severity';
import URI from 'vs/base/common/uri';
import { TPromise } from 'vs/base/common/winjs.base';
import { IConfigurationService, IConfigurationServiceEvent, IConfigurationValue, IConfigurationKeys, IConfigurationValues, IConfigurationData, IConfigurationOverrides } from 'vs/platform/configuration/common/configuration';
import { IEditor, IEditorInput, IEditorOptions, IEditorService, IResourceInput, Position } from 'vs/platform/editor/common/editor';
import { ICommandService, ICommand, ICommandEvent, ICommandHandler } from 'vs/platform/commands/common/commands';
import { AbstractKeybindingService } from 'vs/platform/keybinding/common/abstractKeybindingService';
import { KeybindingResolver } from 'vs/platform/keybinding/common/keybindingResolver';
import { IKeyboardEvent } from 'vs/platform/keybinding/common/keybinding';
import { ContextKeyExpr, IContextKeyService } from 'vs/platform/contextkey/common/contextkey';
import { IConfirmation, IMessageService } from 'vs/platform/message/common/message';
import { IWorkspaceContextService, ILegacyWorkspace, IWorkspace } from 'vs/platform/workspace/common/workspace';
import * as editorCommon from 'vs/editor/common/editorCommon';
import { ICodeEditor, IDiffEditor } from 'vs/editor/browser/editorBrowser';
import { Selection } from 'vs/editor/common/core/selection';
import Event from 'vs/base/common/event';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { IProgressService, IProgressRunner } from 'vs/platform/progress/common/progress';
import { ITextResourceConfigurationService } from 'vs/editor/common/services/resourceConfiguration';
import { ITextModelService, ITextModelContentProvider, ITextEditorModel } from 'vs/editor/common/services/resolverService';
import { IDisposable, IReference } from 'vs/base/common/lifecycle';
import { MenuId, IMenu, IMenuService } from 'vs/platform/actions/common/actions';
import { ITelemetryService, ITelemetryInfo } from 'vs/platform/telemetry/common/telemetry';
import { ResolvedKeybinding, Keybinding } from 'vs/base/common/keyCodes';
export declare class SimpleEditor implements IEditor {
    input: IEditorInput;
    options: IEditorOptions;
    position: Position;
    _widget: editorCommon.IEditor;
    constructor(editor: editorCommon.IEditor);
    getId(): string;
    getControl(): editorCommon.IEditor;
    getSelection(): Selection;
    focus(): void;
    isVisible(): boolean;
    withTypedEditor<T>(codeEditorCallback: (editor: ICodeEditor) => T, diffEditorCallback: (editor: IDiffEditor) => T): T;
}
export declare class SimpleModel implements ITextEditorModel {
    private model;
    private _onDispose;
    constructor(model: editorCommon.IModel);
    readonly onDispose: Event<void>;
    load(): TPromise<SimpleModel>;
    readonly textEditorModel: editorCommon.IModel;
    dispose(): void;
}
export interface IOpenEditorDelegate {
    (url: string): boolean;
}
export declare class SimpleEditorService implements IEditorService {
    _serviceBrand: any;
    private editor;
    private openEditorDelegate;
    constructor();
    setEditor(editor: editorCommon.IEditor): void;
    setOpenEditorDelegate(openEditorDelegate: IOpenEditorDelegate): void;
    openEditor(typedData: IResourceInput, sideBySide?: boolean): TPromise<IEditor>;
    private doOpenEditor(editor, data);
    private findModel(editor, data);
}
export declare class SimpleEditorModelResolverService implements ITextModelService {
    _serviceBrand: any;
    private editor;
    setEditor(editor: editorCommon.IEditor): void;
    createModelReference(resource: URI): TPromise<IReference<ITextEditorModel>>;
    registerTextModelContentProvider(scheme: string, provider: ITextModelContentProvider): IDisposable;
    private findModel(editor, resource);
}
export declare class SimpleProgressService implements IProgressService {
    _serviceBrand: any;
    private static NULL_PROGRESS_RUNNER;
    show(infinite: boolean, delay?: number): IProgressRunner;
    show(total: number, delay?: number): IProgressRunner;
    showWhile(promise: TPromise<any>, delay?: number): TPromise<void>;
}
export declare class SimpleMessageService implements IMessageService {
    _serviceBrand: any;
    private static Empty;
    show(sev: Severity, message: any): () => void;
    hideAll(): void;
    confirm(confirmation: IConfirmation): boolean;
}
export declare class StandaloneCommandService implements ICommandService {
    _serviceBrand: any;
    private readonly _instantiationService;
    private _dynamicCommands;
    private _onWillExecuteCommand;
    readonly onWillExecuteCommand: Event<ICommandEvent>;
    constructor(instantiationService: IInstantiationService);
    addCommand(id: string, command: ICommand): IDisposable;
    executeCommand<T>(id: string, ...args: any[]): TPromise<T>;
}
export declare class StandaloneKeybindingService extends AbstractKeybindingService {
    private _cachedResolver;
    private _dynamicKeybindings;
    constructor(contextKeyService: IContextKeyService, commandService: ICommandService, messageService: IMessageService, domNode: HTMLElement);
    addDynamicKeybinding(commandId: string, keybinding: number, handler: ICommandHandler, when: ContextKeyExpr): IDisposable;
    private updateResolver(event);
    protected _getResolver(): KeybindingResolver;
    private _toNormalizedKeybindingItems(items, isDefault);
    resolveKeybinding(keybinding: Keybinding): ResolvedKeybinding[];
    resolveKeyboardEvent(keyboardEvent: IKeyboardEvent): ResolvedKeybinding;
    resolveUserBinding(userBinding: string): ResolvedKeybinding[];
}
export declare class SimpleConfigurationService implements IConfigurationService {
    _serviceBrand: any;
    private _onDidUpdateConfiguration;
    onDidUpdateConfiguration: Event<IConfigurationServiceEvent>;
    private _configuration;
    constructor();
    private configuration();
    reloadConfiguration<T>(section?: string): TPromise<T>;
    getConfiguration<C>(section?: string, options?: IConfigurationOverrides): C;
    lookup<C>(key: string, options?: IConfigurationOverrides): IConfigurationValue<C>;
    keys(): IConfigurationKeys;
    values<V>(): IConfigurationValues;
    getConfigurationData(): IConfigurationData<any>;
}
export declare class SimpleResourceConfigurationService implements ITextResourceConfigurationService {
    private configurationService;
    _serviceBrand: any;
    readonly onDidUpdateConfiguration: Event<void>;
    private readonly _onDidUpdateConfigurationEmitter;
    constructor(configurationService: SimpleConfigurationService);
    getConfiguration<T>(): T;
}
export declare class SimpleMenuService implements IMenuService {
    _serviceBrand: any;
    private readonly _commandService;
    constructor(commandService: ICommandService);
    createMenu(id: MenuId, contextKeyService: IContextKeyService): IMenu;
}
export declare class StandaloneTelemetryService implements ITelemetryService {
    _serviceBrand: void;
    isOptedIn: boolean;
    publicLog(eventName: string, data?: any): TPromise<void>;
    getTelemetryInfo(): TPromise<ITelemetryInfo>;
}
export declare class SimpleWorkspaceContextService implements IWorkspaceContextService {
    _serviceBrand: any;
    private static SCHEME;
    private readonly _onDidChangeWorkspaceName;
    readonly onDidChangeWorkspaceName: Event<void>;
    private readonly _onDidChangeWorkspaceRoots;
    readonly onDidChangeWorkspaceRoots: Event<void>;
    private readonly legacyWorkspace;
    private readonly workspace;
    constructor();
    getLegacyWorkspace(): ILegacyWorkspace;
    getWorkspace(): IWorkspace;
    getRoot(resource: URI): URI;
    hasWorkspace(): boolean;
    hasFolderWorkspace(): boolean;
    hasMultiFolderWorkspace(): boolean;
    isInsideWorkspace(resource: URI): boolean;
    toResource(workspaceRelativePath: string): URI;
}
