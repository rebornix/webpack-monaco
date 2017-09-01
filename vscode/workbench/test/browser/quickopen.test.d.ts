import 'vs/workbench/browser/parts/editor/editor.contribution';
import { Promise } from 'vs/base/common/winjs.base';
import Event from 'vs/base/common/event';
import { IQuickOpenService } from 'vs/platform/quickOpen/common/quickOpen';
export declare class TestQuickOpenService implements IQuickOpenService {
    _serviceBrand: any;
    private callback;
    constructor(callback?: (prefix: string) => void);
    pick(arg: any, options?: any, token?: any): Promise;
    input(options?: any, token?: any): Promise;
    accept(): void;
    focus(): void;
    close(): void;
    show(prefix?: string, options?: any): Promise;
    readonly onShow: Event<void>;
    readonly onHide: Event<void>;
    dispose(): void;
    navigate(): void;
}
