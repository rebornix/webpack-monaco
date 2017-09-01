import 'vs/css!./gotoLine';
import { IContext, QuickOpenEntry } from 'vs/base/parts/quickopen/browser/quickOpenModel';
import { Mode } from 'vs/base/parts/quickopen/common/quickOpen';
import * as editorCommon from 'vs/editor/common/editorCommon';
import { BaseEditorQuickOpenAction, IDecorator } from './editorQuickOpen';
import { ServicesAccessor } from 'vs/editor/common/editorCommonExtensions';
export declare class GotoLineEntry extends QuickOpenEntry {
    private _parseResult;
    private decorator;
    private editor;
    constructor(line: string, editor: editorCommon.IEditor, decorator: IDecorator);
    private _parseInput(line);
    getLabel(): string;
    getAriaLabel(): string;
    run(mode: Mode, context: IContext): boolean;
    runOpen(): boolean;
    runPreview(): boolean;
    private toSelection();
}
export declare class GotoLineAction extends BaseEditorQuickOpenAction {
    constructor();
    run(accessor: ServicesAccessor, editor: editorCommon.ICommonCodeEditor): void;
}
