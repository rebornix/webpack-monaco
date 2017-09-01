import { TPromise } from 'vs/base/common/winjs.base';
import { IAutoFocus } from 'vs/base/parts/quickopen/common/quickOpen';
import { QuickOpenModel } from 'vs/base/parts/quickopen/browser/quickOpenModel';
import { QuickOpenHandler, QuickOpenAction } from 'vs/workbench/browser/quickopen';
import { IEditor } from 'vs/editor/common/editorCommon';
import { IWorkbenchEditorService } from 'vs/workbench/services/editor/common/editorService';
import { Position } from 'vs/platform/editor/common/editor';
import { IQuickOpenService } from 'vs/platform/quickOpen/common/quickOpen';
import { IRange } from 'vs/editor/common/core/range';
export declare const GOTO_LINE_PREFIX = ":";
export declare class GotoLineAction extends QuickOpenAction {
    static ID: string;
    static LABEL: string;
    constructor(actionId: string, actionLabel: string, quickOpenService: IQuickOpenService);
}
export declare class GotoLineHandler extends QuickOpenHandler {
    private editorService;
    private rangeHighlightDecorationId;
    private lastKnownEditorViewState;
    constructor(editorService: IWorkbenchEditorService);
    getAriaLabel(): string;
    getResults(searchValue: string): TPromise<QuickOpenModel>;
    canRun(): boolean | string;
    decorateOutline(range: IRange, editor: IEditor, position: Position): void;
    clearDecorations(): void;
    onClose(canceled: boolean): void;
    getAutoFocus(searchValue: string): IAutoFocus;
}
