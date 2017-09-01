import { TPromise } from 'vs/base/common/winjs.base';
import { IModel } from 'vs/editor/common/editorCommon';
import { IMode } from 'vs/editor/common/modes';
import { EditorModel } from 'vs/workbench/common/editor';
import URI from 'vs/base/common/uri';
import { ITextEditorModel } from 'vs/editor/common/services/resolverService';
import { IModeService } from 'vs/editor/common/services/modeService';
import { IModelService } from 'vs/editor/common/services/modelService';
import { IRawTextSource } from 'vs/editor/common/model/textSource';
/**
 * The base text editor model leverages the code editor model. This class is only intended to be subclassed and not instantiated.
 */
export declare abstract class BaseTextEditorModel extends EditorModel implements ITextEditorModel {
    protected modelService: IModelService;
    protected modeService: IModeService;
    private textEditorModelHandle;
    protected createdEditorModel: boolean;
    private modelDisposeListener;
    constructor(modelService: IModelService, modeService: IModeService, textEditorModelHandle?: URI);
    private handleExistingModel(textEditorModelHandle);
    private registerModelDisposeListener(model);
    readonly textEditorModel: IModel;
    /**
     * Creates the text editor model with the provided value, modeId (can be comma separated for multiple values) and optional resource URL.
     */
    protected createTextEditorModel(value: string | IRawTextSource, resource?: URI, modeId?: string): TPromise<EditorModel>;
    private doCreateTextEditorModel(value, mode, resource);
    protected getFirstLineText(value: string | IRawTextSource): string;
    /**
     * Gets the mode for the given identifier. Subclasses can override to provide their own implementation of this lookup.
     *
     * @param firstLineText optional first line of the text buffer to set the mode on. This can be used to guess a mode from content.
     */
    protected getOrCreateMode(modeService: IModeService, modeId: string, firstLineText?: string): TPromise<IMode>;
    /**
     * Updates the text editor model with the provided value. If the value is the same as the model has, this is a no-op.
     */
    protected updateTextEditorModel(newValue: string | IRawTextSource): void;
    /**
     * Returns the textual value of this editor model or null if it has not yet been created.
     */
    getValue(): string;
    isResolved(): boolean;
    dispose(): void;
}
