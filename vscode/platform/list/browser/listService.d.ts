import { ITree } from 'vs/base/parts/tree/browser/tree';
import { List } from 'vs/base/browser/ui/list/listWidget';
import { IDisposable } from 'vs/base/common/lifecycle';
import { IContextKeyService, IContextKey, RawContextKey } from 'vs/platform/contextkey/common/contextkey';
export declare const IListService: {
    (...args: any[]): void;
    type: IListService;
};
export interface IListService {
    _serviceBrand: any;
    /**
     * Makes a tree or list widget known to the list service. It will track the lists focus and
     * blur events to update context keys based on the widget being focused or not.
     *
     * @param extraContextKeys an optional list of additional context keys to update based on
     * the widget being focused or not.
     */
    register(tree: ITree, extraContextKeys?: (IContextKey<boolean>)[]): IDisposable;
    register(list: List<any>, extraContextKeys?: (IContextKey<boolean>)[]): IDisposable;
    /**
     * Returns the currently focused list widget if any.
     */
    getFocused(): ITree | List<any>;
}
export declare const ListFocusContext: RawContextKey<boolean>;
export declare class ListService implements IListService {
    _serviceBrand: any;
    private focusedTreeOrList;
    private lists;
    private listFocusContext;
    private focusChangeScheduler;
    constructor(contextKeyService: IContextKeyService);
    register(tree: ITree, extraContextKeys?: (IContextKey<boolean>)[]): IDisposable;
    register(list: List<any>, extraContextKeys?: (IContextKey<boolean>)[]): IDisposable;
    private indexOf(widget);
    private onFocusChange();
    private setFocusedList(focusedList?);
    getFocused(): ITree | List<any>;
}
