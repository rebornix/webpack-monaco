export interface IThreadService {
    /**
     * Always returns a proxy.
     */
    get<T>(identifier: ProxyIdentifier<T>): T;
    /**
     * Register instance.
     */
    set<T, R extends T>(identifier: ProxyIdentifier<T>, value: R): R;
    /**
     * Assert these identifiers are already registered via `.set`.
     */
    assertRegistered(identifiers: ProxyIdentifier<any>[]): void;
}
export declare class ProxyIdentifier<T> {
    _proxyIdentifierBrand: void;
    isMain: boolean;
    id: string;
    constructor(isMain: boolean, id: string);
}
export declare function createMainContextProxyIdentifier<T>(identifier: string): ProxyIdentifier<T>;
export declare function createExtHostContextProxyIdentifier<T>(identifier: string): ProxyIdentifier<T>;
