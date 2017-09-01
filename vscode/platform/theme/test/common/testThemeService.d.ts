import Event, { Emitter } from 'vs/base/common/event';
import { IThemeService, ITheme } from 'vs/platform/theme/common/themeService';
import { Color } from 'vs/base/common/color';
export declare class TestTheme implements ITheme {
    private colors;
    type: "light" | "dark" | "hc";
    constructor(colors?: {
        [id: string]: string;
    }, type?: "light" | "dark" | "hc");
    getColor(color: string, useDefault?: boolean): Color;
    defines(color: string): boolean;
}
export declare class TestThemeService implements IThemeService {
    _serviceBrand: any;
    _theme: ITheme;
    _onThemeChange: Emitter<ITheme>;
    constructor(theme?: TestTheme);
    getTheme(): ITheme;
    setTheme(theme: ITheme): void;
    fireThemeChange(): void;
    readonly onThemeChange: Event<ITheme>;
}
