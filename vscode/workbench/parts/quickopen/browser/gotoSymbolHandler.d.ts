import 'vs/css!./media/gotoSymbolHandler';
import { TPromise } from 'vs/base/common/winjs.base';
import { IAutoFocus } from 'vs/base/parts/quickopen/common/quickOpen';
import { QuickOpenModel } from 'vs/base/parts/quickopen/browser/quickOpenModel';
import { QuickOpenHandler, QuickOpenAction } from 'vs/workbench/browser/quickopen';
import { IEditor } from 'vs/editor/common/editorCommon';
import { IWorkbenchEditorService } from 'vs/workbench/services/editor/common/editorService';
import { IQuickOpenService } from 'vs/platform/quickOpen/common/quickOpen';
import { Position } from 'vs/platform/editor/common/editor';
import { IRange } from 'vs/editor/common/core/range';
export declare const GOTO_SYMBOL_PREFIX = "@";
export declare const SCOPE_PREFIX = ":";
export declare class GotoSymbolAction extends QuickOpenAction {
    static ID: string;
    static LABEL: string;
    constructor(actionId: string, actionLabel: string, quickOpenService: IQuickOpenService);
}
export declare class GotoSymbolHandler extends QuickOpenHandler {
    private editorService;
    private outlineToModelCache;
    private rangeHighlightDecorationId;
    private lastKnownEditorViewState;
    private activeOutlineRequest;
    constructor(editorService: IWorkbenchEditorService);
    getResults(searchValue: string): TPromise<QuickOpenModel>;
    getEmptyLabel(searchString: string): string;
    getAriaLabel(): string;
    canRun(): boolean | string;
    getAutoFocus(searchValue: string): IAutoFocus;
    private toQuickOpenEntries(flattened);
    private getActiveOutline();
    private doGetActiveOutline();
    decorateOutline(fullRange: IRange, startRange: IRange, editor: IEditor, position: Position): void;
    clearDecorations(): void;
    onClose(canceled: boolean): void;
}
