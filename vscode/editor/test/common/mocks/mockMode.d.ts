import { Disposable } from 'vs/base/common/lifecycle';
import { IMode, LanguageIdentifier } from 'vs/editor/common/modes';
export declare class MockMode extends Disposable implements IMode {
    private _languageIdentifier;
    constructor(languageIdentifier: LanguageIdentifier);
    getId(): string;
    getLanguageIdentifier(): LanguageIdentifier;
}
