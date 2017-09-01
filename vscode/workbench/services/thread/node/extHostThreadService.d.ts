import { RPCProtocol } from 'vs/workbench/services/extensions/node/rpcProtocol';
import { AbstractThreadService } from 'vs/workbench/services/thread/node/abstractThreadService';
import { IThreadService } from 'vs/workbench/services/thread/common/threadService';
export declare class ExtHostThreadService extends AbstractThreadService implements IThreadService {
    constructor(rpcProtocol: RPCProtocol);
}
