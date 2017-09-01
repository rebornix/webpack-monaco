import Event from 'vs/base/common/event';
import * as debug from 'vs/workbench/parts/debug/common/debug';
export declare class ViewModel implements debug.IViewModel {
    private _focusedStackFrame;
    private _focusedProcess;
    private selectedExpression;
    private selectedFunctionBreakpoint;
    private _onDidFocusProcess;
    private _onDidFocusStackFrame;
    private _onDidSelectExpression;
    private _onDidSelectFunctionBreakpoint;
    private multiProcessView;
    changedWorkbenchViewState: boolean;
    constructor();
    getId(): string;
    readonly focusedProcess: debug.IProcess;
    readonly focusedThread: debug.IThread;
    readonly focusedStackFrame: debug.IStackFrame;
    setFocusedStackFrame(stackFrame: debug.IStackFrame, process: debug.IProcess, explicit: boolean): void;
    readonly onDidFocusProcess: Event<debug.IProcess>;
    readonly onDidFocusStackFrame: Event<{
        stackFrame: debug.IStackFrame;
        explicit: boolean;
    }>;
    getSelectedExpression(): debug.IExpression;
    setSelectedExpression(expression: debug.IExpression): void;
    readonly onDidSelectExpression: Event<debug.IExpression>;
    getSelectedFunctionBreakpoint(): debug.IFunctionBreakpoint;
    setSelectedFunctionBreakpoint(functionBreakpoint: debug.IFunctionBreakpoint): void;
    readonly onDidSelectFunctionBreakpoint: Event<debug.IFunctionBreakpoint>;
    isMultiProcessView(): boolean;
    setMultiProcessView(isMultiProcessView: boolean): void;
}
