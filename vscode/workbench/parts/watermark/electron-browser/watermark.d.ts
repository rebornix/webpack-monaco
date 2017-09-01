import 'vs/css!./watermark';
import { IKeybindingService } from 'vs/platform/keybinding/common/keybinding';
import { ITelemetryService } from 'vs/platform/telemetry/common/telemetry';
import { IWorkspaceContextService } from 'vs/platform/workspace/common/workspace';
import { IWorkbenchContribution } from 'vs/workbench/common/contributions';
import { ILifecycleService } from 'vs/platform/lifecycle/common/lifecycle';
import { IConfigurationService } from 'vs/platform/configuration/common/configuration';
import { IPartService } from 'vs/workbench/services/part/common/partService';
export declare class WatermarkContribution implements IWorkbenchContribution {
    private partService;
    private keybindingService;
    private contextService;
    private telemetryService;
    private configurationService;
    private toDispose;
    private watermark;
    private enabled;
    constructor(lifecycleService: ILifecycleService, partService: IPartService, keybindingService: IKeybindingService, contextService: IWorkspaceContextService, telemetryService: ITelemetryService, configurationService: IConfigurationService);
    getId(): string;
    private create();
    private destroy();
    dispose(): void;
}
