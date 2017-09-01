import { TPromise } from 'vs/base/common/winjs.base';
import { IEditorAction } from 'vs/editor/common/editorCommon';
import { IContextKeyService, ContextKeyExpr } from 'vs/platform/contextkey/common/contextkey';
export declare class InternalEditorAction implements IEditorAction {
    readonly id: string;
    readonly label: string;
    readonly alias: string;
    private readonly _precondition;
    private readonly _run;
    private readonly _contextKeyService;
    constructor(id: string, label: string, alias: string, precondition: ContextKeyExpr, run: () => void, contextKeyService: IContextKeyService);
    isSupported(): boolean;
    run(): TPromise<void>;
}
