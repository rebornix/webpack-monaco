import { IWorkbenchEditorService } from 'vs/workbench/services/editor/common/editorService';
import { IWorkspaceContextService } from 'vs/platform/workspace/common/workspace';
export declare class LinkDetector {
    private editorService;
    private contextService;
    private static FILE_LOCATION_PATTERNS;
    constructor(editorService: IWorkbenchEditorService, contextService: IWorkspaceContextService);
    /**
     * Matches and handles relative and absolute file links in the string provided.
     * Returns <span/> element that wraps the processed string, where matched links are replaced by <a/> and unmatched parts are surrounded by <span/> elements.
     * 'onclick' event is attached to all anchored links that opens them in the editor.
     * If no links were detected, returns the original string.
     */
    handleLinks(text: string): HTMLElement | string;
    private onLinkClick(event, resource, line, column?);
}
