import 'vs/css!./iconlabel';
import { IMatch } from 'vs/base/common/filters';
import uri from 'vs/base/common/uri';
import { IRootProvider, IUserHomeProvider } from 'vs/base/common/labels';
export interface IIconLabelCreationOptions {
    supportHighlights?: boolean;
}
export interface IIconLabelOptions {
    title?: string;
    extraClasses?: string[];
    italic?: boolean;
    matches?: IMatch[];
}
export declare class IconLabel {
    private domNode;
    private labelNode;
    private descriptionNode;
    constructor(container: HTMLElement, options?: IIconLabelCreationOptions);
    readonly element: HTMLElement;
    readonly labelElement: HTMLElement;
    readonly descriptionElement: HTMLElement;
    setValue(label?: string, description?: string, options?: IIconLabelOptions): void;
    dispose(): void;
}
export declare class FileLabel extends IconLabel {
    constructor(container: HTMLElement, file: uri, provider: IRootProvider, userHome?: IUserHomeProvider);
    setFile(file: uri, provider: IRootProvider, userHome: IUserHomeProvider): void;
}
