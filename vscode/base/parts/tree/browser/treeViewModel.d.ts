import { EventEmitter } from 'vs/base/common/eventEmitter';
import { IIterator } from 'vs/base/common/iterator';
import { Item } from './treeModel';
export interface IViewItem {
    model: Item;
    top: number;
    height: number;
}
export declare class HeightMap extends EventEmitter {
    private heightMap;
    private indexes;
    constructor();
    getTotalHeight(): number;
    onInsertItems(iterator: IIterator<Item>, afterItemId?: string): number;
    onInsertItem(item: IViewItem): void;
    onRemoveItems(iterator: IIterator<string>): void;
    onRemoveItem(item: IViewItem): void;
    onRefreshItemSet(items: Item[]): void;
    onRefreshItems(iterator: IIterator<Item>): void;
    onRefreshItem(item: IViewItem, needsRender?: boolean): void;
    itemsCount(): number;
    itemAt(position: number): string;
    withItemsInRange(start: number, end: number, fn: (item: string) => void): void;
    indexAt(position: number): number;
    indexAfter(position: number): number;
    itemAtIndex(index: number): IViewItem;
    itemAfter(item: IViewItem): IViewItem;
    protected createViewItem(item: Item): IViewItem;
    dispose(): void;
}
