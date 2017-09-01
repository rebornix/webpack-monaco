import { TPromise } from 'vs/base/common/winjs.base';
import { IModel } from 'vs/editor/common/editorCommon';
import { Dimension, Builder } from 'vs/base/browser/builder';
import { EditorOptions, EditorInput } from 'vs/workbench/common/editor';
import { Position } from 'vs/platform/editor/common/editor';
import { ITelemetryService } from 'vs/platform/telemetry/common/telemetry';
import { IThemeService } from 'vs/platform/theme/common/themeService';
import { IOpenerService } from 'vs/platform/opener/common/opener';
import { ITextModelService } from 'vs/editor/common/services/resolverService';
import { IPartService } from 'vs/workbench/services/part/common/partService';
import { IContextViewService } from 'vs/platform/contextview/browser/contextView';
import { IContextKeyService } from 'vs/platform/contextkey/common/contextkey';
import { IStorageService } from 'vs/platform/storage/common/storage';
import { WebviewEditor } from './webviewEditor';
/**
 * An implementation of editor for showing HTML content in an IFrame by leveraging the HTML input.
 */
export declare class HtmlPreviewPart extends WebviewEditor {
    private textModelResolverService;
    private readonly openerService;
    private partService;
    private _contextViewService;
    static ID: string;
    static class: string;
    private _webviewDisposables;
    private _modelRef;
    readonly model: IModel;
    private _modelChangeSubscription;
    private _themeChangeSubscription;
    private scrollYPercentage;
    constructor(telemetryService: ITelemetryService, textModelResolverService: ITextModelService, themeService: IThemeService, openerService: IOpenerService, partService: IPartService, storageService: IStorageService, _contextViewService: IContextViewService, contextKeyService: IContextKeyService);
    dispose(): void;
    protected createEditor(parent: Builder): void;
    private readonly webview;
    changePosition(position: Position): void;
    protected setEditorVisible(visible: boolean, position?: Position): void;
    private _doSetVisible(visible);
    private _hasValidModel();
    layout(dimension: Dimension): void;
    focus(): void;
    clearInput(): void;
    shutdown(): void;
    sendMessage(data: any): void;
    setInput(input: EditorInput, options?: EditorOptions): TPromise<void>;
}
