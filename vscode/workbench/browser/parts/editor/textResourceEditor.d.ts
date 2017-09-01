import { TPromise } from 'vs/base/common/winjs.base';
import { IEditorOptions } from 'vs/editor/common/config/editorOptions';
import { EditorInput, EditorOptions } from 'vs/workbench/common/editor';
import { BaseTextEditor } from 'vs/workbench/browser/parts/editor/textEditor';
import { ITelemetryService } from 'vs/platform/telemetry/common/telemetry';
import { IStorageService } from 'vs/platform/storage/common/storage';
import { ITextResourceConfigurationService } from 'vs/editor/common/services/resourceConfiguration';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { IThemeService } from 'vs/platform/theme/common/themeService';
import { IEditorGroupService } from 'vs/workbench/services/group/common/groupService';
import { IModeService } from 'vs/editor/common/services/modeService';
import { ITextFileService } from 'vs/workbench/services/textfile/common/textfiles';
/**
 * An editor implementation that is capable of showing the contents of resource inputs. Uses
 * the TextEditor widget to show the contents.
 */
export declare class TextResourceEditor extends BaseTextEditor {
    static ID: string;
    constructor(telemetryService: ITelemetryService, instantiationService: IInstantiationService, storageService: IStorageService, configurationService: ITextResourceConfigurationService, themeService: IThemeService, editorGroupService: IEditorGroupService, modeService: IModeService, textFileService: ITextFileService);
    getTitle(): string;
    setInput(input: EditorInput, options?: EditorOptions): TPromise<void>;
    protected restoreViewState(input: EditorInput): void;
    protected getConfigurationOverrides(): IEditorOptions;
    protected getAriaLabel(): string;
    /**
     * Reveals the last line of this editor if it has a model set.
     */
    revealLastLine(): void;
    clearInput(): void;
    shutdown(): void;
    protected saveTextEditorViewStateForInput(input: EditorInput): void;
}
