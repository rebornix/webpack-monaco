import { FileChangeType, FileChangesEvent } from 'vs/platform/files/common/files';
export interface IRawFileChange {
    type: FileChangeType;
    path: string;
}
export declare function toFileChangesEvent(changes: IRawFileChange[]): FileChangesEvent;
/**
 * Given events that occurred, applies some rules to normalize the events
 */
export declare function normalize(changes: IRawFileChange[]): IRawFileChange[];
