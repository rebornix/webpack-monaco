import { IState } from 'vs/editor/common/modes';
export declare class Token {
    _tokenBrand: void;
    readonly offset: number;
    readonly type: string;
    readonly language: string;
    constructor(offset: number, type: string, language: string);
    toString(): string;
}
export declare class TokenizationResult {
    _tokenizationResultBrand: void;
    readonly tokens: Token[];
    readonly endState: IState;
    constructor(tokens: Token[], endState: IState);
}
export declare class TokenizationResult2 {
    _tokenizationResult2Brand: void;
    /**
     * The tokens in binary format. Each token occupies two array indices. For token i:
     *  - at offset 2*i => startIndex
     *  - at offset 2*i + 1 => metadata
     *
     */
    readonly tokens: Uint32Array;
    readonly endState: IState;
    constructor(tokens: Uint32Array, endState: IState);
}
