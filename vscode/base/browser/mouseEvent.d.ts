export interface IMouseEvent {
    readonly browserEvent: MouseEvent;
    readonly leftButton: boolean;
    readonly middleButton: boolean;
    readonly rightButton: boolean;
    readonly target: HTMLElement;
    readonly detail: number;
    readonly posx: number;
    readonly posy: number;
    readonly ctrlKey: boolean;
    readonly shiftKey: boolean;
    readonly altKey: boolean;
    readonly metaKey: boolean;
    readonly timestamp: number;
    preventDefault(): void;
    stopPropagation(): void;
}
export declare class StandardMouseEvent implements IMouseEvent {
    readonly browserEvent: MouseEvent;
    readonly leftButton: boolean;
    readonly middleButton: boolean;
    readonly rightButton: boolean;
    readonly target: HTMLElement;
    detail: number;
    readonly posx: number;
    readonly posy: number;
    readonly ctrlKey: boolean;
    readonly shiftKey: boolean;
    readonly altKey: boolean;
    readonly metaKey: boolean;
    readonly timestamp: number;
    constructor(e: MouseEvent);
    preventDefault(): void;
    stopPropagation(): void;
}
export interface IDataTransfer {
    dropEffect: string;
    effectAllowed: string;
    types: any[];
    files: any[];
    setData(type: string, data: string): void;
    setDragImage(image: any, x: number, y: number): void;
    getData(type: string): string;
    clearData(types?: string[]): void;
}
export declare class DragMouseEvent extends StandardMouseEvent {
    readonly dataTransfer: IDataTransfer;
    constructor(e: MouseEvent);
}
export declare class DropMouseEvent extends DragMouseEvent {
    constructor(e: MouseEvent);
}
export declare class StandardMouseWheelEvent {
    readonly browserEvent: MouseWheelEvent;
    readonly deltaY: number;
    readonly deltaX: number;
    readonly target: Node;
    constructor(e: MouseWheelEvent, deltaX?: number, deltaY?: number);
    preventDefault(): void;
    stopPropagation(): void;
}
