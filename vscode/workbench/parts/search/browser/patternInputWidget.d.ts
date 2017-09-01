import * as dom from 'vs/base/browser/dom';
import { Widget } from 'vs/base/browser/ui/widget';
import { IContextViewProvider } from 'vs/base/browser/ui/contextview/contextview';
import { InputBox, IInputValidator } from 'vs/base/browser/ui/inputbox/inputBox';
import CommonEvent from 'vs/base/common/event';
import { IThemeService } from 'vs/platform/theme/common/themeService';
import { ITelemetryService } from 'vs/platform/telemetry/common/telemetry';
export interface IOptions {
    placeholder?: string;
    width?: number;
    validation?: IInputValidator;
    ariaLabel?: string;
}
export declare class PatternInputWidget extends Widget {
    private contextViewProvider;
    protected themeService: IThemeService;
    static OPTION_CHANGE: string;
    inputFocusTracker: dom.IFocusTracker;
    protected onOptionChange: (event: Event) => void;
    private width;
    private placeholder;
    private ariaLabel;
    private domNode;
    private inputNode;
    protected inputBox: InputBox;
    private history;
    private _onSubmit;
    onSubmit: CommonEvent<boolean>;
    private _onCancel;
    onCancel: CommonEvent<boolean>;
    constructor(parent: HTMLElement, contextViewProvider: IContextViewProvider, themeService: IThemeService, options?: IOptions);
    dispose(): void;
    on(eventType: string, handler: (event: Event) => void): PatternInputWidget;
    setWidth(newWidth: number): void;
    getValue(): string;
    setValue(value: string): void;
    select(): void;
    focus(): void;
    inputHasFocus(): boolean;
    private setInputWidth();
    protected getSubcontrolsWidth(): number;
    getHistory(): string[];
    setHistory(history: string[]): void;
    onSearchSubmit(): void;
    showNextTerm(): void;
    showPreviousTerm(): void;
    private render();
    protected renderSubcontrols(controlsDiv: HTMLDivElement): void;
    private onInputKeyUp(keyboardEvent);
}
export declare class ExcludePatternInputWidget extends PatternInputWidget {
    private telemetryService;
    constructor(parent: HTMLElement, contextViewProvider: IContextViewProvider, themeService: IThemeService, telemetryService: ITelemetryService, options?: IOptions);
    private useIgnoreFilesBox;
    private useExcludeSettingsBox;
    dispose(): void;
    useExcludeSettings(): boolean;
    setUseExcludeSettings(value: boolean): void;
    useIgnoreFiles(): boolean;
    setUseIgnoreFiles(value: boolean): void;
    protected getSubcontrolsWidth(): number;
    protected renderSubcontrols(controlsDiv: HTMLDivElement): void;
}
