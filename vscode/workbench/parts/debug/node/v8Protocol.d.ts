import stream = require('stream');
import { TPromise } from 'vs/base/common/winjs.base';
export declare abstract class V8Protocol {
    private id;
    private static TWO_CRLF;
    private outputStream;
    private sequence;
    private pendingRequests;
    private rawData;
    private contentLength;
    constructor(id: string);
    getId(): string;
    protected abstract onServerError(err: Error): void;
    protected abstract onEvent(event: DebugProtocol.Event): void;
    protected abstract dispatchRequest(request: DebugProtocol.Request, response: DebugProtocol.Response): any;
    protected connect(readable: stream.Readable, writable: stream.Writable): void;
    protected send<R extends DebugProtocol.Response>(command: string, args: any): TPromise<R>;
    sendResponse(response: DebugProtocol.Response): void;
    private doSend(command, args, clb);
    private sendMessage(typ, message);
    private handleData();
    private dispatch(body);
}
