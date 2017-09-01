import { TPromise } from 'vs/base/common/winjs.base';
import { ICommonCodeEditor } from 'vs/editor/common/editorCommon';
import { EditorAction, ServicesAccessor, IActionOptions } from 'vs/editor/common/editorCommonExtensions';
import { LanguageId, LanguageIdentifier } from 'vs/editor/common/modes';
export interface IGrammarContributions {
    getGrammar(mode: string): string;
}
export interface ILanguageIdentifierResolver {
    getLanguageIdentifier(modeId: LanguageId): LanguageIdentifier;
}
export interface IEmmetActionOptions extends IActionOptions {
    actionName: string;
}
export declare abstract class EmmetEditorAction extends EditorAction {
    protected emmetActionName: string;
    constructor(opts: IEmmetActionOptions);
    private static readonly emmetSupportedModes;
    private _lastGrammarContributions;
    private _lastExtensionService;
    private _withGrammarContributions(extensionService);
    run(accessor: ServicesAccessor, editor: ICommonCodeEditor): TPromise<void>;
    static getLanguage(languageIdentifierResolver: ILanguageIdentifierResolver, editor: ICommonCodeEditor, grammars: IGrammarContributions): {
        language: string;
        parentMode: string;
    };
}
