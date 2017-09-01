import { TPromise } from 'vs/base/common/winjs.base';
import { IDisposable } from 'vs/base/common/lifecycle';
import Event from 'vs/base/common/event';
export interface IMessagePassingProtocol {
    send(request: any): void;
    onMessage: Event<any>;
}
/**
 * An `IChannel` is an abstraction over a collection of commands.
 * You can `call` several commands on a channel, each taking at
 * most one single argument. A `call` always returns a promise
 * with at most one single return value.
 */
export interface IChannel {
    call(command: string, arg?: any): TPromise<any>;
}
/**
 * An `IChannelServer` hosts a collection of channels. You are
 * able to register channels onto it, provided a channel name.
 */
export interface IChannelServer {
    registerChannel(channelName: string, channel: IChannel): void;
}
/**
 * An `IChannelClient` has access to a collection of channels. You
 * are able to get those channels, given their channel name.
 */
export interface IChannelClient {
    getChannel<T extends IChannel>(channelName: string): T;
}
/**
 * An `IClientRouter` is responsible for routing calls to specific
 * channels, in scenarios in which there are multiple possible
 * channels (each from a separate client) to pick from.
 */
export interface IClientRouter {
    route(command: string, arg: any): string;
}
/**
 * Similar to the `IChannelClient`, you can get channels from this
 * collection of channels. The difference being that in the
 * `IRoutingChannelClient`, there are multiple clients providing
 * the same channel. You'll need to pass in an `IClientRouter` in
 * order to pick the right one.
 */
export interface IRoutingChannelClient {
    getChannel<T extends IChannel>(channelName: string, router: IClientRouter): T;
}
export declare class ChannelServer implements IChannelServer, IDisposable {
    private protocol;
    private channels;
    private activeRequests;
    private protocolListener;
    constructor(protocol: IMessagePassingProtocol);
    registerChannel(channelName: string, channel: IChannel): void;
    private onMessage(request);
    private onCommonRequest(request);
    private onCancelRequest(request);
    dispose(): void;
}
export declare class ChannelClient implements IChannelClient, IDisposable {
    private protocol;
    private state;
    private activeRequests;
    private bufferedRequests;
    private handlers;
    private lastRequestId;
    private protocolListener;
    constructor(protocol: IMessagePassingProtocol);
    getChannel<T extends IChannel>(channelName: string): T;
    private request(channelName, name, arg);
    private doRequest(request);
    private bufferRequest(request);
    private onMessage(response);
    private send(raw);
    dispose(): void;
}
export interface ClientConnectionEvent {
    protocol: IMessagePassingProtocol;
    onDidClientDisconnect: Event<void>;
}
/**
 * An `IPCServer` is both a channel server and a routing channel
 * client.
 *
 * As the owner of a protocol, you should extend both this
 * and the `IPCClient` classes to get IPC implementations
 * for your protocol.
 */
export declare class IPCServer implements IChannelServer, IRoutingChannelClient, IDisposable {
    private channels;
    private channelClients;
    private onClientAdded;
    constructor(onDidClientConnect: Event<ClientConnectionEvent>);
    getChannel<T extends IChannel>(channelName: string, router: IClientRouter): T;
    registerChannel(channelName: string, channel: IChannel): void;
    private getClient(clientId);
    dispose(): void;
}
/**
 * An `IPCClient` is both a channel client and a channel server.
 *
 * As the owner of a protocol, you should extend both this
 * and the `IPCClient` classes to get IPC implementations
 * for your protocol.
 */
export declare class IPCClient implements IChannelClient, IChannelServer, IDisposable {
    private channelClient;
    private channelServer;
    constructor(protocol: IMessagePassingProtocol, id: string);
    getChannel<T extends IChannel>(channelName: string): T;
    registerChannel(channelName: string, channel: IChannel): void;
    dispose(): void;
}
export declare function getDelayedChannel<T extends IChannel>(promise: TPromise<T>): T;
export declare function getNextTickChannel<T extends IChannel>(channel: T): T;
export declare type Serializer<T, R> = (obj: T) => R;
export declare type Deserializer<T, R> = (raw: R) => T;
export declare function eventToCall<T>(event: Event<T>, serializer?: Serializer<T, any>): TPromise<void>;
export declare function eventFromCall<T>(channel: IChannel, name: string, arg?: any, deserializer?: Deserializer<T, any>): Event<T>;
