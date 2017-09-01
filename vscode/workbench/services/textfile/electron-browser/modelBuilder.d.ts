import { IStringStream } from 'vs/platform/files/common/files';
import { TPromise } from 'vs/base/common/winjs.base';
import { IRawTextSource } from 'vs/editor/common/model/textSource';
export interface ModelBuilderResult {
    readonly hash: string;
    readonly value: IRawTextSource;
}
export declare function computeHash(rawText: IRawTextSource): string;
export declare class ModelBuilder {
    private leftoverPrevChunk;
    private leftoverEndsInCR;
    private totalCRCount;
    private lineBasedBuilder;
    private totalLength;
    private containsRTL;
    private isBasicASCII;
    static fromStringStream(stream: IStringStream): TPromise<ModelBuilderResult>;
    constructor(computeHash: boolean);
    private _updateCRCount(chunk);
    acceptChunk(chunk: string): void;
    finish(): ModelBuilderResult;
}
