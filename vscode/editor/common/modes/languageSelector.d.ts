import URI from 'vs/base/common/uri';
export interface LanguageFilter {
    language?: string;
    scheme?: string;
    pattern?: string;
}
export declare type LanguageSelector = string | LanguageFilter | (string | LanguageFilter)[];
export default function matches(selection: LanguageSelector, uri: URI, language: string): boolean;
export declare function score(selector: LanguageSelector, candidateUri: URI, candidateLanguage: string): number;
