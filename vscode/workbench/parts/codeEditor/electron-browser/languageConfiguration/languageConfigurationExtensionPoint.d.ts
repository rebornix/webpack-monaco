import { IModeService } from 'vs/editor/common/services/modeService';
import { ITextMateService } from 'vs/workbench/services/textMate/electron-browser/textMateService';
export declare class LanguageConfigurationFileHandler {
    private _modeService;
    private _done;
    constructor(textMateService: ITextMateService, modeService: IModeService);
    private _loadConfigurationsForMode(languageIdentifier);
    private _handleConfigFile(languageIdentifier, configFilePath);
    private _handleConfig(languageIdentifier, configuration);
    private _parseRegex(value);
    private _mapIndentationRules(indentationRules);
    private _mapCharacterPairs(pairs);
}
