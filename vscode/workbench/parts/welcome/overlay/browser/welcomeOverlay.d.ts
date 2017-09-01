import 'vs/css!./welcomeOverlay';
import { TPromise } from 'vs/base/common/winjs.base';
import { Action } from 'vs/base/common/actions';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
export declare class WelcomeOverlayAction extends Action {
    private instantiationService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, instantiationService: IInstantiationService);
    run(): TPromise<void>;
}
export declare class HideWelcomeOverlayAction extends Action {
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string);
    run(): TPromise<void>;
}
