import { EventEmitter } from 'vs/base/common/eventEmitter';
import Event from 'vs/base/common/event';
import { IDisposable, IReference } from 'vs/base/common/lifecycle';
import URI from 'vs/base/common/uri';
import { TPromise } from 'vs/base/common/winjs.base';
import { IRange } from 'vs/editor/common/core/range';
import { Location } from 'vs/editor/common/modes';
import { ITextModelService, ITextEditorModel } from 'vs/editor/common/services/resolverService';
import { Position } from 'vs/editor/common/core/position';
export declare class OneReference {
    private _parent;
    private _range;
    private _eventBus;
    private _id;
    constructor(_parent: FileReferences, _range: IRange, _eventBus: EventEmitter);
    readonly id: string;
    readonly model: FileReferences;
    readonly parent: FileReferences;
    readonly uri: URI;
    readonly name: string;
    readonly directory: string;
    range: IRange;
    getAriaMessage(): string;
}
export declare class FilePreview implements IDisposable {
    private _modelReference;
    constructor(_modelReference: IReference<ITextEditorModel>);
    private readonly _model;
    preview(range: IRange, n?: number): {
        before: string;
        inside: string;
        after: string;
    };
    dispose(): void;
}
export declare class FileReferences implements IDisposable {
    private _parent;
    private _uri;
    private _children;
    private _preview;
    private _resolved;
    private _loadFailure;
    constructor(_parent: ReferencesModel, _uri: URI);
    readonly id: string;
    readonly parent: ReferencesModel;
    readonly children: OneReference[];
    readonly uri: URI;
    readonly name: string;
    readonly directory: string;
    readonly preview: FilePreview;
    readonly failure: any;
    getAriaMessage(): string;
    resolve(textModelResolverService: ITextModelService): TPromise<FileReferences>;
    dispose(): void;
}
export declare class ReferencesModel implements IDisposable {
    private _groups;
    private _references;
    private _eventBus;
    onDidChangeReferenceRange: Event<OneReference>;
    constructor(references: Location[]);
    readonly empty: boolean;
    readonly references: OneReference[];
    readonly groups: FileReferences[];
    getAriaMessage(): string;
    nextReference(reference: OneReference): OneReference;
    nearestReference(resource: URI, position: Position): OneReference;
    dispose(): void;
    private static _compareReferences(a, b);
}
