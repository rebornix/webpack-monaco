import { ITelemetryService } from 'vs/platform/telemetry/common/telemetry';
import { IThemeService } from 'vs/platform/theme/common/themeService';
import { BaseEditor } from 'vs/workbench/browser/parts/editor/baseEditor';
import URI from 'vs/base/common/uri';
import { IStorageService } from 'vs/platform/storage/common/storage';
export interface HtmlPreviewEditorViewState {
    scrollYPercentage: number;
}
/**
 * This class is only intended to be subclassed and not instantiated.
 */
export declare abstract class BaseWebviewEditor extends BaseEditor {
    private storageService;
    constructor(id: string, telemetryService: ITelemetryService, themeService: IThemeService, storageService: IStorageService);
    private readonly viewStateStorageKey;
    protected saveViewState(resource: URI | string, editorViewState: HtmlPreviewEditorViewState): void;
    protected loadViewState(resource: URI | string): HtmlPreviewEditorViewState | null;
}
