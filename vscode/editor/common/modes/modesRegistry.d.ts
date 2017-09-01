import Event from 'vs/base/common/event';
import { ILanguageExtensionPoint } from 'vs/editor/common/services/modeService';
import { LanguageIdentifier } from 'vs/editor/common/modes';
export declare var Extensions: {
    ModesRegistry: string;
};
export declare class EditorModesRegistry {
    private _languages;
    private _onDidAddLanguages;
    onDidAddLanguages: Event<ILanguageExtensionPoint[]>;
    constructor();
    registerLanguage(def: ILanguageExtensionPoint): void;
    registerLanguages(def: ILanguageExtensionPoint[]): void;
    getLanguages(): ILanguageExtensionPoint[];
}
export declare var ModesRegistry: EditorModesRegistry;
export declare const PLAINTEXT_MODE_ID = "plaintext";
export declare const PLAINTEXT_LANGUAGE_IDENTIFIER: LanguageIdentifier;
