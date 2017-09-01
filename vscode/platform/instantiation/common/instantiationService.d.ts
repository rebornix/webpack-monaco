import { IInstantiationService, ServicesAccessor } from 'vs/platform/instantiation/common/instantiation';
import { ServiceCollection } from 'vs/platform/instantiation/common/serviceCollection';
export declare class InstantiationService implements IInstantiationService {
    _serviceBrand: any;
    private _services;
    private _strict;
    constructor(services?: ServiceCollection, strict?: boolean);
    createChild(services: ServiceCollection): IInstantiationService;
    invokeFunction<R>(signature: (accessor: ServicesAccessor, ...more: any[]) => R, ...args: any[]): R;
    createInstance<T>(param: any, ...rest: any[]): any;
    private _createInstanceAsync<T>(descriptor, args);
    private _createInstance<T>(desc, args);
    private _getOrCreateServiceInstance<T>(id);
    private _createAndCacheServiceInstance<T>(id, desc);
}
