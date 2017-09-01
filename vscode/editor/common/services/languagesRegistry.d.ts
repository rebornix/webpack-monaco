import { ILanguageExtensionPoint } from 'vs/editor/common/services/modeService';
import { LanguageId, LanguageIdentifier } from 'vs/editor/common/modes';
export interface IResolvedLanguage {
    identifier: LanguageIdentifier;
    name: string;
    mimetypes: string[];
    aliases: string[];
    extensions: string[];
    filenames: string[];
    configurationFiles: string[];
}
export declare class LanguagesRegistry {
    private _nextLanguageId;
    private _languages;
    private _languageIds;
    private _mimeTypesMap;
    private _nameMap;
    private _lowercaseNameMap;
    constructor(useModesRegistry?: boolean);
    _registerLanguages(desc: ILanguageExtensionPoint[]): void;
    private _registerLanguage(lang);
    private static _mergeLanguage(resolvedLanguage, lang);
    isRegisteredMode(mimetypeOrModeId: string): boolean;
    getRegisteredModes(): string[];
    getRegisteredLanguageNames(): string[];
    getLanguageName(modeId: string): string;
    getModeIdForLanguageNameLowercase(languageNameLower: string): string;
    getConfigurationFiles(modeId: string): string[];
    getMimeForMode(modeId: string): string;
    extractModeIds(commaSeparatedMimetypesOrCommaSeparatedIds: string): string[];
    getLanguageIdentifier(_modeId: string | LanguageId): LanguageIdentifier;
    getModeIdsFromLanguageName(languageName: string): string[];
    getModeIdsFromFilenameOrFirstLine(filename: string, firstLine?: string): string[];
    getExtensions(languageName: string): string[];
    getFilenames(languageName: string): string[];
}
