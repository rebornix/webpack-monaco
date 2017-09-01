import { TPromise } from 'vs/base/common/winjs.base';
import { Action } from 'vs/base/common/actions';
import { IQuickOpenService } from 'vs/platform/quickOpen/common/quickOpen';
import { IKeybindingService } from 'vs/platform/keybinding/common/keybinding';
import { ContextKeyExpr } from 'vs/platform/contextkey/common/contextkey';
import { ICommandHandler } from 'vs/platform/commands/common/commands';
export declare const inQuickOpenContext: ContextKeyExpr;
export declare const defaultQuickOpenContextKey = "inFilesPicker";
export declare const defaultQuickOpenContext: ContextKeyExpr;
export declare const QUICKOPEN_ACTION_ID = "workbench.action.quickOpen";
export declare const QUICKOPEN_ACION_LABEL: string;
export declare class BaseQuickOpenNavigateAction extends Action {
    private next;
    private quickNavigate;
    private quickOpenService;
    private keybindingService;
    constructor(id: string, label: string, next: boolean, quickNavigate: boolean, quickOpenService: IQuickOpenService, keybindingService: IKeybindingService);
    run(event?: any): TPromise<any>;
}
export declare function getQuickNavigateHandler(id: string, next?: boolean): ICommandHandler;
export declare class QuickOpenNavigateNextAction extends BaseQuickOpenNavigateAction {
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, quickOpenService: IQuickOpenService, keybindingService: IKeybindingService);
}
export declare class QuickOpenNavigatePreviousAction extends BaseQuickOpenNavigateAction {
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, quickOpenService: IQuickOpenService, keybindingService: IKeybindingService);
}
export declare class QuickOpenSelectNextAction extends BaseQuickOpenNavigateAction {
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, quickOpenService: IQuickOpenService, keybindingService: IKeybindingService);
}
export declare class QuickOpenSelectPreviousAction extends BaseQuickOpenNavigateAction {
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, quickOpenService: IQuickOpenService, keybindingService: IKeybindingService);
}
