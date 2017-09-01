import uri from 'vs/base/common/uri';
import { TPromise } from 'vs/base/common/winjs.base';
import { IStringDictionary } from 'vs/base/common/collections';
export declare const IConfigurationResolverService: {
    (...args: any[]): void;
    type: IConfigurationResolverService;
};
export interface IConfigurationResolverService {
    _serviceBrand: any;
    resolve(root: uri, value: string): string;
    resolve(root: uri, value: string[]): string[];
    resolve(root: uri, value: IStringDictionary<string>): IStringDictionary<string>;
    resolveAny<T>(root: uri, value: T): T;
    resolveInteractiveVariables(configuration: any, interactiveVariablesMap: {
        [key: string]: string;
    }): TPromise<any>;
}
