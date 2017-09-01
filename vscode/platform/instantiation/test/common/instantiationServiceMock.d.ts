import * as sinon from 'sinon';
import { InstantiationService } from 'vs/platform/instantiation/common/instantiationService';
import { ServiceCollection } from 'vs/platform/instantiation/common/serviceCollection';
import { ServiceIdentifier } from 'vs/platform/instantiation/common/instantiation';
export declare class TestInstantiationService extends InstantiationService {
    private _serviceCollection;
    private _servciesMap;
    constructor(_serviceCollection?: ServiceCollection);
    get<T>(service: ServiceIdentifier<T>): T;
    set<T>(service: ServiceIdentifier<T>, instance: T): T;
    mock<T>(service: ServiceIdentifier<T>): T | sinon.SinonMock;
    stub<T>(service?: ServiceIdentifier<T>, ctor?: any): T;
    stub<T>(service?: ServiceIdentifier<T>, obj?: any): T;
    stub<T>(service?: ServiceIdentifier<T>, ctor?: any, property?: string, value?: any): sinon.SinonStub;
    stub<T>(service?: ServiceIdentifier<T>, obj?: any, property?: string, value?: any): sinon.SinonStub;
    stub<T>(service?: ServiceIdentifier<T>, property?: string, value?: any): sinon.SinonStub;
    stubPromise<T>(service?: ServiceIdentifier<T>, fnProperty?: string, value?: any): T | sinon.SinonStub;
    stubPromise<T>(service?: ServiceIdentifier<T>, ctor?: any, fnProperty?: string, value?: any): sinon.SinonStub;
    stubPromise<T>(service?: ServiceIdentifier<T>, obj?: any, fnProperty?: string, value?: any): sinon.SinonStub;
    spy<T>(service: ServiceIdentifier<T>, fnProperty: string): sinon.SinonSpy;
    private _create<T>(serviceMock, options);
    private _create<T>(ctor, options);
    private _getOrCreateService<T>(serviceMock, opts);
    private _createService(serviceMock, opts);
    private _createStub(arg);
    private isServiceMock(arg1);
}
export declare function stubFunction<T>(ctor: any, fnProperty: string, value: any): T | sinon.SinonStub;
