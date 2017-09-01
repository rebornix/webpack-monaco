import Severity from 'vs/base/common/severity';
import { IExtensionService } from 'vs/platform/extensions/common/extensions';
import { MainThreadExtensionServiceShape, IExtHostContext } from '../node/extHost.protocol';
export declare class MainThreadExtensionService implements MainThreadExtensionServiceShape {
    private readonly _extensionService;
    constructor(extHostContext: IExtHostContext, extensionService: IExtensionService);
    dispose(): void;
    $localShowMessage(severity: Severity, msg: string): void;
    $onExtensionActivated(extensionId: string, startup: boolean, codeLoadingTime: number, activateCallTime: number, activateResolvedTime: number): void;
    $onExtensionActivationFailed(extensionId: string): void;
}
