import Event from 'vs/base/common/event';
import { TPromise } from 'vs/base/common/winjs.base';
import { Dimension, Builder } from 'vs/base/browser/builder';
import { EditorInput, EditorOptions } from 'vs/workbench/common/editor';
import { BaseEditor } from 'vs/workbench/browser/parts/editor/baseEditor';
import { ITelemetryService } from 'vs/platform/telemetry/common/telemetry';
import { IThemeService } from 'vs/platform/theme/common/themeService';
import { IWindowsService } from 'vs/platform/windows/common/windows';
export declare abstract class BaseBinaryResourceEditor extends BaseEditor {
    private windowsService;
    private _onMetadataChanged;
    private metadata;
    private binaryContainer;
    private scrollbar;
    constructor(id: string, telemetryService: ITelemetryService, themeService: IThemeService, windowsService: IWindowsService);
    readonly onMetadataChanged: Event<void>;
    getTitle(): string;
    protected createEditor(parent: Builder): void;
    setInput(input: EditorInput, options?: EditorOptions): TPromise<void>;
    private handleMetadataChanged(meta);
    getMetadata(): string;
    clearInput(): void;
    layout(dimension: Dimension): void;
    focus(): void;
    dispose(): void;
}
