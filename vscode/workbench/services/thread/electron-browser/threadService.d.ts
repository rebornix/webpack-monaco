import { AbstractThreadService } from 'vs/workbench/services/thread/node/abstractThreadService';
import { IThreadService } from 'vs/workbench/services/thread/common/threadService';
import { IEnvironmentService } from 'vs/platform/environment/common/environment';
import { IMessagePassingProtocol } from 'vs/base/parts/ipc/common/ipc';
export declare class MainThreadService extends AbstractThreadService implements IThreadService {
    constructor(protocol: IMessagePassingProtocol, environmentService: IEnvironmentService);
}
