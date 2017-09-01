import { TPromise } from 'vs/base/common/winjs.base';
export declare const machineIdStorageKey = "telemetry.machineId";
export declare const machineIdIpcChannel = "vscode:machineId";
export declare function resolveCommonProperties(commit: string, version: string): TPromise<{
    [name: string]: string;
}>;
