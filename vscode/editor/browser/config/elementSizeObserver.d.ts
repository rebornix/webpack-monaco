import { Disposable } from 'vs/base/common/lifecycle';
import { IDimension } from 'vs/editor/common/editorCommon';
export declare class ElementSizeObserver extends Disposable {
    private referenceDomElement;
    private measureReferenceDomElementToken;
    private changeCallback;
    private width;
    private height;
    constructor(referenceDomElement: HTMLElement, changeCallback: () => void);
    dispose(): void;
    getWidth(): number;
    getHeight(): number;
    startObserving(): void;
    stopObserving(): void;
    observe(dimension?: IDimension): void;
    private measureReferenceDomElement(callChangeCallback, dimension?);
}
