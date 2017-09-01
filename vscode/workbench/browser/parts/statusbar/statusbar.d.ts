import { IDisposable } from 'vs/base/common/lifecycle';
import * as statusbarService from 'vs/platform/statusbar/common/statusbar';
import { SyncDescriptor0 } from 'vs/platform/instantiation/common/descriptors';
import { IConstructorSignature0 } from 'vs/platform/instantiation/common/instantiation';
export interface IStatusbarItem {
    render(element: HTMLElement): IDisposable;
}
export import StatusbarAlignment = statusbarService.StatusbarAlignment;
export declare class StatusbarItemDescriptor {
    syncDescriptor: SyncDescriptor0<IStatusbarItem>;
    alignment: StatusbarAlignment;
    priority: number;
    constructor(ctor: IConstructorSignature0<IStatusbarItem>, alignment?: StatusbarAlignment, priority?: number);
}
export interface IStatusbarRegistry {
    registerStatusbarItem(descriptor: StatusbarItemDescriptor): void;
    items: StatusbarItemDescriptor[];
}
export declare const Extensions: {
    Statusbar: string;
};
