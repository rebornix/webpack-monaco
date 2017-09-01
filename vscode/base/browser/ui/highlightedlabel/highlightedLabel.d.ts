import { IDisposable } from 'vs/base/common/lifecycle';
export interface IHighlight {
    start: number;
    end: number;
}
export declare class HighlightedLabel implements IDisposable {
    private domNode;
    private text;
    private highlights;
    private didEverRender;
    constructor(container: HTMLElement);
    readonly element: HTMLElement;
    set(text: string, highlights?: IHighlight[]): void;
    private render();
    dispose(): void;
}
