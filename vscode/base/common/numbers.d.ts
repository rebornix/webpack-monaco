export declare type NumberCallback = (index: number) => void;
export declare function count(to: number, callback: NumberCallback): void;
export declare function count(from: number, to: number, callback: NumberCallback): void;
export declare function countToArray(to: number): number[];
export declare function countToArray(from: number, to: number): number[];
