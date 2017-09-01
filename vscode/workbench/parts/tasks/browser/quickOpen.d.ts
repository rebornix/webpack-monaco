import { TPromise } from 'vs/base/common/winjs.base';
import { IAction } from 'vs/base/common/actions';
import Quickopen = require('vs/workbench/browser/quickopen');
import QuickOpen = require('vs/base/parts/quickopen/common/quickOpen');
import Model = require('vs/base/parts/quickopen/browser/quickOpenModel');
import { IQuickOpenService } from 'vs/platform/quickOpen/common/quickOpen';
import { CustomTask, ContributedTask } from 'vs/workbench/parts/tasks/common/tasks';
import { ITaskService, RunOptions } from 'vs/workbench/parts/tasks/common/taskService';
import { ActionBarContributor } from 'vs/workbench/browser/actions';
export declare class TaskEntry extends Model.QuickOpenEntry {
    protected taskService: ITaskService;
    protected quickOpenService: IQuickOpenService;
    protected _task: CustomTask | ContributedTask;
    constructor(taskService: ITaskService, quickOpenService: IQuickOpenService, _task: CustomTask | ContributedTask, highlights?: Model.IHighlight[]);
    getLabel(): string;
    getAriaLabel(): string;
    readonly task: CustomTask | ContributedTask;
    protected doRun(task: CustomTask | ContributedTask, options?: RunOptions): boolean;
}
export declare class TaskGroupEntry extends Model.QuickOpenEntryGroup {
    constructor(entry: TaskEntry, groupLabel: string, withBorder: boolean);
}
export declare abstract class QuickOpenHandler extends Quickopen.QuickOpenHandler {
    protected quickOpenService: IQuickOpenService;
    protected taskService: ITaskService;
    private tasks;
    constructor(quickOpenService: IQuickOpenService, taskService: ITaskService);
    onOpen(): void;
    onClose(canceled: boolean): void;
    getResults(input: string): TPromise<Model.QuickOpenModel>;
    private fillEntries(entries, input, tasks, groupLabel, withBorder?);
    protected abstract getTasks(): TPromise<(CustomTask | ContributedTask)[]>;
    protected abstract createEntry(task: CustomTask | ContributedTask, highlights: Model.IHighlight[]): TaskEntry;
    getAutoFocus(input: string): QuickOpen.IAutoFocus;
}
export declare class QuickOpenActionContributor extends ActionBarContributor {
    private taskService;
    private quickOpenService;
    constructor(taskService: ITaskService, quickOpenService: IQuickOpenService);
    hasActions(context: any): boolean;
    getActions(context: any): IAction[];
    private getTask(context);
}
