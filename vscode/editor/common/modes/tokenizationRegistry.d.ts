import { IDisposable } from 'vs/base/common/lifecycle';
import Event from 'vs/base/common/event';
import { ITokenizationRegistry, ITokenizationSupport, ITokenizationSupportChangedEvent } from 'vs/editor/common/modes';
import { Color } from 'vs/base/common/color';
export declare class TokenizationRegistryImpl implements ITokenizationRegistry {
    private _map;
    private _onDidChange;
    onDidChange: Event<ITokenizationSupportChangedEvent>;
    private _colorMap;
    constructor();
    fire(languages: string[]): void;
    register(language: string, support: ITokenizationSupport): IDisposable;
    get(language: string): ITokenizationSupport;
    setColorMap(colorMap: Color[]): void;
    getColorMap(): Color[];
    getDefaultForeground(): Color;
    getDefaultBackground(): Color;
}
