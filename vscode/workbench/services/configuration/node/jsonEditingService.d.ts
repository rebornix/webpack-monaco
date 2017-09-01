import { TPromise } from 'vs/base/common/winjs.base';
import URI from 'vs/base/common/uri';
import { ITextFileService } from 'vs/workbench/services/textfile/common/textfiles';
import { IFileService } from 'vs/platform/files/common/files';
import { ITextModelService } from 'vs/editor/common/services/resolverService';
import { IJSONEditingService, IJSONValue } from 'vs/workbench/services/configuration/common/jsonEditing';
export declare class JSONEditingService implements IJSONEditingService {
    private fileService;
    private textModelResolverService;
    private textFileService;
    _serviceBrand: any;
    private queue;
    constructor(fileService: IFileService, textModelResolverService: ITextModelService, textFileService: ITextFileService);
    write(resource: URI, value: IJSONValue, save: boolean): TPromise<void>;
    private doWriteConfiguration(resource, value, save);
    private writeToBuffer(model, value);
    private applyEditsToBuffer(edit, model);
    private getEdits(model, configurationValue);
    private resolveModelReference(resource);
    private hasParseErrors(model);
    private resolveAndValidate(resource, checkDirty);
    private wrapError<T>(code);
    private toErrorMessage(error);
}
