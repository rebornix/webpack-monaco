import URI from 'vs/base/common/uri';
/**
 * A helper that will execute a provided function when the provided HTMLElement receives
 *  dragover event for 800ms. If the drag is aborted before, the callback will not be triggered.
 */
export declare class DelayedDragHandler {
    private timeout;
    constructor(container: HTMLElement, callback: () => void);
    private clearDragTimeout();
    dispose(): void;
}
export interface IDraggedResource {
    resource: URI;
    isExternal: boolean;
}
export declare function extractResources(e: DragEvent, externalOnly?: boolean): IDraggedResource[];
