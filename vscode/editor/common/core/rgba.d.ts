/**
 * A very VM friendly rgba datastructure.
 * Please don't touch unless you take a look at the IR.
 */
export declare class RGBA8 {
    _rgba8Brand: void;
    /**
     * Red: integer in [0-255]
     */
    readonly r: number;
    /**
     * Green: integer in [0-255]
     */
    readonly g: number;
    /**
     * Blue: integer in [0-255]
     */
    readonly b: number;
    /**
     * Alpha: integer in [0-255]
     */
    readonly a: number;
    constructor(r: number, g: number, b: number, a: number);
    static equals(a: RGBA8, b: RGBA8): boolean;
    private static _clampInt_0_255(c);
}
