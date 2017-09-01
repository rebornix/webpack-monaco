export interface Node<T> {
    data: T;
    incoming: {
        [key: string]: Node<T>;
    };
    outgoing: {
        [key: string]: Node<T>;
    };
}
export declare class Graph<T> {
    private _hashFn;
    private _nodes;
    constructor(_hashFn: (element: T) => string);
    roots(): Node<T>[];
    traverse(start: T, inwards: boolean, callback: (data: T) => void): void;
    private _traverse(node, inwards, seen, callback);
    insertEdge(from: T, to: T): void;
    removeNode(data: T): void;
    lookupOrInsertNode(data: T): Node<T>;
    lookup(data: T): Node<T>;
    readonly length: number;
    toString(): string;
}
