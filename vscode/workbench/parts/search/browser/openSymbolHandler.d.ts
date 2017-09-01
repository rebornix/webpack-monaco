import { TPromise } from 'vs/base/common/winjs.base';
import { QuickOpenHandler } from 'vs/workbench/browser/quickopen';
import { QuickOpenModel } from 'vs/base/parts/quickopen/browser/quickOpenModel';
import { IAutoFocus } from 'vs/base/parts/quickopen/common/quickOpen';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
export interface IOpenSymbolOptions {
    skipSorting: boolean;
    skipLocalSymbols: boolean;
    skipDelay: boolean;
}
export declare class OpenSymbolHandler extends QuickOpenHandler {
    private instantiationService;
    private static SEARCH_DELAY;
    private delayer;
    private options;
    constructor(instantiationService: IInstantiationService);
    setOptions(options: IOpenSymbolOptions): void;
    canRun(): boolean | string;
    getResults(searchValue: string): TPromise<QuickOpenModel>;
    private doGetResults(searchValue);
    private fillInSymbolEntries(bucket, provider, types, searchValue);
    getGroupLabel(): string;
    getEmptyLabel(searchString: string): string;
    getAutoFocus(searchValue: string): IAutoFocus;
}
