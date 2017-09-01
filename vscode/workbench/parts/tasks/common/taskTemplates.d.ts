import { IPickOpenEntry } from 'vs/platform/quickOpen/common/quickOpen';
export interface TaskEntry extends IPickOpenEntry {
    sort?: string;
    autoDetect: boolean;
    content: string;
}
export declare let templates: TaskEntry[];
