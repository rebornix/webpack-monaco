import URI from 'vs/base/common/uri';
import { TPromise } from 'vs/base/common/winjs.base';
import { ISingleEditOperation, IDecorationRenderOptions, IDecorationOptions, ILineChange } from 'vs/editor/common/editorCommon';
import { ICodeEditorService } from 'vs/editor/common/services/codeEditorService';
import { IWorkbenchEditorService } from 'vs/workbench/services/editor/common/editorService';
import { IEditorGroupService } from 'vs/workbench/services/group/common/groupService';
import { Position as EditorPosition } from 'vs/platform/editor/common/editor';
import { ITextEditorConfigurationUpdate, TextEditorRevealType, IApplyEditsOptions, IUndoStopOptions } from 'vs/workbench/api/node/extHost.protocol';
import { MainThreadDocumentsAndEditors } from './mainThreadDocumentsAndEditors';
import { ITelemetryService } from 'vs/platform/telemetry/common/telemetry';
import { MainThreadEditorsShape, ITextDocumentShowOptions, IExtHostContext } from '../node/extHost.protocol';
import { IRange } from 'vs/editor/common/core/range';
import { ISelection } from 'vs/editor/common/core/selection';
export declare class MainThreadEditors implements MainThreadEditorsShape {
    private _codeEditorService;
    private _proxy;
    private _documentsAndEditors;
    private _workbenchEditorService;
    private _telemetryService;
    private _toDispose;
    private _textEditorsListenersMap;
    private _editorPositionData;
    constructor(documentsAndEditors: MainThreadDocumentsAndEditors, extHostContext: IExtHostContext, _codeEditorService: ICodeEditorService, workbenchEditorService: IWorkbenchEditorService, editorGroupService: IEditorGroupService, telemetryService: ITelemetryService);
    dispose(): void;
    private _onTextEditorAdd(textEditor);
    private _onTextEditorRemove(id);
    private _updateActiveAndVisibleTextEditors();
    private _getTextEditorPositionData();
    $tryShowTextDocument(resource: URI, options: ITextDocumentShowOptions): TPromise<string>;
    $tryShowEditor(id: string, position: EditorPosition): TPromise<void>;
    $tryHideEditor(id: string): TPromise<void>;
    $trySetSelections(id: string, selections: ISelection[]): TPromise<any>;
    $trySetDecorations(id: string, key: string, ranges: IDecorationOptions[]): TPromise<any>;
    $tryRevealRange(id: string, range: IRange, revealType: TextEditorRevealType): TPromise<any>;
    $trySetOptions(id: string, options: ITextEditorConfigurationUpdate): TPromise<any>;
    $tryApplyEdits(id: string, modelVersionId: number, edits: ISingleEditOperation[], opts: IApplyEditsOptions): TPromise<boolean>;
    $tryInsertSnippet(id: string, template: string, ranges: IRange[], opts: IUndoStopOptions): TPromise<boolean>;
    $registerTextEditorDecorationType(key: string, options: IDecorationRenderOptions): void;
    $removeTextEditorDecorationType(key: string): void;
    $getDiffInformation(id: string): TPromise<ILineChange[]>;
}
