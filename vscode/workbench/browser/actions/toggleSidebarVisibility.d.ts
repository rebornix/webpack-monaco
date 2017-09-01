import { TPromise } from 'vs/base/common/winjs.base';
import { Action } from 'vs/base/common/actions';
import { IPartService } from 'vs/workbench/services/part/common/partService';
export declare class ToggleSidebarVisibilityAction extends Action {
    private partService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, partService: IPartService);
    run(): TPromise<any>;
}
