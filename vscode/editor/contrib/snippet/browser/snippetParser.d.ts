export declare enum TokenType {
    Dollar = 0,
    Colon = 1,
    Comma = 2,
    CurlyOpen = 3,
    CurlyClose = 4,
    Backslash = 5,
    Forwardslash = 6,
    Pipe = 7,
    Int = 8,
    VariableName = 9,
    Format = 10,
    EOF = 11,
}
export interface Token {
    type: TokenType;
    pos: number;
    len: number;
}
export declare class Scanner {
    private static _table;
    static isDigitCharacter(ch: number): boolean;
    static isVariableCharacter(ch: number): boolean;
    value: string;
    pos: number;
    constructor();
    text(value: string): void;
    tokenText(token: Token): string;
    next(): Token;
}
export declare abstract class Marker {
    readonly _markerBrand: any;
    parent: Marker;
    protected _children: Marker[];
    appendChild(child: Marker): this;
    replace(child: Marker, others: Marker[]): void;
    readonly children: Marker[];
    readonly snippet: TextmateSnippet;
    toString(): any;
    abstract toTextmateString(): string;
    len(): number;
    abstract clone(): Marker;
}
export declare class Text extends Marker {
    value: string;
    constructor(value: string);
    toString(): string;
    toTextmateString(): string;
    len(): number;
    clone(): Text;
}
export declare class Placeholder extends Marker {
    index: number;
    static compareByIndex(a: Placeholder, b: Placeholder): number;
    constructor(index: number);
    readonly isFinalTabstop: boolean;
    readonly choice: Choice;
    toTextmateString(): string;
    clone(): Placeholder;
}
export declare class Choice extends Marker {
    readonly options: Text[];
    appendChild(marker: Marker): this;
    toString(): string;
    toTextmateString(): string;
    len(): number;
    clone(): Choice;
}
export declare class Variable extends Marker {
    name: string;
    constructor(name: string);
    resolve(resolver: VariableResolver): boolean;
    toTextmateString(): string;
    clone(): Variable;
}
export interface VariableResolver {
    resolve(variable: Variable): string | undefined;
}
export declare class TextmateSnippet extends Marker {
    private _placeholders;
    readonly placeholderInfo: {
        all: Placeholder[];
        last: Placeholder;
    };
    readonly placeholders: Placeholder[];
    offset(marker: Marker): number;
    fullLen(marker: Marker): number;
    enclosingPlaceholders(placeholder: Placeholder): Placeholder[];
    resolveVariables(resolver: VariableResolver): this;
    appendChild(child: Marker): this;
    replace(child: Marker, others: Marker[]): void;
    toTextmateString(): string;
    clone(): TextmateSnippet;
    walk(visitor: (marker: Marker) => boolean): void;
}
export declare class SnippetParser {
    static escape(value: string): string;
    private _scanner;
    private _token;
    text(value: string): string;
    parse(value: string, insertFinalTabstop?: boolean, enforceFinalTabstop?: boolean): TextmateSnippet;
    private _accept(type);
    private _accept(type, value);
    private _backTo(token);
    private _parse(marker);
    private _parseEscaped(marker);
    private _parseTabstopOrVariableName(parent);
    private _parseComplexPlaceholder(parent);
    private _parseChoiceElement(parent);
    private _parseComplexVariable(parent);
    private _parseAnything(marker);
}
