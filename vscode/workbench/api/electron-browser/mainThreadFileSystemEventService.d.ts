import { IFileService } from 'vs/platform/files/common/files';
import { IExtHostContext } from '../node/extHost.protocol';
export declare class MainThreadFileSystemEventService {
    private readonly _listener;
    constructor(extHostContext: IExtHostContext, fileService: IFileService);
    dispose(): void;
}
