import URI from 'vs/base/common/uri';
import { TPromise } from 'vs/base/common/winjs.base';
import { EventEmitter } from 'vs/base/common/eventEmitter';
import { IConfigurationOverrides, IConfigurationService, IConfigurationValue, IConfigurationKeys, IConfigurationValues, IConfigurationData } from 'vs/platform/configuration/common/configuration';
export declare class TestConfigurationService extends EventEmitter implements IConfigurationService {
    _serviceBrand: any;
    private configuration;
    private configurationByRoot;
    reloadConfiguration<T>(section?: string): TPromise<T>;
    getConfiguration(section?: string, overrides?: IConfigurationOverrides): any;
    getConfigurationData(): IConfigurationData<any>;
    setUserConfiguration(key: any, value: any, root?: URI): Thenable<void>;
    onDidUpdateConfiguration(): {
        dispose(): void;
    };
    lookup<C>(key: string, overrides?: IConfigurationOverrides): IConfigurationValue<C>;
    keys(): IConfigurationKeys;
    values(): IConfigurationValues;
}
