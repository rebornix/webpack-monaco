import { BaseBinaryResourceEditor } from 'vs/workbench/browser/parts/editor/binaryEditor';
import { ITelemetryService } from 'vs/platform/telemetry/common/telemetry';
import { IThemeService } from 'vs/platform/theme/common/themeService';
import { IWindowsService } from 'vs/platform/windows/common/windows';
/**
 * An implementation of editor for binary files like images.
 */
export declare class BinaryFileEditor extends BaseBinaryResourceEditor {
    static ID: string;
    constructor(telemetryService: ITelemetryService, themeService: IThemeService, windowsService: IWindowsService);
    getTitle(): string;
}
