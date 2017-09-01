import { TPromise } from 'vs/base/common/winjs.base';
import Event from 'vs/base/common/event';
import { IGrammar } from 'vscode-textmate';
import { LanguageId } from 'vs/editor/common/modes';
export declare var ITextMateService: {
    (...args: any[]): void;
    type: ITextMateService;
};
export interface ITextMateService {
    _serviceBrand: any;
    onDidEncounterLanguage: Event<LanguageId>;
    createGrammar(modeId: string): TPromise<IGrammar>;
}
