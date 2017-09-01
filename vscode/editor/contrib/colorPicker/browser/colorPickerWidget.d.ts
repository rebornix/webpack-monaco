import 'vs/css!./colorPicker';
import { Widget } from 'vs/base/browser/ui/widget';
import { ColorPickerModel } from 'vs/editor/contrib/colorPicker/browser/colorPickerModel';
import { Disposable } from 'vs/base/common/lifecycle';
export declare class ColorPickerHeader extends Disposable {
    private model;
    private domNode;
    private pickedColorNode;
    private backgroundColor;
    constructor(container: HTMLElement, model: ColorPickerModel);
    private onDidChangeColor(color);
    private onDidChangeFormatter();
}
export declare class ColorPickerBody extends Disposable {
    private container;
    private model;
    private pixelRatio;
    private domNode;
    private saturationBox;
    private hueStrip;
    private opacityStrip;
    constructor(container: HTMLElement, model: ColorPickerModel, pixelRatio: number);
    private flushColor();
    private onDidSaturationValueChange({s, v});
    private onDidOpacityChange(a);
    private onDidHueChange(value);
    layout(): void;
}
export declare class ColorPickerWidget extends Widget {
    private model;
    private pixelRatio;
    private static ID;
    body: ColorPickerBody;
    constructor(container: Node, model: ColorPickerModel, pixelRatio: number);
    getId(): string;
    layout(): void;
}
