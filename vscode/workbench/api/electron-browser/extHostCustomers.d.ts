import { IDisposable } from 'vs/base/common/lifecycle';
import { ProxyIdentifier } from 'vs/workbench/services/thread/common/threadService';
import { IConstructorSignature1 } from 'vs/platform/instantiation/common/instantiation';
import { IExtHostContext } from 'vs/workbench/api/node/extHost.protocol';
export declare type IExtHostNamedCustomer<T extends IDisposable> = [ProxyIdentifier<T>, IExtHostCustomerCtor<T>];
export declare type IExtHostCustomerCtor<T extends IDisposable> = IConstructorSignature1<IExtHostContext, T>;
export declare function extHostNamedCustomer<T extends IDisposable>(id: ProxyIdentifier<T>): (ctor: IConstructorSignature1<IExtHostContext, T>) => void;
export declare function extHostCustomer<T extends IDisposable>(ctor: IExtHostCustomerCtor<T>): void;
export declare namespace ExtHostCustomersRegistry {
    function getNamedCustomers(): IExtHostNamedCustomer<IDisposable>[];
    function getCustomers(): IExtHostCustomerCtor<IDisposable>[];
}
