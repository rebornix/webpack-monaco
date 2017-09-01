import { TPromise } from 'vs/base/common/winjs.base';
import * as editorCommon from 'vs/editor/common/editorCommon';
import { IActionOptions, ServicesAccessor, EditorAction } from 'vs/editor/common/editorCommonExtensions';
import { Location } from 'vs/editor/common/modes';
import { ReferencesModel } from 'vs/editor/contrib/referenceSearch/browser/referencesModel';
import * as corePosition from 'vs/editor/common/core/position';
export declare class DefinitionActionConfig {
    readonly openToSide: boolean;
    readonly openInPeek: boolean;
    readonly filterCurrent: boolean;
    readonly showMessage: boolean;
    constructor(openToSide?: boolean, openInPeek?: boolean, filterCurrent?: boolean, showMessage?: boolean);
}
export declare class DefinitionAction extends EditorAction {
    private _configuration;
    constructor(configuration: DefinitionActionConfig, opts: IActionOptions);
    run(accessor: ServicesAccessor, editor: editorCommon.ICommonCodeEditor): TPromise<void>;
    protected _getDeclarationsAtPosition(model: editorCommon.IModel, position: corePosition.Position): TPromise<Location[]>;
    protected _getNoResultFoundMessage(info?: editorCommon.IWordAtPosition): string;
    protected _getMetaTitle(model: ReferencesModel): string;
    private _onResult(editorService, editor, model);
    private _openReference(editorService, reference, sideBySide);
    private _openInPeek(editorService, target, model);
}
export declare class GoToDefinitionAction extends DefinitionAction {
    static ID: string;
    constructor();
}
export declare class OpenDefinitionToSideAction extends DefinitionAction {
    static ID: string;
    constructor();
}
export declare class PeekDefinitionAction extends DefinitionAction {
    constructor();
}
export declare class ImplementationAction extends DefinitionAction {
    protected _getDeclarationsAtPosition(model: editorCommon.IModel, position: corePosition.Position): TPromise<Location[]>;
    protected _getNoResultFoundMessage(info?: editorCommon.IWordAtPosition): string;
    protected _getMetaTitle(model: ReferencesModel): string;
}
export declare class GoToImplementationAction extends ImplementationAction {
    static ID: string;
    constructor();
}
export declare class PeekImplementationAction extends ImplementationAction {
    static ID: string;
    constructor();
}
export declare class TypeDefinitionAction extends DefinitionAction {
    protected _getDeclarationsAtPosition(model: editorCommon.IModel, position: corePosition.Position): TPromise<Location[]>;
    protected _getNoResultFoundMessage(info?: editorCommon.IWordAtPosition): string;
    protected _getMetaTitle(model: ReferencesModel): string;
}
export declare class GoToTypeDefintionAction extends TypeDefinitionAction {
    static ID: string;
    constructor();
}
export declare class PeekTypeDefinitionAction extends TypeDefinitionAction {
    static ID: string;
    constructor();
}
