import 'vs/css!./walkThroughPart';
import { TPromise } from 'vs/base/common/winjs.base';
import { Dimension, Builder } from 'vs/base/browser/builder';
import { EditorOptions } from 'vs/workbench/common/editor';
import { BaseEditor } from 'vs/workbench/browser/parts/editor/baseEditor';
import { ITelemetryService } from 'vs/platform/telemetry/common/telemetry';
import { WalkThroughInput } from 'vs/workbench/parts/welcome/walkThrough/node/walkThroughInput';
import { IOpenerService } from 'vs/platform/opener/common/opener';
import { IModeService } from 'vs/editor/common/services/modeService';
import { IFileService } from 'vs/platform/files/common/files';
import { IModelService } from 'vs/editor/common/services/modelService';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { IKeybindingService } from 'vs/platform/keybinding/common/keybinding';
import { IStorageService } from 'vs/platform/storage/common/storage';
import { RawContextKey, IContextKeyService } from 'vs/platform/contextkey/common/contextkey';
import { IConfigurationService } from 'vs/platform/configuration/common/configuration';
import { IPartService } from 'vs/workbench/services/part/common/partService';
import { IMessageService } from 'vs/platform/message/common/message';
import { IThemeService } from 'vs/platform/theme/common/themeService';
export declare const WALK_THROUGH_FOCUS: RawContextKey<boolean>;
export declare class WalkThroughPart extends BaseEditor {
    private instantiationService;
    protected themeService: IThemeService;
    private openerService;
    private fileService;
    protected modelService: IModelService;
    private keybindingService;
    private storageService;
    private contextKeyService;
    private configurationService;
    private modeService;
    private messageService;
    private partService;
    static ID: string;
    private disposables;
    private contentDisposables;
    private content;
    private scrollbar;
    private editorFocus;
    private size;
    constructor(telemetryService: ITelemetryService, instantiationService: IInstantiationService, themeService: IThemeService, openerService: IOpenerService, fileService: IFileService, modelService: IModelService, keybindingService: IKeybindingService, storageService: IStorageService, contextKeyService: IContextKeyService, configurationService: IConfigurationService, modeService: IModeService, messageService: IMessageService, partService: IPartService);
    createEditor(parent: Builder): void;
    private updatedScrollPosition();
    private addEventListener<K, E>(element, type, listener, useCapture?);
    private addEventListener<E>(element, type, listener, useCapture?);
    private registerFocusHandlers();
    private registerClickHandler();
    private open(uri);
    private addFrom(uri);
    layout(size: Dimension): void;
    private updateSizeClasses();
    focus(): void;
    arrowUp(): void;
    arrowDown(): void;
    private getArrowScrollHeight();
    pageUp(): void;
    pageDown(): void;
    setInput(input: WalkThroughInput, options: EditorOptions): TPromise<void>;
    private getEditorOptions(language);
    private expandMacros(input);
    private decorateContent();
    private multiCursorModifier();
    private saveTextEditorViewState(resource);
    private loadTextEditorViewState(resource);
    clearInput(): void;
    shutdown(): void;
    dispose(): void;
}
