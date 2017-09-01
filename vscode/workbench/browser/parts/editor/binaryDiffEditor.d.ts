import { ITelemetryService } from 'vs/platform/telemetry/common/telemetry';
import { IThemeService } from 'vs/platform/theme/common/themeService';
import { SideBySideEditor } from 'vs/workbench/browser/parts/editor/sideBySideEditor';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
/**
 * An implementation of editor for diffing binary files like images or videos.
 */
export declare class BinaryResourceDiffEditor extends SideBySideEditor {
    static ID: string;
    constructor(telemetryService: ITelemetryService, instantiationService: IInstantiationService, themeService: IThemeService);
    getMetadata(): string;
}
