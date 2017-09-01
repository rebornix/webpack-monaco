import { TPromise } from 'vs/base/common/winjs.base';
export declare const ICredentialsService: {
    (...args: any[]): void;
    type: ICredentialsService;
};
export interface ICredentialsService {
    _serviceBrand: any;
    readSecret(service: string, account: string): TPromise<string | undefined>;
    writeSecret(service: string, account: string, secret: string): TPromise<void>;
    deleteSecret(service: string, account: string): TPromise<boolean>;
}
