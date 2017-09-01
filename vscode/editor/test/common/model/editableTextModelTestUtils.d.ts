import * as editorCommon from 'vs/editor/common/editorCommon';
import { EditableTextModel } from 'vs/editor/common/model/editableTextModel';
export declare function testApplyEditsWithSyncedModels(original: string[], edits: editorCommon.IIdentifiedSingleEditOperation[], expected: string[], inputEditsAreInvalid?: boolean): void;
export declare function assertSyncedModels(text: string, callback: (model: EditableTextModel, assertMirrorModels: () => void) => void, setup?: (model: EditableTextModel) => void): void;
