import 'vs/css!./media/actions';
import { TPromise } from 'vs/base/common/winjs.base';
import { Action } from 'vs/base/common/actions';
import { IEditorGroupService } from 'vs/workbench/services/group/common/groupService';
export declare class ToggleEditorLayoutAction extends Action {
    private editorGroupService;
    static ID: string;
    static LABEL: string;
    private toDispose;
    constructor(id: string, label: string, editorGroupService: IEditorGroupService);
    private registerListeners();
    private updateLabel();
    private updateEnablement();
    run(): TPromise<any>;
    dispose(): void;
}
