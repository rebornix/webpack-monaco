import uri from 'vs/base/common/uri';
import { TPromise } from 'vs/base/common/winjs.base';
import Event from 'vs/base/common/event';
import severity from 'vs/base/common/severity';
import { IRange } from 'vs/editor/common/core/range';
import { ISuggestion } from 'vs/editor/common/modes';
import { Position } from 'vs/editor/common/core/position';
import { ITreeElement, IExpression, IExpressionContainer, IProcess, IStackFrame, IExceptionBreakpoint, IBreakpoint, IFunctionBreakpoint, IModel, IConfig, ISession, IThread, IRawModelUpdate, IScope, IRawStoppedDetails, IEnablement, IRawBreakpoint, IExceptionInfo, IReplElement, ProcessState } from 'vs/workbench/parts/debug/common/debug';
import { Source } from 'vs/workbench/parts/debug/common/debugSource';
import { IWorkbenchEditorService } from 'vs/workbench/services/editor/common/editorService';
export declare abstract class AbstractOutputElement implements IReplElement {
    private id;
    private static ID_COUNTER;
    constructor(id?: number);
    getId(): string;
    abstract toString(): string;
}
export declare class OutputElement extends AbstractOutputElement {
    value: string;
    severity: severity;
    constructor(value: string, severity: severity);
    toString(): string;
}
export declare class OutputNameValueElement extends AbstractOutputElement implements IExpression {
    name: string;
    valueObj: any;
    annotation: string;
    private static MAX_CHILDREN;
    constructor(name: string, valueObj: any, annotation?: string);
    readonly value: string;
    readonly hasChildren: boolean;
    getChildren(): TPromise<IExpression[]>;
    toString(): string;
}
export declare class ExpressionContainer implements IExpressionContainer {
    protected process: IProcess;
    private _reference;
    private id;
    namedVariables: number;
    indexedVariables: number;
    private startOfVariables;
    static allValues: Map<string, string>;
    private static BASE_CHUNK_SIZE;
    valueChanged: boolean;
    private _value;
    protected children: TPromise<IExpression[]>;
    constructor(process: IProcess, _reference: number, id: string, namedVariables?: number, indexedVariables?: number, startOfVariables?: number);
    reference: number;
    getChildren(): TPromise<IExpression[]>;
    private doGetChildren();
    getId(): string;
    value: string;
    readonly hasChildren: boolean;
    private fetchVariables(start, count, filter);
    private readonly getChildrenInChunks;
    toString(): string;
}
export declare class Expression extends ExpressionContainer implements IExpression {
    name: string;
    static DEFAULT_VALUE: string;
    available: boolean;
    type: string;
    constructor(name: string, id?: string);
    evaluate(process: IProcess, stackFrame: IStackFrame, context: string): TPromise<void>;
    toString(): string;
}
export declare class Variable extends ExpressionContainer implements IExpression {
    parent: IExpressionContainer;
    name: string;
    evaluateName: string;
    type: string;
    available: boolean;
    errorMessage: string;
    constructor(process: IProcess, parent: IExpressionContainer, reference: number, name: string, evaluateName: string, value: string, namedVariables: number, indexedVariables: number, type?: string, available?: boolean, startOfVariables?: number);
    setVariable(value: string): TPromise<any>;
    toString(): string;
}
export declare class Scope extends ExpressionContainer implements IScope {
    name: string;
    expensive: boolean;
    range: IRange;
    constructor(stackFrame: IStackFrame, name: string, reference: number, expensive: boolean, namedVariables: number, indexedVariables: number, range?: IRange);
}
export declare class StackFrame implements IStackFrame {
    thread: IThread;
    frameId: number;
    source: Source;
    name: string;
    presentationHint: string;
    range: IRange;
    private index;
    private scopes;
    constructor(thread: IThread, frameId: number, source: Source, name: string, presentationHint: string, range: IRange, index: number);
    getId(): string;
    getScopes(): TPromise<IScope[]>;
    getMostSpecificScopes(range: IRange): TPromise<IScope[]>;
    restart(): TPromise<any>;
    toString(): string;
    openInEditor(editorService: IWorkbenchEditorService, preserveFocus?: boolean, sideBySide?: boolean): TPromise<any>;
}
export declare class Thread implements IThread {
    process: IProcess;
    name: string;
    threadId: number;
    private callStack;
    private staleCallStack;
    stoppedDetails: IRawStoppedDetails;
    stopped: boolean;
    constructor(process: IProcess, name: string, threadId: number);
    getId(): string;
    clearCallStack(): void;
    getCallStack(): IStackFrame[];
    getStaleCallStack(): IStackFrame[];
    /**
     * Queries the debug adapter for the callstack and returns a promise
     * which completes once the call stack has been retrieved.
     * If the thread is not stopped, it returns a promise to an empty array.
     * Only fetches the first stack frame for performance reasons. Calling this method consecutive times
     * gets the remainder of the call stack.
     */
    fetchCallStack(levels?: number): TPromise<void>;
    private getCallStackImpl(startFrame, levels);
    /**
     * Returns exception info promise if the exception was thrown, otherwise null
     */
    readonly exceptionInfo: TPromise<IExceptionInfo>;
    next(): TPromise<any>;
    stepIn(): TPromise<any>;
    stepOut(): TPromise<any>;
    stepBack(): TPromise<any>;
    continue(): TPromise<any>;
    pause(): TPromise<any>;
    reverseContinue(): TPromise<any>;
}
export declare class Process implements IProcess {
    configuration: IConfig;
    private _session;
    sources: Map<string, Source>;
    private threads;
    private inactive;
    constructor(configuration: IConfig, _session: ISession & ITreeElement);
    readonly session: ISession;
    getName(includeRoot: boolean): string;
    readonly state: ProcessState;
    getThread(threadId: number): Thread;
    getAllThreads(): IThread[];
    getId(): string;
    rawUpdate(data: IRawModelUpdate): void;
    clearThreads(removeThreads: boolean, reference?: number): void;
    completions(frameId: number, text: string, position: Position, overwriteBefore: number): TPromise<ISuggestion[]>;
}
export declare class Breakpoint implements IBreakpoint {
    uri: uri;
    lineNumber: number;
    column: number;
    enabled: boolean;
    condition: string;
    hitCondition: string;
    verified: boolean;
    idFromAdapter: number;
    message: string;
    endLineNumber: number;
    endColumn: number;
    private id;
    constructor(uri: uri, lineNumber: number, column: number, enabled: boolean, condition: string, hitCondition: string);
    getId(): string;
}
export declare class FunctionBreakpoint implements IFunctionBreakpoint {
    name: string;
    enabled: boolean;
    hitCondition: string;
    private id;
    verified: boolean;
    idFromAdapter: number;
    constructor(name: string, enabled: boolean, hitCondition: string);
    getId(): string;
}
export declare class ExceptionBreakpoint implements IExceptionBreakpoint {
    filter: string;
    label: string;
    enabled: boolean;
    private id;
    constructor(filter: string, label: string, enabled: boolean);
    getId(): string;
}
export declare class ThreadAndProcessIds implements ITreeElement {
    processId: string;
    threadId: number;
    constructor(processId: string, threadId: number);
    getId(): string;
}
export declare class Model implements IModel {
    private breakpoints;
    private breakpointsActivated;
    private functionBreakpoints;
    private exceptionBreakpoints;
    private watchExpressions;
    private processes;
    private toDispose;
    private replElements;
    private schedulers;
    private _onDidChangeBreakpoints;
    private _onDidChangeCallStack;
    private _onDidChangeWatchExpressions;
    private _onDidChangeREPLElements;
    constructor(breakpoints: Breakpoint[], breakpointsActivated: boolean, functionBreakpoints: FunctionBreakpoint[], exceptionBreakpoints: ExceptionBreakpoint[], watchExpressions: Expression[]);
    getId(): string;
    getProcesses(): Process[];
    addProcess(configuration: IConfig, session: ISession & ITreeElement): Process;
    removeProcess(id: string): void;
    readonly onDidChangeBreakpoints: Event<void>;
    readonly onDidChangeCallStack: Event<void>;
    readonly onDidChangeWatchExpressions: Event<IExpression>;
    readonly onDidChangeReplElements: Event<void>;
    rawUpdate(data: IRawModelUpdate): void;
    clearThreads(id: string, removeThreads: boolean, reference?: number): void;
    fetchCallStack(thread: Thread): TPromise<void>;
    getBreakpoints(): Breakpoint[];
    getFunctionBreakpoints(): IFunctionBreakpoint[];
    getExceptionBreakpoints(): IExceptionBreakpoint[];
    setExceptionBreakpoints(data: DebugProtocol.ExceptionBreakpointsFilter[]): void;
    areBreakpointsActivated(): boolean;
    setBreakpointsActivated(activated: boolean): void;
    addBreakpoints(uri: uri, rawData: IRawBreakpoint[]): void;
    removeBreakpoints(toRemove: IBreakpoint[]): void;
    updateBreakpoints(data: {
        [id: string]: DebugProtocol.Breakpoint;
    }): void;
    setEnablement(element: IEnablement, enable: boolean): void;
    enableOrDisableAllBreakpoints(enable: boolean): void;
    addFunctionBreakpoint(functionName: string): void;
    updateFunctionBreakpoints(data: {
        [id: string]: {
            name?: string;
            verified?: boolean;
            id?: number;
            hitCondition?: string;
        };
    }): void;
    removeFunctionBreakpoints(id?: string): void;
    getReplElements(): IReplElement[];
    addReplExpression(process: IProcess, stackFrame: IStackFrame, name: string): TPromise<void>;
    appendToRepl(output: string | IExpression, severity: severity): void;
    private addReplElements(newElements);
    removeReplExpressions(): void;
    getWatchExpressions(): Expression[];
    addWatchExpression(process: IProcess, stackFrame: IStackFrame, name: string): TPromise<void>;
    renameWatchExpression(process: IProcess, stackFrame: IStackFrame, id: string, newName: string): TPromise<void>;
    evaluateWatchExpressions(process: IProcess, stackFrame: IStackFrame, id?: string): TPromise<void>;
    removeWatchExpressions(id?: string): void;
    moveWatchExpression(id: string, position: number): void;
    sourceIsNotAvailable(uri: uri): void;
    dispose(): void;
}
