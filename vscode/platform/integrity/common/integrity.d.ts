import { TPromise } from 'vs/base/common/winjs.base';
import URI from 'vs/base/common/uri';
export declare const IIntegrityService: {
    (...args: any[]): void;
    type: IIntegrityService;
};
export interface ChecksumPair {
    uri: URI;
    actual: string;
    expected: string;
    isPure: boolean;
}
export interface IntegrityTestResult {
    isPure: boolean;
    proof: ChecksumPair[];
}
export interface IIntegrityService {
    _serviceBrand: any;
    isPure(): TPromise<IntegrityTestResult>;
}
