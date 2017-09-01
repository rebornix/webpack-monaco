import { QuickOpenModel } from 'vs/base/parts/quickopen/browser/quickOpenModel';
import { IAutoFocus } from 'vs/base/parts/quickopen/common/quickOpen';
import { ICodeEditor, IOverlayWidget, IOverlayWidgetPosition } from 'vs/editor/browser/editorBrowser';
import { IThemeService } from 'vs/platform/theme/common/themeService';
export interface IQuickOpenEditorWidgetOptions {
    inputAriaLabel: string;
}
export declare class QuickOpenEditorWidget implements IOverlayWidget {
    private static ID;
    private codeEditor;
    private themeService;
    private visible;
    private quickOpenWidget;
    private domNode;
    private styler;
    constructor(codeEditor: ICodeEditor, onOk: () => void, onCancel: () => void, onType: (value: string) => void, configuration: IQuickOpenEditorWidgetOptions, themeService: IThemeService);
    private create(onOk, onCancel, onType, configuration);
    setInput(model: QuickOpenModel, focus: IAutoFocus): void;
    getId(): string;
    getDomNode(): HTMLElement;
    destroy(): void;
    isVisible(): boolean;
    show(value: string): void;
    hide(): void;
    getPosition(): IOverlayWidgetPosition;
}
