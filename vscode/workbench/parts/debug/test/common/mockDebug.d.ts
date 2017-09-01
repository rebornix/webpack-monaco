import uri from 'vs/base/common/uri';
import Event from 'vs/base/common/event';
import { TPromise } from 'vs/base/common/winjs.base';
import * as debug from 'vs/workbench/parts/debug/common/debug';
export declare class MockDebugService implements debug.IDebugService {
    _serviceBrand: any;
    readonly state: debug.State;
    readonly onDidCustomEvent: Event<debug.DebugEvent>;
    readonly onDidNewProcess: Event<debug.IProcess>;
    readonly onDidEndProcess: Event<debug.IProcess>;
    readonly onDidChangeState: Event<debug.State>;
    getConfigurationManager(): debug.IConfigurationManager;
    focusStackFrameAndEvaluate(focusedStackFrame: debug.IStackFrame): TPromise<void>;
    addBreakpoints(uri: uri, rawBreakpoints: debug.IRawBreakpoint[]): TPromise<void>;
    enableOrDisableBreakpoints(enabled: boolean): TPromise<void>;
    setBreakpointsActivated(): TPromise<void>;
    removeBreakpoints(): TPromise<any>;
    addFunctionBreakpoint(): void;
    moveWatchExpression(id: string, position: number): void;
    renameFunctionBreakpoint(id: string, newFunctionName: string): TPromise<void>;
    removeFunctionBreakpoints(id?: string): TPromise<void>;
    addReplExpression(name: string): TPromise<void>;
    removeReplExpressions(): void;
    addWatchExpression(name?: string): TPromise<void>;
    renameWatchExpression(id: string, newName: string): TPromise<void>;
    removeWatchExpressions(id?: string): void;
    startDebugging(root: uri, configOrName?: debug.IConfig | string, noDebug?: boolean): TPromise<any>;
    createProcess(root: uri, config: debug.IConfig): TPromise<any>;
    findProcessByUUID(uuid: string): debug.IProcess | null;
    restartProcess(): TPromise<any>;
    stopProcess(): TPromise<any>;
    getModel(): debug.IModel;
    getViewModel(): debug.IViewModel;
    logToRepl(value: string): void;
    sourceIsNotAvailable(uri: uri): void;
}
export declare class MockSession implements debug.ISession {
    readyForBreakpoints: boolean;
    emittedStopped: boolean;
    getId(): string;
    root: uri;
    getLengthInSeconds(): number;
    stackTrace(args: DebugProtocol.StackTraceArguments): TPromise<DebugProtocol.StackTraceResponse>;
    exceptionInfo(args: DebugProtocol.ExceptionInfoArguments): TPromise<DebugProtocol.ExceptionInfoResponse>;
    attach(args: DebugProtocol.AttachRequestArguments): TPromise<DebugProtocol.AttachResponse>;
    scopes(args: DebugProtocol.ScopesArguments): TPromise<DebugProtocol.ScopesResponse>;
    variables(args: DebugProtocol.VariablesArguments): TPromise<DebugProtocol.VariablesResponse>;
    evaluate(args: DebugProtocol.EvaluateArguments): TPromise<DebugProtocol.EvaluateResponse>;
    readonly capabilities: DebugProtocol.Capabilities;
    readonly onDidEvent: Event<debug.DebugEvent>;
    readonly onDidInitialize: Event<DebugProtocol.InitializedEvent>;
    custom(request: string, args: any): TPromise<DebugProtocol.Response>;
    disconnect(restart?: boolean, force?: boolean): TPromise<DebugProtocol.DisconnectResponse>;
    threads(): TPromise<DebugProtocol.ThreadsResponse>;
    stepIn(args: DebugProtocol.StepInArguments): TPromise<DebugProtocol.StepInResponse>;
    stepOut(args: DebugProtocol.StepOutArguments): TPromise<DebugProtocol.StepOutResponse>;
    stepBack(args: DebugProtocol.StepBackArguments): TPromise<DebugProtocol.StepBackResponse>;
    continue(args: DebugProtocol.ContinueArguments): TPromise<DebugProtocol.ContinueResponse>;
    reverseContinue(args: DebugProtocol.ReverseContinueArguments): TPromise<DebugProtocol.ReverseContinueResponse>;
    pause(args: DebugProtocol.PauseArguments): TPromise<DebugProtocol.PauseResponse>;
    setVariable(args: DebugProtocol.SetVariableArguments): TPromise<DebugProtocol.SetVariableResponse>;
    restartFrame(args: DebugProtocol.RestartFrameArguments): TPromise<DebugProtocol.RestartFrameResponse>;
    completions(args: DebugProtocol.CompletionsArguments): TPromise<DebugProtocol.CompletionsResponse>;
    next(args: DebugProtocol.NextArguments): TPromise<DebugProtocol.NextResponse>;
    source(args: DebugProtocol.SourceArguments): TPromise<DebugProtocol.SourceResponse>;
    setBreakpoints(args: DebugProtocol.SetBreakpointsArguments): TPromise<DebugProtocol.SetBreakpointsResponse>;
    setFunctionBreakpoints(args: DebugProtocol.SetFunctionBreakpointsArguments): TPromise<DebugProtocol.SetFunctionBreakpointsResponse>;
    setExceptionBreakpoints(args: DebugProtocol.SetExceptionBreakpointsArguments): TPromise<DebugProtocol.SetExceptionBreakpointsResponse>;
    onDidStop: Event<DebugProtocol.StoppedEvent>;
}
