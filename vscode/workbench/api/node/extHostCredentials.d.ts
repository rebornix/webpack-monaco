import { ExtHostCredentialsShape, IMainContext } from 'vs/workbench/api/node/extHost.protocol';
export declare class ExtHostCredentials implements ExtHostCredentialsShape {
    private _proxy;
    constructor(mainContext: IMainContext);
    readSecret(service: string, account: string): Thenable<string | undefined>;
    writeSecret(service: string, account: string, secret: string): Thenable<void>;
    deleteSecret(service: string, account: string): Thenable<boolean>;
}
