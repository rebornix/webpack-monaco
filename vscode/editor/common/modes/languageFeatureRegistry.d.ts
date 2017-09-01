import Event from 'vs/base/common/event';
import { IDisposable } from 'vs/base/common/lifecycle';
import { IReadOnlyModel } from 'vs/editor/common/editorCommon';
import { LanguageSelector } from 'vs/editor/common/modes/languageSelector';
export default class LanguageFeatureRegistry<T> {
    private _clock;
    private _entries;
    private _onDidChange;
    constructor();
    readonly onDidChange: Event<number>;
    register(selector: LanguageSelector, provider: T): IDisposable;
    has(model: IReadOnlyModel): boolean;
    all(model: IReadOnlyModel): T[];
    ordered(model: IReadOnlyModel): T[];
    orderedGroups(model: IReadOnlyModel): T[][];
    private _orderedForEach(model, callback);
    private _lastCandidate;
    private _updateScores(model);
    private static _compareByScoreAndTime(a, b);
}
