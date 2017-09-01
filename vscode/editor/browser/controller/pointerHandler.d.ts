import { IDisposable } from 'vs/base/common/lifecycle';
import { IPointerHandlerHelper } from 'vs/editor/browser/controller/mouseHandler';
import { IMouseTarget } from 'vs/editor/browser/editorBrowser';
import { ViewContext } from 'vs/editor/common/view/viewContext';
import { ViewController } from 'vs/editor/browser/view/viewController';
export declare class PointerHandler implements IDisposable {
    private handler;
    constructor(context: ViewContext, viewController: ViewController, viewHelper: IPointerHandlerHelper);
    getTargetAtClientPoint(clientX: number, clientY: number): IMouseTarget;
    dispose(): void;
}
