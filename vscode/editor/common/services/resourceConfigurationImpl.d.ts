import Event from 'vs/base/common/event';
import { Disposable } from 'vs/base/common/lifecycle';
import URI from 'vs/base/common/uri';
import { IConfigurationService } from 'vs/platform/configuration/common/configuration';
import { ITextResourceConfigurationService } from 'vs/editor/common/services/resourceConfiguration';
import { IPosition } from 'vs/editor/common/core/position';
import { IModeService } from 'vs/editor/common/services/modeService';
import { IModelService } from 'vs/editor/common/services/modelService';
export declare class TextResourceConfigurationService extends Disposable implements ITextResourceConfigurationService {
    private configurationService;
    private modelService;
    private modeService;
    _serviceBrand: any;
    private readonly _onDidUpdateConfiguration;
    readonly onDidUpdateConfiguration: Event<void>;
    constructor(configurationService: IConfigurationService, modelService: IModelService, modeService: IModeService);
    getConfiguration<T>(resource: URI, section?: string): T;
    getConfiguration<T>(resource: URI, at?: IPosition, section?: string): T;
    private getLanguage(resource, position);
}
