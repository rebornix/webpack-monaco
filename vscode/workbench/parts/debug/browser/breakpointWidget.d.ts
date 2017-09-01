import 'vs/css!../browser/media/breakpointWidget';
import { ICodeEditor } from 'vs/editor/browser/editorBrowser';
import { ZoneWidget } from 'vs/editor/contrib/zoneWidget/browser/zoneWidget';
import { IContextViewService } from 'vs/platform/contextview/browser/contextView';
import { IDebugService } from 'vs/workbench/parts/debug/common/debug';
import { IThemeService } from 'vs/platform/theme/common/themeService';
export declare class BreakpointWidget extends ZoneWidget {
    private lineNumber;
    private column;
    private contextViewService;
    private debugService;
    private themeService;
    private inputBox;
    private toDispose;
    private hitCountContext;
    private hitCountInput;
    private conditionInput;
    constructor(editor: ICodeEditor, lineNumber: number, column: number, contextViewService: IContextViewService, debugService: IDebugService, themeService: IThemeService);
    private readonly placeholder;
    private readonly ariaLabel;
    private getInputBoxValue(breakpoint);
    protected _fillContainer(container: HTMLElement): void;
    dispose(): void;
}
