import * as cp from 'child_process';
import ChildProcess = cp.ChildProcess;
import { PPromise, TPromise, TValueCallback, TProgressCallback, ErrorCallback } from 'vs/base/common/winjs.base';
import { CommandOptions, ForkOptions, SuccessData, Source, TerminateResponse, TerminateResponseCode, Executable } from 'vs/base/common/processes';
export { CommandOptions, ForkOptions, SuccessData, Source, TerminateResponse, TerminateResponseCode };
export interface LineData {
    line: string;
    source: Source;
}
export interface BufferData {
    data: Buffer;
    source: Source;
}
export interface StreamData {
    stdin: NodeJS.WritableStream;
    stdout: NodeJS.ReadableStream;
    stderr: NodeJS.ReadableStream;
}
export declare function terminateProcess(process: ChildProcess, cwd?: string): TerminateResponse;
export declare function getWindowsShell(): string;
export declare abstract class AbstractProcess<TProgressData> {
    private cmd;
    private module;
    private args;
    private options;
    protected shell: boolean;
    private childProcess;
    protected childProcessPromise: TPromise<ChildProcess>;
    protected terminateRequested: boolean;
    private static WellKnowCommands;
    constructor(executable: Executable);
    constructor(cmd: string, args: string[], shell: boolean, options: CommandOptions);
    constructor(module: string, args: string[], options: ForkOptions);
    getSanitizedCommand(): string;
    start(): PPromise<SuccessData, TProgressData>;
    protected abstract handleExec(cc: TValueCallback<SuccessData>, pp: TProgressCallback<TProgressData>, error: Error, stdout: Buffer, stderr: Buffer): void;
    protected abstract handleSpawn(childProcess: ChildProcess, cc: TValueCallback<SuccessData>, pp: TProgressCallback<TProgressData>, ee: ErrorCallback, sync: boolean): void;
    protected handleClose(data: any, cc: TValueCallback<SuccessData>, pp: TProgressCallback<TProgressData>, ee: ErrorCallback): void;
    private static regexp;
    private ensureQuotes(value);
    isRunning(): boolean;
    readonly pid: TPromise<number>;
    terminate(): TPromise<TerminateResponse>;
    private useExec();
}
export declare class LineProcess extends AbstractProcess<LineData> {
    private stdoutLineDecoder;
    private stderrLineDecoder;
    constructor(executable: Executable);
    constructor(cmd: string, args: string[], shell: boolean, options: CommandOptions);
    constructor(module: string, args: string[], options: ForkOptions);
    protected handleExec(cc: TValueCallback<SuccessData>, pp: TProgressCallback<LineData>, error: Error, stdout: Buffer, stderr: Buffer): void;
    protected handleSpawn(childProcess: ChildProcess, cc: TValueCallback<SuccessData>, pp: TProgressCallback<LineData>, ee: ErrorCallback, sync: boolean): void;
    protected handleClose(data: any, cc: TValueCallback<SuccessData>, pp: TProgressCallback<LineData>, ee: ErrorCallback): void;
}
export declare class BufferProcess extends AbstractProcess<BufferData> {
    constructor(executable: Executable);
    constructor(cmd: string, args: string[], shell: boolean, options: CommandOptions);
    constructor(module: string, args: string[], options: ForkOptions);
    protected handleExec(cc: TValueCallback<SuccessData>, pp: TProgressCallback<BufferData>, error: Error, stdout: Buffer, stderr: Buffer): void;
    protected handleSpawn(childProcess: ChildProcess, cc: TValueCallback<SuccessData>, pp: TProgressCallback<BufferData>, ee: ErrorCallback, sync: boolean): void;
}
export declare class StreamProcess extends AbstractProcess<StreamData> {
    constructor(executable: Executable);
    constructor(cmd: string, args: string[], shell: boolean, options: CommandOptions);
    constructor(module: string, args: string[], options: ForkOptions);
    protected handleExec(cc: TValueCallback<SuccessData>, pp: TProgressCallback<StreamData>, error: Error, stdout: Buffer, stderr: Buffer): void;
    protected handleSpawn(childProcess: ChildProcess, cc: TValueCallback<SuccessData>, pp: TProgressCallback<StreamData>, ee: ErrorCallback, sync: boolean): void;
}
export interface IQueuedSender {
    send: (msg: any) => void;
}
export declare function createQueuedSender(childProcess: ChildProcess | NodeJS.Process): IQueuedSender;
