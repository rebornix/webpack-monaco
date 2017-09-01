import { Action } from 'vs/base/common/actions';
import { DropdownMenu, IDropdownMenuOptions } from 'vs/base/browser/ui/dropdown/dropdown';
export interface ILinksDropdownMenuOptions extends IDropdownMenuOptions {
    tooltip: string;
}
export declare class LinksDropdownMenu extends DropdownMenu {
    constructor(container: HTMLElement, options: ILinksDropdownMenuOptions);
    protected onEvent(e: Event, activeElement: HTMLElement): void;
}
export declare class LinkDropdownAction extends Action {
    constructor(id: string, name: string, clazz: string, url: () => string, forceOpenInNewTab?: boolean);
    constructor(id: string, name: string, clazz: string, url: string, forceOpenInNewTab?: boolean);
}
