import { IWorkbenchEditorService } from 'vs/workbench/services/editor/common/editorService';
import { Action } from 'vs/base/common/actions';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { TPromise } from 'vs/base/common/winjs.base';
import { WalkThroughInput } from 'vs/workbench/parts/welcome/walkThrough/node/walkThroughInput';
import { IEditorInputFactory, EditorInput } from 'vs/workbench/common/editor';
export declare class EditorWalkThroughAction extends Action {
    private editorService;
    private instantiationService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, editorService: IWorkbenchEditorService, instantiationService: IInstantiationService);
    run(): TPromise<void>;
}
export declare class EditorWalkThroughInputFactory implements IEditorInputFactory {
    static ID: string;
    serialize(editorInput: EditorInput): string;
    deserialize(instantiationService: IInstantiationService, serializedEditorInput: string): WalkThroughInput;
}
