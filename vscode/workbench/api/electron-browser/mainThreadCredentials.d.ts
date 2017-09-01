import { MainThreadCredentialsShape, IExtHostContext } from '../node/extHost.protocol';
import { ICredentialsService } from 'vs/platform/credentials/common/credentials';
export declare class MainThreadCredentials implements MainThreadCredentialsShape {
    private _credentialsService;
    private _proxy;
    constructor(extHostContext: IExtHostContext, _credentialsService: ICredentialsService);
    dispose(): void;
    $readSecret(service: string, account: string): Thenable<string | undefined>;
    $writeSecret(service: string, account: string, secret: string): Thenable<void>;
    $deleteSecret(service: string, account: string): Thenable<boolean>;
}
