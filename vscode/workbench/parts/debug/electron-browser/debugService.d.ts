import Event from 'vs/base/common/event';
import uri from 'vs/base/common/uri';
import severity from 'vs/base/common/severity';
import { TPromise } from 'vs/base/common/winjs.base';
import { IContextKeyService } from 'vs/platform/contextkey/common/contextkey';
import { IMarkerService } from 'vs/platform/markers/common/markers';
import { ILifecycleService } from 'vs/platform/lifecycle/common/lifecycle';
import { IExtensionService } from 'vs/platform/extensions/common/extensions';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { IFileService } from 'vs/platform/files/common/files';
import { IMessageService } from 'vs/platform/message/common/message';
import { IWindowsService, IWindowService } from 'vs/platform/windows/common/windows';
import { ITelemetryService } from 'vs/platform/telemetry/common/telemetry';
import { ICommandService } from 'vs/platform/commands/common/commands';
import { IStorageService } from 'vs/platform/storage/common/storage';
import * as debug from 'vs/workbench/parts/debug/common/debug';
import { ITaskService } from 'vs/workbench/parts/tasks/common/taskService';
import { IViewletService } from 'vs/workbench/services/viewlet/browser/viewlet';
import { IPanelService } from 'vs/workbench/services/panel/common/panelService';
import { IPartService } from 'vs/workbench/services/part/common/partService';
import { ITextFileService } from 'vs/workbench/services/textfile/common/textfiles';
import { IConfigurationService } from 'vs/platform/configuration/common/configuration';
import { IWorkspaceContextService } from 'vs/platform/workspace/common/workspace';
import { IWorkbenchEditorService } from 'vs/workbench/services/editor/common/editorService';
import { IBroadcastService } from 'vs/platform/broadcast/electron-browser/broadcastService';
export declare class DebugService implements debug.IDebugService {
    private storageService;
    private editorService;
    private textFileService;
    private viewletService;
    private panelService;
    private messageService;
    private partService;
    private windowsService;
    private windowService;
    private broadcastService;
    private telemetryService;
    private contextService;
    private instantiationService;
    private extensionService;
    private markerService;
    private taskService;
    private fileService;
    private configurationService;
    private commandService;
    _serviceBrand: any;
    private sessionStates;
    private _onDidChangeState;
    private _onDidNewProcess;
    private _onDidEndProcess;
    private _onDidCustomEvent;
    private model;
    private viewModel;
    private allSessionIds;
    private configurationManager;
    private customTelemetryService;
    private toDispose;
    private toDisposeOnSessionEnd;
    private inDebugMode;
    private debugType;
    private debugState;
    private breakpointsToSendOnResourceSaved;
    private launchJsonChanged;
    constructor(storageService: IStorageService, editorService: IWorkbenchEditorService, textFileService: ITextFileService, viewletService: IViewletService, panelService: IPanelService, messageService: IMessageService, partService: IPartService, windowsService: IWindowsService, windowService: IWindowService, broadcastService: IBroadcastService, telemetryService: ITelemetryService, contextService: IWorkspaceContextService, contextKeyService: IContextKeyService, lifecycleService: ILifecycleService, instantiationService: IInstantiationService, extensionService: IExtensionService, markerService: IMarkerService, taskService: ITaskService, fileService: IFileService, configurationService: IConfigurationService, commandService: ICommandService);
    private registerListeners(lifecycleService);
    private onBroadcast(broadcast);
    private tryToAutoFocusStackFrame(thread);
    private registerSessionListeners(process, session);
    private fetchThreads(session);
    private loadBreakpoints();
    private loadFunctionBreakpoints();
    private loadExceptionBreakpoints();
    private loadWatchExpressions();
    readonly state: debug.State;
    readonly onDidChangeState: Event<debug.State>;
    readonly onDidNewProcess: Event<debug.IProcess>;
    readonly onDidEndProcess: Event<debug.IProcess>;
    readonly onDidCustomEvent: Event<debug.DebugEvent>;
    private updateStateAndEmit(sessionId?, newState?);
    focusStackFrameAndEvaluate(stackFrame: debug.IStackFrame, process?: debug.IProcess, explicit?: boolean): TPromise<void>;
    enableOrDisableBreakpoints(enable: boolean, breakpoint?: debug.IEnablement): TPromise<void>;
    addBreakpoints(uri: uri, rawBreakpoints: debug.IRawBreakpoint[]): TPromise<void>;
    removeBreakpoints(id?: string): TPromise<any>;
    setBreakpointsActivated(activated: boolean): TPromise<void>;
    addFunctionBreakpoint(): void;
    renameFunctionBreakpoint(id: string, newFunctionName: string): TPromise<void>;
    removeFunctionBreakpoints(id?: string): TPromise<void>;
    addReplExpression(name: string): TPromise<void>;
    removeReplExpressions(): void;
    logToRepl(value: string | debug.IExpression, sev?: severity): void;
    addWatchExpression(name: string): TPromise<void>;
    renameWatchExpression(id: string, newName: string): TPromise<void>;
    moveWatchExpression(id: string, position: number): void;
    removeWatchExpressions(id?: string): void;
    startDebugging(root: uri, configOrName?: debug.IConfig | string, noDebug?: boolean, topCompoundName?: string): TPromise<any>;
    findProcessByUUID(uuid: string): debug.IProcess | null;
    createProcess(root: uri, config: debug.IConfig): TPromise<debug.IProcess>;
    private doCreateProcess(root, configuration, sessionId?);
    private runPreLaunchTask(taskName);
    sourceIsNotAvailable(uri: uri): void;
    restartProcess(process: debug.IProcess, restartData?: any): TPromise<any>;
    stopProcess(process: debug.IProcess): TPromise<any>;
    private onSessionEnd(session);
    getModel(): debug.IModel;
    getViewModel(): debug.IViewModel;
    getConfigurationManager(): debug.IConfigurationManager;
    private sendAllBreakpoints(process?);
    private sendBreakpoints(modelUri, sourceModified?, targetProcess?);
    private sendFunctionBreakpoints(targetProcess?);
    private sendExceptionBreakpoints(targetProcess?);
    private sendToOneOrAllProcesses(process, send);
    private onFileChanges(fileChangesEvent);
    private store();
    dispose(): void;
}
