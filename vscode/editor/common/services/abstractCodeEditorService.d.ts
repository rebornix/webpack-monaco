import Event from 'vs/base/common/event';
import { ICommonCodeEditor, ICommonDiffEditor, IDecorationRenderOptions, IModelDecorationOptions, IModel } from 'vs/editor/common/editorCommon';
import { ICodeEditorService } from 'vs/editor/common/services/codeEditorService';
export declare abstract class AbstractCodeEditorService implements ICodeEditorService {
    _serviceBrand: any;
    private _onCodeEditorAdd;
    private _onCodeEditorRemove;
    private _codeEditors;
    private _onDiffEditorAdd;
    private _onDiffEditorRemove;
    private _diffEditors;
    constructor();
    addCodeEditor(editor: ICommonCodeEditor): void;
    readonly onCodeEditorAdd: Event<ICommonCodeEditor>;
    removeCodeEditor(editor: ICommonCodeEditor): void;
    readonly onCodeEditorRemove: Event<ICommonCodeEditor>;
    getCodeEditor(editorId: string): ICommonCodeEditor;
    listCodeEditors(): ICommonCodeEditor[];
    addDiffEditor(editor: ICommonDiffEditor): void;
    readonly onDiffEditorAdd: Event<ICommonDiffEditor>;
    removeDiffEditor(editor: ICommonDiffEditor): void;
    readonly onDiffEditorRemove: Event<ICommonDiffEditor>;
    getDiffEditor(editorId: string): ICommonDiffEditor;
    listDiffEditors(): ICommonDiffEditor[];
    getFocusedCodeEditor(): ICommonCodeEditor;
    abstract registerDecorationType(key: string, options: IDecorationRenderOptions, parentTypeKey?: string): void;
    abstract removeDecorationType(key: string): void;
    abstract resolveDecorationOptions(decorationTypeKey: string, writable: boolean): IModelDecorationOptions;
    private _transientWatchers;
    setTransientModelProperty(model: IModel, key: string, value: any): void;
    getTransientModelProperty(model: IModel, key: string): any;
    _removeWatcher(w: ModelTransientSettingWatcher): void;
}
export declare class ModelTransientSettingWatcher {
    readonly uri: string;
    private readonly _values;
    constructor(uri: string, model: IModel, owner: AbstractCodeEditorService);
    set(key: string, value: any): void;
    get(key: string): any;
}
