import 'vs/css!./resourceviewer';
import URI from 'vs/base/common/uri';
import { Builder } from 'vs/base/browser/builder';
import { DomScrollableElement } from 'vs/base/browser/ui/scrollbar/scrollableElement';
export interface IResourceDescriptor {
    resource: URI;
    name: string;
    size: number;
    etag: string;
}
/**
 * Helper to actually render the given resource into the provided container. Will adjust scrollbar (if provided) automatically based on loading
 * progress of the binary resource.
 */
export declare class ResourceViewer {
    private static KB;
    private static MB;
    private static GB;
    private static TB;
    private static MAX_IMAGE_SIZE;
    static show(descriptor: IResourceDescriptor, container: Builder, scrollbar: DomScrollableElement, openExternal: (URI) => void, metadataClb?: (meta: string) => void): void;
    private static formatSize(size);
}
