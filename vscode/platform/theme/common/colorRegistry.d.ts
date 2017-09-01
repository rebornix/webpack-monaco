import { IJSONSchema } from 'vs/base/common/jsonSchema';
import { Color } from 'vs/base/common/color';
import { ITheme } from 'vs/platform/theme/common/themeService';
export declare type ColorIdentifier = string;
export interface ColorContribution {
    readonly id: ColorIdentifier;
    readonly description: string;
    readonly defaults: ColorDefaults;
}
export interface ColorFunction {
    (theme: ITheme): Color;
}
export interface ColorDefaults {
    light: ColorValue;
    dark: ColorValue;
    hc: ColorValue;
}
/**
 * A Color Value is either a color literal, a refence to other color or a derived color
 */
export declare type ColorValue = Color | string | ColorIdentifier | ColorFunction;
export declare const Extensions: {
    ColorContribution: string;
};
export interface IColorRegistry {
    /**
     * Register a color to the registry.
     * @param id The color id as used in theme descrition files
     * @param defaults The default values
     * @description the description
     */
    registerColor(id: string, defaults: ColorDefaults, description: string): ColorIdentifier;
    /**
     * Get all color contributions
     */
    getColors(): ColorContribution[];
    /**
     * Gets the default color of the given id
     */
    resolveDefaultColor(id: ColorIdentifier, theme: ITheme): Color;
    /**
     * JSON schema for an object to assign color values to one of the color contrbutions.
     */
    getColorSchema(): IJSONSchema;
    /**
     * JSON schema to for a reference to a color contrbution.
     */
    getColorReferenceSchema(): IJSONSchema;
}
export declare function registerColor(id: string, defaults: ColorDefaults, description: string): ColorIdentifier;
export declare function getColorRegistry(): IColorRegistry;
export declare const foreground: string;
export declare const errorForeground: string;
export declare const descriptionForeground: string;
export declare const focusBorder: string;
export declare const contrastBorder: string;
export declare const activeContrastBorder: string;
export declare const selectionBackground: string;
export declare const textSeparatorForeground: string;
export declare const textLinkForeground: string;
export declare const textLinkActiveForeground: string;
export declare const textPreformatForeground: string;
export declare const textBlockQuoteBackground: string;
export declare const textBlockQuoteBorder: string;
export declare const textCodeBlockBackground: string;
export declare const widgetShadow: string;
export declare const inputBackground: string;
export declare const inputForeground: string;
export declare const inputBorder: string;
export declare const inputActiveOptionBorder: string;
export declare const inputPlaceholderForeground: string;
export declare const inputValidationInfoBackground: string;
export declare const inputValidationInfoBorder: string;
export declare const inputValidationWarningBackground: string;
export declare const inputValidationWarningBorder: string;
export declare const inputValidationErrorBackground: string;
export declare const inputValidationErrorBorder: string;
export declare const selectBackground: string;
export declare const selectForeground: string;
export declare const selectBorder: string;
export declare const listFocusBackground: string;
export declare const listFocusForeground: string;
export declare const listActiveSelectionBackground: string;
export declare const listActiveSelectionForeground: string;
export declare const listInactiveSelectionBackground: string;
export declare const listInactiveSelectionForeground: string;
export declare const listInactiveFocusBackground: string;
export declare const listInactiveFocusForeground: string;
export declare const listHoverBackground: string;
export declare const listHoverForeground: string;
export declare const listDropBackground: string;
export declare const listHighlightForeground: string;
export declare const pickerGroupForeground: string;
export declare const pickerGroupBorder: string;
export declare const buttonForeground: string;
export declare const buttonBackground: string;
export declare const buttonHoverBackground: string;
export declare const badgeBackground: string;
export declare const badgeForeground: string;
export declare const scrollbarShadow: string;
export declare const scrollbarSliderBackground: string;
export declare const scrollbarSliderHoverBackground: string;
export declare const scrollbarSliderActiveBackground: string;
export declare const progressBarBackground: string;
/**
 * Editor background color.
 * Because of bug https://monacotools.visualstudio.com/DefaultCollection/Monaco/_workitems/edit/13254
 * we are *not* using the color white (or #ffffff, rgba(255,255,255)) but something very close to white.
 */
export declare const editorBackground: string;
/**
 * Editor foreground color.
 */
export declare const editorForeground: string;
/**
 * Editor widgets
 */
export declare const editorWidgetBackground: string;
export declare const editorWidgetBorder: string;
/**
 * Editor selection colors.
 */
export declare const editorSelectionBackground: string;
export declare const editorSelectionForeground: string;
export declare const editorInactiveSelection: string;
export declare const editorSelectionHighlight: string;
/**
 * Editor find match colors.
 */
export declare const editorFindMatch: string;
export declare const editorFindMatchHighlight: string;
export declare const editorFindRangeHighlight: string;
/**
 * Editor hover
 */
export declare const editorHoverHighlight: string;
export declare const editorHoverBackground: string;
export declare const editorHoverBorder: string;
/**
 * Editor link colors
 */
export declare const editorActiveLinkForeground: string;
/**
 * Diff Editor Colors
 */
export declare const defaultInsertColor: Color;
export declare const defaultRemoveColor: Color;
export declare const diffInserted: string;
export declare const diffRemoved: string;
export declare const diffInsertedOutline: string;
export declare const diffRemovedOutline: string;
export declare const mergeCurrentHeaderBackground: string;
export declare const mergeCurrentContentBackground: string;
export declare const mergeIncomingHeaderBackground: string;
export declare const mergeIncomingContentBackground: string;
export declare const mergeCommonHeaderBackground: string;
export declare const mergeCommonContentBackground: string;
export declare const mergeBorder: string;
export declare const overviewRulerCurrentContentForeground: string;
export declare const overviewRulerIncomingContentForeground: string;
export declare const overviewRulerCommonContentForeground: string;
export declare function darken(colorValue: ColorValue, factor: number): ColorFunction;
export declare function lighten(colorValue: ColorValue, factor: number): ColorFunction;
export declare function transparent(colorValue: ColorValue, factor: number): ColorFunction;
export declare function oneOf(...colorValues: ColorValue[]): ColorFunction;
