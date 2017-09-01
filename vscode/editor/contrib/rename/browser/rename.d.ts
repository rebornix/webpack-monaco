import { TPromise } from 'vs/base/common/winjs.base';
import { ServicesAccessor, EditorAction } from 'vs/editor/common/editorCommonExtensions';
import { ICommonCodeEditor, IReadOnlyModel } from 'vs/editor/common/editorCommon';
import { WorkspaceEdit } from 'vs/editor/common/modes';
import { Position } from 'vs/editor/common/core/position';
export declare function rename(model: IReadOnlyModel, position: Position, newName: string): TPromise<WorkspaceEdit>;
export declare class RenameAction extends EditorAction {
    constructor();
    run(accessor: ServicesAccessor, editor: ICommonCodeEditor): TPromise<void>;
}
