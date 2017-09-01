import 'vs/css!./countBadge';
import { Color } from 'vs/base/common/color';
export interface ICountBadgeOptions extends ICountBadgetyles {
    count?: number;
    titleFormat?: string;
}
export interface ICountBadgetyles {
    badgeBackground?: Color;
    badgeForeground?: Color;
    badgeBorder?: Color;
}
export declare class CountBadge {
    private element;
    private count;
    private titleFormat;
    private badgeBackground;
    private badgeForeground;
    private badgeBorder;
    private options;
    constructor(container: HTMLElement, options?: ICountBadgeOptions);
    setCount(count: number): void;
    setTitleFormat(titleFormat: string): void;
    private render();
    style(styles: ICountBadgetyles): void;
    private applyStyles();
}
