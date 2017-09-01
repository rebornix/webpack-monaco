import { ExtensionEnablementService } from 'vs/platform/extensionManagement/common/extensionEnablementService';
import { TestInstantiationService } from 'vs/platform/instantiation/test/common/instantiationServiceMock';
export declare class TestExtensionEnablementService extends ExtensionEnablementService {
    constructor(instantiationService: TestInstantiationService);
    reset(): void;
}
