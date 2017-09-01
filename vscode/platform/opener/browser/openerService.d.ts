import URI from 'vs/base/common/uri';
import { TPromise } from 'vs/base/common/winjs.base';
import { IEditorService } from 'vs/platform/editor/common/editor';
import { ICommandService } from 'vs/platform/commands/common/commands';
import { IOpenerService } from 'vs/platform/opener/common/opener';
import { ITelemetryService } from 'vs/platform/telemetry/common/telemetry';
export declare class OpenerService implements IOpenerService {
    private _editorService;
    private _commandService;
    private _telemetryService;
    _serviceBrand: any;
    constructor(_editorService: IEditorService, _commandService: ICommandService, _telemetryService?: ITelemetryService);
    open(resource: URI, options?: {
        openToSide?: boolean;
    }): TPromise<any>;
}
