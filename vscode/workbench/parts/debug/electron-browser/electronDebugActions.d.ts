import { Action } from 'vs/base/common/actions';
import { TPromise } from 'vs/base/common/winjs.base';
import { ITree } from 'vs/base/parts/tree/browser/tree';
import { IDebugService, IStackFrame } from 'vs/workbench/parts/debug/common/debug';
export declare class CopyValueAction extends Action {
    private value;
    private debugService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, value: any, debugService: IDebugService);
    run(): TPromise<any>;
}
export declare class CopyAction extends Action {
    static ID: string;
    static LABEL: string;
    run(): TPromise<any>;
}
export declare class CopyAllAction extends Action {
    private tree;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, tree: ITree);
    run(): TPromise<any>;
}
export declare class CopyStackTraceAction extends Action {
    static ID: string;
    static LABEL: string;
    run(frame: IStackFrame): TPromise<any>;
}
