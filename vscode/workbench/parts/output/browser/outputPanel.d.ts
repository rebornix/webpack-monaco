import 'vs/css!./media/output';
import { TPromise } from 'vs/base/common/winjs.base';
import { Action, IAction } from 'vs/base/common/actions';
import { Builder } from 'vs/base/browser/builder';
import { IActionItem } from 'vs/base/browser/ui/actionbar/actionbar';
import { IEditorOptions } from 'vs/editor/common/config/editorOptions';
import { ITelemetryService } from 'vs/platform/telemetry/common/telemetry';
import { IStorageService } from 'vs/platform/storage/common/storage';
import { ITextResourceConfigurationService } from 'vs/editor/common/services/resourceConfiguration';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { IContextKeyService } from 'vs/platform/contextkey/common/contextkey';
import { EditorInput, EditorOptions } from 'vs/workbench/common/editor';
import { TextResourceEditor } from 'vs/workbench/browser/parts/editor/textResourceEditor';
import { IOutputService } from 'vs/workbench/parts/output/common/output';
import { IThemeService } from 'vs/platform/theme/common/themeService';
import { IEditorGroupService } from 'vs/workbench/services/group/common/groupService';
import { IModeService } from 'vs/editor/common/services/modeService';
import { ITextFileService } from 'vs/workbench/services/textfile/common/textfiles';
export declare class OutputPanel extends TextResourceEditor {
    private outputService;
    private contextKeyService;
    private actions;
    private scopedInstantiationService;
    constructor(telemetryService: ITelemetryService, instantiationService: IInstantiationService, storageService: IStorageService, configurationService: ITextResourceConfigurationService, themeService: IThemeService, outputService: IOutputService, contextKeyService: IContextKeyService, editorGroupService: IEditorGroupService, modeService: IModeService, textFileService: ITextFileService);
    getId(): string;
    getActions(): IAction[];
    getActionItem(action: Action): IActionItem;
    protected getConfigurationOverrides(): IEditorOptions;
    protected getAriaLabel(): string;
    setInput(input: EditorInput, options?: EditorOptions): TPromise<void>;
    protected createEditor(parent: Builder): void;
    readonly instantiationService: IInstantiationService;
}
