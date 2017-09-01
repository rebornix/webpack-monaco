import { Disposable } from 'vs/base/common/lifecycle';
import URI from 'vs/base/common/uri';
import { TPromise } from 'vs/base/common/winjs.base';
import * as editorCommon from 'vs/editor/common/editorCommon';
import * as modes from 'vs/editor/common/modes';
import { IPosition } from 'vs/editor/common/core/position';
import { IEditorWorkerService } from 'vs/editor/common/services/editorWorkerService';
import { IModelService } from 'vs/editor/common/services/modelService';
import { EditorSimpleWorkerImpl } from 'vs/editor/common/services/editorSimpleWorker';
import { ITextResourceConfigurationService } from 'vs/editor/common/services/resourceConfiguration';
import { IRange } from 'vs/editor/common/core/range';
import { IModeService } from 'vs/editor/common/services/modeService';
export declare class EditorWorkerServiceImpl extends Disposable implements IEditorWorkerService {
    _serviceBrand: any;
    private readonly _modelService;
    private readonly _workerManager;
    constructor(modelService: IModelService, configurationService: ITextResourceConfigurationService, modeService: IModeService);
    dispose(): void;
    canComputeDiff(original: URI, modified: URI): boolean;
    computeDiff(original: URI, modified: URI, ignoreTrimWhitespace: boolean): TPromise<editorCommon.ILineChange[]>;
    canComputeDirtyDiff(original: URI, modified: URI): boolean;
    computeDirtyDiff(original: URI, modified: URI, ignoreTrimWhitespace: boolean): TPromise<editorCommon.IChange[]>;
    computeMoreMinimalEdits(resource: URI, edits: modes.TextEdit[], ranges: IRange[]): TPromise<modes.TextEdit[]>;
    canNavigateValueSet(resource: URI): boolean;
    navigateValueSet(resource: URI, range: IRange, up: boolean): TPromise<modes.IInplaceReplaceSupportResult>;
}
export declare class EditorWorkerClient extends Disposable {
    private _modelService;
    private _worker;
    private _workerFactory;
    private _modelManager;
    constructor(modelService: IModelService, label: string);
    private _getOrCreateWorker();
    protected _getProxy(): TPromise<EditorSimpleWorkerImpl>;
    private _getOrCreateModelManager(proxy);
    protected _withSyncedResources(resources: URI[]): TPromise<EditorSimpleWorkerImpl>;
    computeDiff(original: URI, modified: URI, ignoreTrimWhitespace: boolean): TPromise<editorCommon.ILineChange[]>;
    computeDirtyDiff(original: URI, modified: URI, ignoreTrimWhitespace: boolean): TPromise<editorCommon.IChange[]>;
    computeMoreMinimalEdits(resource: URI, edits: modes.TextEdit[], ranges: IRange[]): TPromise<modes.TextEdit[]>;
    computeLinks(resource: URI): TPromise<modes.ILink[]>;
    textualSuggest(resource: URI, position: IPosition): TPromise<modes.ISuggestResult>;
    navigateValueSet(resource: URI, range: IRange, up: boolean): TPromise<modes.IInplaceReplaceSupportResult>;
}
