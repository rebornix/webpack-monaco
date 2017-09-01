import { IStandaloneThemeService, IStandaloneThemeData, IStandaloneTheme } from 'vs/editor/standalone/common/standaloneThemeService';
import Event from 'vs/base/common/event';
export declare class StandaloneThemeServiceImpl implements IStandaloneThemeService {
    _serviceBrand: any;
    private _knownThemes;
    private _styleElement;
    private _theme;
    private _onThemeChange;
    constructor();
    readonly onThemeChange: Event<IStandaloneTheme>;
    defineTheme(themeName: string, themeData: IStandaloneThemeData): void;
    getTheme(): IStandaloneTheme;
    setTheme(themeName: string): string;
}
