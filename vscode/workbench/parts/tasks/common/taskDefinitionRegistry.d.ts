import { TPromise } from 'vs/base/common/winjs.base';
import * as Tasks from 'vs/workbench/parts/tasks/common/tasks';
export interface ITaskDefinitionRegistry {
    onReady(): TPromise<void>;
    exists(key: string): boolean;
    get(key: string): Tasks.TaskDefinition;
    all(): Tasks.TaskDefinition[];
}
export declare const TaskDefinitionRegistry: ITaskDefinitionRegistry;
