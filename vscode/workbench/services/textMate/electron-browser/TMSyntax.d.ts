import Event from 'vs/base/common/event';
import { TPromise } from 'vs/base/common/winjs.base';
import { LanguageId } from 'vs/editor/common/modes';
import { IModeService } from 'vs/editor/common/services/modeService';
import { IGrammar } from 'vscode-textmate';
import { IWorkbenchThemeService } from 'vs/workbench/services/themes/common/workbenchThemeService';
import { ITextMateService } from 'vs/workbench/services/textMate/electron-browser/textMateService';
import { IEmbeddedLanguagesMap } from 'vs/workbench/services/textMate/electron-browser/TMGrammars';
export declare class TMScopeRegistry {
    private _scopeNameToLanguageRegistration;
    private _encounteredLanguages;
    private _onDidEncounterLanguage;
    onDidEncounterLanguage: Event<LanguageId>;
    constructor();
    register(scopeName: string, filePath: string, embeddedLanguages?: IEmbeddedLanguagesMap): void;
    getLanguageRegistration(scopeName: string): TMLanguageRegistration;
    getFilePath(scopeName: string): string;
    /**
     * To be called when tokenization found/hit an embedded language.
     */
    onEncounteredLanguage(languageId: LanguageId): void;
}
export declare class TMLanguageRegistration {
    _topLevelScopeNameDataBrand: void;
    readonly scopeName: string;
    readonly grammarFilePath: string;
    readonly embeddedLanguages: IEmbeddedLanguagesMap;
    constructor(scopeName: string, grammarFilePath: string, embeddedLanguages: IEmbeddedLanguagesMap);
}
export declare class TextMateService implements ITextMateService {
    _serviceBrand: any;
    private _grammarRegistry;
    private _modeService;
    private _themeService;
    private _scopeRegistry;
    private _injections;
    private _languageToScope;
    private _styleElement;
    onDidEncounterLanguage: Event<LanguageId>;
    constructor(modeService: IModeService, themeService: IWorkbenchThemeService);
    private static _toColorMap(colorMap);
    private _updateTheme();
    private _handleGrammarExtensionPointUser(extensionFolderPath, syntax, collector);
    private _resolveEmbeddedLanguages(embeddedLanguages);
    createGrammar(modeId: string): TPromise<IGrammar>;
    private _createGrammar(modeId);
    private registerDefinition(modeId);
}
