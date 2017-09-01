import { TPromise } from 'vs/base/common/winjs.base';
import Quickopen = require('vs/workbench/browser/quickopen');
import QuickOpen = require('vs/base/parts/quickopen/common/quickOpen');
import Model = require('vs/base/parts/quickopen/browser/quickOpenModel');
import { IQuickOpenService } from 'vs/platform/quickOpen/common/quickOpen';
import { IDebugService } from 'vs/workbench/parts/debug/common/debug';
export declare class DebugQuickOpenHandler extends Quickopen.QuickOpenHandler {
    private quickOpenService;
    private debugService;
    constructor(quickOpenService: IQuickOpenService, debugService: IDebugService);
    getAriaLabel(): string;
    getResults(input: string): TPromise<Model.QuickOpenModel>;
    getAutoFocus(input: string): QuickOpen.IAutoFocus;
    getEmptyLabel(searchString: string): string;
}
