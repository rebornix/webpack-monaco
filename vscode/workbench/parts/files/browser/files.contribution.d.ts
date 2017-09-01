import { ToggleViewletAction } from 'vs/workbench/browser/viewlet';
import { IViewletService } from 'vs/workbench/services/viewlet/browser/viewlet';
import { IWorkbenchEditorService } from 'vs/workbench/services/editor/common/editorService';
export declare class OpenExplorerViewletAction extends ToggleViewletAction {
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, viewletService: IViewletService, editorService: IWorkbenchEditorService);
}
