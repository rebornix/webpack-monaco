import URI from 'vs/base/common/uri';
import { UntitledEditorService } from 'vs/workbench/services/untitled/common/untitledEditorService';
import { UntitledEditorInput } from 'vs/workbench/common/editor/untitledEditorInput';
export declare class TestUntitledEditorService extends UntitledEditorService {
    get(resource: URI): UntitledEditorInput;
    getAll(resources?: URI[]): UntitledEditorInput[];
}
