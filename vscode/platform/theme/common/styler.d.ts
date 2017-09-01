import { IThemeService } from 'vs/platform/theme/common/themeService';
import { ColorIdentifier, ColorFunction } from 'vs/platform/theme/common/colorRegistry';
import { IDisposable } from 'vs/base/common/lifecycle';
export declare type styleFn = (colors: {
    [name: string]: ColorIdentifier;
}) => void;
export interface IThemable {
    style: styleFn;
}
export declare function attachStyler(themeService: IThemeService, optionsMapping: {
    [optionsKey: string]: ColorIdentifier | ColorFunction;
}, widgetOrCallback: IThemable | styleFn): IDisposable;
export declare function attachCheckboxStyler(widget: IThemable, themeService: IThemeService, style?: {
    inputActiveOptionBorderColor?: ColorIdentifier;
}): IDisposable;
export declare function attachBadgeStyler(widget: IThemable, themeService: IThemeService, style?: {
    badgeBackground?: ColorIdentifier;
    badgeForeground?: ColorIdentifier;
}): IDisposable;
export declare function attachInputBoxStyler(widget: IThemable, themeService: IThemeService, style?: {
    inputBackground?: ColorIdentifier;
    inputForeground?: ColorIdentifier;
    inputBorder?: ColorIdentifier;
    inputValidationInfoBorder?: ColorIdentifier;
    inputValidationInfoBackground?: ColorIdentifier;
    inputValidationWarningBorder?: ColorIdentifier;
    inputValidationWarningBackground?: ColorIdentifier;
    inputValidationErrorBorder?: ColorIdentifier;
    inputValidationErrorBackground?: ColorIdentifier;
}): IDisposable;
export declare function attachSelectBoxStyler(widget: IThemable, themeService: IThemeService, style?: {
    selectBackground?: ColorIdentifier;
    selectForeground?: ColorIdentifier;
    selectBorder?: ColorIdentifier;
}): IDisposable;
export declare function attachFindInputBoxStyler(widget: IThemable, themeService: IThemeService, style?: {
    inputBackground?: ColorIdentifier;
    inputForeground?: ColorIdentifier;
    inputBorder?: ColorIdentifier;
    inputActiveOptionBorder?: ColorIdentifier;
    inputValidationInfoBorder?: ColorIdentifier;
    inputValidationInfoBackground?: ColorIdentifier;
    inputValidationWarningBorder?: ColorIdentifier;
    inputValidationWarningBackground?: ColorIdentifier;
    inputValidationErrorBorder?: ColorIdentifier;
    inputValidationErrorBackground?: ColorIdentifier;
}): IDisposable;
export declare function attachQuickOpenStyler(widget: IThemable, themeService: IThemeService, style?: {
    foreground?: ColorIdentifier;
    background?: ColorIdentifier;
    borderColor?: ColorIdentifier;
    widgetShadow?: ColorIdentifier;
    progressBarBackground?: ColorIdentifier;
    inputBackground?: ColorIdentifier;
    inputForeground?: ColorIdentifier;
    inputBorder?: ColorIdentifier;
    inputValidationInfoBorder?: ColorIdentifier;
    inputValidationInfoBackground?: ColorIdentifier;
    inputValidationWarningBorder?: ColorIdentifier;
    inputValidationWarningBackground?: ColorIdentifier;
    inputValidationErrorBorder?: ColorIdentifier;
    inputValidationErrorBackground?: ColorIdentifier;
    pickerGroupForeground?: ColorIdentifier;
    pickerGroupBorder?: ColorIdentifier;
    listFocusBackground?: ColorIdentifier;
    listFocusForeground?: ColorIdentifier;
    listActiveSelectionBackground?: ColorIdentifier;
    listActiveSelectionForeground?: ColorIdentifier;
    listFocusAndSelectionBackground?: ColorIdentifier;
    listFocusAndSelectionForeground?: ColorIdentifier;
    listInactiveSelectionBackground?: ColorIdentifier;
    listInactiveSelectionForeground?: ColorIdentifier;
    listInactiveFocusBackground?: ColorIdentifier;
    listInactiveFocusForeground?: ColorIdentifier;
    listHoverBackground?: ColorIdentifier;
    listHoverForeground?: ColorIdentifier;
    listDropBackground?: ColorIdentifier;
    listFocusOutline?: ColorIdentifier;
    listSelectionOutline?: ColorIdentifier;
    listHoverOutline?: ColorIdentifier;
}): IDisposable;
export declare function attachListStyler(widget: IThemable, themeService: IThemeService, style?: {
    listFocusBackground?: ColorIdentifier;
    listFocusForeground?: ColorIdentifier;
    listActiveSelectionBackground?: ColorIdentifier;
    listActiveSelectionForeground?: ColorIdentifier;
    listFocusAndSelectionBackground?: ColorIdentifier;
    listFocusAndSelectionForeground?: ColorIdentifier;
    listInactiveSelectionBackground?: ColorIdentifier;
    listInactiveSelectionForeground?: ColorIdentifier;
    listInactiveFocusBackground?: ColorIdentifier;
    listInactiveFocusForeground?: ColorIdentifier;
    listHoverBackground?: ColorIdentifier;
    listHoverForeground?: ColorIdentifier;
    listDropBackground?: ColorIdentifier;
    listFocusOutline?: ColorIdentifier;
    listInactiveFocusOutline?: ColorIdentifier;
    listSelectionOutline?: ColorIdentifier;
    listHoverOutline?: ColorIdentifier;
}): IDisposable;
export declare function attachButtonStyler(widget: IThemable, themeService: IThemeService, style?: {
    buttonForeground?: ColorIdentifier;
    buttonBackground?: ColorIdentifier;
    buttonHoverBackground?: ColorIdentifier;
}): IDisposable;
export declare function attachProgressBarStyler(widget: IThemable, themeService: IThemeService, style?: {
    progressBarBackground?: ColorIdentifier;
}): IDisposable;
export declare function attachStylerCallback(themeService: IThemeService, colors: {
    [name: string]: ColorIdentifier;
}, callback: styleFn): IDisposable;
