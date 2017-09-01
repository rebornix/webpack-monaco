import { Color } from 'vs/base/common/color';
import { IDisposable } from 'vs/base/common/lifecycle';
import { ColorIdentifier } from 'vs/platform/theme/common/colorRegistry';
import Event from 'vs/base/common/event';
export declare const IThemeService: {
    (...args: any[]): void;
    type: IThemeService;
};
export interface ThemeColor {
    id: string;
}
export declare function themeColorFromId(id: ColorIdentifier): {
    id: string;
};
export declare const DARK: ThemeType;
export declare const LIGHT: ThemeType;
export declare const HIGH_CONTRAST: ThemeType;
export declare type ThemeType = 'light' | 'dark' | 'hc';
export declare function getThemeTypeSelector(type: ThemeType): string;
export interface ITheme {
    readonly type: ThemeType;
    /**
     * Resolves the color of the given color identifer. If the theme does not
     * specify the color, the default color is returned unless <code>useDefault</code> is set to false.
     * @param color the id of the color
     * @param useDefault specifies if the default color should be used. If not set, the default is used.
     */
    getColor(color: ColorIdentifier, useDefault?: boolean): Color;
    /**
     * Returns wheter the theme defines a value for the color. If not, that means the
     * default color will be used.
     */
    defines(color: ColorIdentifier): boolean;
}
export interface ICssStyleCollector {
    addRule(rule: string): void;
}
export interface IThemingParticipant {
    (theme: ITheme, collector: ICssStyleCollector): void;
}
export interface IThemeService {
    _serviceBrand: any;
    getTheme(): ITheme;
    /**
     * Register a theming participant that is invoked after every theme change.
     */
    onThemeChange: Event<ITheme>;
}
export declare const Extensions: {
    ThemingContribution: string;
};
export interface IThemingRegistry {
    /**
     * Register a theming participant that is invoked on every theme change.
     */
    onThemeChange(participant: IThemingParticipant): IDisposable;
    getThemingParticipants(): IThemingParticipant[];
    readonly onThemingParticipantAdded: Event<IThemingParticipant>;
}
export declare function registerThemingParticipant(participant: IThemingParticipant): IDisposable;
/**
 * Tag function for strings containing css rules
 */
export declare function cssRule(literals: any, ...placeholders: any[]): string;
