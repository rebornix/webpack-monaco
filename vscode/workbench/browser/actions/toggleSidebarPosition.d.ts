import { TPromise } from 'vs/base/common/winjs.base';
import { Action } from 'vs/base/common/actions';
import { IConfigurationEditingService } from 'vs/workbench/services/configuration/common/configurationEditing';
import { IPartService } from 'vs/workbench/services/part/common/partService';
export declare class ToggleSidebarPositionAction extends Action {
    private partService;
    private configurationEditingService;
    static ID: string;
    static LABEL: string;
    private static sidebarPositionConfigurationKey;
    constructor(id: string, label: string, partService: IPartService, configurationEditingService: IConfigurationEditingService);
    run(): TPromise<any>;
}
