import { ServiceCollection } from 'vs/platform/instantiation/common/serviceCollection';
import { IContextKeyServiceTarget } from 'vs/platform/contextkey/common/contextkey';
import { CommonCodeEditor } from 'vs/editor/common/commonCodeEditor';
import { CommonEditorConfiguration } from 'vs/editor/common/config/commonEditorConfig';
import { Cursor } from 'vs/editor/common/controller/cursor';
import * as editorCommon from 'vs/editor/common/editorCommon';
import * as editorOptions from 'vs/editor/common/config/editorOptions';
import { IDisposable } from 'vs/base/common/lifecycle';
export declare class MockCodeEditor extends CommonCodeEditor {
    protected _createConfiguration(options: editorOptions.IEditorOptions): CommonEditorConfiguration;
    layout(dimension?: editorCommon.IDimension): void;
    focus(): void;
    isFocused(): boolean;
    hasWidgetFocus(): boolean;
    protected _enableEmptySelectionClipboard(): boolean;
    protected _scheduleAtNextAnimationFrame(callback: () => void): IDisposable;
    protected _createView(): void;
    protected _registerDecorationType(key: string, options: editorCommon.IDecorationRenderOptions, parentTypeKey?: string): void;
    protected _removeDecorationType(key: string): void;
    protected _resolveDecorationOptions(typeKey: string, writable: boolean): editorCommon.IModelDecorationOptions;
    getCursor(): Cursor;
    registerAndInstantiateContribution<T extends editorCommon.IEditorContribution>(ctor: any): T;
    dispose(): void;
}
export declare class MockScopeLocation implements IContextKeyServiceTarget {
    parentElement: IContextKeyServiceTarget;
    setAttribute(attr: string, value: string): void;
    removeAttribute(attr: string): void;
    hasAttribute(attr: string): boolean;
    getAttribute(attr: string): string;
}
export interface MockCodeEditorCreationOptions extends editorOptions.IEditorOptions {
    /**
     * The initial model associated with this code editor.
     */
    model?: editorCommon.IModel;
    serviceCollection?: ServiceCollection;
}
export declare function withMockCodeEditor(text: string[], options: MockCodeEditorCreationOptions, callback: (editor: MockCodeEditor, cursor: Cursor) => void): void;
export declare function mockCodeEditor(text: string[], options: MockCodeEditorCreationOptions): CommonCodeEditor;
