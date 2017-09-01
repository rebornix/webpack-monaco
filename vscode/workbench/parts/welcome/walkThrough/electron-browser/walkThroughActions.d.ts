import { IWorkbenchEditorService } from 'vs/workbench/services/editor/common/editorService';
import { Action } from 'vs/base/common/actions';
import { TPromise } from 'vs/base/common/winjs.base';
export declare class WalkThroughArrowUpAction extends Action {
    private editorService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, editorService: IWorkbenchEditorService);
    run(): TPromise<void>;
}
export declare class WalkThroughArrowDownAction extends Action {
    private editorService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, editorService: IWorkbenchEditorService);
    run(): TPromise<void>;
}
export declare class WalkThroughPageUpAction extends Action {
    private editorService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, editorService: IWorkbenchEditorService);
    run(): TPromise<void>;
}
export declare class WalkThroughPageDownAction extends Action {
    private editorService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, editorService: IWorkbenchEditorService);
    run(): TPromise<void>;
}
