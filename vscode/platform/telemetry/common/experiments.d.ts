import { IConfigurationService } from 'vs/platform/configuration/common/configuration';
import { IStorageService } from 'vs/platform/storage/common/storage';
export interface IExperiments {
    deployToAzureQuickLink: boolean;
}
export declare const IExperimentService: {
    (...args: any[]): void;
    type: IExperimentService;
};
export interface IExperimentService {
    _serviceBrand: any;
    getExperiments(): IExperiments;
}
export declare class ExperimentService implements IExperimentService {
    private storageService;
    private configurationService;
    _serviceBrand: any;
    private experiments;
    constructor(storageService: IStorageService, configurationService: IConfigurationService);
    getExperiments(): IExperiments;
}
