import { IDisposable } from 'vs/base/common/lifecycle';
import Event from 'vs/base/common/event';
export interface IConfigurationChangeEvent<T> {
    config: T;
}
export interface IConfigWatcher<T> {
    path: string;
    hasParseErrors: boolean;
    reload(callback: (config: T) => void): void;
    getConfig(): T;
    getValue<V>(key: string, fallback?: V): V;
}
export interface IConfigOptions<T> {
    onError: (error: Error | string) => void;
    defaultConfig?: T;
    changeBufferDelay?: number;
    parse?: (content: string, errors: any[]) => T;
    initCallback?: (config: T) => void;
}
/**
 * A simple helper to watch a configured file for changes and process its contents as JSON object.
 * Supports:
 * - comments in JSON files and errors
 * - symlinks for the config file itself
 * - delayed processing of changes to accomodate for lots of changes
 * - configurable defaults
 */
export declare class ConfigWatcher<T> implements IConfigWatcher<T>, IDisposable {
    private _path;
    private options;
    private cache;
    private parseErrors;
    private disposed;
    private loaded;
    private timeoutHandle;
    private disposables;
    private _onDidUpdateConfiguration;
    constructor(_path: string, options?: IConfigOptions<T>);
    readonly path: string;
    readonly hasParseErrors: boolean;
    readonly onDidUpdateConfiguration: Event<IConfigurationChangeEvent<T>>;
    private initAsync();
    private updateCache(value);
    private loadSync();
    private loadAsync(callback);
    private parse(raw);
    private registerWatcher();
    private watch(path);
    private onConfigFileChange();
    reload(callback?: (config: T) => void): void;
    getConfig(): T;
    getValue<V>(key: string, fallback?: V): V;
    private ensureLoaded();
    dispose(): void;
}
