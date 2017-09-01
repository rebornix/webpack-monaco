import { TPromise } from 'vs/base/common/winjs.base';
import { IContextKeyService } from 'vs/platform/contextkey/common/contextkey';
import { Position } from 'vs/editor/common/core/position';
import * as editorCommon from 'vs/editor/common/editorCommon';
import { ServicesAccessor, EditorAction } from 'vs/editor/common/editorCommonExtensions';
import { Location } from 'vs/editor/common/modes';
import { IPeekViewService } from 'vs/editor/contrib/zoneWidget/browser/peekViewWidget';
export declare class ReferenceController implements editorCommon.IEditorContribution {
    private static ID;
    constructor(editor: editorCommon.ICommonCodeEditor, contextKeyService: IContextKeyService, peekViewService: IPeekViewService);
    dispose(): void;
    getId(): string;
}
export declare class ReferenceAction extends EditorAction {
    constructor();
    run(accessor: ServicesAccessor, editor: editorCommon.ICommonCodeEditor): void;
}
export declare function provideReferences(model: editorCommon.IReadOnlyModel, position: Position): TPromise<Location[]>;
