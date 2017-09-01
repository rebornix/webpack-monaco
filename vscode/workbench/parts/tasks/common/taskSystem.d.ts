import Severity from 'vs/base/common/severity';
import { TPromise } from 'vs/base/common/winjs.base';
import { TerminateResponse } from 'vs/base/common/processes';
import { IEventEmitter } from 'vs/base/common/eventEmitter';
import { Task } from './tasks';
export declare enum TaskErrors {
    NotConfigured = 0,
    RunningTask = 1,
    NoBuildTask = 2,
    NoTestTask = 3,
    ConfigValidationError = 4,
    TaskNotFound = 5,
    NoValidTaskRunner = 6,
    UnknownError = 7,
}
export declare class TaskError {
    severity: Severity;
    message: string;
    code: TaskErrors;
    constructor(severity: Severity, message: string, code: TaskErrors);
}
export interface TelemetryEvent {
    trigger: string;
    runner: 'terminal' | 'output';
    taskKind: string;
    command: string;
    success: boolean;
    exitCode?: number;
}
export declare namespace Triggers {
    let shortcut: string;
    let command: string;
}
export interface ITaskSummary {
    /**
     * Exit code of the process.
     */
    exitCode?: number;
}
export declare enum TaskExecuteKind {
    Started = 1,
    Active = 2,
}
export interface ITaskExecuteResult {
    kind: TaskExecuteKind;
    promise: TPromise<ITaskSummary>;
    started?: {
        restartOnFileChanges?: string;
    };
    active?: {
        same: boolean;
        background: boolean;
    };
}
export declare namespace TaskSystemEvents {
    let Active: string;
    let Inactive: string;
    let Terminated: string;
    let Changed: string;
}
export declare enum TaskType {
    SingleRun = 0,
    Watching = 1,
}
export interface TaskEvent {
    taskId?: string;
    taskName?: string;
    type?: TaskType;
    group?: string;
    __task?: Task;
}
export interface ITaskResolver {
    resolve(identifier: string): Task;
}
export interface TaskTerminateResponse extends TerminateResponse {
    task: Task | undefined;
}
export interface ITaskSystem extends IEventEmitter {
    run(task: Task, resolver: ITaskResolver): ITaskExecuteResult;
    isActive(): TPromise<boolean>;
    isActiveSync(): boolean;
    getActiveTasks(): Task[];
    canAutoTerminate(): boolean;
    terminate(id: string): TPromise<TaskTerminateResponse>;
    terminateAll(): TPromise<TaskTerminateResponse[]>;
    revealTask(task: Task): boolean;
}
