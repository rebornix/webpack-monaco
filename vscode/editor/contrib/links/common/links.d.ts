import URI from 'vs/base/common/uri';
import { TPromise } from 'vs/base/common/winjs.base';
import { IRange } from 'vs/editor/common/core/range';
import { IReadOnlyModel } from 'vs/editor/common/editorCommon';
import { ILink, LinkProvider } from 'vs/editor/common/modes';
export declare class Link implements ILink {
    private _link;
    private _provider;
    constructor(link: ILink, provider: LinkProvider);
    readonly range: IRange;
    readonly url: string;
    resolve(): TPromise<URI>;
}
export declare function getLinks(model: IReadOnlyModel): TPromise<Link[]>;
