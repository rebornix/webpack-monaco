import { IState, LanguageIdentifier, LanguageId } from 'vs/editor/common/modes';
import { TokenizationResult, TokenizationResult2 } from 'vs/editor/common/core/token';
export declare const NULL_STATE: IState;
export declare const NULL_MODE_ID = "vs.editor.nullMode";
export declare const NULL_LANGUAGE_IDENTIFIER: LanguageIdentifier;
export declare function nullTokenize(modeId: string, buffer: string, state: IState, deltaOffset: number): TokenizationResult;
export declare function nullTokenize2(languageId: LanguageId, buffer: string, state: IState, deltaOffset: number): TokenizationResult2;
