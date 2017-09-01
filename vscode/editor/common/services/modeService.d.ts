import Event from 'vs/base/common/event';
import { TPromise } from 'vs/base/common/winjs.base';
import { IMode, LanguageId, LanguageIdentifier } from 'vs/editor/common/modes';
export declare var IModeService: {
    (...args: any[]): void;
    type: IModeService;
};
export interface IModeLookupResult {
    modeId: string;
    isInstantiated: boolean;
}
export interface ILanguageExtensionPoint {
    id: string;
    extensions?: string[];
    filenames?: string[];
    filenamePatterns?: string[];
    firstLine?: string;
    aliases?: string[];
    mimetypes?: string[];
    configuration?: string;
}
export interface IValidLanguageExtensionPoint {
    id: string;
    extensions: string[];
    filenames: string[];
    filenamePatterns: string[];
    firstLine: string;
    aliases: string[];
    mimetypes: string[];
    configuration: string;
}
export interface IModeService {
    _serviceBrand: any;
    onDidCreateMode: Event<IMode>;
    isRegisteredMode(mimetypeOrModeId: string): boolean;
    getRegisteredModes(): string[];
    getRegisteredLanguageNames(): string[];
    getExtensions(alias: string): string[];
    getFilenames(alias: string): string[];
    getMimeForMode(modeId: string): string;
    getLanguageName(modeId: string): string;
    getModeIdForLanguageName(alias: string): string;
    getModeIdByFilenameOrFirstLine(filename: string, firstLine?: string): string;
    getModeId(commaSeparatedMimetypesOrCommaSeparatedIds: string): string;
    getLanguageIdentifier(modeId: string | LanguageId): LanguageIdentifier;
    getConfigurationFiles(modeId: string): string[];
    lookup(commaSeparatedMimetypesOrCommaSeparatedIds: string): IModeLookupResult[];
    getMode(commaSeparatedMimetypesOrCommaSeparatedIds: string): IMode;
    getOrCreateMode(commaSeparatedMimetypesOrCommaSeparatedIds: string): TPromise<IMode>;
    getOrCreateModeByLanguageName(languageName: string): TPromise<IMode>;
    getOrCreateModeByFilenameOrFirstLine(filename: string, firstLine?: string): TPromise<IMode>;
}
