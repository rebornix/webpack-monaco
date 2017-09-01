import { TPromise } from 'vs/base/common/winjs.base';
import { Action } from 'vs/base/common/actions';
import { IEventEmitter } from 'vs/base/common/eventEmitter';
import { LinkedMap } from 'vs/base/common/map';
import { Task, ContributedTask, CustomTask, TaskSet } from 'vs/workbench/parts/tasks/common/tasks';
import { ITaskSummary, TaskEvent, TaskType, TaskTerminateResponse } from 'vs/workbench/parts/tasks/common/taskSystem';
export { ITaskSummary, Task, TaskEvent, TaskType, TaskTerminateResponse };
export declare const ITaskService: {
    (...args: any[]): void;
    type: ITaskService;
};
export declare namespace TaskServiceEvents {
    let Active: string;
    let Inactive: string;
    let ConfigChanged: string;
    let Terminated: string;
    let Changed: string;
}
export interface ITaskProvider {
    provideTasks(): TPromise<TaskSet>;
}
export interface RunOptions {
    attachProblemMatcher?: boolean;
}
export interface CustomizationProperties {
    group?: string | {
        kind?: string;
        isDefault?: boolean;
    };
    problemMatcher?: string | string[];
}
export interface ITaskService extends IEventEmitter {
    _serviceBrand: any;
    configureAction(): Action;
    build(): TPromise<ITaskSummary>;
    rebuild(): TPromise<ITaskSummary>;
    clean(): TPromise<ITaskSummary>;
    runTest(): TPromise<ITaskSummary>;
    run(task: string | Task, options?: RunOptions): TPromise<ITaskSummary>;
    inTerminal(): boolean;
    isActive(): TPromise<boolean>;
    getActiveTasks(): TPromise<Task[]>;
    restart(task: string | Task): void;
    terminate(task: string | Task): TPromise<TaskTerminateResponse>;
    terminateAll(): TPromise<TaskTerminateResponse[]>;
    tasks(): TPromise<Task[]>;
    /**
     * @param identifier The task's name, label or defined identifier.
     */
    getTask(identifier: string): TPromise<Task>;
    getTasksForGroup(group: string): TPromise<Task[]>;
    getRecentlyUsedTasks(): LinkedMap<string, string>;
    canCustomize(): boolean;
    customize(task: ContributedTask | CustomTask, properties?: {}, openConfig?: boolean): TPromise<void>;
    openConfig(task: CustomTask): TPromise<void>;
    registerTaskProvider(handle: number, taskProvider: ITaskProvider): void;
    unregisterTaskProvider(handle: number): boolean;
}
