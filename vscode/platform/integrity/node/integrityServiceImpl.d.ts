import { TPromise } from 'vs/base/common/winjs.base';
import { IIntegrityService, IntegrityTestResult } from 'vs/platform/integrity/common/integrity';
import { IMessageService } from 'vs/platform/message/common/message';
import { IStorageService } from 'vs/platform/storage/common/storage';
export declare class IntegrityServiceImpl implements IIntegrityService {
    _serviceBrand: any;
    private _messageService;
    private _storage;
    private _isPurePromise;
    constructor(messageService: IMessageService, storageService: IStorageService);
    private _prompt();
    isPure(): TPromise<IntegrityTestResult>;
    private _isPure();
    private _resolve(filename, expected);
    private _computeChecksum(buff);
    private static _createChecksumPair(uri, actual, expected);
}
