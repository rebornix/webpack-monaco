import { TPromise } from 'vs/base/common/winjs.base';
import { ICodeEditorService } from 'vs/editor/common/services/codeEditorService';
import { ISaveParticipant, ITextFileEditorModel, SaveReason } from 'vs/workbench/services/textfile/common/textfiles';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { ITelemetryService } from 'vs/platform/telemetry/common/telemetry';
import { IConfigurationService } from 'vs/platform/configuration/common/configuration';
import { IExtHostContext } from '../node/extHost.protocol';
export interface INamedSaveParticpant extends ISaveParticipant {
    readonly name: string;
}
export declare class FinalNewLineParticipant implements INamedSaveParticpant {
    private configurationService;
    private codeEditorService;
    readonly name: string;
    constructor(configurationService: IConfigurationService, codeEditorService: ICodeEditorService);
    participate(model: ITextFileEditorModel, env: {
        reason: SaveReason;
    }): void;
    private doInsertFinalNewLine(model);
}
export declare class SaveParticipant implements ISaveParticipant {
    private _telemetryService;
    private _saveParticipants;
    constructor(extHostContext: IExtHostContext, _telemetryService: ITelemetryService, instantiationService: IInstantiationService, configurationService: IConfigurationService, codeEditorService: ICodeEditorService);
    dispose(): void;
    participate(model: ITextFileEditorModel, env: {
        reason: SaveReason;
    }): TPromise<void>;
}
