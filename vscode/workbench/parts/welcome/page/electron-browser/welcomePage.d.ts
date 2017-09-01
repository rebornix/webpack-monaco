import 'vs/css!./welcomePage';
import { WalkThroughInput } from 'vs/workbench/parts/welcome/walkThrough/node/walkThroughInput';
import { IWorkbenchContribution } from 'vs/workbench/common/contributions';
import { IPartService } from 'vs/workbench/services/part/common/partService';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { IWorkbenchEditorService } from 'vs/workbench/services/editor/common/editorService';
import { TPromise } from 'vs/base/common/winjs.base';
import { IConfigurationService } from 'vs/platform/configuration/common/configuration';
import { Action } from 'vs/base/common/actions';
import { ITelemetryService } from 'vs/platform/telemetry/common/telemetry';
import { IBackupFileService } from 'vs/workbench/services/backup/common/backup';
import { ILifecycleService } from 'vs/platform/lifecycle/common/lifecycle';
import { IStorageService } from 'vs/platform/storage/common/storage';
import { IEditorInputFactory, EditorInput } from 'vs/workbench/common/editor';
export declare class WelcomePageContribution implements IWorkbenchContribution {
    constructor(partService: IPartService, instantiationService: IInstantiationService, configurationService: IConfigurationService, editorService: IWorkbenchEditorService, backupFileService: IBackupFileService, telemetryService: ITelemetryService, lifecycleService: ILifecycleService, storageService: IStorageService);
    getId(): string;
}
export declare class WelcomePageAction extends Action {
    private instantiationService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, instantiationService: IInstantiationService);
    run(): TPromise<void>;
}
export declare class WelcomeInputFactory implements IEditorInputFactory {
    static ID: string;
    serialize(editorInput: EditorInput): string;
    deserialize(instantiationService: IInstantiationService, serializedEditorInput: string): WalkThroughInput;
}
