import { TokenTheme, ITokenThemeRule } from 'vs/editor/common/modes/supports/tokenization';
import { ITheme, IThemeService } from 'vs/platform/theme/common/themeService';
export declare var IStandaloneThemeService: {
    (...args: any[]): void;
    type: IStandaloneThemeService;
};
export declare type BuiltinTheme = 'vs' | 'vs-dark' | 'hc-black';
export declare type IColors = {
    [colorId: string]: string;
};
export interface IStandaloneThemeData {
    base: BuiltinTheme;
    inherit: boolean;
    rules: ITokenThemeRule[];
    colors: IColors;
}
export interface IStandaloneTheme extends ITheme {
    tokenTheme: TokenTheme;
    themeName: string;
}
export interface IStandaloneThemeService extends IThemeService {
    _serviceBrand: any;
    setTheme(themeName: string): string;
    defineTheme(themeName: string, themeData: IStandaloneThemeData): void;
    getTheme(): IStandaloneTheme;
}
