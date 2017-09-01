import _ = require('vs/base/parts/tree/browser/tree');
import Mouse = require('vs/base/browser/mouseEvent');
import { DefaultDragAndDrop } from 'vs/base/parts/tree/browser/treeDefaults';
import URI from 'vs/base/common/uri';
export declare class ElementsDragAndDropData implements _.IDragAndDropData {
    private elements;
    constructor(elements: any[]);
    update(event: Mouse.DragMouseEvent): void;
    getData(): any;
}
export declare class ExternalElementsDragAndDropData implements _.IDragAndDropData {
    private elements;
    constructor(elements: any[]);
    update(event: Mouse.DragMouseEvent): void;
    getData(): any;
}
export declare class DesktopDragAndDropData implements _.IDragAndDropData {
    private types;
    private files;
    constructor();
    update(event: Mouse.DragMouseEvent): void;
    getData(): any;
}
export declare class SimpleFileResourceDragAndDrop extends DefaultDragAndDrop {
    private toResource;
    constructor(toResource: (obj: any) => URI);
    getDragURI(tree: _.ITree, obj: any): string;
    getDragLabel(tree: _.ITree, elements: any[]): string;
    onDragStart(tree: _.ITree, data: _.IDragAndDropData, originalEvent: Mouse.DragMouseEvent): void;
}
