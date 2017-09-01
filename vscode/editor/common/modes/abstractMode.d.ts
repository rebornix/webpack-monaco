import { IMode, LanguageIdentifier } from 'vs/editor/common/modes';
export declare class FrankensteinMode implements IMode {
    private _languageIdentifier;
    constructor(languageIdentifier: LanguageIdentifier);
    getId(): string;
    getLanguageIdentifier(): LanguageIdentifier;
}
