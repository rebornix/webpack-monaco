import { ISearchWorker } from './worker/searchWorkerIpc';
export interface ITextSearchWorkerProvider {
    getWorkers(): ISearchWorker[];
}
export declare class TextSearchWorkerProvider implements ITextSearchWorkerProvider {
    private workers;
    getWorkers(): ISearchWorker[];
    private createWorker();
}
