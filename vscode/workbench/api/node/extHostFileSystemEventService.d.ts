import { FileSystemWatcher as _FileSystemWatcher } from 'vscode';
import { FileSystemEvents, ExtHostFileSystemEventServiceShape } from './extHost.protocol';
export declare class ExtHostFileSystemEventService implements ExtHostFileSystemEventServiceShape {
    private _emitter;
    constructor();
    createFileSystemWatcher(globPattern: string, ignoreCreateEvents?: boolean, ignoreChangeEvents?: boolean, ignoreDeleteEvents?: boolean): _FileSystemWatcher;
    $onFileEvent(events: FileSystemEvents): void;
}
