import { BaseEditor } from 'vs/workbench/browser/parts/editor/baseEditor';
import { ITelemetryService } from 'vs/platform/telemetry/common/telemetry';
export declare class MyEditor extends BaseEditor {
    constructor(id: string, telemetryService: ITelemetryService);
    getId(): string;
    layout(): void;
    createEditor(): any;
}
export declare class MyOtherEditor extends BaseEditor {
    constructor(id: string, telemetryService: ITelemetryService);
    getId(): string;
    layout(): void;
    createEditor(): any;
}
