import 'vs/css!./standalone-tokens';
import * as editorCommon from 'vs/editor/common/editorCommon';
import { ICodeEditor } from 'vs/editor/browser/editorBrowser';
import { IStandaloneCodeEditor, IStandaloneDiffEditor, IEditorConstructionOptions, IDiffEditorConstructionOptions } from 'vs/editor/standalone/browser/standaloneCodeEditor';
import { IEditorOverrideServices } from 'vs/editor/standalone/browser/standaloneServices';
import { IDisposable } from 'vs/base/common/lifecycle';
import URI from 'vs/base/common/uri';
import { TPromise } from 'vs/base/common/winjs.base';
import { IColorizerElementOptions, IColorizerOptions } from 'vs/editor/standalone/browser/colorizer';
import { IWebWorkerOptions, MonacoWebWorker } from 'vs/editor/common/services/webWorker';
import { IMarkerData, IMarker } from 'vs/platform/markers/common/markers';
import { IStandaloneThemeData } from 'vs/editor/standalone/common/standaloneThemeService';
import { Token } from 'vs/editor/common/core/token';
/**
 * @internal
 */
export declare function setupServices(overrides: IEditorOverrideServices): any;
/**
 * Create a new editor under `domElement`.
 * `domElement` should be empty (not contain other dom nodes).
 * The editor will read the size of `domElement`.
 */
export declare function create(domElement: HTMLElement, options?: IEditorConstructionOptions, override?: IEditorOverrideServices): IStandaloneCodeEditor;
/**
 * Emitted when an editor is created.
 * Creating a diff editor might cause this listener to be invoked with the two editors.
 * @event
 */
export declare function onDidCreateEditor(listener: (codeEditor: ICodeEditor) => void): IDisposable;
/**
 * Create a new diff editor under `domElement`.
 * `domElement` should be empty (not contain other dom nodes).
 * The editor will read the size of `domElement`.
 */
export declare function createDiffEditor(domElement: HTMLElement, options?: IDiffEditorConstructionOptions, override?: IEditorOverrideServices): IStandaloneDiffEditor;
export interface IDiffNavigator {
    revealFirst: boolean;
    canNavigate(): boolean;
    next(): void;
    previous(): void;
    dispose(): void;
}
export interface IDiffNavigatorOptions {
    readonly followsCaret?: boolean;
    readonly ignoreCharChanges?: boolean;
    readonly alwaysRevealFirst?: boolean;
}
export declare function createDiffNavigator(diffEditor: IStandaloneDiffEditor, opts?: IDiffNavigatorOptions): IDiffNavigator;
/**
 * Create a new editor model.
 * You can specify the language that should be set for this model or let the language be inferred from the `uri`.
 */
export declare function createModel(value: string, language?: string, uri?: URI): editorCommon.IModel;
/**
 * Change the language for a model.
 */
export declare function setModelLanguage(model: editorCommon.IModel, language: string): void;
/**
 * Set the markers for a model.
 */
export declare function setModelMarkers(model: editorCommon.IModel, owner: string, markers: IMarkerData[]): void;
/**
 * Get markers for owner and/or resource
 * @returns {IMarker[]} list of markers
 * @param filter
 */
export declare function getModelMarkers(filter: {
    owner?: string;
    resource?: URI;
    take?: number;
}): IMarker[];
/**
 * Get the model that has `uri` if it exists.
 */
export declare function getModel(uri: URI): editorCommon.IModel;
/**
 * Get all the created models.
 */
export declare function getModels(): editorCommon.IModel[];
/**
 * Emitted when a model is created.
 * @event
 */
export declare function onDidCreateModel(listener: (model: editorCommon.IModel) => void): IDisposable;
/**
 * Emitted right before a model is disposed.
 * @event
 */
export declare function onWillDisposeModel(listener: (model: editorCommon.IModel) => void): IDisposable;
/**
 * Emitted when a different language is set to a model.
 * @event
 */
export declare function onDidChangeModelLanguage(listener: (e: {
    readonly model: editorCommon.IModel;
    readonly oldLanguage: string;
}) => void): IDisposable;
/**
 * Create a new web worker that has model syncing capabilities built in.
 * Specify an AMD module to load that will `create` an object that will be proxied.
 */
export declare function createWebWorker<T>(opts: IWebWorkerOptions): MonacoWebWorker<T>;
/**
 * Colorize the contents of `domNode` using attribute `data-lang`.
 */
export declare function colorizeElement(domNode: HTMLElement, options: IColorizerElementOptions): TPromise<void>;
/**
 * Colorize `text` using language `languageId`.
 */
export declare function colorize(text: string, languageId: string, options: IColorizerOptions): TPromise<string>;
/**
 * Colorize a line in a model.
 */
export declare function colorizeModelLine(model: editorCommon.IModel, lineNumber: number, tabSize?: number): string;
/**
 * Tokenize `text` using language `languageId`
 */
export declare function tokenize(text: string, languageId: string): Token[][];
/**
 * Define a new theme.
 */
export declare function defineTheme(themeName: string, themeData: IStandaloneThemeData): void;
/**
 * Switches to a theme.
 */
export declare function setTheme(themeName: string): void;
/**
 * @internal
 */
export declare function createMonacoEditorAPI(): typeof monaco.editor;
