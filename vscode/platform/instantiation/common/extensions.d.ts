import { SyncDescriptor } from './descriptors';
import { ServiceIdentifier, IConstructorSignature0 } from './instantiation';
export declare const Services = "di.services";
export interface IServiceContribution<T> {
    id: ServiceIdentifier<T>;
    descriptor: SyncDescriptor<T>;
}
export declare function registerSingleton<T>(id: ServiceIdentifier<T>, ctor: IConstructorSignature0<T>): void;
export declare function getServices(): IServiceContribution<any>[];
