import { Disposable } from 'vs/base/common/lifecycle';
import { FastDomNode } from 'vs/base/browser/fastDomNode';
import { ScrollbarVisibility } from 'vs/base/common/scrollable';
export declare class ScrollbarVisibilityController extends Disposable {
    private _visibility;
    private _visibleClassName;
    private _invisibleClassName;
    private _domNode;
    private _shouldBeVisible;
    private _isNeeded;
    private _isVisible;
    private _revealTimer;
    constructor(visibility: ScrollbarVisibility, visibleClassName: string, invisibleClassName: string);
    private applyVisibilitySetting(shouldBeVisible);
    setShouldBeVisible(rawShouldBeVisible: boolean): void;
    setIsNeeded(isNeeded: boolean): void;
    setDomNode(domNode: FastDomNode<HTMLElement>): void;
    ensureVisibility(): void;
    private _reveal();
    private _hide(withFadeAway);
}
