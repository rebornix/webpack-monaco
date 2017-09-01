import { TPromise } from 'vs/base/common/winjs.base';
import { ICredentialsService } from 'vs/platform/credentials/common/credentials';
export declare class CredentialsService implements ICredentialsService {
    _serviceBrand: any;
    readSecret(service: string, account: string): TPromise<string | undefined>;
    writeSecret(service: string, account: string, secret: string): TPromise<void>;
    deleteSecret(service: string, account: string): TPromise<boolean>;
}
