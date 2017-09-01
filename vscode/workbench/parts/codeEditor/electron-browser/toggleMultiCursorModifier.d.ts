import { TPromise } from 'vs/base/common/winjs.base';
import { Action } from 'vs/base/common/actions';
import { IConfigurationEditingService } from 'vs/workbench/services/configuration/common/configurationEditing';
import { IConfigurationService } from 'vs/platform/configuration/common/configuration';
export declare class ToggleMultiCursorModifierAction extends Action {
    private configurationService;
    private configurationEditingService;
    static ID: string;
    static LABEL: string;
    private static multiCursorModifierConfigurationKey;
    constructor(id: string, label: string, configurationService: IConfigurationService, configurationEditingService: IConfigurationEditingService);
    run(): TPromise<any>;
}
