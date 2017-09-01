import URI from 'vs/base/common/uri';
import { ICodeEditorService } from 'vs/editor/common/services/codeEditorService';
import { IEditorGroupService } from 'vs/workbench/services/group/common/groupService';
import { MainThreadDocumentContentProvidersShape, IExtHostContext } from '../node/extHost.protocol';
import { ITextSource } from 'vs/editor/common/model/textSource';
import { ITextModelService } from 'vs/editor/common/services/resolverService';
import { IModeService } from 'vs/editor/common/services/modeService';
import { IModelService } from 'vs/editor/common/services/modelService';
export declare class MainThreadDocumentContentProviders implements MainThreadDocumentContentProvidersShape {
    private readonly _textModelResolverService;
    private readonly _modeService;
    private readonly _modelService;
    private _resourceContentProvider;
    private readonly _proxy;
    constructor(extHostContext: IExtHostContext, _textModelResolverService: ITextModelService, _modeService: IModeService, _modelService: IModelService, codeEditorService: ICodeEditorService, editorGroupService: IEditorGroupService);
    dispose(): void;
    $registerTextContentProvider(handle: number, scheme: string): void;
    $unregisterTextContentProvider(handle: number): void;
    $onVirtualDocumentChange(uri: URI, value: ITextSource): void;
}
