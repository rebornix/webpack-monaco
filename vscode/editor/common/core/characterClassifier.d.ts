/**
 * A fast character classifier that uses a compact array for ASCII values.
 */
export declare class CharacterClassifier<T extends number> {
    /**
     * Maintain a compact (fully initialized ASCII map for quickly classifying ASCII characters - used more often in code).
     */
    private _asciiMap;
    /**
     * The entire map (sparse array).
     */
    private _map;
    private _defaultValue;
    constructor(_defaultValue: T);
    private static _createAsciiMap(defaultValue);
    set(charCode: number, _value: T): void;
    get(charCode: number): T;
}
export declare class CharacterSet {
    private _actual;
    constructor();
    add(charCode: number): void;
    has(charCode: number): boolean;
}
