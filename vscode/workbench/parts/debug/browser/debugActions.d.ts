import { Action } from 'vs/base/common/actions';
import * as lifecycle from 'vs/base/common/lifecycle';
import { TPromise } from 'vs/base/common/winjs.base';
import { ICodeEditor } from 'vs/editor/browser/editorBrowser';
import { IKeybindingService } from 'vs/platform/keybinding/common/keybinding';
import { ICommandService } from 'vs/platform/commands/common/commands';
import { IWorkspaceContextService } from 'vs/platform/workspace/common/workspace';
import { IFileService } from 'vs/platform/files/common/files';
import { IMessageService } from 'vs/platform/message/common/message';
import { IDebugService, State, IProcess, IThread, IEnablement, IBreakpoint, IStackFrame, IFunctionBreakpoint, IExpression } from 'vs/workbench/parts/debug/common/debug';
import { Variable, Expression } from 'vs/workbench/parts/debug/common/debugModel';
import { IPartService } from 'vs/workbench/services/part/common/partService';
import { IPanelService } from 'vs/workbench/services/panel/common/panelService';
import { IWorkbenchEditorService } from 'vs/workbench/services/editor/common/editorService';
import { TogglePanelAction } from 'vs/workbench/browser/panel';
import { IQuickOpenService } from 'vs/platform/quickOpen/common/quickOpen';
export declare abstract class AbstractDebugAction extends Action {
    protected debugService: IDebugService;
    private keybindingService;
    weight: number;
    protected toDispose: lifecycle.IDisposable[];
    constructor(id: string, label: string, cssClass: string, debugService: IDebugService, keybindingService: IKeybindingService, weight?: number);
    run(e?: any): TPromise<any>;
    readonly tooltip: string;
    protected updateLabel(newLabel: string): void;
    protected updateEnablement(state?: State): void;
    protected isEnabled(state: State): boolean;
    dispose(): void;
}
export declare class ConfigureAction extends AbstractDebugAction {
    private contextService;
    private messageService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, debugService: IDebugService, keybindingService: IKeybindingService, contextService: IWorkspaceContextService, messageService: IMessageService);
    readonly tooltip: string;
    private updateClass();
    run(event?: any): TPromise<any>;
}
export declare class StartAction extends AbstractDebugAction {
    private contextService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, debugService: IDebugService, keybindingService: IKeybindingService, contextService: IWorkspaceContextService);
    run(): TPromise<any>;
    protected isNoDebug(): boolean;
    protected isEnabled(state: State): boolean;
}
export declare class RunAction extends StartAction {
    static ID: string;
    static LABEL: string;
    protected isNoDebug(): boolean;
}
export declare class SelectAndStartAction extends AbstractDebugAction {
    private quickOpenService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, debugService: IDebugService, keybindingService: IKeybindingService, commandService: ICommandService, contextService: IWorkspaceContextService, fileService: IFileService, quickOpenService: IQuickOpenService);
    run(): TPromise<any>;
}
export declare class RestartAction extends AbstractDebugAction {
    static ID: string;
    static LABEL: string;
    static RECONNECT_LABEL: string;
    constructor(id: string, label: string, debugService: IDebugService, keybindingService: IKeybindingService);
    private setLabel(process);
    run(process: IProcess): TPromise<any>;
    protected isEnabled(state: State): boolean;
}
export declare class StepOverAction extends AbstractDebugAction {
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, debugService: IDebugService, keybindingService: IKeybindingService);
    run(thread: IThread): TPromise<any>;
    protected isEnabled(state: State): boolean;
}
export declare class StepIntoAction extends AbstractDebugAction {
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, debugService: IDebugService, keybindingService: IKeybindingService);
    run(thread: IThread): TPromise<any>;
    protected isEnabled(state: State): boolean;
}
export declare class StepOutAction extends AbstractDebugAction {
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, debugService: IDebugService, keybindingService: IKeybindingService);
    run(thread: IThread): TPromise<any>;
    protected isEnabled(state: State): boolean;
}
export declare class StopAction extends AbstractDebugAction {
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, debugService: IDebugService, keybindingService: IKeybindingService);
    run(process: IProcess): TPromise<any>;
    protected isEnabled(state: State): boolean;
}
export declare class DisconnectAction extends AbstractDebugAction {
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, debugService: IDebugService, keybindingService: IKeybindingService);
    run(): TPromise<any>;
    protected isEnabled(state: State): boolean;
}
export declare class ContinueAction extends AbstractDebugAction {
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, debugService: IDebugService, keybindingService: IKeybindingService);
    run(thread: IThread): TPromise<any>;
    protected isEnabled(state: State): boolean;
}
export declare class PauseAction extends AbstractDebugAction {
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, debugService: IDebugService, keybindingService: IKeybindingService);
    run(thread: IThread): TPromise<any>;
    protected isEnabled(state: State): boolean;
}
export declare class RestartFrameAction extends AbstractDebugAction {
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, debugService: IDebugService, keybindingService: IKeybindingService);
    run(frame: IStackFrame): TPromise<any>;
}
export declare class RemoveBreakpointAction extends AbstractDebugAction {
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, debugService: IDebugService, keybindingService: IKeybindingService);
    run(breakpoint: IBreakpoint): TPromise<any>;
}
export declare class RemoveAllBreakpointsAction extends AbstractDebugAction {
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, debugService: IDebugService, keybindingService: IKeybindingService);
    run(): TPromise<any>;
    protected isEnabled(state: State): boolean;
}
export declare class EnableBreakpointAction extends AbstractDebugAction {
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, debugService: IDebugService, keybindingService: IKeybindingService);
    run(element: IEnablement): TPromise<any>;
}
export declare class DisableBreakpointAction extends AbstractDebugAction {
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, debugService: IDebugService, keybindingService: IKeybindingService);
    run(element: IEnablement): TPromise<any>;
}
export declare class EnableAllBreakpointsAction extends AbstractDebugAction {
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, debugService: IDebugService, keybindingService: IKeybindingService);
    run(): TPromise<any>;
    protected isEnabled(state: State): boolean;
}
export declare class DisableAllBreakpointsAction extends AbstractDebugAction {
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, debugService: IDebugService, keybindingService: IKeybindingService);
    run(): TPromise<any>;
    protected isEnabled(state: State): boolean;
}
export declare class ToggleBreakpointsActivatedAction extends AbstractDebugAction {
    static ID: string;
    static ACTIVATE_LABEL: string;
    static DEACTIVATE_LABEL: string;
    constructor(id: string, label: string, debugService: IDebugService, keybindingService: IKeybindingService);
    run(): TPromise<any>;
    protected isEnabled(state: State): boolean;
}
export declare class ReapplyBreakpointsAction extends AbstractDebugAction {
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, debugService: IDebugService, keybindingService: IKeybindingService);
    run(): TPromise<any>;
    protected isEnabled(state: State): boolean;
}
export declare class AddFunctionBreakpointAction extends AbstractDebugAction {
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, debugService: IDebugService, keybindingService: IKeybindingService);
    run(): TPromise<any>;
}
export declare class RenameFunctionBreakpointAction extends AbstractDebugAction {
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, debugService: IDebugService, keybindingService: IKeybindingService);
    run(fbp: IFunctionBreakpoint): TPromise<any>;
}
export declare class AddConditionalBreakpointAction extends AbstractDebugAction {
    private editor;
    private lineNumber;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, editor: ICodeEditor, lineNumber: number, debugService: IDebugService, keybindingService: IKeybindingService);
    run(): TPromise<any>;
}
export declare class EditConditionalBreakpointAction extends AbstractDebugAction {
    private editor;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, editor: ICodeEditor, debugService: IDebugService, keybindingService: IKeybindingService);
    run(breakpoint: IBreakpoint): TPromise<any>;
}
export declare class SetValueAction extends AbstractDebugAction {
    private variable;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, variable: Variable, debugService: IDebugService, keybindingService: IKeybindingService);
    run(): TPromise<any>;
    protected isEnabled(state: State): boolean;
}
export declare class AddWatchExpressionAction extends AbstractDebugAction {
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, debugService: IDebugService, keybindingService: IKeybindingService);
    run(): TPromise<any>;
    protected isEnabled(state: State): boolean;
}
export declare class EditWatchExpressionAction extends AbstractDebugAction {
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, debugService: IDebugService, keybindingService: IKeybindingService);
    run(expression: Expression): TPromise<any>;
}
export declare class AddToWatchExpressionsAction extends AbstractDebugAction {
    private expression;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, expression: IExpression, debugService: IDebugService, keybindingService: IKeybindingService);
    run(): TPromise<any>;
}
export declare class RemoveWatchExpressionAction extends AbstractDebugAction {
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, debugService: IDebugService, keybindingService: IKeybindingService);
    run(expression: Expression): TPromise<any>;
}
export declare class RemoveAllWatchExpressionsAction extends AbstractDebugAction {
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, debugService: IDebugService, keybindingService: IKeybindingService);
    run(): TPromise<any>;
    protected isEnabled(state: State): boolean;
}
export declare class ClearReplAction extends AbstractDebugAction {
    private panelService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, debugService: IDebugService, keybindingService: IKeybindingService, panelService: IPanelService);
    run(): TPromise<any>;
}
export declare class ToggleReplAction extends TogglePanelAction {
    private debugService;
    static ID: string;
    static LABEL: string;
    private toDispose;
    constructor(id: string, label: string, debugService: IDebugService, partService: IPartService, panelService: IPanelService);
    private registerListeners();
    private isReplVisible();
    dispose(): void;
}
export declare class FocusReplAction extends Action {
    private panelService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, panelService: IPanelService);
    run(): TPromise<any>;
}
export declare class FocusProcessAction extends AbstractDebugAction {
    private editorService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, debugService: IDebugService, keybindingService: IKeybindingService, editorService: IWorkbenchEditorService);
    run(processName: string): TPromise<any>;
}
export declare class StepBackAction extends AbstractDebugAction {
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, debugService: IDebugService, keybindingService: IKeybindingService);
    run(thread: IThread): TPromise<any>;
    protected isEnabled(state: State): boolean;
}
export declare class ReverseContinueAction extends AbstractDebugAction {
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, debugService: IDebugService, keybindingService: IKeybindingService);
    run(thread: IThread): TPromise<any>;
    protected isEnabled(state: State): boolean;
}
