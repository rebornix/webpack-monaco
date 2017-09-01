import { IDisposable } from 'vs/base/common/lifecycle';
import { TPromise } from 'vs/base/common/winjs.base';
import { ChannelServer as IPCServer, IChannelClient, IChannel } from 'vs/base/parts/ipc/common/ipc';
export declare class Server extends IPCServer {
    constructor();
}
export interface IIPCOptions {
    /**
     * A descriptive name for the server this connection is to. Used in logging.
     */
    serverName: string;
    /**
     * Time in millies before killing the ipc process. The next request after killing will start it again.
     */
    timeout?: number;
    /**
     * Arguments to the module to execute.
     */
    args?: string[];
    /**
     * Environment key-value pairs to be passed to the process that gets spawned for the ipc.
     */
    env?: any;
    /**
     * Allows to assign a debug port for debugging the application executed.
     */
    debug?: number;
    /**
     * Allows to assign a debug port for debugging the application and breaking it on the first line.
     */
    debugBrk?: number;
    /**
     * See https://github.com/Microsoft/vscode/issues/27665
     * Allows to pass in fresh execArgv to the forked process such that it doesn't inherit them from `process.execArgv`.
     * e.g. Launching the extension host process with `--inspect-brk=xxx` and then forking a process from the extension host
     * results in the forked process inheriting `--inspect-brk=xxx`.
     */
    freshExecArgv?: boolean;
    /**
     * Enables our createQueuedSender helper for this Client. Uses a queue when the internal Node.js queue is
     * full of messages - see notes on that method.
     */
    useQueue?: boolean;
}
export declare class Client implements IChannelClient, IDisposable {
    private modulePath;
    private options;
    private disposeDelayer;
    private activeRequests;
    private child;
    private _client;
    private channels;
    constructor(modulePath: string, options: IIPCOptions);
    getChannel<T extends IChannel>(channelName: string): T;
    protected request(channelName: string, name: string, arg: any): TPromise<void>;
    private readonly client;
    private disposeClient();
    dispose(): void;
}
