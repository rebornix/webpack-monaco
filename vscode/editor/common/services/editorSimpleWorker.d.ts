import URI from 'vs/base/common/uri';
import { TPromise } from 'vs/base/common/winjs.base';
import { IDisposable } from 'vs/base/common/lifecycle';
import { IRequestHandler } from 'vs/base/common/worker/simpleWorker';
import { Range, IRange } from 'vs/editor/common/core/range';
import * as editorCommon from 'vs/editor/common/editorCommon';
import { IPosition } from 'vs/editor/common/core/position';
import { IModelChangedEvent } from 'vs/editor/common/model/mirrorModel';
import { IInplaceReplaceSupportResult, ILink, ISuggestResult, TextEdit } from 'vs/editor/common/modes';
export interface IMirrorModel {
    readonly uri: URI;
    readonly version: number;
    getValue(): string;
}
export interface IWorkerContext {
    /**
     * Get all available mirror models in this worker.
     */
    getMirrorModels(): IMirrorModel[];
}
/**
 * @internal
 */
export interface IRawModelData {
    url: string;
    versionId: number;
    lines: string[];
    EOL: string;
}
/**
 * @internal
 */
export interface ICommonModel {
    uri: URI;
    version: number;
    eol: string;
    getValue(): string;
    getLinesContent(): string[];
    getLineCount(): number;
    getLineContent(lineNumber: number): string;
    getWordUntilPosition(position: IPosition, wordDefinition: RegExp): editorCommon.IWordAtPosition;
    getAllUniqueWords(wordDefinition: RegExp, skipWordOnce?: string): string[];
    getValueInRange(range: IRange): string;
    getWordAtPosition(position: IPosition, wordDefinition: RegExp): Range;
    offsetAt(position: IPosition): number;
    positionAt(offset: number): IPosition;
}
/**
 * @internal
 */
export declare abstract class BaseEditorSimpleWorker {
    private _foreignModule;
    constructor();
    protected abstract _getModel(uri: string): ICommonModel;
    protected abstract _getModels(): ICommonModel[];
    computeDiff(originalUrl: string, modifiedUrl: string, ignoreTrimWhitespace: boolean): TPromise<editorCommon.ILineChange[]>;
    computeDirtyDiff(originalUrl: string, modifiedUrl: string, ignoreTrimWhitespace: boolean): TPromise<editorCommon.IChange[]>;
    private static _diffLimit;
    computeMoreMinimalEdits(modelUrl: string, edits: TextEdit[], ranges: IRange[]): TPromise<TextEdit[]>;
    computeLinks(modelUrl: string): TPromise<ILink[]>;
    textualSuggest(modelUrl: string, position: IPosition, wordDef: string, wordDefFlags: string): TPromise<ISuggestResult>;
    navigateValueSet(modelUrl: string, range: IRange, up: boolean, wordDef: string, wordDefFlags: string): TPromise<IInplaceReplaceSupportResult>;
    loadForeignModule(moduleId: string, createData: any): TPromise<string[]>;
    fmr(method: string, args: any[]): TPromise<any>;
}
/**
 * @internal
 */
export declare class EditorSimpleWorkerImpl extends BaseEditorSimpleWorker implements IRequestHandler, IDisposable {
    _requestHandlerTrait: any;
    private _models;
    constructor();
    dispose(): void;
    protected _getModel(uri: string): ICommonModel;
    protected _getModels(): ICommonModel[];
    acceptNewModel(data: IRawModelData): void;
    acceptModelChanged(strURL: string, e: IModelChangedEvent): void;
    acceptRemovedModel(strURL: string): void;
}
/**
 * Called on the worker side
 * @internal
 */
export declare function create(): IRequestHandler;
