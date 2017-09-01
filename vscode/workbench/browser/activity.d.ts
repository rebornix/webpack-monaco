import { IAction } from 'vs/base/common/actions';
import { IConstructorSignature0 } from 'vs/platform/instantiation/common/instantiation';
export interface IActivity {
    id: string;
    name: string;
    cssClass: string;
}
export interface IGlobalActivity extends IActivity {
    getActions(): IAction[];
}
export declare const GlobalActivityExtensions = "workbench.contributions.globalActivities";
export interface IGlobalActivityRegistry {
    registerActivity(descriptor: IConstructorSignature0<IGlobalActivity>): void;
    getActivities(): IConstructorSignature0<IGlobalActivity>[];
}
export declare class GlobalActivityRegistry implements IGlobalActivityRegistry {
    private activityDescriptors;
    registerActivity(descriptor: IConstructorSignature0<IGlobalActivity>): void;
    getActivities(): IConstructorSignature0<IGlobalActivity>[];
}
