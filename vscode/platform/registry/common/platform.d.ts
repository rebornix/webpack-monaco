import { IInstantiationService, IConstructorSignature0 } from 'vs/platform/instantiation/common/instantiation';
export interface IRegistry {
    /**
     * Adds the extension functions and properties defined by data to the
     * platform. The provided id must be unique.
     * @param id a unique identifier
     * @param data a contribution
     */
    add(id: string, data: any): void;
    /**
     * Returns true iff there is an extension with the provided id.
     * @param id an extension identifier
     */
    knows(id: string): boolean;
    /**
     * Returns the extension functions and properties defined by the specified key or null.
     * @param id an extension identifier
     */
    as(id: string): any;
    as<T>(id: string): T;
}
export declare const Registry: IRegistry;
/**
 * A base class for registries that leverage the instantiation service to create instances.
 */
export declare class BaseRegistry<T> {
    private toBeInstantiated;
    private instances;
    private instantiationService;
    setInstantiationService(service: IInstantiationService): void;
    private instantiate(ctor);
    _register(ctor: IConstructorSignature0<T>): void;
    _getInstances(): T[];
    _setInstances(instances: T[]): void;
}
