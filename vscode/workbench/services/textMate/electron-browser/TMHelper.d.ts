import { IColorTheme, ITokenColorizationSetting } from 'vs/workbench/services/themes/common/workbenchThemeService';
export declare function findMatchingThemeRule(theme: IColorTheme, scopes: string[]): ThemeRule;
export declare class ThemeRule {
    readonly rawSelector: string;
    readonly settings: ITokenColorizationSetting;
    readonly scope: string;
    readonly parentScopes: string[];
    constructor(rawSelector: string, settings: ITokenColorizationSetting);
    matches(scope: string, parentScopes: string[]): boolean;
    private static _cmp(a, b);
    isMoreSpecific(other: ThemeRule): boolean;
    private static _matchesOne(selectorScope, scope);
    private static _matches(selectorScope, selectorParentScopes, scope, parentScopes);
}
