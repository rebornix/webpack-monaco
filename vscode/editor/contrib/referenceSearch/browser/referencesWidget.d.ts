import 'vs/css!./referencesWidget';
import Event from 'vs/base/common/event';
import { TPromise } from 'vs/base/common/winjs.base';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { IWorkspaceContextService } from 'vs/platform/workspace/common/workspace';
import { IRange } from 'vs/editor/common/core/range';
import { ICodeEditor } from 'vs/editor/browser/editorBrowser';
import { PeekViewWidget } from 'vs/editor/contrib/zoneWidget/browser/peekViewWidget';
import { OneReference, ReferencesModel } from './referencesModel';
import { ITextModelService } from 'vs/editor/common/services/resolverService';
import { IThemeService } from 'vs/platform/theme/common/themeService';
import { IEnvironmentService } from 'vs/platform/environment/common/environment';
export interface LayoutData {
    ratio: number;
    heightInLines: number;
}
export interface SelectionEvent {
    kind: 'goto' | 'show' | 'side' | 'open';
    source: 'editor' | 'tree' | 'title';
    element: OneReference;
}
/**
 * ZoneWidget that is shown inside the editor
 */
export declare class ReferenceWidget extends PeekViewWidget {
    layoutData: LayoutData;
    private _textModelResolverService;
    private _contextService;
    private _themeService;
    private _instantiationService;
    private _environmentService;
    private _model;
    private _decorationsManager;
    private _disposeOnNewModel;
    private _callOnDispose;
    private _onDidSelectReference;
    private _tree;
    private _treeContainer;
    private _sash;
    private _preview;
    private _previewModelReference;
    private _previewNotAvailableMessage;
    private _previewContainer;
    private _messageContainer;
    constructor(editor: ICodeEditor, layoutData: LayoutData, _textModelResolverService: ITextModelService, _contextService: IWorkspaceContextService, _themeService: IThemeService, _instantiationService: IInstantiationService, _environmentService: IEnvironmentService);
    private _applyTheme(theme);
    dispose(): void;
    readonly onDidSelectReference: Event<SelectionEvent>;
    show(where: IRange): void;
    focus(): void;
    protected _onTitleClick(e: MouseEvent): void;
    protected _fillBody(containerElement: HTMLElement): void;
    protected _doLayoutBody(heightInPixel: number, widthInPixel: number): void;
    _onWidth(widthInPixel: number): void;
    setSelection(selection: OneReference): TPromise<any>;
    setModel(newModel: ReferencesModel): TPromise<any>;
    private _onNewModel();
    private _getFocusedReference();
    private _revealReference(reference);
}
export declare const peekViewTitleBackground: string;
export declare const peekViewTitleForeground: string;
export declare const peekViewTitleInfoForeground: string;
export declare const peekViewBorder: string;
export declare const peekViewResultsBackground: string;
export declare const peekViewResultsMatchForeground: string;
export declare const peekViewResultsFileForeground: string;
export declare const peekViewResultsSelectionBackground: string;
export declare const peekViewResultsSelectionForeground: string;
export declare const peekViewEditorBackground: string;
export declare const peekViewEditorGutterBackground: string;
export declare const peekViewResultsMatchHighlight: string;
export declare const peekViewEditorMatchHighlight: string;
