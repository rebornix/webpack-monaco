import { CharacterPair, IndentationRule, EnterAction, OnEnterRule } from 'vs/editor/common/modes/languageConfiguration';
export interface IOnEnterSupportOptions {
    brackets?: CharacterPair[];
    indentationRules?: IndentationRule;
    regExpRules?: OnEnterRule[];
}
export declare class OnEnterSupport {
    private readonly _brackets;
    private readonly _indentationRules;
    private readonly _regExpRules;
    constructor(opts?: IOnEnterSupportOptions);
    onEnter(oneLineAboveText: string, beforeEnterText: string, afterEnterText: string): EnterAction;
    private static _createOpenBracketRegExp(bracket);
    private static _createCloseBracketRegExp(bracket);
    private static _safeRegExp(def);
}
