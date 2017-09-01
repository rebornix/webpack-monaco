import { TPromise } from 'vs/base/common/winjs.base';
import { Builder } from 'vs/base/browser/builder';
import { ITelemetryService } from 'vs/platform/telemetry/common/telemetry';
import { IThemeService } from 'vs/platform/theme/common/themeService';
import { ReleaseNotesInput } from './releaseNotesInput';
import { EditorOptions } from 'vs/workbench/common/editor';
import { IOpenerService } from 'vs/platform/opener/common/opener';
import { IModeService } from 'vs/editor/common/services/modeService';
import { IPartService } from 'vs/workbench/services/part/common/partService';
import { WebviewEditor } from 'vs/workbench/parts/html/browser/webviewEditor';
import { IStorageService } from 'vs/platform/storage/common/storage';
import { IContextViewService } from 'vs/platform/contextview/browser/contextView';
import { IContextKeyService } from 'vs/platform/contextkey/common/contextkey';
export declare class ReleaseNotesEditor extends WebviewEditor {
    protected themeService: IThemeService;
    private openerService;
    private modeService;
    private partService;
    private _contextViewService;
    static ID: string;
    private contentDisposables;
    private scrollYPercentage;
    constructor(telemetryService: ITelemetryService, themeService: IThemeService, openerService: IOpenerService, modeService: IModeService, partService: IPartService, storageService: IStorageService, _contextViewService: IContextViewService, contextKeyService: IContextKeyService);
    createEditor(parent: Builder): void;
    setInput(input: ReleaseNotesInput, options: EditorOptions): TPromise<void>;
    layout(): void;
    focus(): void;
    dispose(): void;
    protected getViewState(): {
        scrollYPercentage: number;
    };
    clearInput(): void;
    shutdown(): void;
}
