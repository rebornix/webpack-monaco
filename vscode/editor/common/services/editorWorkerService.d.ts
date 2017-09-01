import URI from 'vs/base/common/uri';
import { TPromise } from 'vs/base/common/winjs.base';
import { IChange, ILineChange } from 'vs/editor/common/editorCommon';
import { IInplaceReplaceSupportResult, TextEdit } from 'vs/editor/common/modes';
import { IRange } from 'vs/editor/common/core/range';
export declare var ID_EDITOR_WORKER_SERVICE: string;
export declare var IEditorWorkerService: {
    (...args: any[]): void;
    type: IEditorWorkerService;
};
export interface IEditorWorkerService {
    _serviceBrand: any;
    canComputeDiff(original: URI, modified: URI): boolean;
    computeDiff(original: URI, modified: URI, ignoreTrimWhitespace: boolean): TPromise<ILineChange[]>;
    canComputeDirtyDiff(original: URI, modified: URI): boolean;
    computeDirtyDiff(original: URI, modified: URI, ignoreTrimWhitespace: boolean): TPromise<IChange[]>;
    computeMoreMinimalEdits(resource: URI, edits: TextEdit[], ranges: IRange[]): TPromise<TextEdit[]>;
    canNavigateValueSet(resource: URI): boolean;
    navigateValueSet(resource: URI, range: IRange, up: boolean): TPromise<IInplaceReplaceSupportResult>;
}
