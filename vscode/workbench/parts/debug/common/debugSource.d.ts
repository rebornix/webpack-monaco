import uri from 'vs/base/common/uri';
export declare class Source {
    raw: DebugProtocol.Source;
    uri: uri;
    available: boolean;
    constructor(raw: DebugProtocol.Source);
    readonly name: string;
    readonly origin: string;
    readonly presentationHint: "normal" | "emphasize" | "deemphasize";
    readonly reference: number;
    readonly inMemory: boolean;
}
