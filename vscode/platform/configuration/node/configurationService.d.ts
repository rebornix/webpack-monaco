import { TPromise } from 'vs/base/common/winjs.base';
import { IDisposable, Disposable } from 'vs/base/common/lifecycle';
import { IConfigurationService, IConfigurationServiceEvent, IConfigurationValue, IConfigurationKeys, IConfigurationOverrides, Configuration, IConfigurationValues, IConfigurationData } from 'vs/platform/configuration/common/configuration';
import Event from 'vs/base/common/event';
import { IEnvironmentService } from 'vs/platform/environment/common/environment';
export declare class ConfigurationService<T> extends Disposable implements IConfigurationService, IDisposable {
    _serviceBrand: any;
    private _configuration;
    private userConfigModelWatcher;
    private _onDidUpdateConfiguration;
    readonly onDidUpdateConfiguration: Event<IConfigurationServiceEvent>;
    constructor(environmentService: IEnvironmentService);
    configuration(): Configuration<any>;
    private onConfigurationChange(source);
    reloadConfiguration<C>(section?: string): TPromise<C>;
    getConfiguration<C>(section?: string, options?: IConfigurationOverrides): C;
    lookup<C>(key: string, overrides?: IConfigurationOverrides): IConfigurationValue<C>;
    keys(overrides?: IConfigurationOverrides): IConfigurationKeys;
    values<V>(): IConfigurationValues;
    getConfigurationData<T2>(): IConfigurationData<T2>;
    private reset();
    private consolidateConfigurations();
}
