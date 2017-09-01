import { TPromise } from 'vs/base/common/winjs.base';
import { Dimension, Builder } from 'vs/base/browser/builder';
import { EditorOptions, SideBySideEditorInput } from 'vs/workbench/common/editor';
import { BaseEditor } from 'vs/workbench/browser/parts/editor/baseEditor';
import { IEditorControl, Position, IEditor } from 'vs/platform/editor/common/editor';
import { ITelemetryService } from 'vs/platform/telemetry/common/telemetry';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { IThemeService } from 'vs/platform/theme/common/themeService';
export declare class SideBySideEditor extends BaseEditor {
    private instantiationService;
    static ID: string;
    private dimension;
    protected masterEditor: BaseEditor;
    private masterEditorContainer;
    protected detailsEditor: BaseEditor;
    private detailsEditorContainer;
    private sash;
    constructor(telemetryService: ITelemetryService, instantiationService: IInstantiationService, themeService: IThemeService);
    protected createEditor(parent: Builder): void;
    setInput(newInput: SideBySideEditorInput, options?: EditorOptions): TPromise<void>;
    protected setEditorVisible(visible: boolean, position: Position): void;
    changePosition(position: Position): void;
    clearInput(): void;
    focus(): void;
    layout(dimension: Dimension): void;
    getControl(): IEditorControl;
    getMasterEditor(): IEditor;
    getDetailsEditor(): IEditor;
    private updateInput(oldInput, newInput, options?);
    private setNewInput(newInput, options?);
    private _createEditor(editorInput, container);
    private onEditorsCreated(details, master, detailsInput, masterInput, options);
    private createEditorContainers();
    updateStyles(): void;
    private createSash(parentElement);
    private dolayout(splitPoint);
    private disposeEditors();
    dispose(): void;
}
