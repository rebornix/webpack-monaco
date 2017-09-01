import { IAction } from 'vs/base/common/actions';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { ActionBarContributor } from 'vs/workbench/browser/actions';
export declare class QuickOpenActionContributor extends ActionBarContributor {
    private instantiationService;
    private openToSideActionInstance;
    constructor(instantiationService: IInstantiationService);
    hasActions(context: any): boolean;
    getActions(context: any): IAction[];
    private getEntry(context);
}
