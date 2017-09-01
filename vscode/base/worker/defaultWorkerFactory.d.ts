import { IWorker, IWorkerCallback, IWorkerFactory } from 'vs/base/common/worker/simpleWorker';
export declare class DefaultWorkerFactory implements IWorkerFactory {
    private static LAST_WORKER_ID;
    private _label;
    private _webWorkerFailedBeforeError;
    constructor(label: string);
    create(moduleId: string, onMessageCallback: IWorkerCallback, onErrorCallback: (err: any) => void): IWorker;
}
