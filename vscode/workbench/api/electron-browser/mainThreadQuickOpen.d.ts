import { TPromise } from 'vs/base/common/winjs.base';
import { IQuickOpenService, IPickOptions } from 'vs/platform/quickOpen/common/quickOpen';
import { InputBoxOptions } from 'vscode';
import { MainThreadQuickOpenShape, MyQuickPickItems, IExtHostContext } from '../node/extHost.protocol';
export declare class MainThreadQuickOpen implements MainThreadQuickOpenShape {
    private _proxy;
    private _quickOpenService;
    private _doSetItems;
    private _doSetError;
    private _contents;
    private _token;
    constructor(extHostContext: IExtHostContext, quickOpenService: IQuickOpenService);
    dispose(): void;
    $show(options: IPickOptions): TPromise<number>;
    $setItems(items: MyQuickPickItems[]): TPromise<any>;
    $setError(error: Error): TPromise<any>;
    $input(options: InputBoxOptions, validateInput: boolean): TPromise<string>;
}
