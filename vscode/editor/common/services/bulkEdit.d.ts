import URI from 'vs/base/common/uri';
import { TPromise } from 'vs/base/common/winjs.base';
import { ITextModelService } from 'vs/editor/common/services/resolverService';
import { IFileService } from 'vs/platform/files/common/files';
import { IRange } from 'vs/editor/common/core/range';
import { ISelection } from 'vs/editor/common/core/selection';
import { EndOfLineSequence, ICommonCodeEditor } from 'vs/editor/common/editorCommon';
import { IProgressRunner } from 'vs/platform/progress/common/progress';
export interface IResourceEdit {
    resource: URI;
    range?: IRange;
    newText: string;
    newEol?: EndOfLineSequence;
}
export interface BulkEdit {
    progress(progress: IProgressRunner): void;
    add(edit: IResourceEdit[]): void;
    finish(): TPromise<ISelection>;
    ariaMessage(): string;
}
export declare function bulkEdit(textModelResolverService: ITextModelService, editor: ICommonCodeEditor, edits: IResourceEdit[], fileService?: IFileService, progress?: IProgressRunner): TPromise<any>;
export declare function createBulkEdit(textModelResolverService: ITextModelService, editor?: ICommonCodeEditor, fileService?: IFileService): BulkEdit;
