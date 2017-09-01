import { IDisposable } from 'vs/base/common/lifecycle';
export interface IBadge {
    getDescription(): string;
}
export declare class BaseBadge implements IBadge {
    descriptorFn: (args: any) => string;
    constructor(descriptorFn: (args: any) => string);
    getDescription(): string;
}
export declare class NumberBadge extends BaseBadge {
    number: number;
    constructor(number: number, descriptorFn: (args: any) => string);
    getDescription(): string;
}
export declare class TextBadge extends BaseBadge {
    text: string;
    constructor(text: string, descriptorFn: (args: any) => string);
}
export declare class IconBadge extends BaseBadge {
    constructor(descriptorFn: (args: any) => string);
}
export declare class ProgressBadge extends BaseBadge {
}
export declare const IActivityBarService: {
    (...args: any[]): void;
    type: IActivityBarService;
};
export interface IActivityBarService {
    _serviceBrand: any;
    /**
     * Show activity in the activitybar for the given global activity.
     */
    showGlobalActivity(globalActivityId: string, badge: IBadge): IDisposable;
    /**
     * Show activity in the activitybar for the given viewlet.
     */
    showActivity(viewletId: string, badge: IBadge, clazz?: string): IDisposable;
    /**
     * Unpins a viewlet from the activitybar.
     */
    unpin(viewletId: string): void;
    /**
     * Pin a viewlet inside the activity bar.
     */
    pin(viewletId: string): void;
    /**
     * Find out if a viewlet is pinned in the activity bar.
     */
    isPinned(viewletId: string): boolean;
    /**
     * Reorder viewlet ordering by moving a viewlet to the location of another viewlet.
     */
    move(viewletId: string, toViewletId: string): void;
}
