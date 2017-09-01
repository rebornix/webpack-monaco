import { TPromise } from 'vs/base/common/winjs.base';
import Model = require('vs/base/parts/quickopen/browser/quickOpenModel');
import { IQuickOpenService } from 'vs/platform/quickOpen/common/quickOpen';
import { CustomTask, ContributedTask } from 'vs/workbench/parts/tasks/common/tasks';
import { ITaskService } from 'vs/workbench/parts/tasks/common/taskService';
import { IExtensionService } from 'vs/platform/extensions/common/extensions';
import * as base from './quickOpen';
export declare class QuickOpenHandler extends base.QuickOpenHandler {
    private activationPromise;
    constructor(quickOpenService: IQuickOpenService, taskService: ITaskService, extensionService: IExtensionService);
    getAriaLabel(): string;
    protected getTasks(): TPromise<(CustomTask | ContributedTask)[]>;
    protected createEntry(task: CustomTask | ContributedTask, highlights: Model.IHighlight[]): base.TaskEntry;
    getEmptyLabel(searchString: string): string;
}
