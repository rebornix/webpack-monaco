import 'vs/css!../browser/media/exceptionWidget';
import { ZoneWidget } from 'vs/editor/contrib/zoneWidget/browser/zoneWidget';
import { ICodeEditor } from 'vs/editor/browser/editorBrowser';
import { IContextViewService } from 'vs/platform/contextview/browser/contextView';
import { IDebugService, IExceptionInfo } from 'vs/workbench/parts/debug/common/debug';
import { IThemeService } from 'vs/platform/theme/common/themeService';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
export declare const debugExceptionWidgetBorder: string;
export declare const debugExceptionWidgetBackground: string;
export declare class ExceptionWidget extends ZoneWidget {
    private exceptionInfo;
    private lineNumber;
    private contextViewService;
    private debugService;
    private instantiationService;
    private _backgroundColor;
    constructor(editor: ICodeEditor, exceptionInfo: IExceptionInfo, lineNumber: number, contextViewService: IContextViewService, debugService: IDebugService, themeService: IThemeService, instantiationService: IInstantiationService);
    private _applyTheme(theme);
    protected _applyStyles(): void;
    protected _fillContainer(container: HTMLElement): void;
    protected _doLayout(heightInPixel: number, widthInPixel: number): void;
}
