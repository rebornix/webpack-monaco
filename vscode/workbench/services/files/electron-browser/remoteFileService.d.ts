import URI from 'vs/base/common/uri';
import { FileService } from 'vs/workbench/services/files/electron-browser/fileService';
import { IContent, IStreamContent, IFileStat, IResolveContentOptions, IUpdateContentOptions } from 'vs/platform/files/common/files';
import { TPromise } from 'vs/base/common/winjs.base';
import Event from 'vs/base/common/event';
import { IDisposable } from 'vs/base/common/lifecycle';
export interface IRemoteFileSystemProvider {
    onDidChange: Event<URI>;
    resolve(resource: URI): TPromise<string>;
    update(resource: URI, content: string): TPromise<any>;
}
export declare class RemoteFileService extends FileService {
    private readonly _provider;
    registerProvider(authority: string, provider: IRemoteFileSystemProvider): IDisposable;
    resolveContent(resource: URI, options?: IResolveContentOptions): TPromise<IContent>;
    resolveStreamContent(resource: URI, options?: IResolveContentOptions): TPromise<IStreamContent>;
    private _doResolveContent(resource);
    updateContent(resource: URI, value: string, options?: IUpdateContentOptions): TPromise<IFileStat>;
    private _doUpdateContent(resource, content);
    private static _createFakeStat(resource);
    private static _asStreamContent(content);
}
