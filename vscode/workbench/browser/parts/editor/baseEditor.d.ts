import { TPromise } from 'vs/base/common/winjs.base';
import { Builder } from 'vs/base/browser/builder';
import { Panel } from 'vs/workbench/browser/panel';
import { EditorInput, EditorOptions, IEditorDescriptor } from 'vs/workbench/common/editor';
import { IEditor, Position } from 'vs/platform/editor/common/editor';
import { AsyncDescriptor } from 'vs/platform/instantiation/common/descriptors';
import { ITelemetryService } from 'vs/platform/telemetry/common/telemetry';
import { IThemeService } from 'vs/platform/theme/common/themeService';
/**
 * The base class of editors in the workbench. Editors register themselves for specific editor inputs.
 * Editors are layed out in the editor part of the workbench. Only one editor can be open at a time.
 * Each editor has a minimized representation that is good enough to provide some information about the
 * state of the editor data.
 * The workbench will keep an editor alive after it has been created and show/hide it based on
 * user interaction. The lifecycle of a editor goes in the order create(), setVisible(true|false),
 * layout(), setInput(), focus(), dispose(). During use of the workbench, a editor will often receive a
 * clearInput, setVisible, layout and focus call, but only one create and dispose call.
 *
 * This class is only intended to be subclassed and not instantiated.
 */
export declare abstract class BaseEditor extends Panel implements IEditor {
    protected _input: EditorInput;
    private _options;
    private _position;
    constructor(id: string, telemetryService: ITelemetryService, themeService: IThemeService);
    readonly input: EditorInput;
    readonly options: EditorOptions;
    /**
     * Note: Clients should not call this method, the workbench calls this
     * method. Calling it otherwise may result in unexpected behavior.
     *
     * Sets the given input with the options to the part. An editor has to deal with the
     * situation that the same input is being set with different options.
     */
    setInput(input: EditorInput, options?: EditorOptions): TPromise<void>;
    /**
     * Called to indicate to the editor that the input should be cleared and resources associated with the
     * input should be freed.
     */
    clearInput(): void;
    create(parent: Builder): void;
    create(parent: Builder): TPromise<void>;
    /**
     * Called to create the editor in the parent builder.
     */
    protected abstract createEditor(parent: Builder): void;
    /**
     * Overload this function to allow for passing in a position argument.
     */
    setVisible(visible: boolean, position?: Position): void;
    setVisible(visible: boolean, position?: Position): TPromise<void>;
    protected setEditorVisible(visible: boolean, position?: Position): void;
    /**
     * Called when the position of the editor changes while it is visible.
     */
    changePosition(position: Position): void;
    /**
     * The position this editor is showing in or null if none.
     */
    readonly position: Position;
    dispose(): void;
}
/**
 * A lightweight descriptor of an editor. The descriptor is deferred so that heavy editors
 * can load lazily in the workbench.
 */
export declare class EditorDescriptor extends AsyncDescriptor<BaseEditor> implements IEditorDescriptor {
    private id;
    private name;
    constructor(id: string, name: string, moduleId: string, ctorName: string);
    getId(): string;
    getName(): string;
    describes(obj: any): boolean;
}
