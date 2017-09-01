import { Socket, Server as NetServer } from 'net';
import { TPromise } from 'vs/base/common/winjs.base';
import Event from 'vs/base/common/event';
import { IMessagePassingProtocol, IPCServer, IPCClient } from 'vs/base/parts/ipc/common/ipc';
export declare function generateRandomPipeName(): string;
export declare class Protocol implements IMessagePassingProtocol {
    private _socket;
    private static _headerLen;
    private _onMessage;
    readonly onMessage: Event<any>;
    constructor(_socket: Socket);
    send(message: any): void;
    private _writeBuffer;
    private _writeSoon(header, data);
}
export declare class Server extends IPCServer {
    private server;
    private static toClientConnectionEvent(server);
    constructor(server: NetServer);
    dispose(): void;
}
export declare class Client extends IPCClient {
    private socket;
    private _onClose;
    readonly onClose: Event<void>;
    constructor(socket: Socket, id: string);
    dispose(): void;
}
export declare function serve(port: number): TPromise<Server>;
export declare function serve(namedPipe: string): TPromise<Server>;
export declare function connect(port: number, clientId: string): TPromise<Client>;
export declare function connect(namedPipe: string, clientId: string): TPromise<Client>;
