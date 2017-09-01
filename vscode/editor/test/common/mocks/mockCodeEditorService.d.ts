import { IDecorationRenderOptions, IModelDecorationOptions } from 'vs/editor/common/editorCommon';
import { AbstractCodeEditorService } from 'vs/editor/common/services/abstractCodeEditorService';
export declare class MockCodeEditorService extends AbstractCodeEditorService {
    registerDecorationType(key: string, options: IDecorationRenderOptions, parentTypeKey?: string): void;
    removeDecorationType(key: string): void;
    resolveDecorationOptions(decorationTypeKey: string, writable: boolean): IModelDecorationOptions;
}
