import { TPromise } from 'vs/base/common/winjs.base';
import { IModeService } from 'vs/editor/common/services/modeService';
import { MainThreadLanguagesShape, IExtHostContext } from '../node/extHost.protocol';
export declare class MainThreadLanguages implements MainThreadLanguagesShape {
    private _modeService;
    constructor(extHostContext: IExtHostContext, modeService: IModeService);
    dispose(): void;
    $getLanguages(): TPromise<string[]>;
}
