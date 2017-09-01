import URI from 'vs/base/common/uri';
import { IModel, ITextModelCreationOptions } from 'vs/editor/common/editorCommon';
import { EditableTextModel } from 'vs/editor/common/model/editableTextModel';
import { IDisposable } from 'vs/base/common/lifecycle';
import { LanguageIdentifier } from 'vs/editor/common/modes';
import { IRawTextSource } from 'vs/editor/common/model/textSource';
import * as textModelEvents from 'vs/editor/common/model/textModelEvents';
export declare class Model extends EditableTextModel implements IModel {
    onDidChangeDecorations(listener: (e: textModelEvents.IModelDecorationsChangedEvent) => void): IDisposable;
    onDidChangeOptions(listener: (e: textModelEvents.IModelOptionsChangedEvent) => void): IDisposable;
    onWillDispose(listener: () => void): IDisposable;
    onDidChangeLanguage(listener: (e: textModelEvents.IModelLanguageChangedEvent) => void): IDisposable;
    static createFromString(text: string, options?: ITextModelCreationOptions, languageIdentifier?: LanguageIdentifier, uri?: URI): Model;
    readonly id: string;
    private readonly _associatedResource;
    private _attachedEditorCount;
    constructor(rawTextSource: IRawTextSource, creationOptions: ITextModelCreationOptions, languageIdentifier: LanguageIdentifier, associatedResource?: URI);
    destroy(): void;
    dispose(): void;
    onBeforeAttached(): void;
    onBeforeDetached(): void;
    protected _shouldAutoTokenize(): boolean;
    isAttachedToEditor(): boolean;
    readonly uri: URI;
}
